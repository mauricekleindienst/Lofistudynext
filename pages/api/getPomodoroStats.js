import { createClient, createAdminClient } from '../../utils/supabase/server';
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

async function handler(req, res) {
  try {
    await runMiddleware(req, res, cors);

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed. Only POST requests are allowed.' });
    }    const authSupabase = await createClient();
    const { data: { user }, error: authError } = await authSupabase.auth.getUser();
    
    if (authError || !user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Use the authenticated user's email instead of requiring it in request body
    const userEmail = user?.email;if (!userEmail) {
      return res.status(400).json({ error: 'Bad Request: User email not found in session.' });
    }

    const supabase = createAdminClient();

    const { data: userPomodoros, error } = await supabase
      .from('user_pomodoros')
      .select('pomodoro_count, studying, coding, writing, working, other, daily_counts')
      .eq('email', userEmail)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching Pomodoro stats:', error);
      return res.status(500).json({ error: 'Internal Server Error. Please try again later.' });
    }

    if (!userPomodoros) {
      return res.status(404).json({ error: `User with email ${userEmail} not found.` });
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

    res.status(200).json(stats);  } catch (error) {
    console.error('Error fetching Pomodoro stats:', error);
    res.status(500).json({ error: 'Internal Server Error. Please try again later.' });
  }
}

export default handler;
