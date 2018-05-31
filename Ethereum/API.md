# Public Rest API for Ethereum Node

vcoin apis  

# Summary
[Get block list from offset and count](#get-block-list-from-offset-and-count)  
[Get transaction list by offset, count, order](#get-transaction-list-by-offset-count-order)  
[Get block by hash or height](#get-block-by-hash-or-height)  
[Get block details by hash or height](#get-block-details-by-hash-or-height)  
[Get transaction from hash](#get-transaction-from-hash)  
[Get transaction details from hash](#get-transaction-details-from-hash)  
[Get address related transaction by offset, count, order](#Get-address-related-transaction-by-offset-count-order)  
[Get Balance](#get-balance)  

***

# API Details


## Get Block list from offset and count
```
 GET /api/v1/blocks
```

get block list in latest order from offset and count.

### QUERY PARAMS

Name | Type | Mandatory | Default | Description
------------ | ------------ | ------------ | ------------ | ------------
offset | Number | Yes | 0 | start block number
count | Number | Yes | 10 | count of blocks to get 

### RETURN

* for successed case
`status code:` 200

```javascript
{ status: 200, msg: 'success', data: { total, [block] } }

block = {
            "difficulty": "2609994988",
            "extraData": "0xda83010807846765746888676f312e31302e318777696e646f7773",
            "gasLimit": 58000000,
            "gasUsed": 5233537,
            "hash": "0xe3b092cff27d1c3488a7043173c8d4ab016ac9c8a3a6b2ee43087946e792e1bf",
            "logsBloom": "0x0000080000...",
            "miner": "0xe24246e6dCBb07BC15A1f9C3833fc1877DF4c80e",
            "mixHash": "0x64a8f940cf2e65c719526f505292e4af9229a72477559da720bb0b9c2454c447",
            "nonce": "0x937b2b8a430d1eeb",
            "number": 3332474,
            "parentHash": "0x38cd4923a32040c54957da1fa8ce37f2dd109f314b5eeba18a36fc407c5cc3e5",
            "receiptsRoot": "0xdde230f13416b1aa7fbc249cc01f42cb249a2c3ce25b4c411322858f990897f1",
            "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
            "size": 21803,
            "stateRoot": "0x716e7237186911968b734006e2ff76b6b7b84525dff883fc5d0adf82e067d12e",
            "timestamp": 1527583261,
            "totalDifficulty": "8399454833308733",
            "transactions": [transaction],
            "transactionsRoot": "0x75a94c75fb1e56c1d14961308da23e36586fbf824e42d316ea4744ccf7959991",
            "uncles": []
        }
```

* for failed case
`status code:` 400

```javascript
{
  "error": ""   //error message
}
```


## Get transaction list by offset, count, order
```
 GET /api/v1/transactions
```

Get transaction list.

### QUERY PARAMS

Name | Type | Mandatory | Default | Description
------------ | ------------ | ------------ | ------------
offset | Number | NO | 0 | offset
count | Number | NO | 10 | transaction count
order | Number | NO | 0 | 0 => newest first, 1 => oldest first

### RETURN

* for successed case
`status code:` 200

```javascript
{
"status": 200,
"msg": "success",
"data": { total, [transaction] }
}

transaction = {
        "blockHash": "0x5621793adbf64e139ccc2af202b3a1ab09febc5593f7c659e277658aae1a0da0",
        "blockNumber": 1432232,
        "from": "0x07d914A675F0CB82590E6D6a02A501301A066a2b",
        "gas": 600000,
        "gasPrice": "40000000000",
        "hash": "0x739b685867c94d426d68e163b94ee7c301e2b34cca0e4a458f572bdabd066d87",
        "input": "0x34a4f35a00000000000000000000000000000000000000000000000000000000178b38c0dea101e427b0bd1a370654f3f125d4e913cda80d70b4e9f834fc250a400900c8",
        "nonce": 2,
        "to": "0xE26B3678FEF015f3122e78f9d85b292ce45975B1",
        "transactionIndex": 0,
        "value": "0",
        "v": "0x1c",
        "r": "0xe4d4efd0552250b2a425d724948b8018ce9bb75a5dc15892b38e9d0683f4d46d",
        "s": "0x6978c715fb9be617374a73e5542085de93c9abf0e8a3f171805a1956ccbe318c"
    }
```

* for failed case
`status code:` 400

```javascript
{
  "status": 400,
  "msg": "error msg",
  "data": error   //error message
}
```


## Get Block by hash or height
```
 GET /api/v1/block/:hash
```

Get block by hash or height

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
hash | String | YES | block hash or block number


### RETURN

* for successed case
`status code:` 200

```javascript
{
  status: 200,
  "msg": "success",
  "data": block
}
```

## Get block details by hash or height
```
 GET /api/v1/blockdetails/:hash
```

Get block details by hash or height

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
hash | String | YES | block hash or block number


### RETURN

* for successed case
`status code:` 200

```javascript
{
  status: 200,
  "msg": "success",
  "data": blockdetails
}
```


## Get transaction from hash
```
 GET /api/v1/tx/:hash
```

Get transaction from hash

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
hash | String | YES | transaction hash


### RETURN

* for successed case
`status code:` 200

```javascript
{ status: 200, msg: "success", data: transaction }
```

* for failed case
`status code:` 400

```javascript
{
  "error": ""   //error message
}
```

## Get transaction details from hash
```
 GET /api/v1/txdetails/:hash
```

Get transaction details from hash

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
hash | String | YES | transaction hash


### RETURN

* for successed case
`status code:` 200

```javascript
{ status: 200, msg: "success", data: txdetails }

txdetails = {
        "blockHash": "0x2d4d8f99a59dd855da527d11c01c72b8a9b681dfe3b112cd46060deb9f0a9603",
        "blockNumber": 1436757,
        "from": "0xd9E4e366a70Feb4D13933399703D8Dd2CFcD9231",
        "gas": 4000000,
        "gasPrice": "100000000000",
        "hash": "0xdeb182f3c5c47d6740b3783c22fb3f57c02bb7a74958e825f8deaf9ef185aca2",
        "input": "0x60606040000096c77",
        "nonce": 946,
        "to": null,
        "transactionIndex": 0,
        "value": "0",
        "v": "0x1b",
        "r": "0x65f980b4ad5ccad642cc04829787848f0bd3c55525327a28035d23d6e1ddf15",
        "s": "0xda02c456ddedb993c3c54da5e29043b349f9e3408749427f83aa3b145ba0a5b",
        "block": {
            "difficulty": "2434506459",
            "extraData": "0x526f707374656e20506f6f6c",
            "gasLimit": 4712388,
            "gasUsed": 3517959,
            "hash": "0x2d4d8f99a59dd855da527d11c01c72b8a9b681dfe3b112cd46060deb9f0a9603",
            "logsBloom": "0x00000000000...",
            "miner": "0xF4D8e706CfB25c0DECBbDd4D2E2Cc10C66376a3F",
            "mixHash": "0xb33d84636d7b7d41f45093bcbe73284285f317569637755114f560e2c802d41e",
            "nonce": "0xdaf25055dd665da4",
            "number": 1436757,
            "parentHash": "0xbf0bbc5e2f439aafca0a7bd78c29906ec8ae6f1b53db6403767317f3a41eba61",
            "receiptsRoot": "0xc845daf74e712229153a3f99ec489dbe961197aae6b8bb93d1ae5048395bf4ea",
            "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
            "size": 13339,
            "stateRoot": "0x01ecd4589889f0f578b23bdb31002b37a34ccaf3bb640c38ef2ccc0d81c71dfa",
            "timestamp": 1501978275,
            "totalDifficulty": "1594978033867895",
            "transactions": [
                "0xdeb182f3c5c47d6740b3783c22fb3f57c02bb7a74958e825f8deaf9ef185aca2"
            ],
            "transactionsRoot": "0xc2b2d441d77d7ea0136acc55e3d4e48b4d3edb683e0a9cb29184e2fc5898e227",
            "uncles": []
        },
        "txreceipt": {
            "blockHash": "0x2d4d8f99a59dd855da527d11c01c72b8a9b681dfe3b112cd46060deb9f0a9603",
            "blockNumber": 1436757,
            "contractAddress": "0xeeE100FCCF4456ea093A86f98D816daef2A0E460",
            "cumulativeGasUsed": 3517959,
            "from": "0xd9e4e366a70feb4d13933399703d8dd2cfcd9231",
            "gasUsed": 3517959,
            "logs": [],
            "logsBloom": "0x000...",
            "root": "0x63d4f4764c22da919f41b9d6565f3fd03c65f6ab85c8a2325e9b29f1b47a790c",
            "to": null,
            "transactionHash": "0xdeb182f3c5c47d6740b3783c22fb3f57c02bb7a74958e825f8deaf9ef185aca2",
            "transactionIndex": 0
        },
        "fee": 351795900000000000
    }
```

* for failed case
`status code:` 400

```javascript
{
  "error": ""   //error message
}
```


## Get address related transaction by offset, count, order
```
 GET /api/v1/address/txs/:address
```

Get address related transactions

### QUERY PARAMS

Name | Type | Mandatory | Default | Description
------------ | ------------ | ------------ | ------------ | ------------
offset | Number | NO | 0 | offset
count | Number | NO | 10 | transaction count
order | Number | NO | 0 | 0 => newest first, 1 => oldest first

### RETURN

* for successed case
`status code:` 200

```javascript
{
"msg": "success",
"data":  { total, [transaction] } 
}
```

* for failed case
`status code:` 400

```javascript
{
  "error": ""   //error message
}
```

## Get Balance
```
GET /api/v1/balance/:address
```
Get balance of specified address as unit of ETH.

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
address | STRING | YES | address to get balance

### RETURN

* for successed case
`status code:` 200

```javascript
{
  "balance": 0.2   //ether value of balance 
}
```

* for failed case
`status code:` 400

```javascript
{
  "error": ""   //error message
}
```
