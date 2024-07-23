require('dotenv').config();
const express = require('express');
const http = require('http');
const next = require('next');
const { Server } = require('socket.io');
const MobileDetect = require('mobile-detect');
const cron = require('node-cron');
const { Pool } = require('pg');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const logger = require('./utils/logger');
const db = require('./database');
const socketHandler = require('./socketHandler');
const cronJobs = require('./cronJobs');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);
  const io = new Server(httpServer);

  // Middleware
  server.use(helmet());
  server.use(cors());
  server.use(limiter);

  // Socket handling
  socketHandler(io);

  // Routes
  server.get('/hello', (req, res) => {
    return res.send('Hello World');
  });

  server.get('/app', (req, res) => {
    const md = new MobileDetect(req.headers['user-agent']);
    if (md.mobile()) {
      res.redirect('/app_mobile');
    } else {
      handle(req, res);
    }
  });

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  // Start cron jobs
  cronJobs.start();

  // Graceful shutdown
  process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    httpServer.close(() => {
      logger.info('HTTP server closed');
      db.end(() => {
        logger.info('Database connection closed');
        process.exit(0);
      });
    });
  });

  const port = process.env.PORT || 3000;
  httpServer.listen(port, (err) => {
    if (err) throw err;
    logger.info(`> Ready on http://localhost:${port}`);
  });
});