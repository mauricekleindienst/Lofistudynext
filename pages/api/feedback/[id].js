import { createClient, createAdminClient } from '../../../utils/supabase/server'

const handler = async (req, res) => {
  const authSupabase = await createClient();
  const { data: { user }, error: authError } = await authSupabase.auth.getUser();
  
  if (authError || !user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const supabase = createAdminClient();
  const { id } = req.query;
  
  // Check admin status
  const admins = ['admin@lofi.study', 'your-admin-email@example.com', 'kleindiema@gmail.com'];
  
  if (!admins.includes(user.email)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // GET: Retrieve a specific feedback item
  if (req.method === 'GET') {
    try {
      const { data: feedback, error } = await supabase
        .from('feedback')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ error: 'Feedback not found' });
        }
        throw error
      }
      
      return res.status(200).json({ data: feedback });
    } catch (error) {
      console.error('Error retrieving feedback:', error);
      return res.status(500).json({ error: 'Failed to retrieve feedback' });
    }
  }
  
  // PATCH: Update a feedback status or add response
  if (req.method === 'PATCH') {
    try {
      const { status, response } = req.body;
      
      // Validate input
      if (!status && !response) {
        return res.status(400).json({ error: 'At least one field must be updated' });
      }
      
      // Build the update data
      const updateData = {
        updated_at: new Date()
      };
      if (status) updateData.status = status;
      if (response) updateData.response = response;
      
      // Update the feedback
      const { data: updatedFeedback, error } = await supabase
        .from('feedback')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      
      return res.status(200).json({ data: updatedFeedback });
    } catch (error) {
      console.error('Error updating feedback:', error);
      return res.status(500).json({ error: 'Failed to update feedback' });
    }
  }
  
  // DELETE: Remove a feedback item
  if (req.method === 'DELETE') {
    try {
      const { error } = await supabase
        .from('feedback')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error deleting feedback:', error);
      return res.status(500).json({ error: 'Failed to delete feedback' });
    }
  }
  
  // Method not allowed
  return res.status(405).json({ error: 'Method not allowed' });
}

export default handler 