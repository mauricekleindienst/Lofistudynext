const cron = require('node-cron');
const db = require('./database');
const logger = require('./utils/logger');

async function resetWeeklyCount() {
  try {
    await db.query('UPDATE user_pomodoros SET pomodoro_count_weekly = 0');
    logger.info('Weekly Pomodoro count reset successfully.');
  } catch (error) {
    logger.error('Error resetting weekly Pomodoro count:', error);
  }
}

function start() {
  cron.schedule('59 23 * * 0', () => {
    logger.info('Running the weekly reset task...');
    resetWeeklyCount().catch(error => logger.error(error));
  });
}

module.exports = { start };