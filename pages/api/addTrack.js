import { supabase } from '../../lib/supabase-admin'
import { requireAuth } from '../../lib/auth-helpers'

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const user = req.user
  const { title, videoId } = req.body;

  if (!title || !videoId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const { data: newTrack, error } = await supabase
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

export default requireAuth(handler)
