// pages/api/flashcards.js
import prisma from '../../lib/prisma';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    const { title, description, pdfUrl } = req.body;

    try {
      const container = await prisma.flashcardContainer.create({
        data: {
          user_email: session.user.email,
          title,
          description,
          pdf_url: pdfUrl,
        },
      });

      res.status(201).json(container);
    } catch (error) {
      res.status(500).json({ error: 'Error creating flashcard container' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
