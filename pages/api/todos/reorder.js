import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { email, newOrder } = req.body;

  if (!email || !newOrder || !Array.isArray(newOrder)) {
    return res.status(400).json({ error: 'Email and newOrder array are required' });
  }

  try {
    // Use transaction to ensure all position updates succeed or none do
    await prisma.$transaction(
      newOrder.map(({ id, position }) =>
        prisma.todos.updateMany({
          where: {
            AND: [
              { id: parseInt(id) },
              { email: email }
            ]
          },
          data: { position },
        })
      )
    );

    // Fetch updated todos to return in response
    const updatedTodos = await prisma.todos.findMany({
      where: { email },
      orderBy: { position: 'asc' },
      include: { subtasks: true }
    });

    return res.status(200).json({ 
      message: 'Todo order updated successfully',
      todos: updatedTodos
    });
  } catch (error) {
    console.error('Error reordering todos:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'One or more todos not found' });
    }
    
    return res.status(500).json({ error: 'Failed to reorder todos' });
  } finally {
    await prisma.$disconnect();
  }
}
