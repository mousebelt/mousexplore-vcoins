var btcController = require('../controllers/bitcoin');

module.exports = function (app) {
    const prefix = '/api/v1';
    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    //// RPC Call apis ////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////

    app.post(prefix + '/getnewaddress', btcController.getnewaddress);
    app.post(prefix + '/setaccount', btcController.setaccount);
    app.post(prefix + '/settxfee', btcController.setTxFee);
    app.post(prefix + '/getreceivedbyaccount', btcController.getReceivedByAccount);
    app.post(prefix + '/getreceivedbyaddress', btcController.getReceivedByAddress);
    app.get(prefix + '/getaccountbalance', btcController.getAccountBalance);
    app.get(prefix + '/getalltransactionsbyaccount', btcController.getAllTransactionsByAccount);
    app.get(prefix + '/getaccount/:address', btcController.getAccount);
    app.get(prefix + '/getaccountaddress/:account', btcController.getAccountAddress);
    app.get(prefix + '/getaddressesbyaccount/:account', btcController.getAccountByAddress);
    app.get(prefix + '/getblockcount', btcController.getBlockCount);
    app.get(prefix + '/getbestblockhash', btcController.getBestBlockHash);
    app.get(prefix + '/getblock/:hash', btcController.getBlock);
    app.get(prefix + '/getblockhash/:index', btcController.getBlockHash);
    app.get(prefix + '/gettransaction/:txid', btcController.getTransaction);
    app.get(prefix + '/getrawtransaction/:txid', btcController.getRawTransaction);
    app.get(prefix + '/listaccounts', btcController.listAccounts);
    app.get(prefix + '/listsinceblock', btcController.listSinceBlock);
    app.post(prefix + '/sendfrom', btcController.sendFrom);
    app.post(prefix + '/sendmany', btcController.sendMany);
    app.post(prefix + '/sendtoaddress', btcController.sendToAddress);
    app.post(prefix + '/listtransactions', btcController.listTransactions);

    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    //// Utility apis ////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////

    app.get(prefix + '/blocks/latest/:count', btcController.getBlocksLatest);
    app.get(prefix + '/blocks', btcController.getBlocks);
    app.get(prefix + '/block/:height', btcController.getBlockHeight);
    app.get(prefix + '/transaction/:txid', btcController.getTransactionInfo);
    app.get(prefix + '/block/transactions/:height', btcController.getBlockTransactions);
}
