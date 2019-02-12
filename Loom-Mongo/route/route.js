const controller = require('../controllers/loom');

module.exports = function (app) {
  const prefix = '/api/v1';

  // monitor apis
  app.get(`${prefix}/monitor`, controller.getMonitor);
  app.get(`${prefix}/monitor/db`, controller.getMonitorDb);
  app.get(`${prefix}/monitor/rpc`, controller.getMonitorRpc);
  app.get(`${prefix}/monitor/syncing`, controller.getMonitorSyncing);

  // explorer apis
  app.get(`${prefix}/blocks`, controller.getBlocks);
  app.get(`${prefix}/block/:hash`, controller.getBlockByHash);
  app.get(`${prefix}/blockdetails/:hash`, controller.getBlockDetails);
  app.get(`${prefix}/transactions`, controller.getTransactions);
  app.get(`${prefix}/tx/:hash`, controller.getTransactionInfo);
  app.get(`${prefix}/address/txs/:address`, controller.getTransactionsFromAccount);
  app.get(`${prefix}/search/:key`, controller.getSearch);
};
