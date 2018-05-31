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
 GET /tx/:txid
```

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
txid | String | YES | txid

### RETURN

* for successed case

```javascript
{ status: 200, msg: 'sccuess', data: tx }
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
{ status: 200, msg: 'sccuess', data: [txs] }
```

* for failed case

```javascript
{ status: 400, msg: 'errors', data: err }
```
