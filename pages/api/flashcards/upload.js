import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import formidable from 'formidable';
import fs from 'fs';
import AdmZip from 'adm-zip';
import sqlite3 from 'sqlite3';
import path from 'path';

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

async function extractAnkiCards(filePath) {
  const zip = new AdmZip(filePath);
  const tempDir = path.join(process.cwd(), 'tmp');
  
  // Create temp directory if it doesn't exist
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  // Extract the collection.anki2 file
  const collectionEntry = zip.getEntries().find(e => e.entryName === 'collection.anki2');
  if (!collectionEntry) {
    throw new Error('Invalid Anki deck: collection.anki2 not found');
  }

  const dbPath = path.join(tempDir, 'collection.anki2');
  zip.extractEntryTo(collectionEntry, tempDir, false, true);

  try {
    // Open the SQLite database
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    // Query to get cards and notes
    const cards = await db.all(`
      SELECT n.id, n.flds, n.tags, c.type
      FROM notes n
      JOIN cards c ON c.nid = n.id
      WHERE n.id > 0
    `);

    // Process the cards
    const processedCards = cards.map(card => {
      const fields = card.flds.split('\x1f'); // Split fields by Unit Separator character
      return {
        question: fields[0],
        answer: fields[1] || fields[0], // Use second field if exists, otherwise use first field
        color: "#ff7b00",
      };
    }).filter(card => card.question && card.answer); // Filter out invalid cards

    // Close the database connection
    await db.close();

    return processedCards;
  } catch (error) {
    console.error('Error processing Anki database:', error);
    throw error;
  } finally {
    // Clean up temporary files
    try {
      if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
      if (fs.existsSync(tempDir)) fs.rmdirSync(tempDir);
    } catch (error) {
      console.error('Error cleaning up temporary files:', error);
    }
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Please sign in to continue' });
  }

  try {
    const form = formidable({
      keepExtensions: true,
      maxFileSize: 50 * 1024 * 1024, // 50MB max file size for Anki decks
    });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    const file = files.file?.[0];
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let cards = [];

    if (file.originalFilename?.endsWith('.apkg')) {
      // Process Anki deck
      cards = await extractAnkiCards(file.filepath);
    } else if (file.originalFilename?.endsWith('.txt')) {
      // Process text file
      const content = fs.readFileSync(file.filepath, 'utf8');
      const lines = content.split('\n').filter(line => line.trim());
      
      cards = lines.map(line => {
        const [question, answer] = line.split('\t').map(s => s.trim());
        if (question && answer) {
          return {
            question,
            answer,
            color: "#ff7b00"
          };
        }
        return null;
      }).filter(card => card !== null);
    } else {
      return res.status(400).json({ error: 'Invalid file type. Please upload .apkg or .txt files only.' });
    }

    if (cards.length === 0) {
      return res.status(400).json({ error: 'No valid flashcards found in file' });
    }

    // Save cards to database
    const savedCards = await Promise.all(
      cards.map(card =>
        prisma.flashcard.create({
          data: {
            email: session.user.email,
            question: card.question,
            answer: card.answer,
            color: card.color,
            createdAt: new Date(),
          },
        })
      )
    );

    // Clean up
    fs.unlinkSync(file.filepath);

    res.status(200).json({
      message: `Successfully imported ${savedCards.length} flashcards`,
      cards: savedCards
    });
  } catch (error) {
    console.error('Error processing file upload:', error);
    res.status(500).json({ error: 'Failed to process file upload: ' + error.message });
  }
} 