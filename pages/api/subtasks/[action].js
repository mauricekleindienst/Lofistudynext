import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

const prisma = new PrismaClient();

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

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Please sign in to continue' });
  }

  const { action } = req.query;
  const { subtaskId, todoId, completed } = req.body;

  if (req.method === 'POST' && action === 'complete') {
    try {
      const subtask = await prisma.subtasks.update({
        where: { id: parseInt(subtaskId) },
        data: { completed },
      });

      // Update challenges
      await updateSubtaskChallenges(session.user.email);

      res.status(200).json(subtask);
    } catch (error) {
      console.error('Failed to update subtask:', error);
      res.status(500).json({ error: 'Failed to update subtask' });
    }
  } else if (req.method === 'POST' && action === 'create') {
    try {
      const subtask = await prisma.subtasks.create({
        data: {
          todo_id: parseInt(todoId),
          text: req.body.text,
          completed: false,
        },
      });
      res.status(201).json(subtask);
    } catch (error) {
      console.error('Failed to create subtask:', error);
      res.status(500).json({ error: 'Failed to create subtask' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.subtasks.delete({
        where: { id: parseInt(subtaskId) },
      });
      res.status(204).end();
    } catch (error) {
      console.error('Failed to delete subtask:', error);
      res.status(500).json({ error: 'Failed to delete subtask' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 