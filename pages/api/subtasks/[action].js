import { supabase } from '../../../lib/supabase-admin'
import { requireAuth } from '../../../lib/auth-helpers'

async function updateSubtaskChallenges(user) {
  try {
    const { data: challenges, error } = await supabase
      .from('challenges')
      .select(`
        *,
        progress!progress_challenge_id_fkey (*)
      `)
      .eq('tracking_type', 'subtask_complete')
      .eq('progress.user_id', user.id)

    if (error) throw error

    for (const challenge of challenges) {
      const currentProgress = challenge.progress[0];
      
      const progressData = {
        user_id: user.id,
        challenge_id: challenge.id,
        progress: (currentProgress?.progress || 0) + 1,
        completed: (currentProgress?.progress || 0) + 1 >= challenge.total,
        completed_at: (currentProgress?.progress || 0) + 1 >= challenge.total ? new Date() : null
      }

      if (currentProgress) {
        await supabase
          .from('progress')
          .update(progressData)
          .eq('user_id', user.id)
          .eq('challenge_id', challenge.id)
      } else {
        await supabase
          .from('progress')
          .insert(progressData)
      }
    }
  } catch (error) {
    console.error('Error updating subtask challenges:', error);
  }
}

const handler = async (req, res) => {
  const user = req.user
  const { action } = req.query;
  const { subtaskId, todoId, completed } = req.body;

  if (req.method === 'POST' && action === 'complete') {
    try {
      const { data: subtask, error } = await supabase
        .from('subtasks')
        .update({ completed })
        .eq('id', subtaskId)
        .select()
        .single()

      if (error) throw error

      // Update challenges
      await updateSubtaskChallenges(user);

      res.status(200).json(subtask);
    } catch (error) {
      console.error('Failed to update subtask:', error);
      res.status(500).json({ error: 'Failed to update subtask' });
    }
  } else if (req.method === 'POST' && action === 'create') {
    try {
      const { data: subtask, error } = await supabase
        .from('subtasks')
        .insert({
          todo_id: todoId,
          text: req.body.text,
          completed: false,
        })
        .select()
        .single()

      if (error) throw error

      res.status(201).json(subtask);
    } catch (error) {
      console.error('Failed to create subtask:', error);
      res.status(500).json({ error: 'Failed to create subtask' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { error } = await supabase
        .from('subtasks')
        .delete()
        .eq('id', subtaskId)

      if (error) throw error

      res.status(204).end();
    } catch (error) {
      console.error('Failed to delete subtask:', error);
      res.status(500).json({ error: 'Failed to delete subtask' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default requireAuth(handler) 