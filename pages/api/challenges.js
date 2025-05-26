import { getSupabaseServerClient } from '../../lib/supabase-server';

export default async function handler(req, res) {
  const supabase = getSupabaseServerClient(req, res);

  try {
    // Check authentication
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { method } = req;

    switch (method) {
      case 'GET':
        try {
          const { data: challenges, error } = await supabase
            .from('challenges')
            .select('*')
            .order('id', { ascending: true });

          if (error) {
            console.error('Challenges fetch error:', error);
            return res.status(500).json({ error: 'Failed to fetch challenges' });
          }

          return res.status(200).json({ challenges: challenges || [] });
        } catch (error) {
          console.error('Challenges GET error:', error);
          return res.status(500).json({ error: 'Internal server error' });
        }

      case 'POST':
        try {
          const { title, description, points, difficulty } = req.body;

          if (!title || !description) {
            return res.status(400).json({ error: 'Title and description are required' });
          }

          const { data: challenge, error } = await supabase
            .from('challenges')
            .insert([{
              title,
              description,
              points: points || 10,
              difficulty: difficulty || 'easy'
            }])
            .select()
            .single();

          if (error) {
            console.error('Challenge creation error:', error);
            return res.status(500).json({ error: 'Failed to create challenge' });
          }

          return res.status(201).json({ challenge });
        } catch (error) {
          console.error('Challenge POST error:', error);
          return res.status(500).json({ error: 'Internal server error' });
        }

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: `Method ${method} not allowed` });
    }
  } catch (error) {
    console.error('Challenges API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
