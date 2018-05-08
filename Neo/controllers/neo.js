// define local node object
var neo = require('neo-api');
const localNode = neo.node('http://localhost:20332');
exports.localNode = localNode;

exports.getBlockCount = function (req, res) {
    localNode.getBlockCount().then(function (result) {
        console.log('Current block height: ' + result);
    }).catch(function (err) {
        console.log(err);
    });
    // localNode.getLastBlockHash().then(function (result) {
    //     console.log('Hash of last block: ' + result);
    // });
}

/**
 * Get latest block list
 * POST /blocks/latest
 * 
 * @param token 
 * @param count 
 * 
 * @return
 * { "status": 200, "msg": "success", 
 *      "data": [blocks]
 * }
 * 
 * block: {
    "index": 2000190,
    "hash": "0x8cb9fee28a48a45468e3c0a229fd4473288cdd9794c10cac7b8f4681ca404342",
    "time": 1520521121,
    "transactions": 7,
    "size": 3291,
 * }
 */
exports.postBlocksLatest = function (req, res) {
    console.log('postBlocksLatest running.')
    res.json({ status: 200, msg: 'success', data: 'postBlocksLatest' });
}

/**
 * POST /blocks 
 * Get block list
 * 
 * @param token: NEP5
 * @param index: 2000190
 * @param count: 20
 * 
 * @return
 * { "status": 200, "msg": "success", 
 *      "data": [blocks]
 * }
 * 
 * block: {
    "index": 2000190,
    "hash": "0x8cb9fee28a48a45468e3c0a229fd4473288cdd9794c10cac7b8f4681ca404342",
    "time": 1520521121,
    "transactions": 7,
    "size": 3291,
 * }
 */
exports.postBlocks = function (req, res) {
    console.log('postBlocks running.')
    res.json({ status: 200, msg: 'success', data: 'postBlocks' });
}

/**
 * POST /block
 * Get block info from hash
 * 
 * @param token: NEP5
 * @param hash: 0x8cb9fee28a48a45468e3c0a229fd4473288cdd9794c10cac7b8f4681ca404342
 * 
 * @return
 * { "status": 200, "msg": "success", 
 *   "data": block
 * }
 * 
 * block: {
    "hash": "0x8cb9fee28a48a45468e3c0a229fd4473288cdd9794c10cac7b8f4681ca404342",
    "version": 0,
    "previousblockhash": "0x361f566c40f43e46678d378f2787f1cb148e399f712126b1dcea95278e424a51",
    "nextblockhash": "0x361f566c40f43e46678d378f2787f1cb148e399f712126b1dcea95278e424a51",
    "merkleroot": "0x55487fec7d46696f66ae4ab9946f9447d4fde7f79e52bce2e9914dd5efd2f036",
    "time": 1520521121,
    "index": 2000190,
    "next_consensus": "0x55bfa4cc95efe9bb65c104bf27385d2b655de759",
    "consensus data": 7357964124241302497,
    "confirmations": -2022686,
    "size": 7435,
    "txs": 104,
    "sys_fee": 210761
 }
 */
exports.postBlock = function (req, res) {
    console.log('postBlock running.')
    res.json({ status: 200, msg: 'success', data: 'postBlock' });
}

/**
 * POST /block/txs
 * Get txs from block
 * 
 * @param token: NEP5
 * @param hash: "0x8cb9fee28a48a45468e3c0a229fd4473288cdd9794c10cac7b8f4681ca404342"
 * 
 * @return
 * { "status": "200", "msg": "success", 
 *   "data": [txs]
 * }
 * 
 * tx: {
 *  "type": "MinerTransaction", 
 *  "txID": "0e3d66967a1783bba502d62483ae79ee86ceaf1fa32358f548881498157d20ec", 
 *  "size": "10",
 *  "time": 1520521121,
 * }
 */
exports.postBlockTxs = function (req, res) {
    console.log('postBlockTxs running.')
    res.json({ status: 200, msg: 'success', data: 'postBlockTxs' });
}

/**
 * POST /txs
 * Get all transactions
 * 
 * @param token: NEP5
 * @param offset: 100
 * @param count: 25
 * 
 * @return
 * { "status": "200", "msg": "success", 
 *   "data": [txs]
 * }
 * 
 * tx: {
 *  "type": "MinerTransaction", 
 *  "txID": "0e3d66967a1783bba502d62483ae79ee86ceaf1fa32358f548881498157d20ec", 
 *  "size": "10",
 *  "time": 1520521121,
 * }
 */
exports.postTxs = function (req, res) {
    console.log('postTxs running.')
    res.json({ status: 200, msg: 'success', data: 'postTxs' });
}

/**
 * POST /tx
 * Get tx info from txID
 * 
 * @param token: NEP5
 * @param txID: 0e3d66967a1783bba502d62483ae79ee86ceaf1fa32358f548881498157d20ec
 * 
 * @return
 * { "status": "200", "msg": "success", 
 *   "data": tx
 * }
 * 
 * tx: {
 *  "txID": "0x9cd48d513a081e7832088e152e26ca46f05dc062b36d9e983a0c6049a2f56cbd", 
 *  "time": "1472533979", 
 *  "type": "ContractTransaction", 
 *  "systemFee": "0",
 *  "networkFee": "0",
 *  "size": "202",
 *  "confirmations": "-2022686",
 *  "blockIndex": 2022689,
 *  "blockHash": 7e8d950dc45c5e3cf65ec2e5545564960014b5d48f6ef986519b6738786598a0,
 *  "from": "AYJXuFBfUyELoTe3wXEzPkq5RcsHsF58uW"
 *  "neo": "1"
 *  "to": "AYJXuFBfUyELoTe3wXEzPkq5RcsHsF58uW"
 *  "gas": "8.68e-6"
 * }
 */
exports.postTx = function (req, res) {
    console.log('postTx running.')
    res.json({ status: 200, msg: 'success', data: 'postTx' });
}

/**
 * POST /txs/address
 * Get txs related to address
 * 
 * @param token: NEP5
 * @param address: ATzcWCz1dzCT9QnybP2aUMzrZj6DyJr2F1
 * @param startno: 1
 * @param count: 25
 * 
 * @return
 * { "status": "200", "msg": "success", 
 *   "data": { total, [txs] }
 * }
 * 
 * tx: {
 *  "txID": "0x9cd48d513a081e7832088e152e26ca46f05dc062b36d9e983a0c6049a2f56cbd", 
 *  "time": "1472533979", 
 *  "type": "ContractTransaction", 
 *  "systemFee": "0",
 *  "networkFee": "0",
 *  "size": "202",
 * }
 */
exports.postTxsAddress = function (req, res) {
    console.log('postTxsAddress running.')
    res.json({ status: 200, msg: 'success', data: 'postTxsAddress' });
}

/**
 * POST /address
 * Get overview from address
 * 
 * @param token: NEP5
 * @param address: AK6dnisjF2tqJVJhEVLVjErXLPP7oCrqUt 
 * 
 * @return
 * { "status": 200, "msg": "success", 
 *  "data": info
 * }
 * 
 * info: {
 *  "address": AK6dnisjF2tqJVJhEVLVjErXLPP7oCrqUt,
 *  "neoBalance": 17,
 *  "gasBalance": 0.04523824
 *  "transactions": 104,
 *  "time": "1472533979"
 * }
 */
exports.postAddress = function (req, res) {
    console.log('postAddress running.')
    res.json({ status: 200, msg: 'success', data: 'postAddress' });
}