import { requireAuth } from '../../../lib/auth-helpers';

export default requireAuth(async function handler(req, res, user) {
  if (req.method !== 'PUT') {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { newOrder } = req.body;

  if (!newOrder || !Array.isArray(newOrder)) {
    return res.status(400).json({ error: 'newOrder array is required' });
  }

  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Update positions for each todo
    for (const { id, position } of newOrder) {
      const { error } = await supabase
        .from('todos')
        .update({ position })
        .eq('id', parseInt(id))
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating todo position:', error);
        return res.status(500).json({ error: 'Failed to reorder todos' });
      }
    }

    // Fetch updated todos to return in response
    const { data: updatedTodos, error: fetchError } = await supabase
      .from('todos')
      .select(`
        *,
        subtasks (*)
      `)
      .eq('user_id', user.id)
      .order('position', { ascending: true });

    if (fetchError) {
      console.error('Error fetching updated todos:', fetchError);
      return res.status(500).json({ error: 'Failed to fetch updated todos' });
    }

    return res.status(200).json({ 
      message: 'Todo order updated successfully',
      todos: updatedTodos
    });
  } catch (error) {
    console.error('Error reordering todos:', error);
    return res.status(500).json({ error: 'Failed to reorder todos' });
  }
});
