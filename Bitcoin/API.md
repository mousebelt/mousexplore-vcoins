# Public Rest API for Bitcoin Node
json-rpc client api list
https://en.bitcoin.it/wiki/Original_Bitcoin_client/API_calls_list

vcoin apis  
>api prefix: '/api/v1'  

# Summary
[Get server working status](#get-server-working-status)  
[Get db working status](#get-db-working-status)  
[Get rpc working status](#get-rpc-working-status)  
[Get latest blocks from offset and count](#get-latest-blocks-from-offset-and-count)  
[Get transactions by offset, count, order](#get-transactions-by-offset-count-order)  
[Get block by hash or height](#get-block-by-hash-or-height)  
[Get block details by hash or height](#get-block-details-by-hash-or-height)  
[Get transaction by txid](#get-transaction-by-txid)  
[Get transaction details by txid](#get-transaction-details-by-txid)  
[Get address related transaction by offset, count, order](#get-address-related-transaction-by-offset-count-order)  
[Search](#search)  
[Get balance](#get-balance)  


***

# Utility APIs


## Get server working status
```
 GET /monitor
```

* for successed case

```javascript
{ status: 200, msg: "success", data: "Server is working now !" }
```

* for failed case

status: 400
```javascript
{ status: 400, msg: 'errors', data: err }
```


## Get db working status
```
 GET /monitor/db
```

* for successed case

```javascript
{ status: 200, msg: "success", data: "Db is working now !" }
```

* for failed case

status: 400
```javascript
{ status: 400, msg: 'errors', data: err }
```


## Get rpc working status
```
 GET /monitor/rpc
```

* for successed case

```javascript
{ status: 200, msg: "sccuess", data: info }
```

* for failed case

status: 400
```javascript
{ status: 400, msg: 'errors', data: err }
```


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
{ status: 200, msg: 'sccuess', data: { total, result: [block] } }

block = {
            "hash": "000000000000000000319967fddc5cd030ec5663914f237989043e467355a1e2",
            "confirmations": 2,
            "strippedsize": 917476,
            "size": 1094185,
            "weight": 3846613,
            "height": 525273,
            "version": 536870912,
            "versionHex": "20000000",
            "merkleroot": "1fc02f10960eac65367e0386c862961d48924dd20c0ec6d20559b8ca86f5b312",
            "tx": [
                "b5583f58890754e0dd8f781fd5ce970f41e55badc66fcaa20ca0225895d57674",
                "c6d3fb0132a19a6348980e7be10b0042e96a7c446b719364c1d9a98707532aef"
            ],
            "time": 1527764842,
            "mediantime": 1527763207,
            "nonce": 3743760219,
            "bits": "17415a49",
            "difficulty": 4306949573981.513,
            "chainwork": "000000000000000000000000000000000000000001e5f3b04dcb79cb4a9e8058",
            "previousblockhash": "00000000000000000019ea91ec076eafe1997b36beefb8408fecfb39331be920",
            "nextblockhash": "0000000000000000003a33c9c6358c87765cae31e5cb48c63ddc53c9d5b1df38"
        }
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
{ status: 200, msg: 'sccuess', data: { total, result: [txdetails] } } 

transaction =  {
            "txid": "56e7db1e3a768c93f01eea5da9a05e5a81456a4b3fac9e6be7259fbaf51896d6",
            "hash": "56e7db1e3a768c93f01eea5da9a05e5a81456a4b3fac9e6be7259fbaf51896d6",
            "version": 1,
            "size": 259,
            "vsize": 259,
            "locktime": 0,
            "vin": [
                {
                    "txid": "263b41e81125dc4af3d9a1cce67158587ce1d3b9609fa99d6ef3720c1dd14fab",
                    "vout": 0,
                    "scriptSig": {
                        "asm": "3046022100c0cf29040adeb2a2129a7727293e14b2b4e62244ba69e5f2f89fcd3f5d74aaab022100adc994726c5ced5d5585a42116195cab89f40e8feca44a1bf321fbf2503bb469[ALL] 04668b56640591d3bb5ab7de7ab0b02274637a7254ca70e48e2c498f121e1946d4b6dffa84f559aca1984a7c9824b15884d81304307167d920ab5eb9520ebadb3f",
                        "hex": "493046022100c0cf29040adeb2a2129a7727293e14b2b4e62244ba69e5f2f89fcd3f5d74aaab022100adc994726c5ced5d5585a42116195cab89f40e8feca44a1bf321fbf2503bb469014104668b56640591d3bb5ab7de7ab0b02274637a7254ca70e48e2c498f121e1946d4b6dffa84f559aca1984a7c9824b15884d81304307167d920ab5eb9520ebadb3f"
                    },
                    "sequence": 4294967295,
                    "address": {
                        "value": 0.94,
                        "n": 0,
                        "scriptPubKey": {
                            "asm": "OP_DUP OP_HASH160 ec50a57158bd1216679f50bba749f75f111ff5ea OP_EQUALVERIFY OP_CHECKSIG",
                            "hex": "76a914ec50a57158bd1216679f50bba749f75f111ff5ea88ac",
                            "reqSigs": 1,
                            "type": "pubkeyhash",
                            "addresses": [
                                "1NYX5fzzjGhEkbRhmEx9eTw3sojFu2mArJ"
                            ]
                        }
                    }
                }
            ],
            "vout": [
                {
                    "value": 126.69252632,
                    "n": 0,
                    "scriptPubKey": {
                        "asm": "OP_DUP OP_HASH160 96f868348e28e7646ed3c23176c09a469a5bf401 OP_EQUALVERIFY OP_CHECKSIG",
                        "hex": "76a91496f868348e28e7646ed3c23176c09a469a5bf40188ac",
                        "reqSigs": 1,
                        "type": "pubkeyhash",
                        "addresses": [
                            "1EmFwQ9cfJhzhnhaosZTzVmQ1e7CkjouB2"
                        ]
                    }
                }, ...
            ],
            "hex": "0100000001ab4fd11d0c72f36e9da99f60b9d3e17c585871e6cca1d9f34adc2511e8413b26000000008c493046022100c0cf29040adeb2a2129a7727293e14b2b4e62244ba69e5f2f89fcd3f5d74aaab022100adc994726c5ced5d5585a42116195cab89f40e8feca44a1bf321fbf2503bb469014104668b56640591d3bb5ab7de7ab0b02274637a7254ca70e48e2c498f121e1946d4b6dffa84f559aca1984a7c9824b15884d81304307167d920ab5eb9520ebadb3fffffffff02187425f3020000001976a91496f868348e28e7646ed3c23176c09a469a5bf40188ac00c41927000000001976a914d7e7e4afb57a3ce0c131dc255f532719c6c7fc3288ac00000000",
            "blockhash": "000000000000000d8049f9d729aa5735994b2c5a65b39aa0c7a7588d0dbb81d4",
            "confirmations": 393640,
            "time": 1308407762,
            "blocktime": 1308407762
        }
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

block = {
            "hash": "000000000000000000319967fddc5cd030ec5663914f237989043e467355a1e2",
            "confirmations": 2,
            "strippedsize": 917476,
            "size": 1094185,
            "weight": 3846613,
            "height": 525273,
            "version": 536870912,
            "versionHex": "20000000",
            "merkleroot": "1fc02f10960eac65367e0386c862961d48924dd20c0ec6d20559b8ca86f5b312",
            "tx": [txdetails],
            "time": 1527764842,
            "mediantime": 1527763207,
            "nonce": 3743760219,
            "bits": "17415a49",
            "difficulty": 4306949573981.513,
            "chainwork": "000000000000000000000000000000000000000001e5f3b04dcb79cb4a9e8058",
            "previousblockhash": "00000000000000000019ea91ec076eafe1997b36beefb8408fecfb39331be920",
            "nextblockhash": "0000000000000000003a33c9c6358c87765cae31e5cb48c63ddc53c9d5b1df38"
        }
```

* for failed case

```javascript
{ status: 400, msg: 'errors', data: err }
```


## Get transaction by txid
```
 GET /tx/:txid
```

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
txid | String | YES | txid

### RETURN

* for successed case

```javascript
{ status: 200, msg: 'sccuess', data: transaction }
```

* for failed case

```javascript
{ status: 400, msg: 'errors', data: err }
```

## Get transaction details by txid
```
 GET /txdetails/:txid
```

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
txid | String | YES | txid

### RETURN

* for successed case

```javascript
{ status: 200, msg: 'sccuess', data: txdetails }

txdetails = {
        "txid": "ebd04978a24bb39e1b3d60dba0d4363cae48a66101532ba3a0376e2b8ec9d751",
        "hash": "ebd04978a24bb39e1b3d60dba0d4363cae48a66101532ba3a0376e2b8ec9d751",
        "version": 2,
        "size": 226,
        "vsize": 226,
        "locktime": 0,
        "vin": [
            {
                "txid": "b349fe10539ed7df62d69c3cb96d801a25f0b5e8442793660fdacd08c1c40207",
                "vout": 1,
                "scriptSig": {
                    "asm": "3045022100f3448e427fcef9b63f56d4365bbcc6073166a3918d73f8feb6cc541c5a71f16b0220217fa75e5201d49850db2d258234db57e58ee36ae1de98375d6b496fddfb4c17[ALL] 03c38205e5b9b5cf8f91f90ca38d79a7ab6d3b168e1b25bd5f4be0d615f0b47a44",
                    "hex": "483045022100f3448e427fcef9b63f56d4365bbcc6073166a3918d73f8feb6cc541c5a71f16b0220217fa75e5201d49850db2d258234db57e58ee36ae1de98375d6b496fddfb4c17012103c38205e5b9b5cf8f91f90ca38d79a7ab6d3b168e1b25bd5f4be0d615f0b47a44"
                },
                "sequence": 4294967295,
                "address": {
                    "value": 67.15217239,
                    "n": 1,
                    "scriptPubKey": {
                        "asm": "OP_DUP OP_HASH160 d8e04f20c9a44ecc18656cb2bb58f2ff58a6dc54 OP_EQUALVERIFY OP_CHECKSIG",
                        "hex": "76a914d8e04f20c9a44ecc18656cb2bb58f2ff58a6dc5488ac",
                        "reqSigs": 1,
                        "type": "pubkeyhash",
                        "addresses": [
                            "1LmjfhrnJcq9Te3h7x7cDQcXPneqS1jTJc"
                        ]
                    }
                }
            }
        ],
        "vout": [
            {
                "value": 0.100297,
                "n": 0,
                "scriptPubKey": {
                    "asm": "OP_DUP OP_HASH160 a602a4bfa9cbe00e80be128973b407389e5177bd OP_EQUALVERIFY OP_CHECKSIG",
                    "hex": "76a914a602a4bfa9cbe00e80be128973b407389e5177bd88ac",
                    "reqSigs": 1,
                    "type": "pubkeyhash",
                    "addresses": [
                        "1G8nLXDHN33MTV2RG3A9grWPtdjWZc8WB2"
                    ]
                }
            }, ...
        ],
        "hex": "02000000010702c4c108cdda0f66932744e8b5f0251a806db93c9cd662dfd79e5310fe49b3010000006b483045022100f3448e427fcef9b63f56d4365bbcc6073166a3918d73f8feb6cc541c5a71f16b0220217fa75e5201d49850db2d258234db57e58ee36ae1de98375d6b496fddfb4c17012103c38205e5b9b5cf8f91f90ca38d79a7ab6d3b168e1b25bd5f4be0d615f0b47a44ffffffff02840a9900000000001976a914a602a4bfa9cbe00e80be128973b407389e5177bd88ac3384a78f010000001976a91488b10e923ba601f0560a9e934079ba40e3c5debc88ac00000000",
        "blockhash": "00000000000000000033d469c86c974d60cb12a3d58f305b1f8a1705469b378d",
        "confirmations": 4,
        "time": 1527771199,
        "blocktime": 1527771199
    }
}
```

* for failed case

```javascript
{ status: 400, msg: 'errors', data: err }
```


## Get address related transaction by offset, count, order
```
 GET /address/txs/:address
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
{ status: 200, msg: 'sccuess', data: { total, result: [txdetails] } }
```

* for failed case

```javascript
{ status: 400, msg: 'errors', data: err }
```


## Search
```
 GET /search/:key
```

key param can be txid or blockNo, blockHash, address.

### RETURN

* for successed case

```javascript
{ status: 200, msg: 'sccuess', data: { type } }

type = 'block'
type = 'transaction'
type = 'address'
```

* for failed case

```javascript
{ status: 400, msg: 'errors', data: err }
```

## Get balance
```
 GET /balance/:address
```

Get balance of the address

### RETURN

* for successed case

```javascript
{ 
    status: 200, 
    msg: 'sccuess', 
    data: { address, balance, n_tx }
}
```

* for failed case

```javascript
{ status: 400, msg: 'errors', data: err }
```
