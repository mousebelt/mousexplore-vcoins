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

    app.get(prefix + '/search/:key', btcController.getSearch);
    app.get(prefix + '/blocks', btcController.getBlocks);
    app.get(prefix + '/transactions', btcController.getTransactions);
    app.get(prefix + '/block/:hash', btcController.getBlock);
    app.get(prefix + '/blockdetails/:hash', btcController.getBlockDetails);
    app.get(prefix + '/tx/:txid', btcController.getTransactionInfo);
    app.get(prefix + '/txdetails/:txid', btcController.getTransactionDetails);
    app.get(prefix + '/address/txs/:address', btcController.getAddressTransactions);
    app.get(prefix + '/balance/:address', btcController.getBalance);
}
