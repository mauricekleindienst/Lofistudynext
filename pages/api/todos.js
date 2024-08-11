import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { method } = req;

  try {
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
  } catch (error) {
    console.error('Error in todo handler:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}

const getTodosHandler = async (req, res) => {
  const { email, page = 1, limit = 20 } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const skip = (page - 1) * limit;
    const todos = await prisma.todos.findMany({
      where: { email },
      orderBy: { position: 'asc' },
      include: { subtasks: true },
      skip,
      take: Number(limit),
    });

    const totalCount = await prisma.todos.count({ where: { email } });

    res.status(200).json({
      todos,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
};

const saveTodoHandler = async (req, res) => {
  const { email, text, color = '#ff7b00' } = req.body;

  if (!email || !text) {
    return res.status(400).json({ error: 'Email and text are required' });
  }

  try {
    const maxPositionResult = await prisma.todos.aggregate({
      _max: { position: true },
      where: { email },
    });
    const maxPosition = maxPositionResult._max.position || 0;

    const todo = await prisma.todos.create({
      data: {
        email,
        text,
        completed: false,
        color,
        position: maxPosition + 1,
      },
    });

    res.status(201).json({ message: 'Todo saved successfully', id: todo.id });
  } catch (error) {
    console.error('Error saving todo:', error);
    res.status(500).json({ error: 'Failed to save todo' });
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

    const updatedTodo = await prisma.todos.updateMany({
      where: { id, email },
      data: updateData,
    });

    if (updatedTodo.count === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.status(200).json({ message: 'Todo updated successfully' });
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Failed to update todo' });
  }
};

const deleteTodoHandler = async (req, res) => {
  const { id, email } = req.body;

  if (!id || !email) {
    return res.status(400).json({ error: 'Id and email are required' });
  }

  try {
    await prisma.$transaction(async (prisma) => {
      await prisma.subtasks.deleteMany({ where: { todo_id: id } });
      const deletedTodo = await prisma.todos.deleteMany({ where: { id, email } });

      if (deletedTodo.count === 0) {
        throw new Error('Todo not found');
      }
    });

    res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    if (error.message === 'Todo not found') {
      res.status(404).json({ error: 'Todo not found' });
    } else {
      res.status(500).json({ error: 'Failed to delete todo' });
    }
  }
};