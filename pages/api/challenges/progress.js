import { createClient, createAdminClient } from '../../../utils/supabase/server';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { challengeId, email } = req.body;

  // Ensure user can only update their own progress
  if (email && email !== user.email) {
    return res.status(403).json({ error: 'Forbidden: You can only update your own progress' });
  }

  try {
    const supabase = createAdminClient();

    // Get challenge details
    const { data: challenge, error: challengeError } = await supabase
      .from('challenges')
      .select('id, total')
      .eq('id', challengeId)
      .single();

    if (challengeError || !challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    // Get current progress
    const { data: currentProgress, error: progressError } = await supabase
      .from('challenge_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('challenge_id', challengeId)
      .single();

    if (progressError && progressError.code !== 'PGRST116') {
      console.error('Error fetching progress:', progressError);
      return res.status(500).json({ error: 'Error fetching progress' });
    }

    const newProgress = (currentProgress?.progress || 0) + 1;
    const completed = newProgress >= challenge.total;

    const { data: updatedProgress, error: updateError } = await supabase
      .from('challenge_progress')
      .upsert({
        user_id: user.id,
        challenge_id: challengeId,
        progress: newProgress,
        completed,
        completed_at: completed ? new Date().toISOString() : null
      }, {
        onConflict: 'user_id,challenge_id'
      })
      .select()
      .single();

    if (updateError) {
      console.error('Error updating progress:', updateError);
      return res.status(500).json({ error: 'Error updating progress' });
    }

    res.json(updatedProgress);  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ error: 'Error updating progress' });
  }
}

export default handler;