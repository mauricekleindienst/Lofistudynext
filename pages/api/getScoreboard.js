import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export default async function handler(req, res) {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT firstname, pomodoro_count FROM user_pomodoros ORDER BY pomodoro_count DESC');
    client.release();
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching scoreboard data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
