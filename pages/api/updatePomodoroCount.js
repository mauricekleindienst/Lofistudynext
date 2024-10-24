import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Only POST requests are accepted.' });
  }

  const { email, firstname, increment, category } = req.body;

  if (!email || !firstname || typeof increment !== 'number' || !category) {
    return res.status(400).json({ error: 'Invalid request. All fields are required.' });
  }

  if (!['Studying', 'Coding', 'Writing', 'Working', 'Other'].includes(category)) {
    return res.status(400).json({ error: 'Invalid category.' });
  }

  try {
    const today = new Date().toISOString().split('T')[0];

    const existingUser = await prisma.user_pomodoros.findUnique({
      where: { email },
    });

    let updatedDailyCounts = existingUser
      ? { ...existingUser.daily_counts, [today]: (existingUser.daily_counts[today] || 0) + increment }
      : { [today]: increment };

    const user = await prisma.user_pomodoros.upsert({
      where: { email },
      update: {
        pomodoro_count: { increment },
        pomodoro_count_weekly: { increment },
        [category.toLowerCase()]: { increment },
        daily_counts: updatedDailyCounts,
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

    res.status(200).json({ message: 'Pomodoro count updated successfully' });
  } catch (error) {
    console.error('Error updating Pomodoro count:', error);
    res.status(500).json({ error: 'Internal server error. Please try again later.' });
  } finally {
    await prisma.$disconnect();
  }
}
