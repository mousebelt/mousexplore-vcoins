var WanchainController = require('../controllers/wanchain');

module.exports = function (app) {
    //account related
    app.post('/api/create_account', WanchainController.createAccount);

    app.post('/api/make_transaction', WanchainController.sendTransaction);
    app.post('/api/get_updated_transaction', WanchainController.getUpdatedTransactions);

    app.post('/api/v1/blocks', WanchainController.blocklist);

    //api for token related
    app.get('/api/v1/token/list', WanchainController.getTokenList);
    app.post('/api/v1/token/add', WanchainController.addToken);
    app.post('/api/v1/token/remove', WanchainController.removeToken);

    //api for block explorer
    app.get('/api/v1/blocks', WanchainController.getBlocks);
    app.get('/api/v1/transactions', WanchainController.getTransactions);
    app.get('/api/v1/block/:hash', WanchainController.getBlockByHash);
    app.get('/api/v1/blockdetails/:hash', WanchainController.getBlockDetails);
    app.get('/api/v1/tx/:hash', WanchainController.getTransactionInfo);
    app.get('/api/v1/txdetails/:hash', WanchainController.getTransactionDetails);
    app.get('/api/v1/address/txs/:address', WanchainController.getTransactionsFromAccount);
    app.get('/api/v1/address/gettransactioncount/:address', WanchainController.getTransactionCount);
    app.get('/api/v1/balance/:address', WanchainController.getBalance);
    app.get('/api/v1/search/:key', WanchainController.getSearch);

    app.post('/api/v1/sendsignedtransaction', WanchainController.postSendSignedTransaction);

    app.get('/monitor', WanchainController.getMonitor);
    app.get('/monitor/db', WanchainController.getMonitorDb);
    app.get('/monitor/rpc', WanchainController.getMonitorRpc);
}
