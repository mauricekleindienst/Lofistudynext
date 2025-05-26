import { supabase } from '../../lib/supabase-admin'
import { requireAuth } from '../../lib/auth-helpers'

const handler = async (req, res) => {
  const user = req.user

  try {
    if (req.method === 'GET') {
      // Get user's pomodoro sessions
      const { data: pomodoros, error } = await supabase
        .from('pomodoro_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      return res.status(200).json(pomodoros);
    } else if (req.method === 'POST') {
      const { 
        duration, 
        completed, 
        type, 
        category, 
        task_name, 
        notes, 
        completed_at 
      } = req.body;
      
      // Convert duration from minutes to seconds if needed
      const durationInSeconds = duration ? (duration > 100 ? duration : duration * 60) : 1500; // Default 25 minutes
      
      // Save pomodoro session
      const { data: pomodoro, error } = await supabase
        .from('pomodoro_sessions')
        .insert({
          user_id: user.id,
          email: user.email,
          duration: durationInSeconds,
          completed: completed || false,
          type: type || 'work',
          category: category || 'Other',
          task_name: task_name || null,
          notes: notes || null,
          completed_at: completed && completed_at ? completed_at : null
        })
        .select()
        .single()

      if (error) throw error

      return res.status(200).json(pomodoro);
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Pomodoros API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export default requireAuth(handler)
