import { createAdminClient } from '../../../utils/supabase/server';
import { requireAuth } from '../../../utils/auth-helpers';

export default requireAuth(async function handler(req, res) {
  const { id } = req.query;
  const user = req.user; // Get user from request

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
});