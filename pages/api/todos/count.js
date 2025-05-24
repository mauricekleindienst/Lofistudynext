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

    const { count, error } = await supabase
      .from('todos')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('completed', false);

    if (error) {
      console.error('Failed to fetch todos count:', error);
      return res.status(500).json({ error: 'Failed to fetch todos count' });
    }

    res.status(200).json({ count: count || 0 });
  } catch (error) {
    console.error('Failed to fetch todos count:', error);
    res.status(500).json({ error: 'Failed to fetch todos count' });
  }
}); 