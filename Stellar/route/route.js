var StellarController = require('../controllers/stellar');

module.exports = function (app) {
    app.get('/api/v1/ledgers', StellarController.getLatestLedgers);
    app.get('/api/v1/transactions', StellarController.getLatestTransactions);
    app.get('/api/v1/ledger/:hash', StellarController.getLedgerByHash);
    app.get('/api/v1/balance/:address', StellarController.getBalance);
    app.get('/api/v1/search/:key', StellarController.getSearch);

    app.post('/api/create_account', StellarController.createAccount);
    app.post('/api/v1/ledger/txs', StellarController.getTransactionsForLedger);
    app.post('/api/v1/txs/operations', StellarController.getOperationsForTransaction);
    app.post('/api/v1/operations', StellarController.getOperations);
    app.post('/api/v1/tx', StellarController.getTransaction);
    app.post('/api/v1/account', StellarController.getAccount);
    app.post('/api/v1/account/operations', StellarController.getOperationsForAccount);
    app.post('/api/v1/account/txs', StellarController.getTransactionsForAccount);
    app.post('/api/v1/account/payments', StellarController.getPaymentsForAccount);
    app.post('/api/v1/account/offers', StellarController.getOffersForAccount);
    app.post('/api/v1/account/effects', StellarController.getEffectsForAccount);
    app.post('/api/v1/effects', StellarController.getLatestEffects);
}