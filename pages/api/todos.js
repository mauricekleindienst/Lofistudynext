import { supabaseAdmin } from '../../lib/supabase-admin'
import { requireAuth } from '../../lib/auth-helpers'

const handler = async (req, res) => {
  const user = req.user

  try {
    switch (req.method) {
      case 'GET':
        return getTodosHandler(req, res, user);
      case 'POST':
        return saveTodoHandler(req, res, user);
      case 'PUT':
        return updateTodoHandler(req, res, user);
      case 'DELETE':
        return deleteTodoHandler(req, res, user);
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error in todo handler:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export default requireAuth(handler)

async function getTodosHandler(req, res, user) {
  const { page = 1, limit = 20 } = req.query;

  try {
    const skip = (page - 1) * limit;
    
    const { data: todos, error } = await supabaseAdmin
      .from('todos')
      .select(`
        *,
        subtasks (*)
      `)
      .eq('user_id', user.id)
      .order('position', { ascending: true })
      .range(skip, skip + parseInt(limit) - 1)

    if (error) throw error

    const { count, error: countError } = await supabaseAdmin
      .from('todos')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (countError) throw countError

    return res.status(200).json({
      todos,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error('Error fetching todos:', error);
    return res.status(500).json({ error: 'Failed to fetch todos' });
  }
}

async function saveTodoHandler(req, res, user) {
  const { text, color = '#ff7b00' } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    // Get max position
    const { data: maxPositionData, error: maxError } = await supabaseAdmin
      .from('todos')
      .select('position')
      .eq('user_id', user.id)
      .order('position', { ascending: false })
      .limit(1)
      .single()

    let maxPosition = 0
    if (maxPositionData && !maxError) {
      maxPosition = maxPositionData.position
    }

    const { data: todo, error } = await supabaseAdmin
      .from('todos')
      .insert({
        user_id: user.id,
        email: user.email,
        text,
        completed: false,
        color,
        position: maxPosition + 1,
      })
      .select()
      .single()

    if (error) throw error

    return res.status(201).json({ message: 'Todo saved successfully', id: todo.id });
  } catch (error) {
    console.error('Error saving todo:', error);
    return res.status(500).json({ error: 'Failed to save todo' });
  }
}

async function updateTodoHandler(req, res, user) {
  const { id, text, completed, color } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Id is required' });
  }

  try {
    const updateData = {
      ...(text !== undefined && { text }),
      ...(completed !== undefined && { completed }),
      ...(color !== undefined && { color }),
      updated_at: new Date()
    };

    const { data: todo, error } = await supabaseAdmin
      .from('todos')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    return res.status(200).json({ 
      message: 'Todo updated successfully',
      todo: todo 
    });
  } catch (error) {
    console.error('Error updating todo:', error);
    return res.status(500).json({ error: 'Failed to update todo' });
  }
}

async function deleteTodoHandler(req, res, user) {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Id is required' });
  }

  try {
    // First delete all subtasks
    const { error: subtasksError } = await supabaseAdmin
      .from('subtasks')
      .delete()
      .eq('todo_id', id)

    if (subtasksError) throw subtasksError

    // Then delete the todo
    const { data: deletedTodo, error } = await supabaseAdmin
      .from('todos')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)
      .select()

    if (error) throw error

    if (!deletedTodo || deletedTodo.length === 0) {
      return res.status(404).json({ error: 'Todo not found or already deleted' });
    }

    return res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    return res.status(500).json({ error: 'Failed to delete todo' });
  }
}
