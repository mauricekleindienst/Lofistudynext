import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Please sign in to continue' });
  }

  const { id } = req.query;

  if (req.method === 'PATCH') {
    try {
      // First check if the flashcard belongs to the user
      const existingCard = await prisma.flashcard.findFirst({
        where: {
          id: parseInt(id),
          email: session.user.email,
        },
      });

      if (!existingCard) {
        return res.status(404).json({ error: 'Flashcard not found' });
      }

      // Prepare update data with only the fields that exist in the schema
      const updateData = {};
      
      // Handle completed status
      if (typeof req.body.completed === 'boolean') {
        updateData.completed = req.body.completed;
      }

      // Handle other basic fields if they exist in the request
      if (req.body.question) updateData.question = req.body.question;
      if (req.body.answer) updateData.answer = req.body.answer;
      if (req.body.color) updateData.color = req.body.color;
      if (req.body.imageUrl !== undefined) updateData.imageUrl = req.body.imageUrl;

      const flashcard = await prisma.flashcard.update({
        where: {
          id: parseInt(id),
        },
        data: updateData,
      });

      // Return the card with virtual rating properties
      res.status(200).json({
        ...flashcard,
        rating: req.body.rating,
        lastReviewed: req.body.lastReviewed,
        nextReview: req.body.nextReview,
        reviewCount: req.body.reviewCount,
      });
    } catch (error) {
      console.error('Failed to update flashcard:', error);
      res.status(500).json({ error: 'Failed to update flashcard' });
    }
  } else if (req.method === 'DELETE') {
    try {
      // First check if the flashcard belongs to the user
      const existingCard = await prisma.flashcard.findFirst({
        where: {
          id: parseInt(id),
          email: session.user.email,
        },
      });

      if (!existingCard) {
        return res.status(404).json({ error: 'Flashcard not found' });
      }

      await prisma.flashcard.delete({
        where: {
          id: parseInt(id),
        },
      });

      res.status(204).end();
    } catch (error) {
      console.error('Failed to delete flashcard:', error);
      res.status(500).json({ error: 'Failed to delete flashcard' });
    }
  } else {
    res.setHeader('Allow', ['PATCH', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 