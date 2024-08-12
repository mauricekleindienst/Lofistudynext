import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Create a new Flashcard Container
    const { user_email, title, description, pdf_url } = req.body;

    try {
      const container = await prisma.flashcardContainer.create({
        data: {
          user_email,
          title,
          description,
          pdf_url,
        },
      });
      res.status(201).json(container);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create container' });
    }
  } else if (req.method === 'GET') {
    // Retrieve all Flashcard Containers
    try {
      const containers = await prisma.flashcardContainer.findMany();
      res.status(200).json(containers);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve containers' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
