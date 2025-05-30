import { createClient, createAdminClient } from '../../../utils/supabase/server'

export default async function handler(req, res) {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const supabaseAdmin = createAdminClient()

  // GET: Retrieve feedback (admin only)
  if (req.method === 'GET') {
    try {
      // Check if the user is an admin
      const admins = ['admin@lofi.study', 'your-admin-email@example.com', 'kleindiema@gmail.com'];
      
      if (!admins.includes(user.email)) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      // Get query parameters
      const { status, page = '1', limit = '10' } = req.query;
      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      const skip = (pageNum - 1) * limitNum;

      // Build the query
      let query = supabaseAdmin
        .from('feedback')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(skip, skip + limitNum - 1)

      if (status) {
        query = query.eq('status', status)
      }

      const { data: feedback, error, count } = await query

      if (error) throw error

      // Return feedback with pagination info
      return res.status(200).json({
        data: feedback,
        pagination: {
          total: count,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(count / limitNum),
        },
      });
    } catch (error) {
      console.error('Error retrieving feedback:', error);
      return res.status(500).json({ error: 'Failed to retrieve feedback' });
    }
  }

  // POST: Submit new feedback
  if (req.method === 'POST') {
    try {
      const { message } = req.body;

      // Validate input
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      // Create the feedback entry
      const { data: feedback, error } = await supabaseAdmin
        .from('feedback')
        .insert({
          user_id: user.id,
          email: user.email,
          message,
          status: 'pending',
        })
        .select()
        .single()

      if (error) throw error

      return res.status(201).json({ success: true, data: feedback });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      return res.status(500).json({ error: 'Failed to submit feedback' });
    }
  }

  // Method not allowed
  return res.status(405).json({ error: 'Method not allowed' });
}