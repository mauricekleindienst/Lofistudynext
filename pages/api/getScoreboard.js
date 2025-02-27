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

  const { type = 'weekly' } = req.query;

  try {
    const users = await prisma.user_pomodoros.findMany({
      where: {
        [type === 'weekly' ? 'pomodoro_count_weekly' : 'pomodoro_count']: {
          gt: 0,
        },
      },
      orderBy: {
        [type === 'weekly' ? 'pomodoro_count_weekly' : 'pomodoro_count']: 'desc',
      },
      select: {
        email: true,
        firstname: true,
        pomodoro_count_weekly: true,
        pomodoro_count: true,
      },
    });

    // Format the response based on the type
    const formattedUsers = users.map(user => ({
      email: user.email,
      firstname: user.firstname,
      pomodoro_count: type === 'weekly' ? user.pomodoro_count_weekly : user.pomodoro_count,
    }));

    res.status(200).json(formattedUsers);
  } catch (error) {
    console.error('Error fetching scoreboard:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}