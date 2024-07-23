const logger = require('./utils/logger');

const messages = [];

function handleSocket(io) {
  io.on('connection', (socket) => {
    logger.info('A user connected');

    socket.emit('chat history', messages);

    socket.on('disconnect', () => {
      logger.info('User disconnected');
    });

    socket.on('chat message', (msg) => {
      logger.info('Received chat message:', msg);
      messages.push(msg);
      io.emit('chat message', msg);
    });
  });
}

module.exports = handleSocket;