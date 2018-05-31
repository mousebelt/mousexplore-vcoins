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
[Get transaction details by txid](#get-transaction-details-by-txid)  

[Get address related transaction by offset, count, order](#get-address-related-transaction-by-offset-count-order)  


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
{ status: 200, msg: 'sccuess', data: [transaction] }

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
                    "sequence": 4294967295
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
            "tx": [transaction],
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
{ status: 200, msg: 'sccuess', data: { total, [transaction] } }
```

* for failed case

```javascript
{ status: 400, msg: 'errors', data: err }
```
