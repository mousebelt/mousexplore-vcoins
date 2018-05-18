var neoNodeController = require('../controllers/neo-node');
var neoClientController = require('../controllers/neo-client');

module.exports = function (app) {
  const prefix = '/api/v1';

  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  //// RPC Call apis ////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////

  //Asset
  app.get(prefix + '/balance', neoNodeController.getBalance);

  //Block
  app.get(prefix + '/lastblockhash', neoNodeController.getLastBlockHash);
  app.get(prefix + '/blockbyheight', neoNodeController.getBlockByHeight);
  app.get(prefix + '/blockcount', neoNodeController.getBlockCount);
  app.get(prefix + '/blockhashbyheight', neoNodeController.getBlockHashByHeight);

  //Net
  app.get(prefix + '/connectioncount', neoNodeController.getConnectionCount);
  app.get(prefix + '/version', neoNodeController.getVersion);

  //Tx
  app.get(prefix + '/rawmempool', neoNodeController.getRawMemPool);
  app.get(prefix + '/rawtransaction', neoNodeController.getRawTransaction);
  app.get(prefix + '/txout', neoNodeController.getTxOut);

  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  //// Utility apis ////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////

  app.post(prefix + '/blocks/latest', neoNodeController.postBlocksLatest);
  app.post(prefix + '/blocks', neoNodeController.postBlocks);
  app.post(prefix + '/block', neoNodeController.postBlock);
  app.post(prefix + '/block/txs', neoNodeController.postBlockTxs);
  app.post(prefix + '/tx', neoNodeController.postTx);

  app.post(prefix + '/txs', neoNodeController.postTxs);

  app.post(prefix + '/address/txs', neoNodeController.postAddressTransactions);

  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  //// Client Call apis ////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  const prefixClient = `${prefix}/client`;
  app.get(prefixClient + '/getblockcount', neoClientController.getblockcount);

}
