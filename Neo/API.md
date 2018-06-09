# Neo
neo-vcoin apis  
>api prefix: '/api/v1'  

## Summary
### Utility apis
[get latest blocks from offset, count](#getBlocks)  
[get transactions by offset, count, order](#getTransactions)  
[get block by hash or height](#getBlockByHash)  
[get block details by hash or height](#getBlockDetails)  
[get transaction by txid](#getTx)  
[get transaction details by txid](#getTxDetails)  
[get address related transactions](#getAddressTransactions)  
[search](#search)  

***

## Utility apis

<a name="getBlocks"/>

- get latest blocks from offset, count
```
 GET /blocks 
```

Name | Type | Mandatory | Default | Description
------------ | ------------ | ------------ | ------------ | ------------
offset | Number | NO | 0 | offset
count | Number | NO | 10 | block count

```
 * @return
 * { status: 200, msg: 'success', data: { total, result: [block] } }
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
        "tx": [transaction],
        "confirmations": 3,
        "nextblockhash": "0x2697dad3a4b6641600c7c975986152da14df272acb6f1c82a2360a82401fff32"
    }
 */
```

<a name="getTransactions"/>

- get transactions by offset, count, order

```
GET /transactions
```

Name | Type | Mandatory | Default | Description
------------ | ------------ | ------------ | ------------ | ------------
offset | Number | NO | 0 | offset
count | Number | NO | 10 | transaction count
order | Number | NO | 0 | 0 => newest first, 1 => oldest first
token_hash | String | NO | undefined | undefined => all transactions

```
 * @return
 * { "status": "200", "msg": "success", 
 *   "data": { total, result: [txdetails] }
 * }
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
```

<a name="getBlockDetails"/>

- get block details by hash or height

```
GET /blockdetails/:hash
```

```
 * return
 * { "status": "200", "msg": "success", "data": blockdetails }

 blockdetails = block & txdetails
```

<a name="getTx"/>

- get transaction by txid
```
GET /tx/:txid

 * return
 * { "status": "200", "msg": "success", "data": transaction }
```

<a name="getTxDetails"/>

- get transaction details by txid
```
GET /txdetails/:txid

 * return
 * { "status": "200", "msg": "success", "data": txdetails }

 txdetails = {
        "txid": "0x4d072dd2c362f84edebb637b3d2085fab3d31e31f85c4b3ae29236163502512f",
        "size": 296,
        "type": "ContractTransaction",
        "version": 0,
        "attributes": [],
        "vin": [
            {
                "txid": "0x5dcb045017f2cce0403747d153d616113e30cd7a02e4e29f9a0babac23e4b582",
                "vout": 0,
                "address": {
                    "n": 0,
                    "asset": "0x602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7",
                    "value": "28.54029216",
                    "address": "AK3tAKzmKvjeDeLx33SfKh1VZxgR6Vf7dp"
                }
            },...
        ],
        "vout": [
            {
                "n": 0,
                "asset": "0x602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7",
                "value": "36",
                "address": "AQBnkfJmP2NrYMB8UxVgW5sMfZjE3SVPdf"
            },...
        ],
        "sys_fee": "0",
        "net_fee": "0",
        "scripts": [
            {
                "invocation": "40e5459f25b2f6f627562673f79df7fcd43380d5ecd61ed88e2003eb5e688c48bb2958acaa0a7cfdd21ddaacca5ab36c7b6bc7959c151e3424be9e4169bc3eb4dc",
                "verification": "21039453ace186f4662574dd95ebdd26fd7df4f42218266928a7612290343bb5f560ac"
            }
        ],
        "blockhash": "0x41ffc368fd33e512263f5f32e3b22c1d57affd2866a32c1ca3480ce06aca13bc",
        "confirmations": 254241,
        "blocktime": 1479737124
    }
```

<a name="getAddressTransactions"/>

- get address related transactions

```
 GET /address/txs/:address
```

### QUERY PARAMS

Name | Type | Mandatory | Default | Description
------------ | ------------ | ------------ | ------------ | ------------
asset | String | NO | undefined | address asset
offset | Number | NO | 0 | offset
count | Number | NO | 10 | transaction count
order | Number | NO | 0 | 0 => newest first, 1 => oldest first

```
return: { status: 200, msg: 'success', data: { total, result: [txdetails] } }
```

<a name="getBalance"/>

- getBalance
```
 GET /balance

Returns the balance of the corresponding asset in the wallet, based on the specified asset number.

 * @param {String} assetId : "025d82f7b00a9ff1cfe709abe3c4741a105d067178e645bc3ebad9bc79af47d4" 
 * 
 * @return
 * { "status": 200, "msg": "success", "data": balance }
 * 
 * balance: {
    "Balance": "1.01",
    "Confirmed": "1.01"
    }
```

<a name="search"/>

- Search
```
 GET /search/:key

key param can be txid or blockNo, blockHash, address.

{ status: 200, msg: 'sccuess', data: { type, result: info } }

type = 'block' => info = blockdetails
type = 'transaction' => info = txdetails
type = 'address' => info = addressInfo
```
