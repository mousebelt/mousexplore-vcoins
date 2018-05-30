# Public Rest API for Stellar Node
Stellar apis

# Summary
[Get latest ledgers](#get-latest-ledgers)  
[Get ledger](#get-ledger)  
[Get Latest transactions](#get-latest-transactions)  
[Get transactions by ledger](#get-transactions-by-ledger)  
[Get Latest operations](#get-latest-operations)  
[Get operations by transaction](#get-operations-by-transaction)  
[Get transaction by transaction hash](#get-transaction-by-transaction-hash)  
[Get account information by accountID](#get-account-information-by-accountid)  
[Get operations by accountID](#get-operations-by-accountid)  
[Get transactions by account](#get-transactions-by-account)  
[Get payments by account](#get-payments-by-account)  
[Get Offers by account](#get-offers-by-account)  
[Get effects by account](#get-effects-by-account)  
[Get Latest effects](#get-latest-effects)  


***

# API Details

## Get latest ledgers

```
GET /api/v1/ledgers
```
Get latest ledger list.

### QUERY PARAMS

Name | Type | Mandatory | Default | Description
------------ | ------------ | ------------ | ------------ | ------------
count | Number | No | 10 | ledger count to get
cursor | String | No| 0 | 0 for first page, and next or prev value of response of this api


### RETURN

* for successed case
`status code:` 200

```javascript
{
"status": 200,
"msg": "success",
"next": "23442324233",
"prev": "23442324128",
"data": [
        {   
		  "sequence": "17730975", "timeStamp": "1472533979", 
		  "hash": "16a77f2b7d8d7a0204585ab1c3c73da73746dbb1e93ac2fd7e0ab8c3303657cf"
		  "transactions": 10, 
		  "operations": 22, 
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



## Get ledger

Get ledger info.
### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
ledger | String | YES | sequence or hash


### RETURN

* for successed case
`status code:` 200

```javascript
{
"msg": "success",
"data":{   
		  "sequence": "17730975", "timeStamp": "1472533979", 
		  "hash": "16a77f2b7d8d7a0204585ab1c3c73da73746dbb1e93ac2fd7e0ab8c3303657cf"
		  "prev_hash": "4b0b8bace3b2438b2404776ce57643966855487ba6384724a3c664c7aa4cd9e4",
		  "feePool": "1,437,655.968",
		  "baseFee": "100 stroops",
		  "baseReserve": "0.5 XLM",
		  "maxTransactions": "50 per ledger",
		  "totalCoins": "103,906,864,158.029",
		  "transactions": 10, 
		  "operations": 22, 
        },
}
```

* for failed case
`status code:` 400

```javascript
{
  "error": ""   //error message
}
```


## Get Latest transactions

GET /api/v1/transactions

### QUERY PARAMS

Name | Type | Mandatory | Default | Description
------------ | ------------ | ------------ | ------------ | ------------
count | Number | No | 10 | count of transactions
cursor | String | No | 0 | 0 for first page, and next or prev value of response of this api

### RETURN

* for successed case
`status code:` 200

```javascript
{
"msg": "success",
"next": "23442324233",
"next": "23442324128",
"data": [
        {   
		  "hash": "8febfdb00d2920f65af42d4f28d118742a95b0f3ea134ebd980cf302e7818317",
		  "account": "GARMAQQ45FYTFSCLBREX5M3JTTBZ5MWDMU5DOGZRHXU6SG2GX4CB7IAF",
		  "timeStamp": "2015-09-24T10:07:09Z",
		  "operations": 11,
		  "ledger": 17733198,
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


## Get transactions by ledger

/api/v1/ledger/txs

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
ledger | String | YES | sequence or hash


### RETURN

* for successed case
`status code:` 200

```javascript
{
"msg": "success",
"data": [
        {   
		  "hash": "8febfdb00d2920f65af42d4f28d118742a95b0f3ea134ebd980cf302e7818317",
		  "account": "GARMAQQ45FYTFSCLBREX5M3JTTBZ5MWDMU5DOGZRHXU6SG2GX4CB7IAF",
		  "timeStamp": "2015-09-24T10:07:09Z",
		  "operations": 11,
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


## Get Latest operations

/api/v1/operations

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
count | Number | YES | count of operations


### RETURN

* for successed case
`status code:` 200

```javascript
{
"msg": "success",
"data": [
        {   
		   "transaction": "8febfdb00d2920f65af42d4f28d118742a95b0f3ea134ebd980cf302e7818317",
		   "account": "GARMAQQ45FYTFSCLBREX5M3JTTBZ5MWDMU5DOGZRHXU6SG2GX4CB7IAF",
		   "type": "payment",
		   "asset_type": 'credit_alphanum12',
	       "asset_code": 'nCntGameCoin',
	       "asset_issuer": 'GDLMDXI6EVVUIXWRU4S2YVZRMELHUEX3WKOX6XFW77QQC6KZJ4CZ7NRB',
	       "from": 'GAK3NSB43EVCZKDH4PYGJPCVPOYZ7X7KIR3ZTWSYRKRMJWGG5TABM6TH',
	       "to": 'GCHKKQ5VWJBRQZHNMODO5BWYZKPNM2HDSJ26T4O644CNEQBYK7IXATKM',
	       "amount": '2.0000000'
		   "timeStamp": "2015-09-24T10:07:09Z",
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


## Get operations by transaction
/api/v1/txs/operations

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
txHash | String | YES | sequence or hash


### RETURN

* for successed case
`status code:` 200

```javascript
{
"msg": "success",
"data": [
        {   
		   "account": "GARMAQQ45FYTFSCLBREX5M3JTTBZ5MWDMU5DOGZRHXU6SG2GX4CB7IAF",
		   "type": "payment",
		   "asset_type": 'credit_alphanum12',
	       "asset_code": 'nCntGameCoin',
	       "asset_issuer": 'GDLMDXI6EVVUIXWRU4S2YVZRMELHUEX3WKOX6XFW77QQC6KZJ4CZ7NRB',
	       "from": 'GAK3NSB43EVCZKDH4PYGJPCVPOYZ7X7KIR3ZTWSYRKRMJWGG5TABM6TH',
	       "to": 'GCHKKQ5VWJBRQZHNMODO5BWYZKPNM2HDSJ26T4O644CNEQBYK7IXATKM',
	       "amount": '2.0000000'
		   "timeStamp": "2015-09-24T10:07:09Z"
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



## Get transaction by transaction hash

/api/v1/tx

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
txHash | String | YES | hash of transaction


### RETURN

* for successed case
`status code:` 200

```javascript
{
"msg": "success",
"data": {   
	   "timeStamp": "2015-09-24T10:07:09Z",
	   "ledger": 17733198,
	   "account": "GA4K4BUZ4SLAKQA5T2OE64FM3BWTUJXQQ3J4QPCEQBHCQZWQHRHGPPSO",
	   "fee": 0.00004,
	 },
}
```

* for failed case
`status code:` 400

```javascript
{
  "error": ""   //error message
}
```



## Get account information by accountID

/api/v1/account

Get overview from account

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
account | String | YES | account ID


### RETURN

* for successed case
`status code:` 200

```javascript
{
"msg": "success",
"data":
        {   
		  "subentry_count": 1,
		  "thresholds": {
		    "low_threshold": 0,
		    "med_threshold": 0,
		    "high_threshold": 0
		  },
		  "flags": {
		    "auth_required": false,
		    "auth_revocable": false
		  },
		  "balances": [
		    {
		      "balance": "49881.0000000",
		      "limit": "922337203685.4775807",
		      "asset_type": "credit_alphanum12",
		      "asset_code": "nCntGameCoin",
		      "asset_issuer": "GDLMDXI6EVVUIXWRU4S2YVZRMELHUEX3WKOX6XFW77QQC6KZJ4CZ7NRB"
		    },
		    {
		      "balance": "9999.9530300",
		      "asset_type": "native"
		    }
		  ],
		  "signers": [
		    {
		      "public_key": "GBYLPSBGNBG2RNGOQ66RSSYLWOGD6MNYRFNEB4UH3QY6CBH5IPMPXIBH",
		      "weight": 1,
		      "key": "GBYLPSBGNBG2RNGOQ66RSSYLWOGD6MNYRFNEB4UH3QY6CBH5IPMPXIBH",
		      "type": "ed25519_public_key"
		    }
		  ],
		  "data": {}
        },
}
```

* for failed case
`status code:` 400

```javascript
{
  "error": ""   //error message
}
```



## Get operations by accountID

/api/v1/account/operations


Get operations related to account

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
account | String | YES | account ID


### RETURN

* for successed case
`status code:` 200

```javascript
{
"msg": "success",
"data": [
    {   
		  "account": "GARMAQQ45FYTFSCLBREX5M3JTTBZ5MWDMU5DOGZRHXU6SG2GX4CB7IAF",
		  "timeStamp": "2015-09-24T10:07:09Z",
		  "type": 11,
		  "ledger": "payment",
    },
  ],
        ...
}
```

* for failed case
`status code:` 400

```javascript
{
  "error": ""   //error message
}
```

## Get transactions by account

/api/v1/account/txs

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
account | String | YES | account ID


### RETURN

* for successed case
`status code:` 200

```javascript
{
"msg": "success",
"data": [
        {   
		  "hash": "8febfdb00d2920f65af42d4f28d118742a95b0f3ea134ebd980cf302e7818317",
		  "ledger": 17733198,
		  "timeStamp": "2015-09-24T10:07:09Z",
		  "operations": 11,
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



## Get payments by account

/api/v1/account/payments

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
account | String | YES | account ID
count | Number | YES | count of transactions
cursor | String | YES | 0 for first page, and next or prev value of response of this api

### RETURN

* for successed case
`status code:` 200

```javascript
{
"msg": "success",
"next": "23442324233",
"next": "23442324128",
"data": [
        {   
        	"hash": "8febfdb00d2920f65af42d4f28d118742a95b0f3ea134ebd980cf302e7818317",
		   	"account": "GARMAQQ45FYTFSCLBREX5M3JTTBZ5MWDMU5DOGZRHXU6SG2GX4CB7IAF",
		   	"asset_type": 'credit_alphanum12',
	       	"asset_code": 'nCntGameCoin',
	       	"asset_issuer": 'GDLMDXI6EVVUIXWRU4S2YVZRMELHUEX3WKOX6XFW77QQC6KZJ4CZ7NRB',
	       	"from": 'GAK3NSB43EVCZKDH4PYGJPCVPOYZ7X7KIR3ZTWSYRKRMJWGG5TABM6TH',
	       	"to": 'GCHKKQ5VWJBRQZHNMODO5BWYZKPNM2HDSJ26T4O644CNEQBYK7IXATKM',
	       	"amount": '2.0000000'
		   	"timeStamp": "2015-09-24T10:07:09Z"
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



## Get Offers by account

/api/v1/account/offers

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
account | String | YES | account ID
count | Number | YES | count of transactions
cursor | String | YES | 0 for first page, and next or prev value of response of this api

### RETURN

* for successed case
`status code:` 200

```javascript
{
"msg": "success",
"next": "23442324233",
"next": "23442324128",
"data": [
        {   
              "sell": XLM,
               "buy": USD,
               "amount": 4622.8710000,
               "price": 0.364310
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




## Get effects by account

/api/v1/account/effects

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
account | String | YES | account ID
count | Number | YES | count of transactions
cursor | String | YES | 0 for first page, and next or prev value of response of this api

### RETURN

* for successed case
`status code:` 200

```javascript
{
"msg": "success",
"next": "23442324233",
"next": "23442324128",
"data": [
        {   
        	"hash": "8febfdb00d2920f65af42d4f28d118742a95b0f3ea134ebd980cf302e7818317",
		   	"account": "GARMAQQ45FYTFSCLBREX5M3JTTBZ5MWDMU5DOGZRHXU6SG2GX4CB7IAF",
		   	"asset_type": 'credit_alphanum12',
	       	"asset_code": 'nCntGameCoin',
	       	"asset_issuer": 'GDLMDXI6EVVUIXWRU4S2YVZRMELHUEX3WKOX6XFW77QQC6KZJ4CZ7NRB',
	       	"from": 'GAK3NSB43EVCZKDH4PYGJPCVPOYZ7X7KIR3ZTWSYRKRMJWGG5TABM6TH',
	       	"to": 'GCHKKQ5VWJBRQZHNMODO5BWYZKPNM2HDSJ26T4O644CNEQBYK7IXATKM',
	       	"amount": '2.0000000'
		   	"timeStamp": "2015-09-24T10:07:09Z"
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



## Get Latest effects

/api/v1/effects

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
count | Number | YES | count of transactions
cursor | String | YES | 0 for first page, and next or prev value of response of this api

### RETURN

* for successed case
`status code:` 200

```javascript
{
"msg": "success",
"next": "23442324233",
"next": "23442324128",
"data": [
        {   
        	"hash": "8febfdb00d2920f65af42d4f28d118742a95b0f3ea134ebd980cf302e7818317",
            "account": "GD5WH732DRJWCTMQLNC57UECV44WORONOZ7L3TALNRV3TGFSGIXSNKCB",
            "type": "account_debited",
            "type_i": 3,
            "asset_type": "credit_alphanum4",
            "asset_code": "ATN",
            "asset_issuer": "GCAUZH5OGE4HU4NZPBXX67A66D6DVR2IIZMT2BU635UN5PJXWUPUO3A7",
            "amount": "1.0000000",
            "timestamp": "2018-05-12T14:05:15Z",
            "transaction_hash": "e67f79d3eae73a661f21cccdf719b05deec49419e47eb9e5431a3f048c2fa5ac"
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