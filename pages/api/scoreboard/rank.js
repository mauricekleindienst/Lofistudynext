import { requireAuth } from '../../../lib/auth-helpers';

export default requireAuth(async function handler(req, res, user) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Get all users ordered by weekly pomodoro count
    const { data: users, error } = await supabase
      .from('user_pomodoros')
      .select('user_id, pomodoro_count_weekly')
      .order('pomodoro_count_weekly', { ascending: false });

    if (error) {
      console.error('Failed to fetch users:', error);
      return res.status(500).json({ error: 'Failed to fetch user rank' });
    }

    // Find user's rank
    const userIndex = users.findIndex(u => u.user_id === user.id);
    const rank = userIndex !== -1 ? userIndex + 1 : users.length + 1;

    res.status(200).json({ rank });
  } catch (error) {
    console.error('Failed to fetch user rank:', error);
    res.status(500).json({ error: 'Failed to fetch user rank' });
  }
}); 