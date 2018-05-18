var neoController = require('../controllers/neo');

module.exports = function (app) {
  const prefix = '/api/v1';
  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  //// RPC Call apis ////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////

  //Asset
  app.get(prefix + '/balance', neoController.getBalance);

  //Block
  app.get(prefix + '/lastblockhash', neoController.getLastBlockHash);
  app.get(prefix + '/blockbyheight', neoController.getBlockByHeight);
  app.get(prefix + '/blockcount', neoController.getBlockCount);
  app.get(prefix + '/blockhashbyheight', neoController.getBlockHashByHeight);

  //Net
  app.get(prefix + '/connectioncount', neoController.getConnectionCount);
  app.get(prefix + '/version', neoController.getVersion);

  //Tx
  app.get(prefix + '/rawmempool', neoController.getRawMemPool);
  app.get(prefix + '/rawtransaction', neoController.getRawTransaction);
  app.get(prefix + '/txout', neoController.getTxOut);

  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  //// Utility apis ////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////

  app.post(prefix + '/blocks/latest', neoController.postBlocksLatest);
  app.post(prefix + '/blocks', neoController.postBlocks);
  app.post(prefix + '/block', neoController.postBlock);
  app.post(prefix + '/block/txs', neoController.postBlockTxs);
  app.post(prefix + '/tx', neoController.postTx);

  app.post(prefix + '/txs', neoController.postTxs);

  app.post(prefix + '/address/txs', neoController.postAddressTransactions);

}
