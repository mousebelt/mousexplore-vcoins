const monitorRouter = require('./monitor');
const loomRouter = require('./loom');

module.exports = function (app) {
  app.use('/api/v1/monitor', monitorRouter);
  app.use('/api/v1/', loomRouter);
};
