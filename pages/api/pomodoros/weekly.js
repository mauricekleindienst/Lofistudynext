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
    const userPomodoros = await prisma.user_pomodoros.findUnique({
      where: {
        email: session.user.email
      },
      select: {
        pomodoro_count_weekly: true
      }
    });

    const count = userPomodoros?.pomodoro_count_weekly || 0;
    res.status(200).json({ count });
  } catch (error) {
    console.error('Failed to fetch weekly pomodoro count:', error);
    res.status(500).json({ error: 'Failed to fetch weekly pomodoro count' });
  }
} 