import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  await reorderTodosHandler(req, res);
}

const reorderTodosHandler = async (req, res) => {
    const { email, newOrder } = req.body;
  
    if (!email || !newOrder || !Array.isArray(newOrder)) {
      return res.status(400).json({ error: 'Email and newOrder array are required' });
    }
  
    try {
      const client = await pool.connect();
      await client.query('BEGIN');
  
      for (let i = 0; i < newOrder.length; i++) {
        await client.query(
          'UPDATE todos SET position = $1 WHERE id = $2 AND email = $3',
          [i + 1, newOrder[i].id, email]
        );
      }
  
      await client.query('COMMIT');
      client.release();
  
      res.status(200).json({ message: 'Todos reordered successfully' });
    } catch (error) {
      console.error('Error reordering todos:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
};
