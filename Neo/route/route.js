var neoController = require('../controllers/neo');

module.exports = function (app) {
    app.get('/api/blockcount', neoController.getBlockCount);
    // app.post('/api/create_account', StellarController.createAccount);
}