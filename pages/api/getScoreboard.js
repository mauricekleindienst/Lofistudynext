import { PrismaClient } from '@prisma/client';
import Cors from 'cors';

const prisma = new PrismaClient();

const cors = Cors({
  origin: ['http://localhost:3000', 'https://lo-fi.study'], // Add allowed origins
  methods: ['GET', 'POST'], // Specify allowed methods
  allowedHeaders: ['Content-Type'], // Specify allowed headers
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
  // Run the middleware
  await runMiddleware(req, res, cors);

  try {
    const users = await prisma.user_pomodoros.findMany({
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