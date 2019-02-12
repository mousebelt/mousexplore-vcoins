const monitorRouter = require('./monitor');

module.exports = function (app) {
  app.use('/api/v1/monitor', monitorRouter);
};
