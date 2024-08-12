import { PrismaClient } from '@prisma/client';
import Cors from 'cors';

const prisma = new PrismaClient();

const cors = Cors({
  methods: ['GET'],
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const users = await prisma.user_pomodoros.findMany({
      where: {
        pomodoro_count_weekly: {
          gt: 0
        }
      },
      orderBy: {
        pomodoro_count_weekly: 'desc',
      },
      select: {
        firstname: true,
        pomodoro_count_weekly: true,
      },
    });

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching scoreboard data:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}