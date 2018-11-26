const EthereumController = require('../controllers/ethereum');

module.exports = function (app) {
  // account related
  app.post('/api/create_account', EthereumController.createAccount);

  app.post('/api/make_transaction', EthereumController.sendTransaction);
  app.post('/api/get_updated_transaction', EthereumController.getUpdatedTransactions);

  app.post('/api/v1/blocks', EthereumController.blocklist);

  // api for token related
  app.get('/api/v1/token/list', EthereumController.getTokenList);
  app.post('/api/v1/token/add', EthereumController.addToken);
  app.post('/api/v1/token/remove', EthereumController.removeToken);

  // api for block explorer
  app.get('/api/v1/blocks', EthereumController.getBlocks);
  app.get('/api/v1/transactions', EthereumController.getTransactions);
  app.get('/api/v1/block/:hash', EthereumController.getBlockByHash);
  app.get('/api/v1/blockdetails/:hash', EthereumController.getBlockDetails);
  app.get('/api/v1/tx/:hash', EthereumController.getTransactionInfo);
  app.get('/api/v1/txdetails/:hash', EthereumController.getTransactionDetails);
  app.get('/api/v1/address/txs/:address', EthereumController.getTransactionsFromAccount);
  app.get('/api/v1/address/gettransactioncount/:address', EthereumController.getTransactionCount);
  app.get('/api/v1/balance/:address', EthereumController.getBalance);
  app.get('/api/v1/search/:key', EthereumController.getSearch);
  app.post('/api/v1/sendsignedtransaction', EthereumController.postSendSignedTransaction);

  // api for sapien service
  app.get('/api/v1/sent_received_tx_history/:address', EthereumController.getSentReceivedTxHistory);
  app.get('/api/v1/tx_history_by_ticker/:address', EthereumController.getTxHistoryByTicker);

  // apis for monitor
  app.get('/monitor', EthereumController.getMonitor);
  app.get('/monitor/db', EthereumController.getMonitorDb);
  app.get('/monitor/rpc', EthereumController.getMonitorRpc);
};
