import { createClient, createAdminClient } from '../../utils/supabase/server'

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const supabaseAdmin = createAdminClient()
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Track ID is required" });
  }
  try {
    const { error } = await supabaseAdmin
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

export default handler;
