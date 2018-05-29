# Public Rest API for Ethereum Node

vcoin apis  

# Summary
[Get Balance](#get-balance)  
[Create Account](#create-account)  
[Make Transaction](#make-transaction)  
[Get Updated Transaction](#get-updated-transaction)  
[Get Block list](#get-block-list)  
[Get Block list from offset and count](#get-block-list-from-offset-and-count)  
[Get Latest Blocks](#get-latest-blocks)  
[Get Block Detail](#get-block-detail)  
[Get transactions from blocknumber](#get-transactions-from-blocknumber)  
[Get transaction list by offset, count, order](#get-transaction-list)  
[Get transaction list From Account](#get-transaction-list-from-account)  
[Get transaction count From Account](#get-transaction-count-from-account)  
[Get tx info from txHash](#get-tx-info-from-txhash)  

***

# API Details

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
{ status: 200, msg: 'success', data: [block] }

block = {
            "difficulty": "2609994988",
            "extraData": "0xda83010807846765746888676f312e31302e318777696e646f7773",
            "gasLimit": 58000000,
            "gasUsed": 5233537,
            "hash": "0xe3b092cff27d1c3488a7043173c8d4ab016ac9c8a3a6b2ee43087946e792e1bf",
            "logsBloom": "0x0000080000008a0000000000000040000202000000000010000000000000000000000080000000000000008000000000000100000000000000000000000400400000000000200000000000080000000000000000200500000000000000000000000000000200002000020000000008200000000000004000100000100000000000000000100100000000000000000c0400000000000000010004000000080000000080000000000000000000008000000000000000000000000000000100000000100a02000200000000000008000000000000020000000000000000100060000000000000000000000000040000000001000000000000000000000000000000",
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
            "transactions": [
                {
                    "blockHash": "0xe3b092cff27d1c3488a7043173c8d4ab016ac9c8a3a6b2ee43087946e792e1bf",
                    "blockNumber": 3332474,
                    "from": "0x4B8E0fCDdca42a238DA3b930d0a5543B6B0e7A19",
                    "gas": 6721975,
                    "gasPrice": "100000000000",
                    "hash": "0x204e704b27602180d7bd11d5575449022b30b02124c6f10704bfbb3e60949ce8",
                    "input": "0x60806040526103e96004556103e9600555600060065560006007556000600855336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550610b208061006e6000396000f300608060405260043610610149576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680630a8256331461014e5780630ba3c8ac1461017b5780632ce62e50146101a65780633f252506146101f35780634cb81417146102205780634d717c681461024d578063554fe557146102785780635c2b1119146102c35780635f92cf2b146102ee5780636a19e6de1461035b5780636fdbd52a146103a657806379ba5097146103d35780638da5cb5b146103ea57806393a332801461044157806399e6f76d1461046c578063a439847814610497578063a91f14cc146104c4578063acc1ed32146104ef578063bd773a7a1461051a578063cbe5486814610545578063d4ee1d9014610572578063d6c7a59b146105c9578063e8a96b46146105f4578063eb63eadd14610661578063f2fde38b146106a2575b600080fd5b34801561015a57600080fd5b50610179600480360381019080803590602001909291905050506106e5565b005b34801561018757600080fd5b506101906106f9565b6040518082815260200191505060405180910390f35b3480156101b257600080fd5b506101f160048036038101908080359060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610703565b005b3480156101ff57600080fd5b5061021e60048036038101908080359060200190929190505050610763565b005b34801561022c57600080fd5b5061024b60048036038101908080359060200190929190505050610777565b005b34801561025957600080fd5b5061026261078b565b6040518082815260200191505060405180910390f35b34801561028457600080fd5b506102ad6004803603810190808035906020019092919080359060200190929190505050610791565b6040518082815260200191505060405180910390f35b3480156102cf57600080fd5b506102d86107b8565b6040518082815260200191505060405180910390f35b3480156102fa57600080fd5b50610319600480360381019080803590602001909291905050506107c2565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561036757600080fd5b5061039060048036038101908080359060200190929190803590602001909291905050506107f5565b6040518082815260200191505060405180910390f35b3480156103b257600080fd5b506103d160048036038101908080359060200190929190505050610821565b005b3480156103df57600080fd5b506103e8610835565b005b3480156103f657600080fd5b506103ff610937565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561044d57600080fd5b5061045661095c565b6040518082815260200191505060405180910390f35b34801561047857600080fd5b50610481610962565b6040518082815260200191505060405180910390f35b3480156104a357600080fd5b506104c26004803603810190808035906020019092919050505061096c565b005b3480156104d057600080fd5b506104d9610976565b6040518082815260200191505060405180910390f35b3480156104fb57600080fd5b5061050461097c565b6040518082815260200191505060405180910390f35b34801561052657600080fd5b5061052f610982565b6040518082815260200191505060405180910390f35b34801561055157600080fd5b5061057060048036038101908080359060200190929190505050610988565b005b34801561057e57600080fd5b5061058761099c565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156105d557600080fd5b506105de6109c2565b6040518082815260200191505060405180910390f35b34801561060057600080fd5b5061061f600480360381019080803590602001909291905050506109cc565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561066d57600080fd5b506106a0600480360381019080803590602001909291908035906020019092919080359060200190929190505050610a09565b005b3480156106ae57600080fd5b506106e3600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610a4a565b005b600115156106ef57fe5b8060088190555050565b6000600754905090565b6001151561070d57fe5b806003600084815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505050565b6001151561076d57fe5b8060048190555050565b6001151561078157fe5b8060078190555050565b60065481565b6002602052816000526040600020816008811015156107ac57fe5b01600091509150505481565b6000600454905090565b60036020528060005260406000206000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000600260008481526020019081526020016000208260088110151561081757fe5b0154905092915050565b6001151561082b57fe5b8060058190555050565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561089157600080fd5b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506000600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60045481565b6000600854905090565b8060068190555050565b60075481565b60085481565b60055481565b6001151561099257fe5b8060068190555050565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000600554905090565b60006003600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b60011515610a1357fe5b600882101515610a1f57fe5b806002600085815260200190815260200160002083600881101515610a4057fe5b0181905550505050565b60011515610a5457fe5b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614151515610ab057600080fd5b80600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550505600a165627a7a7230582030a8696067780fc1d67e60146922903f04fecf62e1d15bf5a312dadca8df3fc30029",
                    "nonce": 227,
                    "to": null,
                    "transactionIndex": 0,
                    "value": "0",
                    "v": "0x2a",
                    "r": "0x97538fc245070412cc153bd130c9875684da92e7052431e811fcb400af27abe1",
                    "s": "0x4c9caaeeb82e2559e43c08b9464def81cbddf065e0b242bfb990de9b3b9df0e9"
                },
            ],
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

## Get Block Detail
```
 POST /api/v1/block
```

Get block info from blockNumber.

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
blocknum | Number | YES | start block number


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
           transactions: 260, 
           hash: "0x1716fe362ce1711ccc7727d72f1becd8d585318dcae48c714d7b7b25f7c3d6ae", 
           parentHash: "0x3c192dfa22e832633723b57897cd9e00024a0ed341e2de274d2bbeeee5921bbe", 
           sha3Uncles: "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347", 
           minedBy: "0xb2930b35844a230f00e51431acae96fe543a0347", 
           difficulty: "3,162,739,934,758,047", 
           totalDifficulty: "4,003,097,177,949,420,847,497", 
           size: "38742 bytes", 
           gasUsed: "7,993,537 (99.92%)", 
           gasLimit: "8,000,029", 
           nonce: "0xa9cdfb1c086bb04b", 
           unclesReward: "0", 
           extraData: "0x73656f3234242342e34242323d324324"
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
  "status": 400,
  "msg": "error msg",
  "data": error   //error message
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




## Get tx info from txHash
```
 POST /api/v1/tx
```

Get list of specified transactions.

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
txHash | String | YES | hash value


### RETURN

* for successed case
`status code:` 200

```javascript
{
"msg": "success",
"data": [
        {   
          "txHash": "0x9cd48d513a081e7832088e152e26ca46f05dc062b36d9e983a0c6049a2f56cbd",
          "timeStamp": "1472533979",
          "txReceipt Status": "Success",
          "block": "5558044 (70 block confirmations)",
          "from": "0xaa7a7c2decb180f68f11e975e6d92b5dc06083a6"
          "to": "0x1a7208627ffe43a69f13f3c393a41712fa4a7831"
          "value": "0.09 Ether ($71.87)"
          "gasLimit": 120000,
          "gasUsedByTxn": 87221,
          "gasPrice": "0.000000003 Ether (3 Gwei)",
          "actualTxCostFee": "0.000261663 Ether ($0.21)",
          "nonce": 574,
          "inputData": "Function: miningTen() MethodID: 0xcc4bf6a3"
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