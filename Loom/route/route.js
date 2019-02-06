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
  app.get(`${apiPrefix}/blockdetails/:hash`, controller.getBlockDetails);
  // app.get('/api/v1/transactions', EthereumController.getTransactions);
  // app.get('/api/v1/block/:hash', EthereumController.getBlockByHash);
  // app.get('/api/v1/tx/:hash', EthereumController.getTransactionInfo);
  // app.get('/api/v1/txdetails/:hash', EthereumController.getTransactionDetails);
  // app.get('/api/v1/address/txs/:address', EthereumController.getTransactionsFromAccount);
  // app.get('/api/v1/address/gettransactioncount/:address', EthereumController.getTransactionCount);
  // app.get('/api/v1/balance/:address', EthereumController.getBalance);
  // app.get('/api/v1/search/:key', EthereumController.getSearch);
};
