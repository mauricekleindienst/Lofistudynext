import { createClient, createAdminClient } from '../../../utils/supabase/server';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get authenticated user
  const authSupabase = createClient();
  const { data: { user }, error: authError } = await authSupabase.auth.getUser();
  
  if (authError || !user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const supabase = createAdminClient();

    const { data: userPomodoros, error } = await supabase
      .from('user_pomodoros')
      .select('pomodoro_count_weekly')
      .eq('email', user.email)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Failed to fetch weekly pomodoro count:', error);
      return res.status(500).json({ error: 'Failed to fetch weekly pomodoro count' });
    }    const count = userPomodoros?.pomodoro_count_weekly || 0;
    res.status(200).json({ count });
  } catch (error) {
    console.error('Failed to fetch weekly pomodoro count:', error);
    res.status(500).json({ error: 'Failed to fetch weekly pomodoro count' });
  }
}

export default handler;