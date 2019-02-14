const monitorRouter = require('./monitor');
const apiRouter = require('./api');

module.exports = function (app) {
  app.use('/api/v1/monitor', monitorRouter);
  app.use('/api/v1', apiRouter);
};
