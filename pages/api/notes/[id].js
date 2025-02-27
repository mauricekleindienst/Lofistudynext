import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Please sign in to continue' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Note ID is required' });
  }

  if (req.method === 'DELETE') {
    try {
      const result = await prisma.notes.deleteMany({
        where: {
          AND: [
            { id: parseInt(id) },
            { email: session.user.email }
          ]
        }
      });

      if (result.count === 0) {
        return res.status(404).json({ error: 'Note not found or already deleted' });
      }

      return res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
      console.error('Error deleting note:', error);
      return res.status(500).json({ error: 'Failed to delete note' });
    }
  }

  res.setHeader('Allow', ['DELETE']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
} 