# Public Rest API for Bitcoin Node
json-rpc client api list
https://en.bitcoin.it/wiki/Original_Bitcoin_client/API_calls_list

## General API Information
* The base endpoint is: **/api/v1**
* All endpoints return a JSON object.

* For `GET` endpoints, parameters must be sent as a `query string`.
* For `POST`, `PUT`, and `DELETE` endpoints, the parameters may be sent as a
  `query string` or in the `request body` with content type
  `application/x-www-form-urlencoded`. You may mix parameters between both the
  `query string` and `request body` if you wish to do so.
* Parameters may be sent in any order.
* If a parameter sent in both the `query string` and `request body`, the
  `query string` parameter will be used.

## Endpoint security type
* Endpoint can only be accessed from specified client for provided REST APIs.
* Every APIs needs Authorization.

## getnewaddress
```
 POST /createaccount
```

Returns a new bitcoin address for receiving payments. If [account] is specified payments received with the address will be credited to [account].

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
account | String | NO | account

### RETURN

* for successed case

```javascript
{ status: 200, msg: 'sccuess', data: result }
```

* for failed case

```javascript
{ status: 400, msg: 'errors', data: err }
```

## setaccount
```
 POST /associateaddress
```

Sets the account associated with the given address. Assigning address that is already assigned to the same account will create a new address associated with that account.

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
address | String | YES | bitcoinaddress
account | String | YES | account


### RETURN


* for successed case

```javascript
{ status: 200, msg: 'sccuess', data: result }
```

* for failed case

```javascript
{ status: 400, msg: 'errors', data: err }
```

## settxfee
```
 POST /settxfee
```

`<fee>` is a real and is rounded to the nearest 0.00000001

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
fee | Number | YES | a real and rounded to the nearest 0.00000001


### RETURN

* for successed case

```javascript
{ status: 200, msg: 'sccuess', data: result }
```

* for failed case

```javascript
{ status: 400, msg: 'errors', data: err }
```


## getreceivedbyaccount
```
 POST /getreceivedbyaccount
```

[account] [minconf=1] 
Returns the total amount received by addresses with [account] in transactions with at least [minconf] confirmations. If [account] not provided return will include all transactions to all accounts. (version 0.3.24) 

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
account | String | NO | account
confirm | Number | NO | minconf


### RETURN

* for successed case

```javascript
{ status: 200, msg: 'sccuess', data: result }
```

* for failed case

```javascript
{ status: 400, msg: 'errors', data: err }
```


## getreceivedbyaddress
```
 POST /getreceivedbyaddress
```

`<bitcoinaddress> [minconf=1]`

Returns the amount received by `<bitcoinaddress>` in transactions with at least [minconf] confirmations. It correctly handles the case where someone has sent to the address in multiple transactions. Keep in mind that addresses are only ever used for receiving transactions. Works only for addresses in the local wallet, external addresses will always show 0. 

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
address | String | YES | bitcoinaddress
confirm | Number | NO | minconf


### RETURN

* for successed case

```javascript
{ status: 200, msg: 'sccuess', data: result }
```

* for failed case

```javascript
{ status: 400, msg: 'errors', data: err }
```

## getbalance
```
 GET /getaccountbalance/:account
```

[account] [minconf=1] 
If [account] is not specified, returns the server's total available balance.
If [account] is specified, returns the balance in the account. 

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
account | String | YES | account


### RETURN

* for successed case

```javascript
{ status: 200, msg: 'sccuess', data: result }
```

* for failed case

```javascript
{ status: 400, msg: 'errors', data: err }
```

## getbalance
```
 GET /getalltransactionsbyaccount/:address
```

get all transactions by account. (not tested)

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
address | String | YES | address


### RETURN

* for successed case

```javascript
{ status: 200, msg: 'sccuess', data: result }
```

* for failed case

```javascript
{ status: 400, msg: 'errors', data: err }
```

## getaccount
```
 GET /getaccount/:address
```

`<bitcoinaddress>`

Returns the account associated with the given address. 

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
address | String | YES | address


### RETURN

* for successed case

```javascript
{ status: 200, msg: 'sccuess', data: result }
```

* for failed case

```javascript
{ status: 400, msg: 'errors', data: err }
```

## getaccountaddress
```
 GET /getaccountaddress/:account
```

`<account>`

Returns the current bitcoin address for receiving payments to this account. If `<account>` does not exist, it will be created along with an associated new address that will be returned. 

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
account | String | YES | account


### RETURN

* for successed case

```javascript
{ status: 200, msg: 'sccuess', data: result }
```

* for failed case

```javascript
{ status: 400, msg: 'errors', data: err }
```

## getaddressesbyaccount
```
 GET /getaddressesbyaccount/:account
```

`<account>`

Returns the list of addresses for the given account. 

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
account | String | YES | account


### RETURN

* for successed case

```javascript
{ status: 200, msg: 'sccuess', data: result }
```

* for failed case

```javascript
{ status: 400, msg: 'errors', data: err }
```

## getblockcount
```
 GET /getblockcount
```

Returns the number of blocks in the longest block chain.

### RETURN

* for successed case

```javascript
{
    "status": 200,
    "msg": "sccuess",
    "data": 1297157
}
```

* for failed case

```javascript
{ status: 400, msg: 'errors', data: err }
```

## getbestblockhash
```
 GET /getbestblockhash
```

version 0.9 Returns the hash of the best (tip) block in the longest block chain.

### RETURN

* for successed case

```javascript
{
    "status": 200,
    "msg": "sccuess",
    "data": "00000000000679f684e1ecdf69b6b686f535cd77ee40e34a2a68b7b3f1b2505e"
}
```

* for failed case

```javascript
{ status: 400, msg: 'errors', data: err }
```

## getblock
```
 GET /getblock/:hash
```

`<hash>`

Returns information about the block with the given hash. 

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
hash | String | YES | hash


### RETURN

* for successed case

```javascript
{
    "status": 200,
    "msg": "sccuess",
    "data": {
        "hash": "00000000000679f684e1ecdf69b6b686f535cd77ee40e34a2a68b7b3f1b2505e",
        "confirmations": 1,
        "strippedsize": 52185,
        "size": 62557,
        "weight": 219112,
        "height": 1297157,
        "version": 536870912,
        "versionHex": "20000000",
        "merkleroot": "c8c4d4a271e41f7467142769e40e6c39aaed6037b21cc20682793bacacefa625",
        "tx": [
            "54f979cd229b0747fb7582480b1ec0abb432e0b1f7402d518b896ff82feac976",
            ...
        ],
        "time": 1525966830,
        "mediantime": 1525963479,
        "nonce": 3052428953,
        "bits": "1d00ffff",
        "difficulty": 1,
        "chainwork": "00000000000000000000000000000000000000000000003fc71d274e5462344a",
        "previousblockhash": "000000000000000e3e082765c2a1e1231f5a870911ea21f8125fd8e0fbd42c56"
    }
}
```

* for failed case

```javascript
{ status: 400, msg: 'errors', data: err }
```

## getblockhash
```
 GET /getblockhash/:index
```

`<index>`

Returns hash of block in best-block-chain at `<index>`; index 0 is the genesis block

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
index | Number | YES | index


### RETURN

* for successed case

```javascript
{
    "status": 200,
    "msg": "sccuess",
    "data": "00000000b873e79784647a6c82962c70d228557d24a747ea4d1b8bbe878e1206"
}
```

* for failed case

```javascript
{ status: 400, msg: 'errors', data: err }
```

## gettransaction
```
 GET /gettransaction/:txid
```

`<txid>`

Returns an object about the given transaction containing:

    "amount" : total amount of the transaction
    "confirmations" : number of confirmations of the transaction
    "txid" : the transaction ID
    "time" : time associated with the transaction[1].
    "details" - An array of objects containing:
        "account"
        "address"
        "category"
        "amount"
        "fee"
(not working on current version)

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
txid | String | YES | txid


### RETURN

* for successed case

```javascript
{ status: 200, msg: 'sccuess', data: result }
```

* for failed case

```javascript
{ status: 400, msg: 'errors', data: err }
```

## getrawtransaction
```
 GET /getrawtransaction/:txid
```

`<txid>`

Returns raw transaction representation for given transaction id. 

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
txid | String | YES | txid
verbose | Number | NO | verbose


### RETURN

* for successed case

```javascript
if verbose == 0,
{
    "status": 200,
    "msg": "sccuess",
    "data": "0100000001ef63f7b90f0a37c80090bcf75a94018bbb9c31905d3f3f0a1b31bfdb3e101ca4010000006b4830450221008b16cf55a57467ebb3d6fb0370428193dc914d29aa0812fb4f5a984c36b49cb70220769d63000df8964f411d3b2db383a32dddf3b8b0d8240033a7bf4d47c2bb82f1012103c53dd523b28307e384f6952e61428a5ca4ece665f9926e0aed63d67111f83da4ffffffff024b540101000000001976a914c0611bd7b1b8cd52e41b317134061bbcb6f6176d88ac405dc600000000001976a91419d1da92986db921307794714aeb64b34e46661688ac00000000"
}

if verbose = 1,
{
    "status": 200,
    "msg": "sccuess",
    "data": {
        "txid": "fcaacc7ae9dfadfe3b163374d901878474a601352a15514c58cf14b98a6a85a6",
        "hash": "6a738faa0a710cae19141b77354d72d432591928ce1fb0c69a535cd07ba456c5",
        "version": 1,
        "size": 247,
        "vsize": 166,
        "weight": 661,
        "locktime": 0,
        "vin": [
            {
                "txid": "d22e26ac229576e48de2a74d37462f78f85297ceba3d328f079461e065ab5c3b",
                "vout": 1,
                "scriptSig": {
                    "asm": "0014a3097be5226dba0475562577e5232c03eda3e421",
                    "hex": "160014a3097be5226dba0475562577e5232c03eda3e421"
                },
                "txinwitness": [
                    "30440220027a291cdfaa553370dbf7e4e25be662ccabcbfce1698887cbd74aa14b9bea2d02202bcc9ac49981a0ae4f8ad33f70343e11c82b1d15cf9e8eb733ac75fbcf46b3a601",
                    "0359b3ced1c1d207e5ccce21afa0fd593eb9fbe8e530f83c2f76c484788b018d47"
                ],
                "sequence": 4294967295
            }
        ],
        "vout": [
            {
                "value": 0.65,
                "n": 0,
                "scriptPubKey": {
                    "asm": "OP_HASH160 c69534bbbc565c2e97a57aca06205210123cad53 OP_EQUAL",
                    "hex": "a914c69534bbbc565c2e97a57aca06205210123cad5387",
                    "reqSigs": 1,
                    "type": "scripthash",
                    "addresses": [
                        "2NBMEXHD7fwZ6ezMvW3oy7eSSnpC6fUXYqX"
                    ]
                }
            },
            {
                "value": 580.83548413,
                "n": 1,
                "scriptPubKey": {
                    "asm": "OP_HASH160 fa321b1aa478b8a3ee09fe7f53f4194c37df4613 OP_EQUAL",
                    "hex": "a914fa321b1aa478b8a3ee09fe7f53f4194c37df461387",
                    "reqSigs": 1,
                    "type": "scripthash",
                    "addresses": [
                        "2NG48wfAUSvpH9APew7xqk7fgit1asi5pKy"
                    ]
                }
            }
        ],
        "hex": "010000000001013b5cab65e06194078f323dbace9752f8782f46374da7e28de4769522ac262ed20100000017160014a3097be5226dba0475562577e5232c03eda3e421ffffffff0240d2df030000000017a914c69534bbbc565c2e97a57aca06205210123cad5387fd9c0c860d00000017a914fa321b1aa478b8a3ee09fe7f53f4194c37df461387024730440220027a291cdfaa553370dbf7e4e25be662ccabcbfce1698887cbd74aa14b9bea2d02202bcc9ac49981a0ae4f8ad33f70343e11c82b1d15cf9e8eb733ac75fbcf46b3a601210359b3ced1c1d207e5ccce21afa0fd593eb9fbe8e530f83c2f76c484788b018d4700000000",
        "blockhash": "00000000000000ac6e4c8175812b40989ef630731b7a9c288eb4261a4ef1e147",
        "confirmations": 2,
        "time": 1525969510,
        "blocktime": 1525969510
    }
}
```

* for failed case

```javascript
{ status: 400, msg: 'errors', data: err }
```

## listaccounts
```
 GET /listaccounts
```

[minconf=1] 
Returns Object that has account names as keys, account balances as values.  

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------

### RETURN

* for successed case

```javascript
{ status: 200, msg: 'sccuess', data: result }
```

* for failed case

```javascript
{ status: 400, msg: 'errors', data: err }
```

## listsinceblock
```
 GET /listsinceblock/:blockhash
```

[blockhash] [target-confirmations]  
Get all transactions in blocks since block [blockhash], or all transactions if omitted. [target-confirmations] intentionally does not affect the list of returned transactions, but only affects the returned "lastblock" value. 

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
blockhash | String | YES | blockhash


### RETURN

* for successed case

```javascript
{ status: 200, msg: 'sccuess', data: result }
```

* for failed case

```javascript
{ status: 400, msg: 'errors', data: err }
```

## sendfrom
```
 POST /sendfrom
```

`<fromaccount> <tobitcoinaddress> <amount> [minconf=1] [comment] [comment-to]`

`<amount>` is a real and is rounded to 8 decimal places. Will send the given amount to the given address, ensuring the account has a valid balance using `[minconf]` confirmations. Returns the transaction ID if successful (not in JSON object).

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
fromaccount | String | YES | fromaccount
toaddress | String | YES | tobitcoinaddress
amount | Number | YES | amount
confrim | Number | YES | confrim

### RETURN

* for successed case

```javascript
{ status: 200, msg: 'sccuess', data: result }
```

* for failed case

```javascript
{ status: 400, msg: 'errors', data: err }
```

## sendmany
```
 POST /sendmany
```

`<fromaccount> {address:amount,...} [minconf=1] [comment]`

amounts are double-precision floating point numbers.

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
fromaccount | String | YES | fromaccount
toaddresses | Any | YES | {address:amount,...}
confrim | Number | YES | minconf


### RETURN

* for successed case

```javascript
{ status: 200, msg: 'sccuess', data: result }
```

* for failed case

```javascript
{ status: 400, msg: 'errors', data: err }
```

## sendtoaddress
```
 POST /sendtoaddress
```

`<bitcoinaddress> <amount> [comment] [comment-to]`

`<amount>` is a real and is rounded to 8 decimal places. Returns the transaction ID `<txid>` if successful.

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
toaddress | String | YES | toaddress
amount | Number | YES | amount
confrim | Number | YES | confrim

### RETURN

* for successed case

```javascript
{ status: 200, msg: 'sccuess', data: result }
```

* for failed case

```javascript
{ status: 400, msg: 'errors', data: err }
```

## listtransactions
```
 POST /listtransactions
```

`[account] [count=10] [from=0]`  
Returns up to [count] most recent transactions skipping the first [from] transactions for account [account]. If [account] not provided it'll return recent transactions from all accounts. 

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
account | String | YES | account
count | Number | YES | count
from | Number | YES | from


### RETURN

* for successed case

```javascript
{ status: 200, msg: 'sccuess', data: result }
```

* for failed case

```javascript
{ status: 400, msg: 'errors', data: err }
```

# Utility APIs

## Get latest blocks
```
 GET /blocks/latest/:count
```

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
count | Number | YES | count

### RETURN

* for successed case

```javascript
{ status: 200, msg: 'sccuess', data: [blocks] }

block: {
            "hash": "0000000000000171dd048645bbeee7e123093e5f4e68d38ed17fc24d34fa7142",
            "confirmations": 2,
            "strippedsize": 15715,
            "size": 18803,
            "weight": 65948,
            "height": 1297315,
            "version": 536870912,
            "versionHex": "20000000",
            "merkleroot": "c9f98a531dd34b0dede5969955f779b74ee8225a158d2fce099c7c998f5752ce",
            "tx": [
                "9eff7a269396f7a18c9424842bbc3b1d4837c3ec20b675e899c57b2393ef7971",
                ...
            ],
            "time": 1526058347,
            "mediantime": 1526057159,
            "nonce": 1487591789,
            "bits": "1a020231",
            "difficulty": 8352729.56295154,
            "chainwork": "0000000000000000000000000000000000000000000000400558f6e6826d654d",
            "previousblockhash": "00000000000001ba933c605a4ce4dfbb012c1587e77dc1580b4993160bcddbf0",
            "nextblockhash": "000000000000017caabb3ca758e7ad38be73e38d5d84f899fc07f0b7abe5234f"
        }
```

* for failed case

```javascript
{ status: 400, msg: 'errors', data: err }
```

## Get Bitcoin blocks from given block height with offset
```
 GET /blocks
```

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
height | Number | YES | height
count | Number | YES | count

### RETURN

* for successed case

```javascript
{ status: 200, msg: 'sccuess', data: [blocks] }

block: {
            "hash": "0000000000000171dd048645bbeee7e123093e5f4e68d38ed17fc24d34fa7142",
            "confirmations": 2,
            "strippedsize": 15715,
            "size": 18803,
            "weight": 65948,
            "height": 1297315,
            "version": 536870912,
            "versionHex": "20000000",
            "merkleroot": "c9f98a531dd34b0dede5969955f779b74ee8225a158d2fce099c7c998f5752ce",
            "tx": [
                "9eff7a269396f7a18c9424842bbc3b1d4837c3ec20b675e899c57b2393ef7971",
                ...
            ],
            "time": 1526058347,
            "mediantime": 1526057159,
            "nonce": 1487591789,
            "bits": "1a020231",
            "difficulty": 8352729.56295154,
            "chainwork": "0000000000000000000000000000000000000000000000400558f6e6826d654d",
            "previousblockhash": "00000000000001ba933c605a4ce4dfbb012c1587e77dc1580b4993160bcddbf0",
            "nextblockhash": "000000000000017caabb3ca758e7ad38be73e38d5d84f899fc07f0b7abe5234f"
        }
```

* for failed case

```javascript
{ status: 400, msg: 'errors', data: err }
```

## Get Bitcoin block info from given block height
```
 GET /block/:height
```

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
height | Number | YES | height

### RETURN

* for successed case

```javascript
{ status: 200, msg: 'sccuess', data: block }

block: {
            "hash": "0000000000000171dd048645bbeee7e123093e5f4e68d38ed17fc24d34fa7142",
            "confirmations": 2,
            "strippedsize": 15715,
            "size": 18803,
            "weight": 65948,
            "height": 1297315,
            "version": 536870912,
            "versionHex": "20000000",
            "merkleroot": "c9f98a531dd34b0dede5969955f779b74ee8225a158d2fce099c7c998f5752ce",
            "tx": [
                "9eff7a269396f7a18c9424842bbc3b1d4837c3ec20b675e899c57b2393ef7971",
                ...
            ],
            "time": 1526058347,
            "mediantime": 1526057159,
            "nonce": 1487591789,
            "bits": "1a020231",
            "difficulty": 8352729.56295154,
            "chainwork": "0000000000000000000000000000000000000000000000400558f6e6826d654d",
            "previousblockhash": "00000000000001ba933c605a4ce4dfbb012c1587e77dc1580b4993160bcddbf0",
            "nextblockhash": "000000000000017caabb3ca758e7ad38be73e38d5d84f899fc07f0b7abe5234f"
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