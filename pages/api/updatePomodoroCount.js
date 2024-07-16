import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export default async function handler(req, res) {
  const { email, firstname, increment } = req.body;

  if (!email || !firstname || typeof increment !== 'number') {
    return res.status(400).json({ error: 'Invalid request' });
  }

  try {
    const client = await pool.connect();

    const userResult = await client.query('SELECT * FROM user_pomodoros WHERE email = $1', [email]);

    if (userResult.rows.length > 0) {
      await client.query('UPDATE user_pomodoros SET pomodoro_count = pomodoro_count + $1 WHERE email = $2', [increment, email]);
    } else {
      await client.query('INSERT INTO user_pomodoros (email, firstname, pomodoro_count) VALUES ($1, $2, $3)', [email, firstname, increment]);
    }

    client.release();
    res.status(200).json({ message: 'Pomodoro count updated' });
  } catch (error) {
    console.error('Error updating Pomodoro count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
