import { requireAuth } from '../../../lib/auth-helpers';

export default requireAuth(async function handler(req, res, user) {
  const { type, category, count, time } = req.body;

  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Get relevant challenges
    const { data: challenges, error: challengesError } = await supabase
      .from('challenges')
      .select('*')
      .or(`tracking_type.eq.${type},and(tracking_type.eq.category_count,category.eq.${category})`);

    if (challengesError) {
      console.error('Error fetching challenges:', challengesError);
      return res.status(500).json({ error: 'Error fetching challenges' });
    }

    // Process each challenge
    for (const challenge of challenges) {
      // Get current progress
      const { data: currentProgress } = await supabase
        .from('challenge_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('challenge_id', challenge.id)
        .single();

      // Check time requirements if they exist
      if (challenge.time_requirement) {
        const currentHour = new Date().getHours();
        const requirementHour = parseInt(challenge.time_requirement.before || challenge.time_requirement.after);
        
        if (challenge.time_requirement.before && currentHour >= requirementHour) continue;
        if (challenge.time_requirement.after && currentHour < requirementHour) continue;
      }

      const incrementValue = count || 1;
      const newProgress = (currentProgress?.progress || 0) + incrementValue;
      const completed = newProgress >= challenge.total;

      // Update progress
      const { error: updateError } = await supabase
        .from('challenge_progress')
        .upsert({
          user_id: user.id,
          challenge_id: challenge.id,
          progress: newProgress,
          completed: completed,
          completed_at: completed ? new Date().toISOString() : null
        }, {
          onConflict: 'user_id,challenge_id'
        });

      if (updateError) {
        console.error('Error updating progress:', updateError);
        // Continue processing other challenges even if one fails
      }
    }

    res.status(200).json({ message: 'Progress updated' });
  } catch (error) {
    console.error('Error updating challenge progress:', error);
    res.status(500).json({ error: 'Error updating progress' });
  }
}); 