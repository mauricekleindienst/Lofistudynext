import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Only POST requests are accepted.' });
  }

  const { email, firstname, increment, category } = req.body;

  if (!email || !firstname || typeof increment !== 'number' || !category) {
    return res.status(400).json({ error: 'Invalid request. All fields are required.' });
  }

  if (!['Studying', 'Coding', 'Writing', 'Working', 'Other'].includes(category)) {
    return res.status(400).json({ error: 'Invalid category.' });
  }

  try {
    const today = new Date().toISOString().split('T')[0];

    const existingUser = await prisma.user_pomodoros.findUnique({
      where: { email },
    });

    let updatedDailyCounts = existingUser
      ? { ...existingUser.daily_counts, [today]: (existingUser.daily_counts[today] || 0) + increment }
      : { [today]: increment };

    const user = await prisma.user_pomodoros.upsert({
      where: { email },
      update: {
        pomodoro_count: { increment },
        pomodoro_count_weekly: { increment },
        [category.toLowerCase()]: { increment },
        daily_counts: updatedDailyCounts,
      },
      create: {
        email,
        firstname,
        pomodoro_count: increment,
        pomodoro_count_weekly: increment,
        [category.toLowerCase()]: increment,
        daily_counts: { [today]: increment },
      },
    });

    // Get current hour for time-based challenges
    const currentHour = new Date().getHours();

    // Check and update challenges
    await Promise.all([
      // Update daily pomodoro count challenge
      updateChallengeProgress(email, 'pomodoro_daily', increment),
      
      // Update category-specific challenge
      updateChallengeProgress(email, 'category_count', increment, category.toLowerCase()),
      
      // Update weekly pomodoro challenge
      updateChallengeProgress(email, 'pomodoro_weekly', increment),
      
      // Check time-based challenges
      updateTimeBasedChallenges(email, currentHour)
    ]);

    res.status(200).json({ message: 'Pomodoro count updated successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}

async function updateChallengeProgress(email, type, count, category = null) {
  try {
    const challenges = await prisma.challenge.findMany({
      where: category 
        ? { 
            AND: [
              { trackingType: type },
              { category: category }
            ]
          }
        : { trackingType: type },
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
            increment: count
          },
          completed: (currentProgress?.progress || 0) + count >= challenge.total,
          completedAt: (currentProgress?.progress || 0) + count >= challenge.total ? new Date() : null
        },
        create: {
          email,
          challengeId: challenge.id,
          progress: count,
          completed: count >= challenge.total
        }
      });
    }
  } catch (error) {
    console.error('Error updating challenge progress:', error);
  }
}

async function updateTimeBasedChallenges(email, currentHour) {
  try {
    const timeBasedChallenges = await prisma.challenge.findMany({
      where: {
        trackingType: 'time_check'
      },
      include: {
        progress: {
          where: { email }
        }
      }
    });

    for (const challenge of timeBasedChallenges) {
      if (challenge.timeRequirement) {
        const requirementHour = parseInt(challenge.timeRequirement.before || challenge.timeRequirement.after);
        
        // Check if time requirement is met
        if ((challenge.timeRequirement.before && currentHour < requirementHour) ||
            (challenge.timeRequirement.after && currentHour >= requirementHour)) {
          
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
              completed: true,
              completedAt: new Date()
            },
            create: {
              email,
              challengeId: challenge.id,
              progress: 1,
              completed: true,
              completedAt: new Date()
            }
          });
        }
      }
    }
  } catch (error) {
    console.error('Error updating time-based challenges:', error);
  }
}
