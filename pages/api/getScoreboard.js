// api/getScoreboard.js
import { PrismaClient } from '@prisma/client';
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';

let prisma;
if (!global.prisma) {
  global.prisma = new PrismaClient();
}
prisma = global.prisma;

const cors = initMiddleware(
  Cors({
    methods: ['GET'],
  })
);

export default async function handler(req, res) {
  try {
    await cors(req, res);
  } catch (error) {
    return res.status(500).json({ error: 'CORS error' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const users = await prisma.user_pomodoros.findMany({
      where: {
        pomodoro_count_weekly: {
          gt: 0,
        },
      },
      orderBy: {
        pomodoro_count_weekly: 'desc',
      },
      select: {
        email: true,
        firstname: true,
        pomodoro_count_weekly: true,
      },
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}