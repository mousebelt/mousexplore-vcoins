// define local node object
var neo = require('neo-api');
const localNode = neo.node('http://localhost:20332');
exports.localNode = localNode;

exports.getBlockCount = function (req, res) {
    localNode.getBlockCount().then(function (result) {
        res.json({ status: 400, msg: 'errors', data: result });
    }).catch(function (err) {
        res.json({ status: 400, msg: 'errors', data: err });
    });
}

/**
 * Get latest block list
 * POST /blocks/latest
 * 
 * @param {Number} count 
 * 
 * @return
 * { "status": 200, "msg": "success", "data": [blocks] }
 * 
 * block: {
            "hash": "0x4708829b458f53921839d87b721e4e42ef9d27f2083a87cb38f523cf556224ca",
            "size": 686,
            "version": 0,
            "previousblockhash": "0xf064a5f865cc2eb2d77cc4214d1483cd0f25555b2a95d965f54331a070db3983",
            "merkleroot": "0x0ba2f72cabb58bd0e7bdcd4a8cdfd58c6f4e75792cde1bb5285a611213dff96a",
            "time": 1478009068,
            "index": 69588,
            "nonce": "b12ce7f04858d3f7",
            "nextconsensus": "APyEx5f4Zm4oCHwFWiSTaph1fPBxZacYVR",
            "script": {
                "invocation": "400326428e56374f1f2e9cf436afd8968124c750f5e3d0c56365e25963f0d9773303780fab49276183d30cee6de8d3004bc58b6556d29cbfca4160d5fe7df315854014d86bc1f2862f1542a66ef7d04a33b6001936a5f906b94c3d4f3b3a4df732d689e48c9404fe46c7220e51ec72ab7ddfe4897caa985052b4112c422c855500f940c62be8e64cf3019f7448f0924cd69cfce527aa0b50fdd7c5daed34074208034041fbf8a96c9a9ae048dd34a8f3930b96127ba2904494a876e548bdfe9af0304d4054d3bbbdb3f3e3889cd97c7d5a4b34f0fdd09669228f51fbe142c8c1e58564f853e42623d46dc347f3ab92a83ad9880a014b45ee2ac6ee9627932723f9f81b254048af07cfc3ee4579682d5e8caa178b690c11180280d5695965470e2d1046cc29e783aad3b6d960fa8e33f80079ae039a2ed6853a887f746e05bb6068cfdd47c1",
                "verification": "552102486fd15702c4490a26703112a5cc1d0923fd697a33406bd5a1c00e0013b09a7021024c7b7fb6c310fccf1ba33b082519d82964ea93868d676662d4a59ad548df0e7d2102aaec38470f6aad0042c6e877cfd8087d2676b0f516fddd362801b9bd3936399e2103b209fd4f53a7170ea4444e0cb0a6bb6a53c2bd016926989cf85f9b0fba17a70c2103b8d9d5771d8f513aa0869b9cc8d50986403b78c6da36890638c3d46a5adce04a2102ca0e27697b9c248f6f16e085fd0061e26f44da85b58ee835c110caa5ec3ba5542102df48f60e8f3e01c48ff40b9b7f1310d7a8b2a193188befe1c2e3df740e89509357ae"
            },
            "tx": [
                {
                    "txid": "0x0ba2f72cabb58bd0e7bdcd4a8cdfd58c6f4e75792cde1bb5285a611213dff96a",
                    "size": 10,
                    "type": "MinerTransaction",
                    "version": 0,
                    "attributes": [],
                    "vin": [],
                    "vout": [],
                    "sys_fee": "0",
                    "net_fee": "0",
                    "scripts": [],
                    "nonce": 1213780983
                }
            ],
            "confirmations": 1,
            "nextblockhash": "0x4530743a9a497b77c24249e995b832e7216e6a0283ca6a4a0b7bfb19c54c4566"
        }
 */
exports.postBlocksLatest = async function (req, res) {
    var { count } = req.body

    // validation
    if (!count || count < 1 || count > 50 ) count = 20;

    // logic
    var blockCount = await localNode.getBlockCount();

    if (!blockCount) {
        res.json({ status: 400, msg: 'errors', data: 'Fail to get block count !' });
    }

    var blocks = [];
    for (let i = 1; i <= count; i++) {
        var index = blockCount - i;

        var block = await localNode.getBlockByHeight(index, 1);
        blocks.push(block);
    }

    return res.json({ status: 200, msg: 'success', data: blocks });
}

/**
 * POST /blocks 
 * Get block list
 * 
 * @param {Number} index: 69588
 * @param {Number} count: 20
 * 
 * @return
 * { "status": 200, "msg": "success", "data": [blocks] }
 * 
 * block: {
            "hash": "0x4708829b458f53921839d87b721e4e42ef9d27f2083a87cb38f523cf556224ca",
            "size": 686,
            "version": 0,
            "previousblockhash": "0xf064a5f865cc2eb2d77cc4214d1483cd0f25555b2a95d965f54331a070db3983",
            "merkleroot": "0x0ba2f72cabb58bd0e7bdcd4a8cdfd58c6f4e75792cde1bb5285a611213dff96a",
            "time": 1478009068,
            "index": 69588,
            "nonce": "b12ce7f04858d3f7",
            "nextconsensus": "APyEx5f4Zm4oCHwFWiSTaph1fPBxZacYVR",
            "script": {
                "invocation": "400326428e56374f1f2e9cf436afd8968124c750f5e3d0c56365e25963f0d9773303780fab49276183d30cee6de8d3004bc58b6556d29cbfca4160d5fe7df315854014d86bc1f2862f1542a66ef7d04a33b6001936a5f906b94c3d4f3b3a4df732d689e48c9404fe46c7220e51ec72ab7ddfe4897caa985052b4112c422c855500f940c62be8e64cf3019f7448f0924cd69cfce527aa0b50fdd7c5daed34074208034041fbf8a96c9a9ae048dd34a8f3930b96127ba2904494a876e548bdfe9af0304d4054d3bbbdb3f3e3889cd97c7d5a4b34f0fdd09669228f51fbe142c8c1e58564f853e42623d46dc347f3ab92a83ad9880a014b45ee2ac6ee9627932723f9f81b254048af07cfc3ee4579682d5e8caa178b690c11180280d5695965470e2d1046cc29e783aad3b6d960fa8e33f80079ae039a2ed6853a887f746e05bb6068cfdd47c1",
                "verification": "552102486fd15702c4490a26703112a5cc1d0923fd697a33406bd5a1c00e0013b09a7021024c7b7fb6c310fccf1ba33b082519d82964ea93868d676662d4a59ad548df0e7d2102aaec38470f6aad0042c6e877cfd8087d2676b0f516fddd362801b9bd3936399e2103b209fd4f53a7170ea4444e0cb0a6bb6a53c2bd016926989cf85f9b0fba17a70c2103b8d9d5771d8f513aa0869b9cc8d50986403b78c6da36890638c3d46a5adce04a2102ca0e27697b9c248f6f16e085fd0061e26f44da85b58ee835c110caa5ec3ba5542102df48f60e8f3e01c48ff40b9b7f1310d7a8b2a193188befe1c2e3df740e89509357ae"
            },
            "tx": [
                {
                    "txid": "0x0ba2f72cabb58bd0e7bdcd4a8cdfd58c6f4e75792cde1bb5285a611213dff96a",
                    "size": 10,
                    "type": "MinerTransaction",
                    "version": 0,
                    "attributes": [],
                    "vin": [],
                    "vout": [],
                    "sys_fee": "0",
                    "net_fee": "0",
                    "scripts": [],
                    "nonce": 1213780983
                }
            ],
            "confirmations": 1,
            "nextblockhash": "0x4530743a9a497b77c24249e995b832e7216e6a0283ca6a4a0b7bfb19c54c4566"
        }
 */
exports.postBlocks = async function (req, res) {
    var { index, count } = req.body

    // validation
    if (!index || index < 0 ) res.json({ status: 400, msg: 'errors', data: 'invalid index !' });
    if (!count || count < 1 || count > 50 ) count = 20;

    // logic
    var blocks = [];
    for (let i = 0; i < count; i++) {
        var _index = index - i;

        var block = await localNode.getBlockByHeight(_index, 1);
        blocks.push(block);
    }

    return res.json({ status: 200, msg: 'success', data: blocks });
}

/**
 * POST /block
 * Get block info from hash or index
 * 
 * @param {String|Int} height: 0x4708829b458f53921839d87b721e4e42ef9d27f2083a87cb38f523cf556224ca | 69588
 * 
 * @return
 * { "status": 200, "msg": "success", "data": block }
 * 
 * block: {
            "hash": "0x4708829b458f53921839d87b721e4e42ef9d27f2083a87cb38f523cf556224ca",
            "size": 686,
            "version": 0,
            "previousblockhash": "0xf064a5f865cc2eb2d77cc4214d1483cd0f25555b2a95d965f54331a070db3983",
            "merkleroot": "0x0ba2f72cabb58bd0e7bdcd4a8cdfd58c6f4e75792cde1bb5285a611213dff96a",
            "time": 1478009068,
            "index": 69588,
            "nonce": "b12ce7f04858d3f7",
            "nextconsensus": "APyEx5f4Zm4oCHwFWiSTaph1fPBxZacYVR",
            "script": {
                "invocation": "400326428e56374f1f2e9cf436afd8968124c750f5e3d0c56365e25963f0d9773303780fab49276183d30cee6de8d3004bc58b6556d29cbfca4160d5fe7df315854014d86bc1f2862f1542a66ef7d04a33b6001936a5f906b94c3d4f3b3a4df732d689e48c9404fe46c7220e51ec72ab7ddfe4897caa985052b4112c422c855500f940c62be8e64cf3019f7448f0924cd69cfce527aa0b50fdd7c5daed34074208034041fbf8a96c9a9ae048dd34a8f3930b96127ba2904494a876e548bdfe9af0304d4054d3bbbdb3f3e3889cd97c7d5a4b34f0fdd09669228f51fbe142c8c1e58564f853e42623d46dc347f3ab92a83ad9880a014b45ee2ac6ee9627932723f9f81b254048af07cfc3ee4579682d5e8caa178b690c11180280d5695965470e2d1046cc29e783aad3b6d960fa8e33f80079ae039a2ed6853a887f746e05bb6068cfdd47c1",
                "verification": "552102486fd15702c4490a26703112a5cc1d0923fd697a33406bd5a1c00e0013b09a7021024c7b7fb6c310fccf1ba33b082519d82964ea93868d676662d4a59ad548df0e7d2102aaec38470f6aad0042c6e877cfd8087d2676b0f516fddd362801b9bd3936399e2103b209fd4f53a7170ea4444e0cb0a6bb6a53c2bd016926989cf85f9b0fba17a70c2103b8d9d5771d8f513aa0869b9cc8d50986403b78c6da36890638c3d46a5adce04a2102ca0e27697b9c248f6f16e085fd0061e26f44da85b58ee835c110caa5ec3ba5542102df48f60e8f3e01c48ff40b9b7f1310d7a8b2a193188befe1c2e3df740e89509357ae"
            },
            "tx": [
                {
                    "txid": "0x0ba2f72cabb58bd0e7bdcd4a8cdfd58c6f4e75792cde1bb5285a611213dff96a",
                    "size": 10,
                    "type": "MinerTransaction",
                    "version": 0,
                    "attributes": [],
                    "vin": [],
                    "vout": [],
                    "sys_fee": "0",
                    "net_fee": "0",
                    "scripts": [],
                    "nonce": 1213780983
                }
            ],
            "confirmations": 1,
            "nextblockhash": "0x4530743a9a497b77c24249e995b832e7216e6a0283ca6a4a0b7bfb19c54c4566"
        }
 */
exports.postBlock = async function (req, res) {
    var { height } = req.body

    // validation
    if (!height) res.json({ status: 400, msg: 'errors', data: 'empty height !' });
    
    // logic
    try {
        var block = await localNode.getBlockByHeight(height, 1);
        return res.json({ status: 200, msg: 'success', data: block });
    } catch (error) {
        return res.json({ status: 400, msg: 'errors', data: error });
    }
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