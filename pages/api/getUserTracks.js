import { supabase } from '../../lib/supabase-admin'
import { requireAuth } from '../../lib/auth-helpers'

const handler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const user = req.user

  try {
    const { data: tracks, error } = await supabase
      .from('tracks')
      .select('id, title, video_id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    const userTracks = tracks.map((track) => ({
      id: track.id,
      title: track.title,
      videoId: track.video_id,
    }));

    res.status(200).json(userTracks);
  } catch (error) {
    console.error("Error fetching user tracks:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default requireAuth(handler)
