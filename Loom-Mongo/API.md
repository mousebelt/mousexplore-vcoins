# Public Rest API for Loom Node

Prefix  | Date    | Changes
--------|---------|----------------
/api/v1 |         | Initial deploy

 - [Data Types](#data-types)

# Summary

## Monitor Apis
[Get server working status](#get-server-working-status)  
[Get db working status](#get-db-working-status)  
[Get rpc working status](#get-rpc-working-status)  
[Get out of syncing status](#get-out-of-syncing-status)  

## Loom Explorer Apis
[Get block list from offset and count](#get-block-list-from-offset-and-count)  
[Get block by hash or height](#get-block-by-hash-or-height)  
[Get block details by hash or height](#get-block-details-by-hash-or-height)  
[Get transaction list by offset, count, order](#get-transaction-list-by-offset-count-order)  
[Get transaction from hash](#get-transaction-from-hash)  
[Search](#search)  

## Game Explorer Apis
[Get game data](#get-game-data)  
[Get all game data](#get-all-game-data)  
[Get items of the game](#get-items-of-the-game)  
[Get all items](#get-all-items)  
[Search games](#search-games)  

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
game             | object     | [game data](#game-data)
item             | object     | [item data](#item-data)


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
#### Game data
```
{
    "rarityNames": [
        "Common",
        "Rare",
        "Super Rare",
        "Limited Edition",
        "Unique"
    ],
    "rarityPercs": [
        80,
        15,
        4,
        0.85,
        0.15
    ],
    "isWhitelisted": true,
    "_id": "5c6a07c96d0a17905f55d164",
    "gameAddr": "0x41Ca6FB527D1061f17CC977dBdE2407B8c722DF7",
    "__v": 0,
    "desc": "HTML5/JavaScript multiplayer game experiment.",
    "gameOwner": "0x7D5BEc74d5D72cf00BF359b89553D121F714B92d",
    "image": "BrowserQuest",
    "name": "BrowserQuest",
    "symbol": "BQG",
    "totalSupply": 0,
    "updated": "2019-02-18T01:44:51.843Z"
}
```
#### Item data
```
{
    "owners": [],
    "_id": "5c6a07a46d0a17905f55d0fa",
    "gameAddr": "0x773b0bE4844a76F9078bcC99edB41fC50CF60a2b",
    "tokenId": 0,
    "__v": 0,
    "cap": 0,
    "desc": "Token Description",
    "image": "Token Image",
    "name": "Token Name",
    "rarity": 1,
    "totalSupply": 0,
    "val": 100,
    "updated": "2019-02-18T02:02:06.017Z"
}
```


# Monitor Api Details

## Get server working status
```
 GET /monitor/service
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

# Loom Explorer Api Details
*Prefix: `/loom`*

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
Name     | Type   | Mandatory | Description
-------- | ------ | --------- | ------------
address  | String | NO        | address of specified contract
offset   | Number | NO        | offset. Default: 0
count    | Number | NO        | transaction count. Default: 10
order    | Number | NO        | default: 0. 0 => newest first, 1 => oldest first

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

## Search
```
 GET /search/:key
```

key param can be txid or blockNo, blockHash, address.
### RETURN
* for successed case
```javascript
{ "result": "ok", data: { type: <string> } }
type = 'block'
type = 'transaction'
type = 'address'
```
* for failed case
`status code:` 400
```javascript
{ "result": "error", "message": <string> }
```


# Game Explorer Api Details

*Prefix: `/games`*

## Get game data
```
 GET /data/:gameAddr
```

Get game data by address.
### QUERY PARAMS
Name     | Type   | Mandatory | Description
-------- | ------ | --------- | ------------
gameAddr | string | Yes       | game address
### RETURN
* for successed case
`status code:` 200
```javascript
{ result: 'ok', data: { game: <game> } }
```
* for failed case
`status code:` 400
```javascript
{ "result": "error", "message": <string> }
```

## Get all game data
```
 GET /data
```

Get all game data.
### RETURN
* for successed case
`status code:` 200
```javascript
{ result: 'ok', data: { games: [<game>, ...] } }
```
* for failed case
`status code:` 400
```javascript
{ "result": "error", "message": <string> }
```

## Get items of the game
```
 GET /items/:gameAddr
```

Get items of the game.
### QUERY PARAMS
Name     | Type   | Mandatory | Description
-------- | ------ | --------- | ------------
gameAddr | string | Yes       | game address
### RETURN
* for successed case
`status code:` 200
```javascript
{ result: 'ok', data: { tokens: [<item>, ...] } }
```
* for failed case
`status code:` 400
```javascript
{ "result": "error", "message": <string> }
```

## Get all items
```
 GET /items
```

Get all items.
### RETURN
* for successed case
`status code:` 200
```javascript
{ result: 'ok', data: { tokens: [<item>, ...] } }
```
* for failed case
`status code:` 400
```javascript
{ "result": "error", "message": <string> }
```
## Search games
```
 GET /search
```

Search games.
### QUERY PARAMS
Name | Type   | Mandatory | Description
---- | ------ | --------- | ------------
q    | string | No        | Search query
### RETURN
* for successed case
`status code:` 200
```javascript
{ result: 'ok', data: { games: [<game>, ...] } }
```
* for failed case
`status code:` 400
```javascript
{ "result": "error", "message": <string> }
```
