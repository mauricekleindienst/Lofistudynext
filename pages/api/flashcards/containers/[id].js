import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    // Retrieve a single Flashcard Container by ID
    try {
      const container = await prisma.flashcardContainer.findUnique({
        where: { id: parseInt(id) },
        include: { flashcards: true },
      });

      if (container) {
        res.status(200).json(container);
      } else {
        res.status(404).json({ error: 'Container not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve container' });
    }
  } else if (req.method === 'PUT') {
    // Update a Flashcard Container
    const { title, description, pdf_url } = req.body;

    try {
      const updatedContainer = await prisma.flashcardContainer.update({
        where: { id: parseInt(id) },
        data: {
          title,
          description,
          pdf_url,
        },
      });

      res.status(200).json(updatedContainer);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update container' });
    }
  } else if (req.method === 'DELETE') {
    // Delete a Flashcard Container
    try {
      await prisma.flashcardContainer.delete({
        where: { id: parseInt(id) },
      });

      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete container' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
