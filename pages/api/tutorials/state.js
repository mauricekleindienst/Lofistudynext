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
      const { tutorial } = req.query;
      const tutorialState = await prisma.tutorialState.findUnique({
        where: {
          email_tutorial: {
            email: session.user.email,
            tutorial: tutorial
          }
        }
      });
      
      res.status(200).json(tutorialState || { completed: false });
    } catch (error) {
      console.error('Failed to fetch tutorial state:', error);
      res.status(500).json({ error: 'Failed to fetch tutorial state' });
    }
  } else if (req.method === 'POST') {
    try {
      const { tutorial, completed } = req.body;
      
      const tutorialState = await prisma.tutorialState.upsert({
        where: {
          email_tutorial: {
            email: session.user.email,
            tutorial: tutorial
          }
        },
        update: {
          completed: completed
        },
        create: {
          email: session.user.email,
          tutorial: tutorial,
          completed: completed
        }
      });
      
      res.status(200).json(tutorialState);
    } catch (error) {
      console.error('Failed to update tutorial state:', error);
      res.status(500).json({ error: 'Failed to update tutorial state' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 