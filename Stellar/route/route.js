var StellarController = require('../controllers/stellar');

module.exports = function (app) {
    app.get('/api/get_address_balance/:address', StellarController.getBalance);
    app.post('/api/create_account', StellarController.createAccount);

    app.post('/api/v1/ledgers/latest', StellarController.getLatestLedgers);
}