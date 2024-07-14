// pages/api/pomodoros.js
import { readData, writeData } from '../../utils/dataHandler';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const data = readData();
    res.status(200).json(data);
  } else if (req.method === 'POST') {
    const { userId } = req.body;
    const data = readData();
    const user = data.find(user => user.id === userId);

    if (user) {
      user.pomodoros += 1;
      writeData(data);
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
