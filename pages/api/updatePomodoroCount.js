import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { email, firstname, increment, category } = req.body;

  if (!email || !firstname || typeof increment !== 'number' || !category) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  try {
    const today = new Date().toISOString().split('T')[0]; // Get the current date in YYYY-MM-DD format

    const user = await prisma.user_pomodoros.upsert({
      where: { email },
      update: {
        pomodoro_count: { increment },
        pomodoro_count_weekly: { increment },
        [category.toLowerCase()]: { increment },
        daily_counts: {
          [today]: (prisma.user_pomodoros.daily_counts[today] || 0) + increment,
        },
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

    res.status(200).json({ message: 'Pomodoro count updated' });
  } catch (error) {
    console.error('Error updating Pomodoro count:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}