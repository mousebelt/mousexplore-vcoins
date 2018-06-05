var ltcController = require('../controllers/litecoin');

module.exports = function (app) {
    const prefix = '/api/v1';
    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    //// RPC Call apis ////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////

    app.post(prefix + '/getnewaddress', ltcController.getnewaddress);
    app.post(prefix + '/setaccount', ltcController.setaccount);
    app.post(prefix + '/settxfee', ltcController.setTxFee);
    app.post(prefix + '/getreceivedbyaccount', ltcController.getReceivedByAccount);
    app.post(prefix + '/getreceivedbyaddress', ltcController.getReceivedByAddress);
    app.get(prefix + '/getaccountbalance', ltcController.getAccountBalance);
    app.get(prefix + '/getalltransactionsbyaccount', ltcController.getAllTransactionsByAccount);
    app.get(prefix + '/getaccount/:address', ltcController.getAccount);
    app.get(prefix + '/getaccountaddress/:account', ltcController.getAccountAddress);
    app.get(prefix + '/getaddressesbyaccount/:account', ltcController.getAccountByAddress);
    app.get(prefix + '/getblockcount', ltcController.getBlockCount);
    app.get(prefix + '/getbestblockhash', ltcController.getBestBlockHash);
    app.get(prefix + '/getblockhash/:index', ltcController.getBlockHash);
    app.get(prefix + '/gettransaction/:txid', ltcController.getTransaction);
    app.get(prefix + '/getrawtransaction/:txid', ltcController.getRawTransaction);
    app.get(prefix + '/listaccounts', ltcController.listAccounts);
    app.get(prefix + '/listsinceblock', ltcController.listSinceBlock);
    app.post(prefix + '/sendfrom', ltcController.sendFrom);
    app.post(prefix + '/sendmany', ltcController.sendMany);
    app.post(prefix + '/sendtoaddress', ltcController.sendToAddress);
    app.post(prefix + '/listtransactions', ltcController.listTransactions);

    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    //// Utility apis ////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////

    app.get(prefix + '/search/:key', ltcController.getSearch);
    app.get(prefix + '/blocks', ltcController.getBlocks);
    app.get(prefix + '/transactions', ltcController.getTransactions);
    app.get(prefix + '/block/:hash', ltcController.getBlock);
    app.get(prefix + '/blockdetails/:hash', ltcController.getBlockDetails);
    app.get(prefix + '/tx/:txid', ltcController.getTransactionInfo);
    app.get(prefix + '/txdetails/:txid', ltcController.getTransactionDetails);
    app.get(prefix + '/address/txs/:address', ltcController.getAddressTransactions);
}
