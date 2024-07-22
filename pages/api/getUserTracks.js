import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userEmail } = req.query;

  if (!userEmail) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  try {
    const client = await pool.connect();
    
    const result = await client.query(
      'SELECT id, title, video_id FROM tracks WHERE user_email = $1',
      [userEmail]
    );

    const userTracks = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      videoId: row.video_id
    }));

    client.release();
    res.status(200).json(userTracks);
  } catch (error) {
    console.error('Error fetching user tracks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}