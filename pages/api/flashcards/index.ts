import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.query;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required and must be a string' });
  }

  try {
    if (req.method === 'GET') {
      const flashcards = await prisma.flashcard.findMany({
        where: { email: email },
      });
      return res.status(200).json(flashcards);
    } 
    
    else if (req.method === 'POST') {
      const { question, answer, color = '#ff7b00', imageUrl = '' } = req.body;

      if (!question || !answer) {
        return res.status(400).json({ error: 'Question and answer are required' });
      }

      const flashcard = await prisma.flashcard.create({
        data: {
          email: email,
          question,
          answer,
          color,
          imageUrl,
          completed: false,
        },
      });
      return res.status(201).json(flashcard);
    } 
    
    else {
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error in flashcard API handler:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
