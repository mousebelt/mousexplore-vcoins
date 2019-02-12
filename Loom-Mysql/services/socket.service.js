const socketServer = function (io) {
  io.on('connection', (socket) => {
    socket.on('disconnect', () => {});
  });
};

module.exports = socketServer;
