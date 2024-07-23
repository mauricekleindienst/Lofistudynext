import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id, userEmail } = req.body;

  if (!id || !userEmail) {
    return res.status(400).json({ error: "Invalid request" });
  }

  try {
    const client = await pool.connect();

    await client.query("DELETE FROM tracks WHERE id = $1 AND user_email = $2", [
      id,
      userEmail,
    ]);

    client.release();
    res.status(200).json({ message: "Track removed successfully" });
  } catch (error) {
    console.error("Error removing track:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
