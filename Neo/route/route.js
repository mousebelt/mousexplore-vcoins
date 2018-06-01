var neoNodeController = require('../controllers/neo-node');
var neoClientController = require('../controllers/neo-client');

module.exports = function (app) {
  const prefix = '/api/v1';

  //// RPC Call apis ////

  //Asset
  app.get(prefix + '/balance', neoNodeController.getBalance);

  //Block
  app.get(prefix + '/lastblockhash', neoNodeController.getLastBlockHash);
  app.get(prefix + '/blockcount', neoNodeController.getBlockCount);
  app.get(prefix + '/blockhashbyheight', neoNodeController.getBlockHashByHeight);

  //Net
  app.get(prefix + '/connectioncount', neoNodeController.getConnectionCount);
  app.get(prefix + '/version', neoNodeController.getVersion);

  //Tx
  app.get(prefix + '/rawmempool', neoNodeController.getRawMemPool);
  app.get(prefix + '/rawtransaction', neoNodeController.getRawTransaction);
  app.get(prefix + '/txout', neoNodeController.getTxOut);

  //// Utility apis ////
  app.get(prefix + '/blocks', neoNodeController.getBlocks);
  app.get(prefix + '/transactions', neoNodeController.getTransactions);
  app.get(prefix + '/block/:hash', neoNodeController.getBlockByHash);
  app.get(prefix + '/blockdetails/:hash', neoNodeController.getBlockDetails);

  app.post(prefix + '/blocks', neoNodeController.postBlocks);
  app.post(prefix + '/block/txs', neoNodeController.postBlockTxs);
  app.post(prefix + '/tx', neoNodeController.postTx);

  app.post(prefix + '/address/txs', neoNodeController.postAddressTransactions);

  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  //// json rpc call apis ////
  //// http://docs.neo.org/en-us/node/cli/api.html
  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  const prefixClient = `/api/rpc`;
  app.post(prefixClient + '/dumpprivkey', neoClientController.dumpprivkey); // Need to open the wallet
  app.post(prefixClient + '/getaccountstate', neoClientController.getaccountstate);
  app.post(prefixClient + '/getapplicationlog', neoClientController.getapplicationlog); // Need to enable logging
  app.post(prefixClient + '/getassetstate', neoClientController.getassetstate);
  app.post(prefixClient + '/getbalance', neoClientController.getbalance); // Need to open the wallet
  app.post(prefixClient + '/getbestblockhash', neoClientController.getbestblockhash);
  app.post(prefixClient + '/getblock', neoClientController.getblock);
  app.post(prefixClient + '/getblockcount', neoClientController.getblockcount);
  app.post(prefixClient + '/getblockhash', neoClientController.getblockhash);
  app.post(prefixClient + '/getblocksysfee', neoClientController.getblocksysfee);
  app.post(prefixClient + '/getconnectioncount', neoClientController.getconnectioncount);
  app.post(prefixClient + '/getcontractstate', neoClientController.getcontractstate);
  app.post(prefixClient + '/getnewaddress', neoClientController.getnewaddress); // Need to open the wallet
  app.post(prefixClient + '/getrawmempool', neoClientController.getrawmempool);
  app.post(prefixClient + '/getrawtransaction', neoClientController.getrawtransaction);
  app.post(prefixClient + '/getstorage', neoClientController.getstorage);
  app.post(prefixClient + '/gettxout', neoClientController.gettxout);
  app.post(prefixClient + '/getpeers', neoClientController.getpeers);
  app.post(prefixClient + '/getversion', neoClientController.getversion);
  app.post(prefixClient + '/invoke', neoClientController.invoke);
  app.post(prefixClient + '/invokefunction', neoClientController.invokefunction);
  app.post(prefixClient + '/invokescript', neoClientController.invokescript);
  app.post(prefixClient + '/listaddress', neoClientController.listaddress); // Need to open the wallet
  app.post(prefixClient + '/sendrawtransaction', neoClientController.sendrawtransaction);
  app.post(prefixClient + '/sendtoaddress', neoClientController.sendtoaddress); // Need to open the wallet
  app.post(prefixClient + '/sendmany', neoClientController.sendmany); // Need to open the wallet
  app.post(prefixClient + '/submitblock', neoClientController.submitblock); // Needs to be a consensus node
  app.post(prefixClient + '/validateaddress', neoClientController.validateaddress); // Needs to be a consensus node
}
