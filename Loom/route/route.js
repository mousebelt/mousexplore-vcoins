const controller = require('../controllers/loom');

module.exports = function (app) {
  const apiPrefix = '/api/v1';

  // monitor apis
  app.get(`${apiPrefix}/monitor`, controller.getMonitor);
  app.get(`${apiPrefix}/monitor/db`, controller.getMonitorDb);
  app.get(`${apiPrefix}/monitor/rpc`, controller.getMonitorRpc);
  app.get(`${apiPrefix}/monitor/syncing`, controller.getMonitorSyncing);

  // explorer apis
  app.get(`${apiPrefix}/blocks`, controller.getBlocks);
  app.get(`${apiPrefix}/block/:hash`, controller.getBlockByHash);
  app.get(`${apiPrefix}/blockdetails/:hash`, controller.getBlockDetails);
  app.get('/api/v1/transactions', controller.getTransactions);
  app.get('/api/v1/tx/:hash', controller.getTransactionInfo);
  // app.get('/api/v1/txdetails/:hash', controller.getTransactionDetails);
  // app.get('/api/v1/address/txs/:address', controller.getTransactionsFromAccount);
  // app.get('/api/v1/address/gettransactioncount/:address', controller.getTransactionCount);
  // app.get('/api/v1/balance/:address', controller.getBalance);
  // app.get('/api/v1/search/:key', controller.getSearch);
};
