// Add this to your existing subtask completion handler
async function updateSubtaskChallenges(email) {
  try {
    const challenges = await prisma.challenge.findMany({
      where: {
        trackingType: 'subtask_complete'
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
    console.error('Error updating subtask challenges:', error);
  }
}

// Add to your subtask completion handler
if (req.method === 'POST' && action === 'complete') {
  // ... existing subtask completion code ...
  
  // Update challenges
  await updateSubtaskChallenges(email);
} 