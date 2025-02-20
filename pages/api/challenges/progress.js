import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  const session = await getSession({ req });
  
  if (!session || req.method !== 'POST') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { challengeId, email } = req.body;

  try {
    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
      include: {
        progress: {
          where: { email }
        }
      }
    });

    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    const currentProgress = challenge.progress[0];
    const newProgress = (currentProgress?.progress || 0) + 1;
    const completed = newProgress >= challenge.total;

    const updatedProgress = await prisma.progress.upsert({
      where: {
        email_challengeId: {
          email,
          challengeId
        }
      },
      update: {
        progress: newProgress,
        completed,
        completedAt: completed ? new Date() : null
      },
      create: {
        email,
        challengeId,
        progress: 1,
        completed: false
      }
    });

    res.json(updatedProgress);
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ error: 'Error updating progress' });
  }
} 