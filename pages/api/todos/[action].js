import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateTodoChallenges(email) {
  try {
    // Update todo completion challenge
    const challenges = await prisma.challenge.findMany({
      where: {
        trackingType: 'todo_complete'
      },
      include: {
        progress: {
          where: { email }
        }
      }
    });

    for (const challenge of challenges) {
      const currentProgress = challenge.progress[0];
      
      await prisma.progress.upsert({
        where: {
          email_challengeId: {
            email,
            challengeId: challenge.id
          }
        },
        update: {
          progress: {
            increment: 1
          },
          completed: (currentProgress?.progress || 0) + 1 >= challenge.total,
          completedAt: (currentProgress?.progress || 0) + 1 >= challenge.total ? new Date() : null
        },
        create: {
          email,
          challengeId: challenge.id,
          progress: 1,
          completed: 1 >= challenge.total
        }
      });
    }
  } catch (error) {
    console.error('Error updating todo challenges:', error);
  }
}

export default async function handler(req, res) {
  if (req.method === 'POST' && action === 'complete') {
    // ... existing todo completion code ...
    
    // Update challenges
    await updateTodoChallenges(email);
  }
} 