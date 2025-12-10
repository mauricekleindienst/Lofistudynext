import { createClient, createAdminClient } from '../../../utils/supabase/server';

async function handler(req, res) {
  if (req.method !== 'PUT') {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { newOrder } = req.body;

  if (!newOrder || !Array.isArray(newOrder)) {
    return res.status(400).json({ error: 'newOrder array is required' });
  }

  try {
    const supabaseAdmin = createAdminClient();

    // Update positions for each todo
    for (const { id, position } of newOrder) {
      const { error } = await supabaseAdmin
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
      .eq('user_id', req.user.id)
      .order('position', { ascending: true });

    if (fetchError) {
      console.error('Error fetching updated todos:', fetchError);
      return res.status(500).json({ error: 'Failed to fetch updated todos' });
    }

    return res.status(200).json({ 
      message: 'Todo order updated successfully',
      todos: updatedTodos
    });  } catch (error) {
    console.error('Error reordering todos:', error);
    return res.status(500).json({ error: 'Failed to reorder todos' });
  }
}

export default handler;
