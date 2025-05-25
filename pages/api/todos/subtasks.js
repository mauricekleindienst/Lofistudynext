import { requireAuth } from '../../../lib/auth-helpers';

export default requireAuth(async function handler(req, res) {
  try {
    switch (req.method) {
      case 'POST':
        return addSubtaskHandler(req, res, user);
      case 'PUT':
        return updateSubtaskHandler(req, res, user);
      case 'DELETE':
        return deleteSubtaskHandler(req, res, user);
      default:
        res.setHeader('Allow', ['POST', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error in subtask handler:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

async function addSubtaskHandler(req, res, user) {
  const { todoId, text } = req.body;

  if (!todoId || !text) {
    return res.status(400).json({ error: 'TodoId and text are required' });
  }

  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // First verify the todo belongs to the user
    const { data: todo, error: todoError } = await supabase
      .from('todos')
      .select('id')
      .eq('id', parseInt(todoId))
      .eq('user_id', req.user.id)
      .single();

    if (todoError || !todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    const { data: subtask, error } = await supabase
      .from('subtasks')
      .insert({
        todo_id: parseInt(todoId),
        text,
        completed: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding subtask:', error);
      return res.status(500).json({ error: 'Failed to add subtask' });
    }

    return res.status(201).json({
      message: 'Subtask added successfully',
      subtask,
    });
  } catch (error) {
    console.error('Error adding subtask:', error);
    return res.status(500).json({ error: 'Failed to add subtask' });
  }
}

async function updateSubtaskHandler(req, res, user) {
  const { id, todoId, text, completed } = req.body;

  if (!id || !todoId) {
    return res.status(400).json({ error: 'Id and todoId are required' });
  }

  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Verify todo ownership
    const { data: todo, error: todoError } = await supabase
      .from('todos')
      .select('id')
      .eq('id', parseInt(todoId))
      .eq('user_id', req.user.id)
      .single();

    if (todoError || !todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    const updateData = {};
    if (text !== undefined) updateData.text = text;
    if (completed !== undefined) updateData.completed = completed;

    const { data: subtask, error } = await supabase
      .from('subtasks')
      .update(updateData)
      .eq('id', parseInt(id))
      .eq('todo_id', parseInt(todoId))
      .select()
      .single();

    if (error) {
      console.error('Error updating subtask:', error);
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Subtask not found' });
      }
      return res.status(500).json({ error: 'Failed to update subtask' });
    }

    return res.status(200).json({
      message: 'Subtask updated successfully',
      subtask,
    });
  } catch (error) {
    console.error('Error updating subtask:', error);
    return res.status(500).json({ error: 'Failed to update subtask' });
  }
}

async function deleteSubtaskHandler(req, res, user) {
  const { id, todoId } = req.body;

  if (!id || !todoId) {
    return res.status(400).json({ error: 'Id and todoId are required' });
  }

  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Verify todo ownership
    const { data: todo, error: todoError } = await supabase
      .from('todos')
      .select('id')
      .eq('id', parseInt(todoId))
      .eq('user_id', req.user.id)
      .single();

    if (todoError || !todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    const { error } = await supabase
      .from('subtasks')
      .delete()
      .eq('id', parseInt(id))
      .eq('todo_id', parseInt(todoId));

    if (error) {
      console.error('Error deleting subtask:', error);
      return res.status(500).json({ error: 'Failed to delete subtask' });
    }

    return res.status(200).json({ message: 'Subtask deleted successfully' });
  } catch (error) {
    console.error('Error deleting subtask:', error);
    return res.status(500).json({ error: 'Failed to delete subtask' });
  }
}
