import { requireAuth } from '../../lib/auth-helpers';
import Cors from 'cors';
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:3000', 'https://lo-fi.study'];

const cors = Cors({
  origin: allowedOrigins,
  methods: ['POST'],
  allowedHeaders: ['Content-Type'],
});

const runMiddleware = (req, res, fn) =>
  new Promise((resolve, reject) =>
    fn(req, res, (result) => (result instanceof Error ? reject(result) : resolve(result)))
  );

export default requireAuth(async function handler(req, res) {
  try {
    await runMiddleware(req, res, cors);

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed. Only POST requests are allowed.' });
    }

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Bad Request: Email is required.' });
    }

    // Ensure user can only access their own data
    if (email !== user.email) {
      return res.status(403).json({ error: 'Forbidden: You can only access your own data' });
    }

    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: userPomodoros, error } = await supabase
      .from('user_pomodoros')
      .select('pomodoro_count, studying, coding, writing, working, other, daily_counts')
      .eq('user_id', req.user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching Pomodoro stats:', error);
      return res.status(500).json({ error: 'Internal Server Error. Please try again later.' });
    }

    if (!userPomodoros) {
      return res.status(404).json({ error: `User with email ${email} not found.` });
    }

    const stats = {
      pomodoro_count: userPomodoros.pomodoro_count ?? 0,
      studying: userPomodoros.studying ?? 0,
      coding: userPomodoros.coding ?? 0,
      writing: userPomodoros.writing ?? 0,
      working: userPomodoros.working ?? 0,
      other: userPomodoros.other ?? 0,
      daily_counts: userPomodoros.daily_counts ?? {},
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching Pomodoro stats:', error);
    res.status(500).json({ error: 'Internal Server Error. Please try again later.' });
  }
});
