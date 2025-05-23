import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      return res.status(401).json({ error: 'Please sign in to continue' });
    }

    if (req.method === 'GET') {
      // Return empty array for now - you can expand this based on your needs
      return res.status(200).json([]);
    } else if (req.method === 'POST') {
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      // Here you would typically save to your database
      // For now, returning a mock response
      return res.status(200).json({
        id: userId,
        pomodoroCount: 1,
        updatedAt: new Date().toISOString()
      });
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Pomodoros API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
