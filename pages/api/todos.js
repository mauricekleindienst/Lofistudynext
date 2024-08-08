import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
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

  await prisma.$disconnect();
}

const getTodosHandler = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const todos = await prisma.todos.findMany({
      where: { email },
      orderBy: { position: 'asc' },
      include: { subtasks: true },
    });

    res.status(200).json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const saveTodoHandler = async (req, res) => {
  const { email, text, color = '#ff7b00' } = req.body;

  if (!email || !text) {
    return res.status(400).json({ error: 'Email and text are required' });
  }

  try {
    const todo = await prisma.todos.create({
      data: {
        email,
        text,
        completed: false,
        color,
        position: {
          increment: 1,
          from: (
            await prisma.todos.aggregate({
              _max: { position: true },
              where: { email },
            })
          )._max.position || 0,
        },
      },
    });

    res.status(200).json({ message: 'Todo saved successfully', id: todo.id });
  } catch (error) {
    console.error('Error saving todo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateTodoHandler = async (req, res) => {
  const { id, email, text, completed, color } = req.body;

  if (!id || !email) {
    return res.status(400).json({ error: 'Id and email are required' });
  }

  try {
    const updateData = {
      ...(text !== undefined && { text }),
      ...(completed !== undefined && { completed }),
      ...(color !== undefined && { color }),
    };

    await prisma.todos.updateMany({
      where: { id, email },
      data: updateData,
    });

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
    await prisma.subtasks.deleteMany({ where: { todo_id: id } });
    await prisma.todos.deleteMany({ where: { id, email } });
    res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};