const controller = require('../controllers/loom');

module.exports = function (app) {
  app.get('/blocks', controller.getBlocks);
  app.get('/block/:hash', controller.getBlockByHash);
  app.get('/blockdetails/:hash', controller.getBlockDetails);
  app.get('/transactions', controller.getTransactions);
  app.get('/tx/:hash', controller.getTransactionInfo);
  app.get('/txs/:address', controller.getTransactionsFromAccount);
  app.get('/search/:key', controller.getSearch);
};
