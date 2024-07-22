import { Pool } from 'pg';
import cron from 'node-cron';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function resetWeeklyCount() {
  try {
    const client = await pool.connect();
    await client.query('UPDATE user_pomodoros SET pomodoro_count_weekly = 0');
    client.release();
    console.log('Weekly Pomodoro count reset successfully.');
  } catch (error) {
    console.error('Error resetting weekly Pomodoro count:', error);
  }
}

// Schedule the task to run every Sunday at 23:59
cron.schedule('59 23 * * 0', () => {
  console.log('Running the weekly reset task...');
  resetWeeklyCount().catch(error => console.error(error));
});

console.log('Cron job scheduled: Reset weekly Pomodoro count every Sunday at 23:59');
