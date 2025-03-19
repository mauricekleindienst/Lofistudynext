const express = require('express');
const http = require('http');
const next = require('next');
const { Server } = require('socket.io');
const MobileDetect = require('mobile-detect');
const cron = require('node-cron'); // for scheduling tasks
const { Pool } = require('pg'); // for database interaction

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev, conf: require('./next.config.js') });
const handle = nextApp.getRequestHandler();

const messages = []; // In-memory storage for messages

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

nextApp.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);
  const io = new Server(httpServer);

  io.on('connection', (socket) => {
    console.log('a user connected');

    // Send all stored messages to the new client
    socket.emit('chat history', messages);

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('chat message', (msg) => {
      console.log('Received chat message:', msg);
      messages.push(msg);
      io.emit('chat message', msg);
    });
  });

  server.get('/hello', (req, res) => {
    return res.send('Hello World');
  });

  server.get('/app', (req, res) => {
    const md = new MobileDetect(req.headers['user-agent']);

    if (md.phone()) {
      res.redirect('/app_mobile');
    } else {
      handle(req, res);
    }
  });
  server.get('/auth/signing', (req, res) => {
    const md = new MobileDetect(req.headers['user-agent']);

    if (md.phone()) {
      res.redirect('/app_mobile');
    } else {
      handle(req, res);
    }
  });

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  // Use the PORT environment variable provided by Heroku
  const port = process.env.PORT || 3000;
  httpServer.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
}).catch((err) => {
  console.error('Error starting server:', err);
  process.exit(1);
});