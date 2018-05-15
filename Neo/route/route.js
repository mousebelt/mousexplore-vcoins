var neoController = require('../controllers/neo');

module.exports = function (app) {
    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    //// RPC Call apis ////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////

    //Asset
    app.get('/api/v1/balance', neoController.getBalance);

    //Block
    app.get('/api/v1/lastblockhash', neoController.getLastBlockHash);
    app.get('/api/v1/blockbyheight', neoController.getBlockByHeight);
    app.get('/api/v1/blockcount', neoController.getBlockCount);
    app.get('/api/v1/blockhashbyheight', neoController.getBlockHashByHeight);

    //Net
    app.get('/api/v1/connectioncount', neoController.getConnectionCount);
    app.get('/api/v1/version', neoController.getVersion);

    //Tx
    app.get('/api/v1/rawmempool', neoController.getRawMemPool);
    app.get('/api/v1/rawtransaction', neoController.getRawTransaction);
    app.get('/api/v1/txout', neoController.getTxOut);

    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    //// Utility apis ////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////

    app.post('/api/v1/blocks/latest', neoController.postBlocksLatest);
    app.post('/api/v1/blocks', neoController.postBlocks);
    app.post('/api/v1/block', neoController.postBlock);
    app.post('/api/v1/block/txs', neoController.postBlockTxs);
    app.post('/api/v1/tx', neoController.postTx);

    app.post('/api/v1/txs', neoController.postTxs);
    
}
