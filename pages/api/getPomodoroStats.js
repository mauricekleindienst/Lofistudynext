import { PrismaClient } from '@prisma/client';
import Cors from 'cors';

const prisma = new PrismaClient();
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:3000', 'https://lo-fi.study'];

const cors = Cors({
  origin: allowedOrigins,
  methods: ['POST'],
  allowedHeaders: ['Content-Type'],
});

const runMiddleware = (req, res, fn) =>
  new Promise((resolve, reject) =>
    fn(req, res, (result) => (result instanceof Error ? reject(result) : resolve(result)))
  );

export default async function handler(req, res) {
  try {
    await runMiddleware(req, res, cors);

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed. Only POST requests are allowed.' });
    }

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Bad Request: Email is required.' });
    }

    const user = await prisma.user_pomodoros.findUnique({
      where: { email },
      select: {
        pomodoro_count: true,
        studying: true,
        coding: true,
        writing: true,
        working: true,
        other: true,
        daily_counts: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: `User with email ${email} not found.` });
    }

    const stats = {
      pomodoro_count: user.pomodoro_count ?? 0,
      studying: user.studying ?? 0,
      coding: user.coding ?? 0,
      writing: user.writing ?? 0,
      working: user.working ?? 0,
      other: user.other ?? 0,
      daily_counts: user.daily_counts ?? {},
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching Pomodoro stats:', error.message);
    res.status(500).json({ error: 'Internal Server Error. Please try again later.' });
  } finally {
    await prisma.$disconnect();
  }
}
