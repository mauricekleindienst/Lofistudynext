import { createClient, createAdminClient } from '../../utils/supabase/server'

export default async function handler(req, res) {
  // Check authentication
  const supabase = createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { title, videoId } = req.body;

  if (!title || !videoId) {
    return res.status(400).json({ error: "Missing required fields" });
  }  try {
    const supabaseAdmin = createAdminClient()
    
    const { data: newTrack, error } = await supabaseAdmin
      .from('tracks')
      .insert({
        user_id: user.id,
        user_email: user.email,
        title,
        video_id: videoId
      })
      .select()
      .single()

    if (error) throw error

    res
      .status(200)
      .json({ message: "Track added successfully", id: newTrack.id });
  } catch (error) {
    console.error("Error adding track:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
