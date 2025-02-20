import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    switch (req.method) {
      case 'POST':
        return addSubtaskHandler(req, res);
      case 'PUT':
        return updateSubtaskHandler(req, res);
      case 'DELETE':
        return deleteSubtaskHandler(req, res);
      default:
        res.setHeader('Allow', ['POST', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error in subtask handler:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}

async function addSubtaskHandler(req, res) {
  const { todoId, email, text } = req.body;

  if (!todoId || !email || !text) {
    return res.status(400).json({ error: 'TodoId, email, and text are required' });
  }

  try {
    // First verify the todo belongs to the user
    const todo = await prisma.todos.findUnique({
      where: {
        id_email: {
          id: parseInt(todoId),
          email: email,
        }
      }
    });

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    const subtask = await prisma.subtasks.create({
      data: {
        todo_id: parseInt(todoId),
        text,
        completed: false,
      },
    });

    return res.status(201).json({
      message: 'Subtask added successfully',
      subtask,
    });
  } catch (error) {
    console.error('Error adding subtask:', error);
    return res.status(500).json({ error: 'Failed to add subtask' });
  }
}

async function updateSubtaskHandler(req, res) {
  const { id, todoId, email, text, completed } = req.body;

  if (!id || !todoId || !email) {
    return res.status(400).json({ error: 'Id, todoId, and email are required' });
  }

  try {
    // Verify todo ownership
    const todo = await prisma.todos.findUnique({
      where: {
        id_email: {
          id: parseInt(todoId),
          email: email,
        }
      }
    });

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    const updateData = {
      ...(text !== undefined && { text }),
      ...(completed !== undefined && { completed }),
    };

    const subtask = await prisma.subtasks.update({
      where: {
        id_todo_id: {
          id: parseInt(id),
          todo_id: parseInt(todoId),
        }
      },
      data: updateData,
    });

    return res.status(200).json({
      message: 'Subtask updated successfully',
      subtask,
    });
  } catch (error) {
    console.error('Error updating subtask:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Subtask not found' });
    }
    return res.status(500).json({ error: 'Failed to update subtask' });
  }
}

async function deleteSubtaskHandler(req, res) {
  const { id, todoId, email } = req.body;

  if (!id || !todoId || !email) {
    return res.status(400).json({ error: 'Id, todoId, and email are required' });
  }

  try {
    // Verify todo ownership
    const todo = await prisma.todos.findUnique({
      where: {
        id_email: {
          id: parseInt(todoId),
          email: email,
        }
      }
    });

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    await prisma.subtasks.delete({
      where: {
        id_todo_id: {
          id: parseInt(id),
          todo_id: parseInt(todoId),
        }
      },
    });

    return res.status(200).json({ message: 'Subtask deleted successfully' });
  } catch (error) {
    console.error('Error deleting subtask:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Subtask not found' });
    }
    return res.status(500).json({ error: 'Failed to delete subtask' });
  }
}
