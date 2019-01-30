const controller = require('../controllers/loom');

module.exports = function (app) {
  const apiPrefix = '/api/v1';

  // monitor apis
  app.get(`${apiPrefix}/monitor`, controller.getMonitor);
  app.get(`${apiPrefix}/monitor/db`, controller.getMonitorDb);
};
