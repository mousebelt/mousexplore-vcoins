# Neo
neo-vcoin apis  
>api prefix: '/api/v1'  

## Summary
[RPC client apis](#rpc-client-apis)  
[RPC Call apis](#rpc-call-apis-1)  
[Utility apis](#utility-apis-1)  
### RPC Call apis
#### Asset
[getBalance](#getBalance)  
#### Block
[getLastBlockHash](#getLastBlockHash)  
[getBlockByHeight](#getBlockByHeight)  
[getBlockCount](#getBlockCount)  
[getBlockHashByHeight](#getBlockHashByHeight)  
#### Net
[getConnectionCount](#getConnectionCount)  
[getVersion](#getVersion) 
#### Tx 
[getRawMemPool](#getRawMemPool)  
[getRawTransaction](#getRawTransaction)  
[getTxOut](#getTxOut)  

### Utility apis
[postBlocksLatest](#postBlocksLatest)  
[postBlocks](#postBlocks)  
[postBlock](#postBlock)  
[postBlockTxs](#postBlockTxs)  
[postTx](#postTx)  
[postTxs](#postTxs)  
[postAddressTransactions](#postAddressTransactions)  


***

## RPC client apis
- Prefix: /api/rpc
- Method: POST
- API List: http://docs.neo.org/en-us/node/cli/api.html

***

## RPC Call apis
### Asset
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

### Block
<a name="getLastBlockHash"/>

- getLastBlockHash
```
/**
 * @description Returns the hash of the tallest block
 * 
 * @method GET /lastblockhash
 * 
 * @return
 * { "status": 200, "msg": "success", "data": hash }
 * 
 * hash: "773dd2dae4a9c9275290f89b56e67d7363ea4826dfd4fc13cc01cf73a44b0d0e"
 */
```

<a name="getBlockByHeight"/>

- getBlockByHeight
```
/**
 * @description The corresponding block information is returned according to the specified hash or index value.
 * 
 * @method GET /blockbyheight
 * 
 * @param {String|Int} height: "0x4708829b458f53921839d87b721e4e42ef9d27f2083a87cb38f523cf556224ca" | 69588
 *                              if height is String, it is hash
 *                              if height is Number, it is index
 * @return
 * { "status": 200, "msg": "success", "data": block }
 * 
 * block: {
    "Hash": "773dd2dae4a9c9275290f89b56e67d7363ea4826dfd4fc13cc01cf73a44b0d0e",
    "Size": 686,
    "Version": 0,
    "Previousblockhash": "282293a89587d2513ae82d5baf69a4afd68b8d2ac70e80f58246bc2ca8dfea2d",
    "Merkleroot": "2033d1779cef38259dc9df82a4deb258a944f807f820a4cc364105f11b08f816",
    "Time": 1496721145,
    "Index": 991956,
    "Nonce": "2a551c84bd408f87",
    "Nextconsensus": "APyEx5f4Zm4oCHwFWiSTaph1fPBxZacYVR",
    "Script": {
      "Invocation": "40b514d8562ad3badac0e097a502a43c58e23c75029dad8ccdb3b1ce221067d73d5612950e38c7565d6b166ef62894399a6f152c38a1bdb8c7d3715f75f20c1c7340e443f55108c5eefd99f954e06b21e97a4f0cf64dbd4e52426c27f7046cd880d6a7b1a507131c39afa48b9cac16411d6f84ec2f0b5d9977e5f1e3ce760a127b31409b8a52714b37a3b0970a19b4fb2669d2aa41ea85e05e68dfb03a197d505282dd53846ca58b1457504c65759a9ceb8f84f5148dec71727e9c743e986092728174401862c08611338be8e352b9110b2bb6d11ce0485286d857162deb417f1cb920d6727f8e6edbe1b7fce8d9b122523d5b45cfd02ab1ca002a58e28c8903ad764a84409dfcbda69cef1164936212e8e5d91965c8a976dc8dbcb5ea7d2f2d2f0105dadb902924559fede016a1f76a2c7ab0ff89a6446b0c19c88375906c8b9eccb61bc1",
      "Verification": "552102486fd15702c4490a26703112a5cc1d0923fd697a33406bd5a1c00e0013b09a7021024c7b7fb6c310fccf1ba33b082519d82964ea93868d676662d4a59ad548df0e7d2102aaec38470f6aad0042c6e877cfd8087d2676b0f516fddd362801b9bd3936399e2103b209fd4f53a7170ea4444e0cb0a6bb6a53c2bd016926989cf85f9b0fba17a70c2103b8d9d5771d8f513aa0869b9cc8d50986403b78c6da36890638c3d46a5adce04a2102ca0e27697b9c248f6f16e085fd0061e26f44da85b58ee835c110caa5ec3ba5542102df48f60e8f3e01c48ff40b9b7f1310d7a8b2a193188befe1c2e3df740e89509357ae"
    },
    "Tx": [
      {
        "Txid": "2033d1779cef38259dc9df82a4deb258a944f807f820a4cc364105f11b08f816",
        "Size": 10,
        "Type": "MinerTransaction",
        "Version": 0,
        "Attributes":[],
        "Vin":[],
        "Vout":[],
        "Sys_fee": "0",
        "Net_fee": "0",
        "Scripts":[],
        "Nonce": 3175124871
       }
    ],
    "Confirmations": 20,
    "Nextblockhash": "0b08e2eeed05c70f27293521c47f7f60dfc29f9f299ae9909a8552a4a87db7a2"
  }
 */
```

<a name="getBlockCount"/>

- getBlockCount
```
/**
 * @description Gets the number of blocks.
 * 
 * @method GET /blockcount
 * 
 * @return
 * { "status": 200, "msg": "success", "data": blockcount }
 * 
 * blockcount: 991991
 */
```

<a name="getBlockHashByHeight"/>

- getBlockHashByHeight
```
/**
 * @description Returns the hash value of the corresponding block, based on the specified index.
 * 
 * @method GET /blockhashbyheight
 * 
 * @param {Number} height: Block index (block height)
 * 
 * @return
 * { "status": 200, "msg": "success", "data": hash }
 * 
 * hash: "4c1e879872344349067c3b1a30781eeb4f9040d3795db7922f513f6f9660b9b2"
 */
```

### Net
<a name="getConnectionCount"/>

- getConnectionCount
```
/**
 * @description Gets the current number of connections for the node.
 * 
 * @method GET /connectioncount
 * 
 * @return
 * { "status": 200, "msg": "success", "data": count }
 * 
 * count: 10
 */
```

<a name="getVersion"/>

- getVersion
```
/**
 * @description Returns the version information about the queried node.
 * 
 * @method GET /version
 * 
 * @return
 * { "status": 200, "msg": "success", "data": version }
 * 
 * version: {
      "port": 0,
      "nonce": 156443862,
      "useragent": "/NEO:2.3.5/"
  }
 */
```

### Tx
<a name="getRawMemPool"/>

- getRawMemPool
```
/**
 * @description Obtains the list of unconfirmed transactions in memory.
 * 
 * @method GET /rawmempool
 * 
 * @return
 * { "status": 200, "msg": "success", "data": result }
 * 
 * result: "B4534f6d4c17cda008a76a1968b7fa6256cd90ca448739eae8e828698ccc44e7"
 */
```

<a name="getRawTransaction"/>

- getRawTransaction
```
/**
 * @description Returns the corresponding transaction information, based on the specified hash value.
 * 
 * @method GET /rawtransaction
 * 
 * @param {String} txId: "f4250dab094c38d8265acc15c366dc508d2e14bf5699e12d9df26577ed74d657"
 * 
 * @return
 * { "status": 200, "msg": "success", "data": tx }
 * 
 * tx: {
    "Txid": "f4250dab094c38d8265acc15c366dc508d2e14bf5699e12d9df26577ed74d657",
    "Size": 262,
    "Type": "ContractTransaction",
    "Version": 0,
    "Attributes":[],
    "Vin": [
      {
        "Txid": "abe82713f756eaeebf6fa6440057fca7c36b6c157700738bc34d3634cb765819",
        "Vout": 0
      }
     ],
     "Vout": [
      {
        "N": 0,
        "Asset": "c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b",
        "Value": "2950",
        "Address": "AHCNSDkh2Xs66SzmyKGdoDKY752uyeXDrt"
      },
      {
        "N": 1,
        "Asset": "c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b",
        "Value": "4050",
        "Address": "ALDCagdWUVV4wYoEzCcJ4dtHqtWhsNEEaR"
       }
    ],
    "Sys_fee": "0",
    "Net_fee": "0",
    "Scripts": [
      {
        "Invocation": "40915467ecd359684b2dc358024ca750609591aa731a0b309c7fb3cab5cd0836ad3992aa0a24da431f43b68883ea5651d548feb6bd3c8e16376e6e426f91f84c58",
        "Verification": "2103322f35c7819267e721335948d385fae5be66e7ba8c748ac15467dcca0693692dac"
      }
    ],
    "Blockhash": "9c814276156d33f5dbd4e1bd4e279bb4da4ca73ea7b7f9f0833231854648a72c",
    "Confirmations": 144,
    "Blocktime": 1496719422
  }
 */
```

<a name="getTxOut"/>

- getTxOut
```
/**
 * @description Returns the corresponding unspent transaction output information (returned change), based on the specified hash and index. 
 *              If the transaction output is already spent, the result value will be null.
 * 
 * @method GET /txout
 * 
 * @param {String} txId: "f4250dab094c38d8265acc15c366dc508d2e14bf5699e12d9df26577ed74d657"
 * @param {Number} index: 0: The index of the transaction output to be obtained in the transaction (starts from 0)
 *
 * @return
 * { "status": 200, "msg": "success", "data": result }
 * 
 * result: {
     "N": 0,
     "Asset": "c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b",
     "Value": "2950",
     "Address": "AHCNSDkh2Xs66SzmyKGdoDKY752uyeXDrt"
   }
 */
```


***

## Utility apis
<a name="postBlocksLatest"/>

- postBlocksLatest
```
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
```

<a name="postBlocks"/>

- postBlocks
```
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
```

<a name="postBlock"/>

- postBlock
```
/**
 * POST /block
 * Get block info from hash or index
 * 
 * @param {String|Int} height: "0x4708829b458f53921839d87b721e4e42ef9d27f2083a87cb38f523cf556224ca" | 69588
 *                              if height is String, it is hash
 *                              if height is Number, it is index
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
```

<a name="postBlockTxs"/>

- postBlockTxs
```
/**
 * POST /block/txs
 * Get txs from block
 * 
 * @param {String|Int} height: "0x5a6ef8a1b8a4c040145c5fbc0ade618edab81f31ab97618801ad8beee3217fc0" | 3333
 *                              if height is String, it is hash
 *                              if height is Number, it is index
 * 
 * @return
 * { "status": "200", "msg": "success", "data": [txs] }
 * 
 * tx: {
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
 */
```

<a name="postTx"/>

- postTx
```
/**
 * POST /tx
 * Get tx info from txId
 * 
 * @param {String} txId: "0x0e3d66967a1783bba502d62483ae79ee86ceaf1fa32358f548881498157d20ec"
 * 
 * @return
 * { "status": "200", "msg": "success", 
 *   "data": tx
 * }
 * 
 * tx: {
    "Txid": "f4250dab094c38d8265acc15c366dc508d2e14bf5699e12d9df26577ed74d657",
    "Size": 262,
    "Type": "ContractTransaction",
    "Version": 0,
    "Attributes":[],
    "Vin": [
      {
        "Txid": "abe82713f756eaeebf6fa6440057fca7c36b6c157700738bc34d3634cb765819",
        "Vout": 0
      }
     ],
     "Vout": [
      {
        "N": 0,
        "Asset": "c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b",
        "Value": "2950",
        "Address": "AHCNSDkh2Xs66SzmyKGdoDKY752uyeXDrt"
      },
      {
        "N": 1,
        "Asset": "c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b",
        "Value": "4050",
        "Address": "ALDCagdWUVV4wYoEzCcJ4dtHqtWhsNEEaR"
       }
    ],
    "Sys_fee": "0",
    "Net_fee": "0",
    "Scripts": [
      {
        "Invocation": "40915467ecd359684b2dc358024ca750609591aa731a0b309c7fb3cab5cd0836ad3992aa0a24da431f43b68883ea5651d548feb6bd3c8e16376e6e426f91f84c58",
        "Verification": "2103322f35c7819267e721335948d385fae5be66e7ba8c748ac15467dcca0693692dac"
      }
    ],
    "Blockhash": "9c814276156d33f5dbd4e1bd4e279bb4da4ca73ea7b7f9f0833231854648a72c",
    "Confirmations": 144,
    "Blocktime": 1496719422
  }
 */
```

<a name="postTxs"/>

- postTxs
```
/**
 * POST /txs
 * Get tx list from offset and count
 * 
 * @param {Number} offset: 0
 * @param {Number} count: 10
 * @param {Boolean} sort: If true, newest order. If false, oldest order.
 * 
 * @return
 * { "status": "200", "msg": "success", 
 *   "data": [txs]
 * }
 * 
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