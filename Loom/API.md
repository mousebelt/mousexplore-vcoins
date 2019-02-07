# Public Rest API for Loom Node

Prefix  | Date    | Changes
--------|---------|----------------
/api/v1 |         | Initial deploy

 - [Data Types](#data-types)

# Summary
[Get server working status](#get-server-working-status)  
[Get db working status](#get-db-working-status)  
[Get rpc working status](#get-rpc-working-status)  
[Get out of syncing status](#get-out-of-syncing-status)  

[Get block list from offset and count](#get-block-list-from-offset-and-count)  
[Get block by hash or height](#get-block-by-hash-or-height)  
[Get block details by hash or height](#get-block-details-by-hash-or-height)  
[Get transaction list by offset, count, order](#get-transaction-list-by-offset-count-order)  
[Get transaction from hash](#get-transaction-from-hash)  

# Data Types
Only *string* and *object* may be null.

API Type         | JSON Type  | Note
---------------- |------------|-------
string           | string     | Nullable
object           | object     | Nullable
array            | array      |
integer          | number     | 
float            | number     | 
bignum           | string     | Hex format *"0xNNN..."*, use BigNumber for Javascript
hex_string       | string     | Hex format *"0xNNN..."*
boolean          | boolean    |
eth_date         | integer    | Seconds since Unix epoch
datetime         | string     | ISO 8601 UTC datetime: *YYYY-MM-DDThh:mm:ss*
url              | string     | Resource link
block_brief      | object     | [Block brief data](#block-brief-data)
transaction_brif | object     | [Transaction brief data](#transaction-brief-data)


### Common Objects
#### Block brief data
```
{
    "blockNumber": <hex_string>,
    "transactionHash": <hex_string>,
    "parentHash": <hex_string>,
    "logsBloom": <hex_string>,
    "timestamp": <eth_date>,
    "transactions": [<transaction_brief>, ...],
    "gasLimit": <integer>,
    "gasUsed": <integer>,
    "size": <integer>,
    "number": <integer>
}
```
#### Transaction brief data
```
{
    "hash": <hex_string>,
    "nonce": <integer>,
    "blockHash": <hex_string>,
    "blockNumber": <integer>,
    "transactionIndex": <integer>,
    "from": <hex_string>,
    "to": <hex_string>,
    "value": <integer_string>,
    "gas": <integer>,
    "gasPrice": <integer_string>,
    "gasPrice": <integer>,
    "input": <hex_string>
}
```

# API Details


## Get server working status
```
 GET /monitor
```

* for successed case
`status 200`
```javascript
{ result: 'ok', message: 'Server is working now !' }
```
* for failed case
`status: 400`


## Get db working status
```
 GET /monitor/db
```

* for successed case
```javascript
{ result: 'ok', message: "Db is working now !" }
```

* for failed case
status: 400
```javascript
{ result: 'error', message: 'Db is not working now !' }
```


## Get rpc working status
```
 GET /monitor/rpc
```

* for successed case
```javascript
{ result: 'ok', data: { net_version: <net_version> } }
```

* for failed case
status: 400
```javascript
{ result: 'error', message: 'node rpc is not working' }
```

## Get out of syncing status
```
 GET /monitor/syncing
```

* for successed case

status: 200
```javascript
{
    "result": "ok"
}
```

* for failed case

status: 400
```javascript
{ result: 'error', msg: error_message, error: error_details }
```

## Get Block list from offset and count
```
 GET /blocks
```

Get block list in latest order from offset and count.

### QUERY PARAMS

Name   | Type   | Mandatory | Default | Description
------ | ------ | --------- | ------- | ------------
offset | Number | No        | 0       | start block number
count  | Number | No        | 10      | count of blocks to get 

### RETURN
* for successed case
`status code:` 200
```javascript
{ result: 'ok', data: { total: <integer>, blocks: [<block_brief>, ...] } }
```

* for failed case
`status code:` 400
```javascript
{
  "result": "error", "message": <string>
}
```

## Get Block by hash or height
```
 GET /block/:hash
```

Get block by hash or height.
### QUERY PARAMS
Name | Type   | Mandatory | Description
---- | ------ | --------- | ------------
hash | string | YES       | block hash or block height
### RETURN
* for successed case
`status code:` 200
```javascript
{ "result": "ok", "data": { "block": <block_brief> } }
```
* for failed case
`status code:` 400
```javascript
{ "result": "error", "message": <string> }
```

## Get block details by hash or height
```
 GET /blockdetails/:hash
```

Get block details by hash or height
### QUERY PARAMS
Name | Type   | Mandatory | Description
---- | ------ | --------- | ------------
hash | string | YES       | block hash or block height
### RETURN
* for successed case
`status code:` 200
```javascript
{ "result": "ok", "data": { "block": <block_details> } }
```
* for failed case
`status code:` 400
```javascript
{ "result": "error", "message": <string> }
```

## Get transaction list by offset, count, order
```
 GET /transactions
```

Get transaction list.
### QUERY PARAMS
Name     | Type   | Mandatory | Default | Description
-------- | ------ | --------- | ------- | ------------
contract | String | NO        | 0       | address of specified contract
offset   | Number | NO        | 0       | offset
count    | Number | NO        | 10      | transaction count
order    | Number | NO        | 0       | 0 => newest first, 1 => oldest first

### RETURN
* for successed case
`status code:` 200
```javascript
{
    "result": "ok",
    "data": { "total": <integer>, "transactions": [<transaction_brief>, ...] }
}
```
* for failed case
`status code:` 400
```javascript
{ "result": "error", "message": <string> }
```

## Get transaction from hash
```
 GET /tx/:hash
```

Get transaction from hash
### QUERY PARAMS
Name | Type   | Mandatory | Description
---- | ------ | --------- | ------------
hash | String | YES       | transaction hash
### RETURN
* for successed case
`status code:` 200
```javascript
{ "result": "ok", "data": { "transaction": <transaction_data> } }
```
* for failed case
`status code:` 400
```javascript
{ "result": "error", "message": <string> }
```
