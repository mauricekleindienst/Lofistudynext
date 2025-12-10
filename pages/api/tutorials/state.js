import { createClient, createAdminClient } from '../../../utils/supabase/server';

async function handler(req, res) {
  // Get authenticated user
  const authSupabase = await createClient();
  const { data: { user }, error: authError } = await authSupabase.auth.getUser();
  
  if (authError || !user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const supabase = createAdminClient();

  if (req.method === 'GET') {
    try {
      const { tutorial } = req.query;      const { data: tutorialState, error } = await supabase
        .from('tutorial_state')
        .select('*')
        .eq('user_id', user.id)
        .eq('tutorial', tutorial)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Failed to fetch tutorial state:', error);
        return res.status(500).json({ error: 'Failed to fetch tutorial state' });
      }
      
      res.status(200).json(tutorialState || { completed: false });
    } catch (error) {
      console.error('Failed to fetch tutorial state:', error);
      res.status(500).json({ error: 'Failed to fetch tutorial state' });
    }
  } else if (req.method === 'POST') {
    try {
      const { tutorial, completed } = req.body;
        const { data: tutorialState, error } = await supabase
        .from('tutorial_state')
        .upsert({
          user_id: user.id,
          email: user.email,
          tutorial: tutorial,
          completed: completed
        }, {
          onConflict: 'email,tutorial'
        })
        .select()
        .single();

      if (error) {
        console.error('Failed to update tutorial state:', error);
        return res.status(500).json({ error: 'Failed to update tutorial state' });
      }
      
      res.status(200).json(tutorialState);
    } catch (error) {
      console.error('Failed to update tutorial state:', error);
      res.status(500).json({ error: 'Failed to update tutorial state' });
    }  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;