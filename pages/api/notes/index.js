import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Please sign in to continue' });
  }

  try {
    switch (req.method) {
      case 'GET':
        return getNotes(req, res, session);
      case 'POST':
        return createNote(req, res, session);
      case 'PUT':
        return updateNote(req, res, session);
      case 'DELETE':
        return deleteNote(req, res, session);
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error in notes handler:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function getNotes(req, res, session) {
  try {
    const notes = await prisma.notes.findMany({
      where: {
        email: session.user.email
      },
      orderBy: {
        id: 'desc'
      }
    });
    return res.status(200).json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    return res.status(500).json({ error: 'Failed to fetch notes' });
  }
}

async function createNote(req, res, session) {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  try {
    const note = await prisma.notes.create({
      data: {
        email: session.user.email,
        title,
        content
      }
    });
    return res.status(201).json(note);
  } catch (error) {
    console.error('Error creating note:', error);
    return res.status(500).json({ error: 'Failed to create note' });
  }
}

async function updateNote(req, res, session) {
  const { id, title, content } = req.body;

  if (!id || !title || !content) {
    return res.status(400).json({ error: 'Id, title, and content are required' });
  }

  try {
    const note = await prisma.notes.updateMany({
      where: {
        AND: [
          { id: parseInt(id) },
          { email: session.user.email }
        ]
      },
      data: {
        title,
        content
      }
    });

    if (note.count === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }

    // Fetch the updated note to return
    const updatedNote = await prisma.notes.findFirst({
      where: {
        AND: [
          { id: parseInt(id) },
          { email: session.user.email }
        ]
      }
    });

    return res.status(200).json(updatedNote);
  } catch (error) {
    console.error('Error updating note:', error);
    return res.status(500).json({ error: 'Failed to update note' });
  }
}

async function deleteNote(req, res, session) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Note ID is required' });
  }

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
      return res.status(404).json({ error: 'Note not found' });
    }

    return res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error);
    return res.status(500).json({ error: 'Failed to delete note' });
  }
} 