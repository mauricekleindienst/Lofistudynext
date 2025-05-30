import { createClient, createAdminClient } from '../../../utils/supabase/server';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const supabaseAdmin = createAdminClient();

    const { count, error } = await supabaseAdmin
      .from('todos')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('completed', false);

    if (error) {
      console.error('Failed to fetch todos count:', error);
      return res.status(500).json({ error: 'Failed to fetch todos count' });
    }

    res.status(200).json({ count: count || 0 });  } catch (error) {
    console.error('Failed to fetch todos count:', error);
    res.status(500).json({ error: 'Failed to fetch todos count' });
  }
}

export default handler;