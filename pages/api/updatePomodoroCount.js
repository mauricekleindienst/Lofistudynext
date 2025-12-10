import { createClient, createAdminClient } from '../../utils/supabase/server'

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Only POST requests are accepted.' });
  }

  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const supabaseAdmin = createAdminClient()
  const { increment, category } = req.body;

  if (typeof increment !== 'number' || !category) {
    return res.status(400).json({ error: 'Invalid request. Increment and category are required.' });
  }

  if (!['Studying', 'Coding', 'Writing', 'Working', 'Other'].includes(category)) {
    return res.status(400).json({ error: 'Invalid category.' });
  }

  try {
    const today = new Date().toISOString().split('T')[0];

    // Get existing user data
    const { data: existingUser, error: fetchError } = await supabaseAdmin
      .from('user_pomodoros')
      .select('*')
      .eq('email', user.email)
      .single()

    let updatedDailyCounts = existingUser
      ? { ...existingUser.daily_counts, [today]: (existingUser.daily_counts[today] || 0) + increment }
      : { [today]: increment };

    const updateData = {
      pomodoro_count: (existingUser?.pomodoro_count || 0) + increment,
      pomodoro_count_weekly: (existingUser?.pomodoro_count_weekly || 0) + increment,
      [category.toLowerCase()]: (existingUser?.[category.toLowerCase()] || 0) + increment,
      daily_counts: updatedDailyCounts,
      updated_at: new Date()
    }

    if (existingUser) {
      const { error } = await supabaseAdmin
        .from('user_pomodoros')
        .update(updateData)
        .eq('email', user.email)

      if (error) throw error
    } else {
      const { error } = await supabaseAdmin
        .from('user_pomodoros')
        .insert({
          email: user.email,
          user_id: user.id,
          firstname: user.user_metadata?.full_name || user.email.split('@')[0],
          ...updateData
        })

      if (error) throw error
    }

    // Get current hour for time-based challenges
    const currentHour = new Date().getHours();

    // Check and update challenges
    await Promise.all([
      // Update daily pomodoro count challenge
      updateChallengeProgress(user, 'pomodoro_daily', increment),
      
      // Update category-specific challenge
      updateChallengeProgress(user, 'category_count', increment, category.toLowerCase()),
      
      // Update weekly pomodoro challenge
      updateChallengeProgress(user, 'pomodoro_weekly', increment),
      
      // Check time-based challenges
      updateTimeBasedChallenges(user, currentHour)
    ]);

    res.status(200).json({ message: 'Pomodoro count updated successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export default handler;

async function updateChallengeProgress(user, type, count, category = null) {
  try {
    let query = supabase
      .from('challenges')
      .select(`
        *,
        progress!progress_challenge_id_fkey (*)
      `)
      .eq('tracking_type', type)
      .eq('progress.user_id', user.id)

    if (category) {
      query = query.eq('category', category)
    }

    const { data: challenges, error } = await query

    if (error) throw error

    for (const challenge of challenges) {
      const currentProgress = challenge.progress[0];
      
      const progressData = {
        user_id: user.id,
        challenge_id: challenge.id,
        progress: (currentProgress?.progress || 0) + count,
        completed: (currentProgress?.progress || 0) + count >= challenge.total,
        completed_at: (currentProgress?.progress || 0) + count >= challenge.total ? new Date() : null
      }

      if (currentProgress) {
        await supabaseAdmin
          .from('progress')
          .update(progressData)
          .eq('user_id', user.id)
          .eq('challenge_id', challenge.id)
      } else {
        await supabaseAdmin
          .from('progress')
          .insert(progressData)
      }
    }
  } catch (error) {
    console.error('Error updating challenge progress:', error);
  }
}

async function updateTimeBasedChallenges(user, currentHour) {
  try {
    const { data: timeBasedChallenges, error } = await supabaseAdmin
      .from('challenges')
      .select(`
        *,
        progress!progress_challenge_id_fkey (*)
      `)
      .eq('tracking_type', 'time_check')
      .eq('progress.user_id', user.id)

    if (error) throw error

    for (const challenge of timeBasedChallenges) {
      if (challenge.time_requirement) {
        const requirementHour = parseInt(challenge.time_requirement.before || challenge.time_requirement.after);
        
        // Check if time requirement is met
        if ((challenge.time_requirement.before && currentHour < requirementHour) ||
            (challenge.time_requirement.after && currentHour >= requirementHour)) {
          
          const progressData = {
            user_id: user.id,
            challenge_id: challenge.id,
            progress: 1,
            completed: true,
            completed_at: new Date()
          }

          const currentProgress = challenge.progress[0];
          
          if (currentProgress) {
            await supabaseAdmin
              .from('progress')
              .update(progressData)
              .eq('user_id', user.id)
              .eq('challenge_id', challenge.id)
          } else {
            await supabaseAdmin
              .from('progress')
              .insert(progressData)
          }
        }
      }
    }
  } catch (error) {
    console.error('Error updating time-based challenges:', error);
  }
}
