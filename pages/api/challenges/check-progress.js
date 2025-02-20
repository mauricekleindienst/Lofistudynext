import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  const session = await getSession({ req });
  
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { type, category, count, time } = req.body;
  const email = session.user.email;

  try {
    // Get relevant challenges
    const challenges = await prisma.challenge.findMany({
      where: {
        OR: [
          { trackingType: type },
          { 
            AND: [
              { trackingType: 'category_count' },
              { category: category }
            ]
          }
        ]
      },
      include: {
        progress: {
          where: { email }
        }
      }
    });

    // Process each challenge
    for (const challenge of challenges) {
      const currentProgress = challenge.progress[0];
      
      // Check time requirements if they exist
      if (challenge.timeRequirement) {
        const currentHour = new Date().getHours();
        const requirementHour = parseInt(challenge.timeRequirement.before || challenge.timeRequirement.after);
        
        if (challenge.timeRequirement.before && currentHour >= requirementHour) continue;
        if (challenge.timeRequirement.after && currentHour < requirementHour) continue;
      }

      // Update progress
      await prisma.progress.upsert({
        where: {
          email_challengeId: {
            email,
            challengeId: challenge.id
          }
        },
        update: {
          progress: {
            increment: count || 1
          },
          completed: (currentProgress?.progress || 0) + (count || 1) >= challenge.total,
          completedAt: (currentProgress?.progress || 0) + (count || 1) >= challenge.total ? new Date() : null
        },
        create: {
          email,
          challengeId: challenge.id,
          progress: count || 1,
          completed: (count || 1) >= challenge.total
        }
      });
    }

    res.status(200).json({ message: 'Progress updated' });
  } catch (error) {
    console.error('Error updating challenge progress:', error);
    res.status(500).json({ error: 'Error updating progress' });
  }
} 