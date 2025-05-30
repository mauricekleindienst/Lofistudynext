import { createAdminClient } from '../../../utils/supabase/server';
import { requireAuth } from '../../../utils/auth-helpers';

export default requireAuth(async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      try {
        const supabase = createAdminClient();

        // Try to get flashcard count from database
        const { count, error } = await supabase
          .from('flashcards')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', req.user.id);
        
        if (error) {
          console.log('Flashcard table not found or error:', error.message);
          return res.status(200).json({ count: 0 });
        }
        
        return res.status(200).json({ count: count || 0 });
      } catch (dbError) {
        // If table doesn't exist or other DB error, return 0
        console.log('Flashcard table not found or error:', dbError.message);
        return res.status(200).json({ count: 0 });
      }
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Flashcards count API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
