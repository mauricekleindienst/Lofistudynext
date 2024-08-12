import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const { user_email, title, description, pdf_url } = req.body;

      if (!user_email || !title) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const container = await prisma.flashcardContainer.create({
        data: {
          user_email,
          title,
          description,
          pdf_url,
        },
      });

      res.status(201).json(container);
    } else if (req.method === 'GET') {
      const containers = await prisma.flashcardContainer.findMany();
      res.status(200).json(containers);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in /api/flashcards:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
