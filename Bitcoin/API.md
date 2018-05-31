# Public Rest API for Bitcoin Node
json-rpc client api list
https://en.bitcoin.it/wiki/Original_Bitcoin_client/API_calls_list

vcoin apis  
>api prefix: '/api/v1'  

# Summary
[Get latest blocks from offset and count](#get-latest-blocks-from-offset-and-count)  
[Get transactions by offset, count, order](#get-transactions-by-offset-count-order)  
[Get block by hash or height](#get-block-by-hash-or-height)  
[Get block details by hash or height](#get-block-details-by-hash-or-height)  

[Get transaction by txid](#get-transaction-by-txid)  
[Get Bitcoin transaction by block height](#get-bitcoin-transaction-by-block-height)  
[Get Bitcoin address related transaction by offset, count, order](#get-bitcoin-address-related-transaction-by-offset-count-order)  


***

# Utility APIs

## Get latest blocks from offset and count
```
 GET /blocks
```

### QUERY PARAMS

Name | Type | Mandatory | Default | Description
------------ | ------------ | ------------ | ------------ | ------------
offset | Number | No | 0 | offset from lastest block
count | Number | No | 10 | block count

### RETURN

* for successed case

```javascript
{ status: 200, msg: 'sccuess', data: [block] }
```

* for failed case

```javascript
{ status: 400, msg: 'errors', data: err }
```


## Get transactions by offset, count, order
```
 GET /transactions
```

### QUERY PARAMS

Name | Type | Mandatory | Default | Description
------------ | ------------ | ------------ | ------------ | ------------
offset | Number | NO | 0 | offset
count | Number | NO | 10 | transaction count
order | Number | NO | 0 | 0 => newest first, 1 => oldest first

### RETURN

* for successed case

```javascript
{ status: 200, msg: 'sccuess', data: [transaction] }
```

* for failed case

```javascript
{ status: 400, msg: 'errors', data: err }
```

## get block by hash or height
```
 GET /block/:hash
```

Returns information about the block with the given hash. 

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
hash | String | YES | hash or height


### RETURN

* for successed case

```javascript
{
    "status": 200,
    "msg": "sccuess",
    "data": block
}
```

* for failed case

```javascript
{ status: 400, msg: 'errors', data: err }
```

## get block details by hash or height
```
 GET /blockdetails/:hash
```

Returns information about the block with the given hash. 

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
hash | String | YES | hash or height


### RETURN

* for successed case

```javascript
{
    "status": 200,
    "msg": "sccuess",
    "data": blockdetails
}
```

* for failed case

```javascript
{ status: 400, msg: 'errors', data: err }
```


## Get transaction by txid
```
 GET /transaction/:txid
```

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
txid | String | YES | txid

### RETURN

* for successed case

```javascript
{ status: 200, msg: 'sccuess', data: tx }

tx: {
            "txid": "3bf8c518a7a1187287516da67cb96733697b1d83eb937e68ae39bd4c08e563b7",
            "hash": "3bf8c518a7a1187287516da67cb96733697b1d83eb937e68ae39bd4c08e563b7",
            "version": 1,
            "size": 126,
            "vsize": 126,
            "weight": 504,
            "locktime": 0,
            "vin": [
                {
                    "coinbase": "0440bebf4f0122172f503253482f49636549726f6e2d51432d6d696e65722f",
                    "sequence": 4294967295
                }
            ],
            "vout": [
                {
                    "value": 50,
                    "n": 0,
                    "scriptPubKey": {
                        "asm": "03a5f981bf546b95152ed6695bc50edd0b8db3afb48839b9d58714519e5bdd1f95 OP_CHECKSIG",
                        "hex": "2103a5f981bf546b95152ed6695bc50edd0b8db3afb48839b9d58714519e5bdd1f95ac",
                        "reqSigs": 1,
                        "type": "pubkey",
                        "addresses": [
                            "mw8BoejnFJmntv3PjKAcPbuB6PMsBnAGDQ"
                        ]
                    }
                }
            ],
            "hex": "01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff1f0440bebf4f0122172f503253482f49636549726f6e2d51432d6d696e65722fffffffff0100f2052a01000000232103a5f981bf546b95152ed6695bc50edd0b8db3afb48839b9d58714519e5bdd1f95ac00000000",
            "blockhash": "00000000373403049c5fff2cd653590e8cbe6f7ac639db270e7d1a7503d698df",
            "confirmations": 1209804,
            "time": 1337966144,
            "blocktime": 1337966144
        }
```

* for failed case

```javascript
{ status: 400, msg: 'errors', data: err }
```


## Get Bitcoin transaction by block height
```
 GET /block/transactions/:height
```

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
height | Number | YES | height

### RETURN

* for successed case

```javascript
{ status: 200, msg: 'sccuess', data: [txs] }

tx: {
            "txid": "3bf8c518a7a1187287516da67cb96733697b1d83eb937e68ae39bd4c08e563b7",
            "hash": "3bf8c518a7a1187287516da67cb96733697b1d83eb937e68ae39bd4c08e563b7",
            "version": 1,
            "size": 126,
            "vsize": 126,
            "weight": 504,
            "locktime": 0,
            "vin": [
                {
                    "coinbase": "0440bebf4f0122172f503253482f49636549726f6e2d51432d6d696e65722f",
                    "sequence": 4294967295
                }
            ],
            "vout": [
                {
                    "value": 50,
                    "n": 0,
                    "scriptPubKey": {
                        "asm": "03a5f981bf546b95152ed6695bc50edd0b8db3afb48839b9d58714519e5bdd1f95 OP_CHECKSIG",
                        "hex": "2103a5f981bf546b95152ed6695bc50edd0b8db3afb48839b9d58714519e5bdd1f95ac",
                        "reqSigs": 1,
                        "type": "pubkey",
                        "addresses": [
                            "mw8BoejnFJmntv3PjKAcPbuB6PMsBnAGDQ"
                        ]
                    }
                }
            ],
            "hex": "01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff1f0440bebf4f0122172f503253482f49636549726f6e2d51432d6d696e65722fffffffff0100f2052a01000000232103a5f981bf546b95152ed6695bc50edd0b8db3afb48839b9d58714519e5bdd1f95ac00000000",
            "blockhash": "00000000373403049c5fff2cd653590e8cbe6f7ac639db270e7d1a7503d698df",
            "confirmations": 1209804,
            "time": 1337966144,
            "blocktime": 1337966144
        }
```

* for failed case

```javascript
{ status: 400, msg: 'errors', data: err }
```

## Get Bitcoin address related transaction by offset, count, order
```
 POST /address/txs
```

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
address | String | YES | address
offset | Number | NO | offset, default: 0
count | Number | NO | count, default: 10
order | Boolean | NO | default: 0, 0 => newest first, 1 => oldest first

### RETURN

* for successed case

```javascript
{ status: 200, msg: 'sccuess', data: [txs] }

tx: {
            "txid": "3bf8c518a7a1187287516da67cb96733697b1d83eb937e68ae39bd4c08e563b7",
            "hash": "3bf8c518a7a1187287516da67cb96733697b1d83eb937e68ae39bd4c08e563b7",
            "version": 1,
            "size": 126,
            "vsize": 126,
            "weight": 504,
            "locktime": 0,
            "vin": [
                {
                    "coinbase": "0440bebf4f0122172f503253482f49636549726f6e2d51432d6d696e65722f",
                    "sequence": 4294967295
                }
            ],
            "vout": [
                {
                    "value": 50,
                    "n": 0,
                    "scriptPubKey": {
                        "asm": "03a5f981bf546b95152ed6695bc50edd0b8db3afb48839b9d58714519e5bdd1f95 OP_CHECKSIG",
                        "hex": "2103a5f981bf546b95152ed6695bc50edd0b8db3afb48839b9d58714519e5bdd1f95ac",
                        "reqSigs": 1,
                        "type": "pubkey",
                        "addresses": [
                            "mw8BoejnFJmntv3PjKAcPbuB6PMsBnAGDQ"
                        ]
                    }
                }
            ],
            "hex": "01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff1f0440bebf4f0122172f503253482f49636549726f6e2d51432d6d696e65722fffffffff0100f2052a01000000232103a5f981bf546b95152ed6695bc50edd0b8db3afb48839b9d58714519e5bdd1f95ac00000000",
            "blockhash": "00000000373403049c5fff2cd653590e8cbe6f7ac639db270e7d1a7503d698df",
            "confirmations": 1209804,
            "time": 1337966144,
            "blocktime": 1337966144
        }
```

* for failed case

```javascript
{ status: 400, msg: 'errors', data: err }
```
