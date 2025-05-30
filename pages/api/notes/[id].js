import { createClient, createAdminClient } from '../../../utils/supabase/server';

async function handler(req, res) {
  // Get authenticated user
  const authSupabase = createClient();
  const { data: { user }, error: authError } = await authSupabase.auth.getUser();
  
  if (authError || !user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Note ID is required' });
  }

  if (req.method === 'DELETE') {
    try {
      const supabase = createAdminClient();

      const { data, error } = await supabase
        .from('notes')
        .delete()
        .eq('id', parseInt(id))
        .eq('user_id', user.id)
        .select();

      if (error) {
        console.error('Error deleting note:', error);
        return res.status(500).json({ error: 'Failed to delete note' });
      }

      if (!data || data.length === 0) {
        return res.status(404).json({ error: 'Note not found or already deleted' });
      }

      return res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
      console.error('Error deleting note:', error);
      return res.status(500).json({ error: 'Failed to delete note' });
    }
  }
  res.setHeader('Allow', ['DELETE']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}

export default handler;