import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Create a new Flashcard
    const { container_id, question, answer } = req.body;

    try {
      const flashcard = await prisma.flashcard.create({
        data: {
          container_id,
          question,
          answer,
        },
      });
      res.status(201).json(flashcard);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create flashcard' });
    }
  } else if (req.method === 'GET') {
    // Retrieve all Flashcards
    try {
      const flashcards = await prisma.flashcard.findMany();
      res.status(200).json(flashcards);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve flashcards' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
