import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

  await prisma.$disconnect();
}

const getNotesHandler = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const notes = await prisma.notes.findMany({
      where: { email },
      select: { id: true, title: true, content: true },
    });

    res.status(200).json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const saveNoteHandler = async (req, res) => {
  const { id, email, title, content } = req.body;

  if (!email || !content) {
    console.error('Missing required fields:', { email, content });
    return res.status(400).json({ error: 'Email and content are required' });
  }

  try {
    let note;
    if (id && !id.startsWith('temp_')) {
      console.log('Updating note with ID:', id);
      note = await prisma.notes.update({
        where: { id },
        data: { title, content },
      });
    } else {
      console.log('Creating new note');
      note = await prisma.notes.create({
        data: { email, title, content },
      });
    }

    res.status(200).json(note);
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
    const deleteResult = await prisma.notes.deleteMany({ where: { id, email } });

    if (deleteResult.count > 0) {
      res.status(200).json({ message: 'Note deleted successfully' });
    } else {
      res.status(404).json({ error: 'Note not found or already deleted' });
    }
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
