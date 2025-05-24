// pages/api/youtube-search.js
export default async function handler(req, res) {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Missing query parameter' });
  }

  const apiKey = process.env.YOUTUBE_API_KEY; // Use dedicated YouTube API key
  
  if (!apiKey) {
    return res.status(500).json({ error: 'YouTube API key not configured' });
  }

  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(
    q
  )}&key=${apiKey}&maxResults=10`;

  try {
    const response = await fetch(searchUrl);
    
    if (!response.ok) {
      throw new Error(`YouTube API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('YouTube API Error:', error);
    res.status(500).json({ error: 'Failed to fetch data from YouTube API' });
  }
}
  