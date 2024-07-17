// pages/api/todos.js

import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default async function handler(req, res) {
  console.log('Todos API route hit:', req.method);
  const { method } = req;

  switch (method) {
    case 'GET':
      await getTodosHandler(req, res);
      break;
    case 'POST':
      await saveTodoHandler(req, res);
      break;
    case 'PUT':
      await updateTodoHandler(req, res);
      break;
    case 'DELETE':
      await deleteTodoHandler(req, res);
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

const getTodosHandler = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT id, text, completed FROM todos WHERE email = $1', [email]);
    client.release();

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const saveTodoHandler = async (req, res) => {
  const { email, text } = req.body;

  if (!email || !text) {
    return res.status(400).json({ error: 'Email and text are required' });
  }

  try {
    const client = await pool.connect();
    await client.query('INSERT INTO todos (email, text, completed) VALUES ($1, $2, $3)', [email, text, false]);
    client.release();
    res.status(200).json({ message: 'Todo saved successfully' });
  } catch (error) {
    console.error('Error saving todo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateTodoHandler = async (req, res) => {
  const { id, email, completed } = req.body;

  if (!id || !email) {
    return res.status(400).json({ error: 'Id and email are required' });
  }

  try {
    const client = await pool.connect();
    await client.query('UPDATE todos SET completed = $1 WHERE id = $2 AND email = $3', [completed, id, email]);
    client.release();
    res.status(200).json({ message: 'Todo updated successfully' });
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteTodoHandler = async (req, res) => {
  const { id, email } = req.body;

  if (!id || !email) {
    return res.status(400).json({ error: 'Id and email are required' });
  }

  try {
    const client = await pool.connect();
    await client.query('DELETE FROM todos WHERE id = $1 AND email = $2', [id, email]);
    client.release();
    res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};