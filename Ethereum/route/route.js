

var EthereumController = require('../controllers/ethereum');

module.exports = function (app) {
    //account related
    app.get('/api/get_address_balance/:address', EthereumController.getBalance);
    app.post('/api/create_account', EthereumController.createAccount);

    app.post('/api/make_transaction', EthereumController.makeTransaction);
    app.post('/api/get_updated_transaction', EthereumController.getUpdatedTransactions);
}