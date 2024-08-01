import { Pool } from "pg";
import Cors from 'cors';

const cors = Cors({
  origin: ['http://localhost:3000', 'https://lo-fi.study'], // Add allowed origins
  methods: ['GET', 'POST'], // Specify allowed methods
  allowedHeaders: ['Content-Type'] // Specify allowed headers
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Invalid request" });
  }

  try {
    const client = await pool.connect();

    const result = await client.query(
      "SELECT * FROM user_pomodoros WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = result.rows[0];

    const stats = {
      pomodoro_count: user.pomodoro_count || 0,
      studying: user.studying || 0,
      coding: user.coding || 0,
      writing: user.writing || 0,
      working: user.working || 0,
      other: user.other || 0,
      daily_counts: user.daily_counts || {},
    };

    client.release();
    res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching Pomodoro stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
