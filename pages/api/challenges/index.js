import { createClient, createAdminClient } from '../../../utils/supabase/server'

const handler = async (req, res) => {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const supabaseAdmin = createAdminClient()

  if (req.method === 'GET') {
    const { filter = 'all' } = req.query;

    try {
      let query = supabaseAdmin
        .from('challenges')
        .select(`
          *,
          progress!progress_challenge_id_fkey (
            progress,
            completed,
            completed_at
          )
        `)

      if (filter !== 'all') {
        query = query.eq('type', filter)
      }

      // Filter progress by user_id
      query = query.eq('progress.user_id', user.id)

      const { data: challenges, error } = await query

      if (error) throw error

      const formattedChallenges = challenges.map(challenge => {
        const userProgress = challenge.progress[0] || { progress: 0, completed: false };
        return {
          ...challenge,
          currentProgress: userProgress.progress,
          completed: userProgress.completed
        };
      });

      res.json(formattedChallenges);
    } catch (error) {
      console.error('Error fetching challenges:', error);
      res.status(500).json({ error: 'Error fetching challenges' });
    }
  }
}

export default handler; 