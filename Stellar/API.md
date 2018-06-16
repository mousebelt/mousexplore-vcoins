# Public Rest API for Stellar Node
Stellar apis

# Summary
[Get ledgers](#get-ledgers)  
[Get transactions](#get-transactions)  
[Get ledger by sequence or hash](#get-ledger-by-sequence-or-hash)  
[Get account information by accountID](#get-account-information-by-accountid)  
[Post Transaction](#post-transaction)  
[Get Latest operations](#get-latest-operations)  

[Get transactions by ledger](#get-transactions-by-ledger)  
[Get operations by transaction](#get-operations-by-transaction)  
[Get transaction by transaction hash](#get-transaction-by-transaction-hash)  
[Get operations by accountID](#get-operations-by-accountid)  
[Get transactions by account](#get-transactions-by-account)  
[Get payments by account](#get-payments-by-account)  
[Get Offers by account](#get-offers-by-account)  
[Get effects by account](#get-effects-by-account)  
[Get Latest effects](#get-latest-effects)  


***

# API Details

## Get ledgers

```
GET /api/v1/ledgers
```
Get ledger list.

### QUERY PARAMS

Name | Type | Mandatory | Default | Description
------------ | ------------ | ------------ | ------------ | ------------
count | Number | No | 10 | ledger count to get
order | Number | No | 0 | 0 => newest first, 1 => oldest first
cursor | String | No| 0 | 0 for first page, and next or prev value of response of this api


### RETURN

* for successed case
`status code:` 200

```javascript
{
	"status": 200,
	"msg": "success",
	"data": { 
		"next": "38693046837051392",
        "prev": "38693085491757056",
        "total": 9008936,
		result: [ledger]
	}
}

ledger = {
	"id": "60c6f04a605a79d386214c46775f02a850f13860dd336ed44e48cb2e964bd765",
	"paging_token": "38693085491757056",
	"hash": "60c6f04a605a79d386214c46775f02a850f13860dd336ed44e48cb2e964bd765",
	"prev_hash": "6ffaea6716c56d792e7f9f31191355b62a9454db4a0ec2240307baf652cef834",
	"sequence": 9008936,
	"transaction_count": 4,
	"operation_count": 48,
	"closed_at": "2018-05-17T09:04:35Z",
	"total_coins": "103927355953.6556009",
	"fee_pool": "1898328354.2316593",
	"base_fee_in_stroops": 100,
	"base_reserve_in_stroops": 5000000,
	"max_tx_set_size": 200,
	"protocol_version": 9,
	"header_xdr": "AAAACW/66mcWxW15Ln+fMRkTVbYqlFTbSg7CJAMHuvZSzvg0Xn3YSHB7YrP7YWziXaoUzUxQOQcsG+BaCVHrI/9wPNoAAAAAWv1FowAAAAAAAAAAonXt0GxxROR/l2yXHhQ3lWWcVXs2z++ZlJ0BZpnst3nLsM1CabXmJhg16YMxBpmYK8QRSaEQjiaEjcPD7hBh3gCJdygObD3LzKHX6QBDcTIgNdYxAAAAywAAAAAABhlSAAAAZABMS0AAAADIORwT2/1p/akUncaBeY/PhGpo10g0yo20+/6K1IRr2MQrUJpxoqHTizDJsmkOabKYhxI2Cn44fgM4OMsTcA28gkRVYvtG/DiPztct0Z3hhWAhKFy/HGS3lJ6mGwkyVR2WrynUSxzFDOgJ9lU4y3coHHDSucvnHfkbUeAwNZLhfSAAAAAA"
}
```

* for failed case

```javascript
{
	status: 400, msg: err_msg, data: error
}
```


## Get ledger by sequence or hash

```
GET /api/v1/ledger/:sequence
```

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
sequence | Number | YES | ledger sequence or hash

### RETURN

* for successed case
`status code:` 200

```javascript
{
	status: 200,
	"msg": "success",
	"data": ledger
}
```

* for failed case

```javascript
{
	status: 400, msg: err_msg, data: error
}
```


## Get transactions

GET /api/v1/transactions

### QUERY PARAMS

Name | Type | Mandatory | Default | Description
------------ | ------------ | ------------ | ------------ | ------------
count | Number | No | 10 | ledger count to get
order | Number | No | 0 | 0 => newest first, 1 => oldest first
cursor | String | No| 0 | 0 for first page, and next or prev value of response of this api


### RETURN

* for successed case
`status code:` 200

```javascript
{
	"status": 200,
	"msg": "success",
	"data": {
		"next": "38693072606871552",
        "prev": "38693085491773440",
        "result": [transaction]
	}
}

transaction = {
	"id": "93c2d119d15ee12cacaa12944dd0ba653da7cd8d5970a38968cbddd156d3308d",
	"paging_token": "38693085491773440",
	"hash": "93c2d119d15ee12cacaa12944dd0ba653da7cd8d5970a38968cbddd156d3308d",
	"ledger": 9008936,
	"created_at": "2018-05-17T09:04:35Z",
	"source_account": "GBILND6UWKZCYUE7YRZHS5DBEYM6U4R4SWO73PODLYZVXNKHS4NVSE5X",
	"source_account_sequence": "37676561222087438",
	"fee_paid": 100,
	"operation_count": 1,
	"envelope_xdr": "AAA==...",
	"result_xdr": "AAAAAAAAAGQAAAAAAAAAAQAAAAAAAAABAAAAAAAAAAA=",
	"result_meta_xdr": "AA=...",
	"fee_meta_xdr": "AAA==...",
	"memo_type": "none",
	"signatures": [
		"Hh+czcfw48I+Y5bRbdRBvO/k6/OXaLMGxRXZJwWjlPTl3ErLCT91EnWMdWo+ztwSbhSIZhHAikL2bFJJ1ORoBw=="
	]
}
```

* for failed case

```javascript
{ status: 400, msg: err_msg, data: error }
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

GET /api/v1/operations

### QUERY PARAMS

Name | Type | Mandatory | Default | Description
------------ | ------------ | ------------ | ------------ | ------------
count | Number | No | 10 | count of operations


### RETURN

* for successed case
`status code:` 200

```javascript
{
	status: 200,
	"msg": "success",
	"data": {
		prev: "38693085491765286",
		next: "38693085491773441",
		result: [
			{
				"transaction": "93c2d119d15ee12cacaa12944dd0ba653da7cd8d5970a38968cbddd156d3308d",
				"account": "GBILND6UWKZCYUE7YRZHS5DBEYM6U4R4SWO73PODLYZVXNKHS4NVSE5X",
				"type": "payment",
				"asset_type": "credit_alphanum12",
				"asset_code": "nCntGameCoin",
				"asset_issuer": "GDLMDXI6EVVUIXWRU4S2YVZRMELHUEX3WKOX6XFW77QQC6KZJ4CZ7NRB",
				"from": "GBILND6UWKZCYUE7YRZHS5DBEYM6U4R4SWO73PODLYZVXNKHS4NVSE5X",
				"to": "GC25MF2YFV2KTBVVVL7HT3PHAMGV7N46DVL75MJU4IVXSXVTAOIIHKCM",
				"amount": "1.0000000",
				"timestamp": "2018-05-17T09:04:35Z"
			},
			...
		]
	}
}
```

* for failed case

```javascript
{
	status: 400,
	msg: err_msg,
	data: error
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

GET /api/v1/account/:accountId


### RETURN

* for successed case
`status code:` 200

```javascript
{
"msg": "success",
"data":
        {   
		  "subentry_count": 1,
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
		  "thresholds": {
		    "low_threshold": 0,
		    "med_threshold": 0,
		    "high_threshold": 0
		  },
		  "signers": [
		    {
		      "public_key": "GBYLPSBGNBG2RNGOQ66RSSYLWOGD6MNYRFNEB4UH3QY6CBH5IPMPXIBH",
		      "weight": 1,
		      "key": "GBYLPSBGNBG2RNGOQ66RSSYLWOGD6MNYRFNEB4UH3QY6CBH5IPMPXIBH",
		      "type": "ed25519_public_key"
		    }
		  ],
		  "sequence": 344566789
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

## Post Transaction

POST /api/v1/transaction


Post transaction to stellar net

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
tx | String | YES | transaction data


### RETURN

* for successed case
`status code:` 200

```javascript
{
	"status": 200,
	"msg": "success",
	"data": result,
	],
        ...
}
```

* for failed case
`status code:` 400

```javascript
{
  status: 400, msg: err_msg, data: error
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
