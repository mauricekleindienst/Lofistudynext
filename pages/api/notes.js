import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      await getNotesHandler(req, res);
      break;
    case 'POST':
      await saveNoteHandler(req, res);
      break;
    case 'DELETE':
      await deleteNoteHandler(req, res);
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

const getNotesHandler = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT id, title, content FROM notes WHERE email = $1', [email]);
    client.release();

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const saveNoteHandler = async (req, res) => {
  const { id, email, title, content } = req.body;

  if (!email || !content) {
    return res.status(400).json({ error: 'Email and content are required' });
  }

  try {
    const client = await pool.connect();

    if (id) {
      // Update existing note
      await client.query('UPDATE notes SET title = $1, content = $2 WHERE id = $3 AND email = $4', [title, content, id, email]);
    } else {
      // Insert new note
      await client.query('INSERT INTO notes (email, title, content) VALUES ($1, $2, $3)', [email, title, content]);
    }

    client.release();
    res.status(200).json({ message: 'Note saved successfully' });
  } catch (error) {
    console.error('Error saving note:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteNoteHandler = async (req, res) => {
  const { id, email } = req.body;

  if (!id || !email) {
    return res.status(400).json({ error: 'Id and email are required' });
  }

  try {
    const client = await pool.connect();
    await client.query('DELETE FROM notes WHERE id = $1 AND email = $2', [id, email]);
    client.release();
    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
