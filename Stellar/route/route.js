var StellarController = require('../controllers/stellar');

module.exports = function (app) {
    app.get('/api/v1/ledgers', StellarController.getLatestLedgers);
    app.get('/api/v1/transactions', StellarController.getLatestTransactions);
    app.get('/api/v1/operations', StellarController.getOperations);
    app.get('/api/v1/ledger/:sequence', StellarController.getLedgerBySequence);
    app.get('/api/v1/ledger/txs/:sequence', StellarController.getTransactionsForLedger);
    app.get('/api/v1/tx/:hash', StellarController.getTransaction);
    app.get('/api/v1/tx/operations/:hash', StellarController.getOperationsForTransaction);
    app.get('/api/v1/search/:key', StellarController.getSearch);
    app.get('/api/v1/balance/:address', StellarController.getBalance);
    app.get('/api/v1/address/txs/:account', StellarController.getTransactionsForAccount);
    app.get('/api/v1/address/operations/:account', StellarController.getOperationsForAccount);
    app.get('/api/v1/address/payments/:account', StellarController.getPaymentsForAccount);
    
    app.get('/api/v1/account/:account', StellarController.getAccount);
    app.post('/api/v1/transaction', StellarController.postTransaction);

    app.post('/api/v1/account/offers', StellarController.getOffersForAccount);
    app.post('/api/v1/account/effects', StellarController.getEffectsForAccount);
    app.post('/api/v1/effects', StellarController.getLatestEffects);

    // app.get('/api/create_account', StellarController.createAccount);
    // app.get('/test', StellarController.TestTransaction);

    app.get('/monitor', StellarController.getMonitor);
    app.get('/monitor/horizon', StellarController.getMonitorHorizon);
    app.get('/monitor/stellar-core', StellarController.getMonitorStellarCore);
}
