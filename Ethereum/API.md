# Public Rest API for Ethereum Node

vcoin apis  

# Summary
[Get block list from offset and count](#get-block-list-from-offset-and-count)  
[Get transaction list by offset, count, order](#get-transaction-list-by-offset-count-order)  
[Get block by hash or height](#get-block-by-hash-or-height)  
[Get block details by hash or height](#get-block-details-by-hash-or-height)  
[Get transaction from hash](#get-transaction-from-hash)  
[Get transaction details from hash](#get-transaction-details-from-hash)  

[Get Balance](#get-balance)  
[Create Account](#create-account)  
[Make Transaction](#make-transaction)  
[Get Updated Transaction](#get-updated-transaction)  
[Get Block list](#get-block-list)  
[Get Latest Blocks](#get-latest-blocks)  
[Get transactions from blocknumber](#get-transactions-from-blocknumber)  
[Get transaction list From Account](#get-transaction-list-from-account)  
[Get transaction count From Account](#get-transaction-count-from-account)  

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
  transactionfields,
  block, 
  txreceipt,
  fee
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
GET /api/get_address_balance/:address
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

## Create Account
```
POST /api/create_account
```
Create new account on Ethereum node.

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------

### RETURN

* for successed case
`status code:` 200

```javascript
{
  "address": "0xD7781938264e9BAc311Addba7D59de130a6C15f2"   //ether value of balance 
}
```

* for failed case
`status code:` 400

```javascript
{
  "error": "unknown error"   //error message
}
```

## Make Transaction
```
POST /api/make_transaction
```
Make transaction. In Ethereum, this means send ether to another address.

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
from | STRING | YES | address who sends ether
to | STRING | YES | address who receives ether
value | Number | YES | amount of ether

### RETURN

* for successed case
`status code:` 200

```javascript
{
  "hash": "0xf167e7a3d6d6e13fd0d197be10743ce00c04398aab6f2836b2a8cc09d5be0da8"   //ether value of balance 
}
```

* for failed case
`status code:` 400

```javascript
{
  "error": ""   //error message
}
```

## Get Updated Transaction
```
POST /api/get_updated_transaction
```
get transactions information from specified block to last block.

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
blocknum | Number | YES | start block number

### RETURN

* for successed case
`status code:` 200

```javascript
{
`data:` [
        {   
            hash: '0x9be9bc9fbbdb65d56ff055fef10f7380e188c6cf86526caa245aafb3d0778e53',
            nonce: 1,
            blockHash: '0x7158bcd54e5f10682503968989befdf794788b2d40dc5c836f82d2227f02d290',
            blockNumber: 6,
            transactionIndex: 0,
            from: '0x0625FE5DFBC10BE45abd49c33aC377E45D9eFA6a',
            to: '0x89718DE358A73343bd0F9D71E5f623131792E43d',
            value: '40000000000000000000',
            gas: 90000,
            gasPrice: '20000000000',
            input: '0x0' 
        },
        ...
    ]
}
```

* for failed case
`status code:` 400

```javascript
{
  "error": ""   //error message
}
```


## Get Block list
```
 POST /api/v1/blocklisr
```

get block list of count blocks started from blockNumber.

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
blocknum | Number | YES | start block number
count | Number | YES | count of blocks to get 

### RETURN

* for successed case
`status code:` 200

```javascript
{
"msg": "success",
"data": [
        {   
           blockNumber: "5556102", 
           timeStamp: "1472533979", 
           txn: 260, 
           uncles: 1, 
           blockMiner: "0x13a06d3dfe21e0db5c016c03ea7d2509f7f8d1e3",
           gasUsed: "7985391", 
           gasLimit: 7992222, 
           avgGasPrice: "8.66"
          },
        ...
    ]
}
```

* for failed case
`status code:` 400

```javascript
{
  "error": ""   //error message
}
```


## Get Latest Blocks
```
 POST /api/v1/blocks/latest
```

get block list of latest blocks.

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
count | Number | YES | count of blocks to get 


### RETURN

* for successed case
`status code:` 200

```javascript
{
"msg": "success",
"data": [
        {   
           blockNumber: "5556102", 
           timeStamp: "1472533979", 
           txn: 260, 
           uncles: 1, 
           blockMiner: "0x13a06d3dfe21e0db5c016c03ea7d2509f7f8d1e3",
           gasUsed: "7985391", 
           gasLimit: 7992222, 
           avgGasPrice: "8.66"
          },
        ...
    ]
}
```

* for failed case
`status code:` 400

```javascript
{
  "error": ""   //error message
}
```


* for failed case
`status code:` 400

```javascript
{
  "error": ""   //error message
}
```

## Get transactions from blocknumber
```
 POST /api/v1/block/txs
```

Get transactions from blockNumber.

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
blockNumber | Number | YES | block number


### RETURN

* for successed case
`status code:` 200

```javascript
{
"msg": "success",
"data": [
        {   
          "status": true
          "blockNumber": "2165403", "timeStamp": "1472533979",
          "txHash": "0x98db583e5ff636b78",
          "from": "0xaa7a7c2decb180f68f11e975e6d92b5dc06083a6"
          "to": "0xaa7a7c2decb180f68f11e975e6d92b5dc06083a6",
          "value": "0.007792298571672 Ether"
          "txFee": "0.000084"
          },
        ...
    ]
}
```

* for failed case
`status code:` 400

```javascript
{
  "error": ""   //error message
}
```

## Get transaction list From Account
```
 POST /api/v1/account/txs
```

Get list of transactions of an account.

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
account | String | YES | account address
offset | Number | YES | offset from latest transaction
count | Number | YES | count of blocks to get 

### RETURN

* for successed case
`status code:` 200

```javascript
{
"msg": "success",
"data": [
        {   
          "blocknumber": "2165403", "timestamp": "1472533979",
          "hash": "0x98db583e5ff636b78",
          "from": "0xaa7a7c2decb180f68f11e975e6d92b5dc06083a6"
          "to": "0xaa7a7c2decb180f68f11e975e6d92b5dc06083a6",
          "value": "0.007792298571672 Ether"
          "fee": "0.000084"
          },
        ...
    ]
}
```

* for failed case
`status code:` 400

```javascript
{
  "error": ""   //error message
}
```



## Get transaction count From Account
```
 POST /api/v1/account/txcount
```

Get count of transactions of an account.

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
account | String | YES | account address

### RETURN

* for successed case
`status code:` 200

```javascript
{
"msg": "success",
"data": 50
}
```

* for failed case
`status code:` 400

```javascript
{
  "error": ""   //error message
}
```
