import { supabase } from '../../lib/supabase-admin'
import { requireAuth } from '../../lib/auth-helpers'

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const user = req.user
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Track ID is required" });
  }

  try {
    const { error } = await supabase
      .from('tracks')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error

    res.status(200).json({ message: "Track removed successfully" });
  } catch (error) {
    console.error("Error removing track:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default requireAuth(handler)
