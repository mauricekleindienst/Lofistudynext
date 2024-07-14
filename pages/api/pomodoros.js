// pages/api/pomodoros.js
import { readData, writeData } from '../../utils/dataHandler';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const data = readData();
    res.status(200).json(data);
  } else if (req.method === 'POST') {
    try {
      // Ensure the content type is application/json
      if (!req.headers['content-type'] || !req.headers['content-type'].includes('application/json')) {
        return res.status(400).json({ error: 'Invalid content type, expected application/json' });
      }

      const { userId } = JSON.parse(req.body); // Parse the request body
      const data = readData();
      const user = data.find(user => user.id === userId);

      if (user) {
        user.pomodoros += 1;
        writeData(data);
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
      res.status(400).json({ error: 'Invalid JSON' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
