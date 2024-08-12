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
  console.log("API handler called");
  
  try {
    await runMiddleware(req, res, cors);
  } catch (error) {
    console.error("CORS middleware error:", error);
    return res.status(500).json({ error: 'CORS error' });
  }

  if (req.method !== 'GET') {
    console.log("Method not allowed:", req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log("Querying database...");
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
        email: true,
        firstname: true,
        pomodoro_count_weekly: true,
      },
    });
    console.log("Query result:", users);

    if (users.length === 0) {
      console.log("No users found with pomodoro_count_weekly > 0");
    }

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching scoreboard data:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  } finally {
    await prisma.$disconnect();
  }
}