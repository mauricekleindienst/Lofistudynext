// pages/api/youtube-search.js
export default async function handler(req, res) {
    const { q } = req.query;
  
    if (!q) {
      return res.status(400).json({ error: 'Missing query parameter' });
    }
  
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY; // Store your API key in environment variables
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(
      q
    )}&key=${apiKey}&maxResults=10`;
  
    try {
      const response = await fetch(searchUrl);
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error('YouTube API Error:', error);
      res.status(500).json({ error: 'Failed to fetch data from YouTube API' });
    }
  }
  