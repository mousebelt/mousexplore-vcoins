# Neo
neo-vcoin apis  
>api prefix: '/api/v1'  

## Summary
### Utility apis
[get latest blocks from offset, count](#getBlocks)  
[get transactions by offset, count, order](#getTransactions)  
[get block by hash or height](#getBlockByHash)  

[postBlocks](#postBlocks)  
[postBlock](#postBlock)  
[postBlockTxs](#postBlockTxs)  
[postTx](#postTx)  
[postAddressTransactions](#postAddressTransactions)  

***

## Utility apis

<a name="getBlocks"/>

- get latest blocks from offset, count
```
/**
 * GET /blocks 
 * get latest blocks from offset, count
 * 
 * @param {Number} offset
 * @param {Number} count
 * 
 * @param {Number} offset
 * @param {Number} count
 * 
 * @return
 * { status: 200, msg: 'success', data: [block] }
    block = {
        "hash": "0xd749cffddcf33a5302c2b675ebba305a9534584e91d9f05c639563fc31272c6e",
        "size": 686,
        "version": 0,
        "previousblockhash": "0x0ea28647d7a89f04ac82c5b48be39955a1f040e06a313b510a9aab37970480c5",
        "merkleroot": "0xdda503afb71e64d940cfd2c00995a72503ce901b13760752306d854ed58d9d1b",
        "time": 1479227992,
        "index": 127927,
        "nonce": "19385d2ada9b3096",
        "nextconsensus": "APyEx5f4Zm4oCHwFWiSTaph1fPBxZacYVR",
        "script": {
            "invocation": "403fc6abeb11da17f6b5dd24b5204e5f13e78fee01c658edfefa52bf5095fd1270b0124b2efac72512c4754d7fd54e3feca913ee88fcd530b769e63563fb3a081a40e3b56e3161c4136caaa8e6057ca89bef55615df4ba71d4f72568e9df7aeec6518161362d2f5634a10bca6bb0a48cffc76355a920d0c3228465ef070025fd065640694dc65aa45efbfd0f83ce64314b9e515273c8f69db3bf58eecbc7d796bbb0249f040f8df5a085d72d0fb3df1755ba1cc1f2043343e4c1f0e3fe7f65a989ee784041e59254b31b4a0833878a31ea73491a415273085386a7a065e73cc3123b083e2afb4c62b60108c87e92f967c2f528af2f0e0012f3ba0d8d41dd3381aa79f859406fc02bc4712fe4c5431594036e32a534151f3ef1dc0e55e7ea886fe10f89dacf788a340ee6718add1158ab64b086df6e3448112951d80d5740cb97a7d2599e8c",
            "verification": "552102486fd15702c4490a26703112a5cc1d0923fd697a33406bd5a1c00e0013b09a7021024c7b7fb6c310fccf1ba33b082519d82964ea93868d676662d4a59ad548df0e7d2102aaec38470f6aad0042c6e877cfd8087d2676b0f516fddd362801b9bd3936399e2103b209fd4f53a7170ea4444e0cb0a6bb6a53c2bd016926989cf85f9b0fba17a70c2103b8d9d5771d8f513aa0869b9cc8d50986403b78c6da36890638c3d46a5adce04a2102ca0e27697b9c248f6f16e085fd0061e26f44da85b58ee835c110caa5ec3ba5542102df48f60e8f3e01c48ff40b9b7f1310d7a8b2a193188befe1c2e3df740e89509357ae"
        },
        "tx": [
            {
                "txid": "0xdda503afb71e64d940cfd2c00995a72503ce901b13760752306d854ed58d9d1b",
                "size": 10,
                "type": "MinerTransaction",
                "version": 0,
                "attributes": [],
                "vin": [],
                "vout": [],
                "sys_fee": "0",
                "net_fee": "0",
                "scripts": [],
                "nonce": 3667603606
            }
        ],
        "confirmations": 3,
        "nextblockhash": "0x2697dad3a4b6641600c7c975986152da14df272acb6f1c82a2360a82401fff32"
    }
 */
```
<a name="getTransactions"/>

- get transactions by offset, count, order

```
GET /transactions
get transactions by offset, count, order
```

Name | Type | Mandatory | Default | Description
------------ | ------------ | ------------ | ------------ | ------------
offset | Number | NO | 0 | offset
count | Number | NO | 10 | transaction count
order | Number | NO | 0 | 0 => newest first, 1 => oldest first

```
 * @return
 * { "status": "200", "msg": "success", 
 *   "data": [txs]
 * }
 * 
 * tx: {
        "txid": "0x6d1cc3aa44b218e1fe052fa3c06c8a0009bfc2c91676c977d80e3d2d8388e2ee",
        "size": 10,
        "type": "MinerTransaction",
        "version": 0,
        "attributes": [],
        "vin": [],
        "vout": [],
        "sys_fee": "0",
        "net_fee": "0",
        "scripts": [],
        "nonce": 870829101,
        "blockhash": "0xbe18be00b930b4147195a25608d69c35ba4e8273779db75c87c66310971e1f96",
        "confirmations": 221559,
        "blocktime": 1478762561
    }
 */
```

<a name="getBlockByHash"/>

- get block by hash or height

```
GET /block/:hash
```

```
 * @return
 * { "status": "200", "msg": "success", "data": block }
 * 
 * block: {
        "hash": "0x6a3daf003164ba1712ea754287d30a4a13409ff4eff90ba232387893266663c5",
        "size": 686,
        "version": 0,
        "previousblockhash": "0xf86dccb73d9243728d38b5067c40bf3989a7dfe8a98afd049b7633b568fe0415",
        "merkleroot": "0xbe5521026ff50d8a90dc8296af013a50b5a676e555411f603217e2f7e01ef278",
        "time": 1483559504,
        "index": 345346,
        "nonce": "b7c506092abc14fa",
        "nextconsensus": "APyEx5f4Zm4oCHwFWiSTaph1fPBxZacYVR",
        "script": {
            "invocation": "9f7...",
            "verification": "7ae..."
        },
        "tx": [
            {
                "txid": "0xbe5521026ff50d8a90dc8296af013a50b5a676e555411f603217e2f7e01ef278",
                "size": 10,
                "type": "MinerTransaction",
                "version": 0,
                "attributes": [],
                "vin": [],
                "vout": [],
                "sys_fee": "0",
                "net_fee": "0",
                "scripts": [],
                "nonce": 716969210
            }
        ],
        "confirmations": 1,
        "nextblockhash": "0xdeeeae0dd7b3a89d81b8e36425f2ac971b8b22c3ba7f73d460c480640da089f9"
    }
 */
```

<a name="getBlockDetails"/>

- get block details by hash or height

```
GET /blockdetails/:hash
```

```
 * @return
 * { "status": "200", "msg": "success", "data": blockdetails }
 * 
 * blockdetails = block
 */
```

<a name="postAddressTransactions"/>

- postAddressTransactions
```
/**
 * POST /address/txs
 * Get tx list from address
 * 
 * @param {String} asset: "0xc56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b"
 * @param {String} address: "AQVh2pG732YvtNaxEGkQUei3YA4cvo7d2i"
 * @param {Number} offset: 0
 * @param {Number} count: 10
 * @param {Boolean} order: If 0, newest order. If 1, oldest order.
 * 
 * @return
 * { "status": "200", "msg": "success", 
 *   "data": { "total": total, "txs": [tx] }
 * }
 * 
 * total: Number
 * tx: {
        "_id": "5afa852c31a9a73db264d7ff",
        "txid": "0xc56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b",
        "size": 107,
        "type": "RegisterTransaction",
        "version": 0,
        "vin": [],
        "vout": [],
        "sys_fee": "0",
        "net_fee": "0",
        "blockIndex": 0,
        "blockTime": 1468595301,
        "updatedAt": "2018-05-15T06:58:52.181Z",
        "__v": 0
    }
 */
```

<a name="getBalance"/>

- getBalance
```
/**
 * @description Returns the balance of the corresponding asset in the wallet, based on the specified asset number.
 * 
 * @method GET /balance
 * 
 * @param {String} assetId : "025d82f7b00a9ff1cfe709abe3c4741a105d067178e645bc3ebad9bc79af47d4" 
 * 
 * @return
 * { "status": 200, "msg": "success", "data": balance }
 * 
 * balance: {
    "Balance": "1.01",
    "Confirmed": "1.01"
    }
 */
```
