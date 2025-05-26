import { requireAuth } from '../../../lib/auth-helpers';

export default requireAuth(async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: userPomodoros, error } = await supabase
      .from('user_pomodoros')
      .select('pomodoro_count_weekly')
      .eq('email', req.user.email)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Failed to fetch weekly pomodoro count:', error);
      return res.status(500).json({ error: 'Failed to fetch weekly pomodoro count' });
    }

    const count = userPomodoros?.pomodoro_count_weekly || 0;
    res.status(200).json({ count });
  } catch (error) {
    console.error('Failed to fetch weekly pomodoro count:', error);
    res.status(500).json({ error: 'Failed to fetch weekly pomodoro count' });
  }
}); 