const express = require('express');
const http = require('http');
const next = require('next');
const { Server } = require('socket.io');
const MobileDetect = require('mobile-detect');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const messages = []; // In-memory storage for messages

app.prepare().then(() => {
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

    if (md.mobile()) {
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
});
