import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Please sign in to continue' });
  }

  try {
    // Get all users ordered by weekly pomodoro count
    const users = await prisma.user_pomodoros.findMany({
      orderBy: {
        pomodoro_count_weekly: 'desc'
      },
      select: {
        email: true,
        pomodoro_count_weekly: true
      }
    });

    // Find user's rank
    const userIndex = users.findIndex(user => user.email === session.user.email);
    const rank = userIndex !== -1 ? userIndex + 1 : users.length + 1;

    res.status(200).json({ rank });
  } catch (error) {
    console.error('Failed to fetch user rank:', error);
    res.status(500).json({ error: 'Failed to fetch user rank' });
  }
} 