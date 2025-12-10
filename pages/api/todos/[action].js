import { createClient, createAdminClient } from '../../../utils/supabase/server'

async function updateTodoChallenges(user, supabase) {
  try {
    // Update todo completion challenge
    const { data: challenges, error } = await supabase
      .from('challenges')
      .select(`
        *,
        progress!progress_challenge_id_fkey (*)
      `)
      .eq('tracking_type', 'todo_complete')
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
    console.error('Error updating todo challenges:', error);
  }
}

const handler = async (req, res) => {
  // Get authenticated user
  const authSupabase = await createClient();
  const { data: { user }, error: authError } = await authSupabase.auth.getUser();
  
  if (authError || !user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const supabase = createAdminClient();
  const { action } = req.query;
  const { method } = req;

  try {
    switch (action) {      case 'complete':
        if (method === 'POST') {
          return await completeTodoHandler(req, res, user, supabase);
        }
        break;
      case 'update':
        if (method === 'PUT') {
          return await updateTodoHandler(req, res, user, supabase);
        }
        break;
      default:
        return res.status(404).json({ error: 'Action not found' });
    }
    
    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  } catch (error) {
    console.error('Todo action API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export default handler

async function completeTodoHandler(req, res, user, supabase) {
  const { todoId } = req.body;
  
  if (!todoId) {
    return res.status(400).json({ error: 'Todo ID is required' });
  }

  try {
    // Mark todo as completed
    const { data: updatedTodo, error } = await supabase
      .from('todos')
      .update({ completed: true })
      .eq('id', todoId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error    // Update challenges
    await updateTodoChallenges(user, supabase);

    return res.status(200).json(updatedTodo);
  } catch (error) {
    console.error('Error completing todo:', error);
    return res.status(500).json({ error: 'Failed to complete todo' });
  }
}

async function updateTodoHandler(req, res, user, supabase) {
  const { todoId, text, completed } = req.body;
  
  if (!todoId) {
    return res.status(400).json({ error: 'Todo ID is required' });
  }

  try {
    const updateData = {
      ...(text !== undefined && { text }),
      ...(completed !== undefined && { completed }),
      updated_at: new Date()
    }

    const { data: updatedTodo, error } = await supabase
      .from('todos')
      .update(updateData)
      .eq('id', todoId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error

    return res.status(200).json(updatedTodo);
  } catch (error) {
    console.error('Error updating todo:', error);
    return res.status(500).json({ error: 'Failed to update todo' });
  }
}