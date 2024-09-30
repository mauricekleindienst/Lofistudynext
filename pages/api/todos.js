import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    switch (req.method) {
      case 'GET':
        return getTodosHandler(req, res);
      case 'POST':
        return saveTodoHandler(req, res);
      case 'PUT':
        return updateTodoHandler(req, res);
      case 'DELETE':
        return deleteTodoHandler(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error in todo handler:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    // Ensure that Prisma disconnects only once after all requests
    await prisma.$disconnect();
  }
}

async function getTodosHandler(req, res) {
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
      take: parseInt(limit),
    });

    const totalCount = await prisma.todos.count({ where: { email } });

    return res.status(200).json({
      todos,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error('Error fetching todos:', error);
    return res.status(500).json({ error: 'Failed to fetch todos' });
  }
}

async function saveTodoHandler(req, res) {
  const { email, text, color = '#ff7b00' } = req.body;

  if (!email || !text) {
    return res.status(400).json({ error: 'Email and text are required' });
  }

  try {
    const maxPosition = await prisma.todos.aggregate({
      _max: { position: true },
      where: { email },
    }).then(result => result._max.position || 0);

    const todo = await prisma.todos.create({
      data: {
        email,
        text,
        completed: false,
        color,
        position: maxPosition + 1,
      },
    });

    return res.status(201).json({ message: 'Todo saved successfully', id: todo.id });
  } catch (error) {
    console.error('Error saving todo:', error);
    return res.status(500).json({ error: 'Failed to save todo' });
  }
}

async function updateTodoHandler(req, res) {
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

    return res.status(200).json({ message: 'Todo updated successfully' });
  } catch (error) {
    console.error('Error updating todo:', error);
    return res.status(500).json({ error: 'Failed to update todo' });
  }
}

// Backend code: Fix in the handler
async function deleteTodoHandler(req, res) {
  const { id, email } = req.body;

  if (!id || !email) {
    return res.status(400).json({ error: 'Id and email are required' });
  }

  try {
    // Start transaction to delete subtasks and the todo
    const deleteTransaction = await prisma.$transaction([
      prisma.subtasks.deleteMany({
        where: { todo_id: id },
      }),
      prisma.todos.delete({
        where: {
          id_email: {
            id,
            email,
          },
        },
      }),
    ]);

    // Ensure that the todo was successfully deleted
    if (!deleteTransaction[1]) {
      return res.status(404).json({ error: 'Todo not found or already deleted' });
    }

    return res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);

    // Handle specific Prisma error cases
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Todo not found or already deleted' });
    }

    if (error.code === 'P1001') {
      return res.status(500).json({ error: 'Database connection failed' });
    }

    return res.status(500).json({ error: 'Failed to delete todo' });
  }
}
