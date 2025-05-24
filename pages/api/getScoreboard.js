// api/getScoreboard.js
import { supabase } from '../../lib/supabase-admin'
import { requireAuth } from '../../lib/auth-helpers'
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';

const cors = initMiddleware(
  Cors({
    methods: ['GET'],
  })
);

const handler = async (req, res) => {
  try {
    await cors(req, res);
  } catch (error) {
    return res.status(500).json({ error: 'CORS error' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type = 'weekly' } = req.query;

  try {
    let query = supabase
      .from('user_pomodoros')
      .select('email, firstname, pomodoro_count_weekly, pomodoro_count')

    if (type === 'weekly') {
      query = query
        .gt('pomodoro_count_weekly', 0)
        .order('pomodoro_count_weekly', { ascending: false })
    } else {
      query = query
        .gt('pomodoro_count', 0)
        .order('pomodoro_count', { ascending: false })
    }

    const { data: users, error } = await query

    if (error) throw error

    // Format the response based on the type
    const formattedUsers = users.map(user => ({
      email: user.email,
      firstname: user.firstname,
      pomodoro_count: type === 'weekly' ? user.pomodoro_count_weekly : user.pomodoro_count,
    }));

    res.status(200).json(formattedUsers);
  } catch (error) {
    console.error('Error fetching scoreboard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export default requireAuth(handler)