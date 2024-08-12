import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    // Retrieve a single Flashcard by ID
    try {
      const flashcard = await prisma.flashcard.findUnique({
        where: { id: parseInt(id) },
      });

      if (flashcard) {
        res.status(200).json(flashcard);
      } else {
        res.status(404).json({ error: 'Flashcard not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve flashcard' });
    }
  } else if (req.method === 'PUT') {
    // Update a Flashcard
    const { question, answer } = req.body;

    try {
      const updatedFlashcard = await prisma.flashcard.update({
        where: { id: parseInt(id) },
        data: {
          question,
          answer,
        },
      });

      res.status(200).json(updatedFlashcard);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update flashcard' });
    }
  } else if (req.method === 'DELETE') {
    // Delete a Flashcard
    try {
      await prisma.flashcard.delete({
        where: { id: parseInt(id) },
      });

      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete flashcard' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
