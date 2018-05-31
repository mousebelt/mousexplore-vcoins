var EthereumController = require('../controllers/ethereum');

module.exports = function (app) {
    //account related
    app.get('/api/get_address_balance/:address', EthereumController.getBalance);
    app.post('/api/create_account', EthereumController.createAccount);

    app.post('/api/make_transaction', EthereumController.sendTransaction);
    app.post('/api/get_updated_transaction', EthereumController.getUpdatedTransactions);

    app.post('/api/v1/blocks', EthereumController.blocklist);

    //api for token related
    app.get('/api/v1/token/list', EthereumController.getTokenList);
    app.post('/api/v1/token/add', EthereumController.addToken);
    app.post('/api/v1/token/remove', EthereumController.removeToken);

    //api for block explorer
    app.get('/api/v1/blocks', EthereumController.getBlocks);
    app.get('/api/v1/transactions', EthereumController.getTransactions);
    app.get('/api/v1/block/:hash', EthereumController.getBlockByHash);
    app.get('/api/v1/blockdetails/:hash', EthereumController.getBlockDetails);
    app.get('/api/v1/tx/:hash', EthereumController.getTransactionInfo);
    app.get('/api/v1/txdetails/:hash', EthereumController.getTransactionDetails);
    app.get('/api/v1/address/txs/:address', EthereumController.getTransactionsFromAccount);
}
