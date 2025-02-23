import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Please sign in to continue' });
  }

  if (req.method === 'GET') {
    try {
      const flashcards = await prisma.flashcard.findMany({
        where: {
          email: session.user.email,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      res.status(200).json(flashcards);
    } catch (error) {
      console.error('Failed to fetch flashcards:', error);
      res.status(500).json({ error: 'Failed to fetch flashcards' });
    }
  } else if (req.method === 'POST') {
    const { question, answer, color, imageUrl } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ error: 'Question and answer are required' });
    }

    try {
      const flashcard = await prisma.flashcard.create({
        data: {
          email: session.user.email,
          question,
          answer,
          color,
          imageUrl,
        },
      });
      res.status(201).json(flashcard);
    } catch (error) {
      console.error('Failed to create flashcard:', error);
      res.status(500).json({ error: 'Failed to create flashcard' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 