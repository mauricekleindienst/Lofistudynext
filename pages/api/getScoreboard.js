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
  // Run the middleware
  await runMiddleware(req, res, cors);

  try {
    const client = await pool.connect();
    const result = await client.query(
      "SELECT firstname, pomodoro_count_weekly FROM user_pomodoros ORDER BY pomodoro_count_weekly DESC"
    );
    client.release();
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching scoreboard data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
