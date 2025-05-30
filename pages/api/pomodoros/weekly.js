import { createAdminClient } from '../../../utils/supabase/server';
import { requireAuth } from '../../../utils/auth-helpers';

export default requireAuth(async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = createAdminClient();

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