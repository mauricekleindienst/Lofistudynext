// pages/api/rooms.js
import fetch from "node-fetch";

const DAILY_API_KEY = process.env.DAILY_API_KEY;
const MAX_ROOMS = 50;
let rooms = [];

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      if (rooms.length >= MAX_ROOMS) {
        const oldestRoom = rooms.shift();
        await fetch(`https://api.daily.co/v1/rooms/${oldestRoom.name}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${DAILY_API_KEY}`,
          },
        });
      }

      const response = await fetch("https://api.daily.co/v1/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DAILY_API_KEY}`,
        },
        body: JSON.stringify({
          properties: {
            enable_chat: true,
            exp: Math.round(Date.now() / 1000) + 24 * 60 * 60,
          },
        }),
      });

      const data = await response.json();
      rooms.push({ name: data.name, url: data.url });

      res.status(200).json({ url: data.url });
    } catch (error) {
      console.error("Error creating room:", error);
      res.status(500).json({ error: "Error creating room" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
