import { getSession } from 'next-auth/react';
import Note from '../../models/Note';
import sequelize from '../../lib/db';

export default async (req, res) => {
  await sequelize.sync();
  const session = await getSession({ req });

  if (!session || !session.user || !session.user.email) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { email } = session.user;

  if (req.method === 'GET') {
    try {
      const note = await Note.findOne({ where: { userId: email } });
      return res.status(200).json(note ? note.content : '');
    } catch (error) {
      console.error('Error fetching note:', error);
      return res.status(500).json({ error: 'Failed to fetch note' });
    }
  }

  if (req.method === 'POST') {
    const { content } = req.body;
    try {
      const [note, created] = await Note.findOrCreate({
        where: { userId: email },
        defaults: { content },
      });

      if (!created) {
        note.content = content;
        await note.save();
      }

      return res.status(200).json(note);
    } catch (error) {
      console.error('Error saving note:', error);
      return res.status(500).json({ error: 'Failed to save note' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
};
