var neoController = require('../controllers/neo');

module.exports = function (app) {
    app.post('/api/v1/blocks/latest', neoController.postBlocksLatest);
    app.post('/api/v1/blocks', neoController.postBlocks);
    app.post('/api/v1/block', neoController.postBlock);
    app.post('/api/v1/block/txs', neoController.postBlockTxs);
    app.post('/api/v1/txs', neoController.postTxs);
    app.post('/api/v1/tx', neoController.postTx);
    app.post('/api/v1/txs/address', neoController.postTxsAddress);
    app.post('/api/v1/address', neoController.postAddress);
}
