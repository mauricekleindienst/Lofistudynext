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

    // Get all users ordered by weekly pomodoro count
    const { data: rankings, error } = await supabase
      .from('user_pomodoros')      .select('user_id, pomodoro_count_weekly')
      .order('pomodoro_count_weekly', { ascending: false });

    if (error) {
      console.error('Failed to fetch users:', error);
      return res.status(500).json({ error: 'Failed to fetch user rank' });
    }

    // Find user's rank
    const users = rankings || [];
    const userIndex = users.findIndex(u => u.user_id === user.id);
    const rank = userIndex !== -1 ? userIndex + 1 : users.length + 1;    res.status(200).json({ rank });
  } catch (error) {
    console.error('Failed to fetch user rank:', error);
    res.status(500).json({ error: 'Failed to fetch user rank' });
  }
}

export default handler;