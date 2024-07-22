import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export default async function handler(req, res) {
  const { email, firstname, increment, category } = req.body;

  if (!email || !firstname || typeof increment !== 'number' || !category) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  try {
    const client = await pool.connect();

    const userResult = await client.query('SELECT * FROM user_pomodoros WHERE email = $1', [email]);

    const today = new Date().toISOString().split('T')[0]; // Get the current date in YYYY-MM-DD format

    if (userResult.rows.length > 0) {
      const user = userResult.rows[0];
      const dailyCounts = user.daily_counts || {};

      if (!dailyCounts[today]) {
        dailyCounts[today] = 0;
      }

      dailyCounts[today] += increment;

      await client.query(
        `UPDATE user_pomodoros
         SET pomodoro_count = pomodoro_count + $1,
             pomodoro_count_weekly = pomodoro_count_weekly + $1,
             ${category.toLowerCase()} = ${category.toLowerCase()} + $1,
             daily_counts = $2
         WHERE email = $3`,
        [increment, dailyCounts, email]
      );
    } else {
      const dailyCounts = { [today]: increment };

      await client.query(
        `INSERT INTO user_pomodoros (email, firstname, pomodoro_count, pomodoro_count_weekly, ${category.toLowerCase()}, daily_counts)
         VALUES ($1, $2, $3, $3, $3, $4)`,
        [email, firstname, increment, dailyCounts]
      );
    }

    client.release();
    res.status(200).json({ message: 'Pomodoro count updated' });
  } catch (error) {
    console.error('Error updating Pomodoro count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
