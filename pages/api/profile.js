// pages/api/profile.js
import { createClient, createAdminClient } from '../../utils/supabase/server';

const handler = async (req, res) => {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (req.method === 'GET') {
    try {
      const supabaseAdmin = createAdminClient()
      // Get user profile from auth.users
      const { data: userProfile, error: userError } = await supabaseAdmin.auth.admin.getUserById(user.id);
      
      if (userError) {
        console.error('Error fetching user profile:', userError);
        return res.status(500).json({ error: 'Failed to fetch user profile' });
      }

      // Get additional user stats
      const { data: pomodoroStats, error: pomodoroError } = await supabaseAdmin
        .from('user_pomodoros')
        .select('pomodoro_count, studying, coding, writing, working, other')
        .eq('user_id', user.id)
        .single();

      const { data: todoStats, error: todoError } = await supabaseAdmin
        .from('todos')
        .select('completed')
        .eq('user_id', user.id);

      const completedTodos = todoStats ? todoStats.filter(todo => todo.completed).length : 0;

      return res.status(200).json({
        user: userProfile.user,
        stats: {
          totalPomodoros: pomodoroStats?.pomodoro_count || 0,
          totalStudyTime: Math.round((pomodoroStats?.pomodoro_count || 0) * 25 / 60), // Convert to hours
          todosCompleted: completedTodos,
          currentStreak: 0 // TODO: Implement streak calculation
        }
      });
    } catch (error) {
      console.error('Error in GET /api/profile:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  if (req.method === 'PUT') {
    try {
      const supabaseAdmin = createAdminClient()
      const { full_name } = req.body;

      if (!full_name || typeof full_name !== 'string') {
        return res.status(400).json({ error: 'Full name is required and must be a string' });
      }

      // Update user metadata
      const { data: updatedUser, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        user.id,
        {
          user_metadata: {
            ...user.user_metadata,
            full_name: full_name.trim()
          }
        }
      );

      if (updateError) {
        console.error('Error updating user profile:', updateError);
        return res.status(500).json({ error: 'Failed to update profile' });
      }

      // Also update the firstname in user_pomodoros table if it exists
      try {
        await supabaseAdmin
          .from('user_pomodoros')
          .update({ firstname: full_name.trim().split(' ')[0] })
          .eq('user_id', user.id);
      } catch (pomodoroUpdateError) {
        // This is not critical, just log it
        console.log('Note: Could not update firstname in user_pomodoros:', pomodoroUpdateError);
      }

      return res.status(200).json({
        user: updatedUser.user,
        message: 'Profile updated successfully'
      });
    } catch (error) {
      console.error('Error in PUT /api/profile:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  return res.status(405).json({ error: 'Method not allowed' });
};

export default handler;
