import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, title, videoId } = req.body;

  if (!email || !title || !videoId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const client = await pool.connect();
    
    const result = await client.query(
      'INSERT INTO tracks (user_email, title, video_id) VALUES ($1, $2, $3) RETURNING id',
      [email, title, videoId]
    );

    const newTrackId = result.rows[0].id;

    client.release();
    res.status(200).json({ message: 'Track added successfully', id: newTrackId });
  } catch (error) {
    console.error('Error adding track:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
