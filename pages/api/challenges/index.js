import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  const session = await getSession({ req });
  
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    const { filter = 'all' } = req.query;

    try {
      const challenges = await prisma.challenge.findMany({
        where: filter !== 'all' ? { type: filter } : {},
        include: {
          progress: {
            where: {
              email: session.user.email
            }
          }
        }
      });

      const formattedChallenges = challenges.map(challenge => {
        const userProgress = challenge.progress[0] || { progress: 0, completed: false };
        return {
          ...challenge,
          currentProgress: userProgress.progress,
          completed: userProgress.completed
        };
      });

      res.json(formattedChallenges);
    } catch (error) {
      console.error('Error fetching challenges:', error);
      res.status(500).json({ error: 'Error fetching challenges' });
    }
  }
} 