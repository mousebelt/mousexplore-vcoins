const monitorRouter = require('./monitor');
const loomRouter = require('./loom');
const gameRouter = require('./game');

module.exports = function (app) {
  app.use('/api/v1/monitor', monitorRouter);
  app.use('/api/v1/loom', loomRouter);
  app.use('/api/v1/games', gameRouter);
};
