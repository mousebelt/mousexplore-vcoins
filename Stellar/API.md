# Public Rest API for Stellar Node
Stellar apis

# Summary
[Get ledgers](#get-ledgers)  
[Get transactions](#get-transactions)  
[Get latest operations](#get-latest-operations)  
[Get ledger by sequence](#get-ledger-by-sequence)  
[Get transactions by ledger sequence](#get-transactions-by-ledger-sequence)  
[Get transaction by transaction hash](#get-transaction-by-transaction-hash)  
[Get operations by transaction hash](#get-operations-by-transaction-hash)  
[Search by key](#search-by-key)  
[Get address balance](#get-address-balance)  
[Get account information by accountID](#get-account-information-by-accountid)  
[Post Transaction](#post-transaction)  
[Get transactions by account](#get-transactions-by-account)  
[Get operations by account](#get-operations-by-account)  

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
	"envelope_xdr": "AAAAAFC2j9SysixQn8RyeXRhJhnqcjyVnf29w14zW7VHlxtZAAAAZACF2qIAADMOAAAAAAAAAAAAAAABAAAAAAAAAAEAAAAAtdYXWC10qYa1qv557ecDDV+3nh1X/rE04it5XrMDkIMAAAACbkNudEdhbWVDb2luAAAAANbB3R4la0Re0aclrFcxYRZ6EvuynX9ctv/hAXlZTwWfAAAAAACYloAAAAAAAAAAAUeXG1kAAABAHh+czcfw48I+Y5bRbdRBvO/k6/OXaLMGxRXZJwWjlPTl3ErLCT91EnWMdWo+ztwSbhSIZhHAikL2bFJJ1ORoBw==",
	"result_xdr": "AAAAAAAAAGQAAAAAAAAAAQAAAAAAAAABAAAAAAAAAAA=",
	"result_meta_xdr": "AAAAAAAAAAEAAAAEAAAAAwCJdygAAAABAAAAAFC2j9SysixQn8RyeXRhJhnqcjyVnf29w14zW7VHlxtZAAAAAm5DbnRHYW1lQ29pbgAAAADWwd0eJWtEXtGnJaxXMWEWehL7sp1/XLb/4QF5WU8FnwAAATmpltyAf/////////8AAAABAAAAAAAAAAAAAAABAIl3KAAAAAEAAAAAULaP1LKyLFCfxHJ5dGEmGepyPJWd/b3DXjNbtUeXG1kAAAACbkNudEdhbWVDb2luAAAAANbB3R4la0Re0aclrFcxYRZ6EvuynX9ctv/hAXlZTwWfAAABOaj+RgB//////////wAAAAEAAAAAAAAAAAAAAAMAiXcoAAAAAQAAAAC11hdYLXSphrWq/nnt5wMNX7eeHVf+sTTiK3leswOQgwAAAAJuQ250R2FtZUNvaW4AAAAA1sHdHiVrRF7RpyWsVzFhFnoS+7Kdf1y2/+EBeVlPBZ8AAAE5klfvAH//////////AAAAAQAAAAAAAAAAAAAAAQCJdygAAAABAAAAALXWF1gtdKmGtar+ee3nAw1ft54dV/6xNOIreV6zA5CDAAAAAm5DbnRHYW1lQ29pbgAAAADWwd0eJWtEXtGnJaxXMWEWehL7sp1/XLb/4QF5WU8FnwAAATmS8IWAf/////////8AAAABAAAAAAAAAAA=",
	"fee_meta_xdr": "AAAAAgAAAAMAiXcnAAAAAAAAAABQto/UsrIsUJ/Ecnl0YSYZ6nI8lZ39vcNeM1u1R5cbWQAAABdIYvbsAIXaogAAMw0AAAABAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAEAiXcoAAAAAAAAAABQto/UsrIsUJ/Ecnl0YSYZ6nI8lZ39vcNeM1u1R5cbWQAAABdIYvaIAIXaogAAMw4AAAABAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAA==",
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
				"id": "38693085491773441",
                "paging_token": "38693085491773441",
                "source_account": "GBILND6UWKZCYUE7YRZHS5DBEYM6U4R4SWO73PODLYZVXNKHS4NVSE5X",
                "type": "payment",
                "type_i": 1,
                "created_at": "2018-05-17T09:04:35Z",
                "transaction_hash": "93c2d119d15ee12cacaa12944dd0ba653da7cd8d5970a38968cbddd156d3308d",
                "asset_type": "credit_alphanum12",
                "asset_code": "nCntGameCoin",
                "asset_issuer": "GDLMDXI6EVVUIXWRU4S2YVZRMELHUEX3WKOX6XFW77QQC6KZJ4CZ7NRB",
                "from": "GBILND6UWKZCYUE7YRZHS5DBEYM6U4R4SWO73PODLYZVXNKHS4NVSE5X",
                "to": "GC25MF2YFV2KTBVVVL7HT3PHAMGV7N46DVL75MJU4IVXSXVTAOIIHKCM",
                "amount": "1.0000000"
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


## Get ledger by sequence

```
GET /api/v1/ledger/:sequence
```

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
sequence | Number | YES | ledger sequence

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


## Get transactions by ledger sequence

GET /api/v1/ledger/txs/:sequence

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
sequence | String | YES | ledger sequence


### RETURN

* for successed case
`status code:` 200

```javascript
{
	"status": 200,
    "msg": "success",
    "data": {
        "total": 4,
        "result": [{
			"id": "1e0878471ae283b4d571279f2dde3472682b75cc3ee13ed42e577f30df3ae305",
			"paging_token": "38693085491761152",
			"hash": "1e0878471ae283b4d571279f2dde3472682b75cc3ee13ed42e577f30df3ae305",
			"created_at": "2018-05-17T09:04:35Z",
			"source_account": "GBBPUGFZQCQX4MCU5SJZECQZCAISVI6EQXQSW2MNJXPCK3QVSWGYYAA7",
			"source_account_sequence": "26088580543788834",
			"fee_paid": 100,
			"operation_count": 1,
			"envelope_xdr": "AAAAAEL6GLmAoX4wVOyTkgoZEBEqo8SF4StpjU3eJW4VlY2MAAAAZABcr20AAbciAAAAAAAAAAEAAAAVUDowLjA3NzIyODgyMTUyODgyMzA0AAAAAAAAAQAAAAAAAAABAAAAADq6ZK+15hYax6Lvzu03rl20FuNebgE1rt2f4/q6WkXQAAAAAlppZkNvaW4AAAAAAAAAAABC+hi5gKF+MFTsk5IKGRARKqPEheEraY1N3iVuFZWNjAAAAAAAAYagAAAAAAAAAAEVlY2MAAAAQIFezbpx2pl9s4obWe9j8nvjrfMwoyhI8GzW/ekpegy/WOWEUVJ44SUsQNrlJyBeE5aHLrMKL8nPbKUsv4czLws=",
			"result_xdr": "AAAAAAAAAGQAAAAAAAAAAQAAAAAAAAABAAAAAAAAAAA=",
			"result_meta_xdr": "AAAAAAAAAAEAAAACAAAAAwCJdycAAAABAAAAADq6ZK+15hYax6Lvzu03rl20FuNebgE1rt2f4/q6WkXQAAAAAlppZkNvaW4AAAAAAAAAAABC+hi5gKF+MFTsk5IKGRARKqPEheEraY1N3iVuFZWNjAAAAAAEHmHgf/////////8AAAABAAAAAAAAAAAAAAABAIl3KAAAAAEAAAAAOrpkr7XmFhrHou/O7TeuXbQW415uATWu3Z/j+rpaRdAAAAACWmlmQ29pbgAAAAAAAAAAAEL6GLmAoX4wVOyTkgoZEBEqo8SF4StpjU3eJW4VlY2MAAAAAAQf6IB//////////wAAAAEAAAAAAAAAAA==",
			"fee_meta_xdr": "AAAAAgAAAAMAiXcnAAAAAAAAAABC+hi5gKF+MFTsk5IKGRARKqPEheEraY1N3iVuFZWNjAAADN7mdeIcAFyvbQABtyEAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAEAiXcoAAAAAAAAAABC+hi5gKF+MFTsk5IKGRARKqPEheEraY1N3iVuFZWNjAAADN7mdeG4AFyvbQABtyIAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAA==",
			"memo_type": "text",
			"memo": "P:0.07722882152882304",
			"signatures": [
				"gV7NunHamX2zihtZ72Pye+Ot8zCjKEjwbNb96Sl6DL9Y5YRRUnjhJSxA2uUnIF4Tlocuswovyc9spSy/hzMvCw=="
			],
			"ledger_attr": 9008936
		}, ...]
	}
			
}
```

* for failed case

```javascript
{
  status: 400, msg: err_msg, data: error
}
```


## Get transaction by transaction hash

GET /api/v1/tx/:hash

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
hash | String | YES | hash of transaction


### RETURN

* for successed case
`status code:` 200

```javascript
{
	"status": 200,
    "msg": "success",
    "data": {
		"id": "1e0878471ae283b4d571279f2dde3472682b75cc3ee13ed42e577f30df3ae305",
        "paging_token": "38693085491761152",
        "hash": "1e0878471ae283b4d571279f2dde3472682b75cc3ee13ed42e577f30df3ae305",
        "created_at": "2018-05-17T09:04:35Z",
        "source_account": "GBBPUGFZQCQX4MCU5SJZECQZCAISVI6EQXQSW2MNJXPCK3QVSWGYYAA7",
        "source_account_sequence": "26088580543788834",
        "fee_paid": 100,
        "operation_count": 1,
        "envelope_xdr": "AAAAAEL6GLmAoX4wVOyTkgoZEBEqo8SF4StpjU3eJW4VlY2MAAAAZABcr20AAbciAAAAAAAAAAEAAAAVUDowLjA3NzIyODgyMTUyODgyMzA0AAAAAAAAAQAAAAAAAAABAAAAADq6ZK+15hYax6Lvzu03rl20FuNebgE1rt2f4/q6WkXQAAAAAlppZkNvaW4AAAAAAAAAAABC+hi5gKF+MFTsk5IKGRARKqPEheEraY1N3iVuFZWNjAAAAAAAAYagAAAAAAAAAAEVlY2MAAAAQIFezbpx2pl9s4obWe9j8nvjrfMwoyhI8GzW/ekpegy/WOWEUVJ44SUsQNrlJyBeE5aHLrMKL8nPbKUsv4czLws=",
        "result_xdr": "AAAAAAAAAGQAAAAAAAAAAQAAAAAAAAABAAAAAAAAAAA=",
        "result_meta_xdr": "AAAAAAAAAAEAAAACAAAAAwCJdycAAAABAAAAADq6ZK+15hYax6Lvzu03rl20FuNebgE1rt2f4/q6WkXQAAAAAlppZkNvaW4AAAAAAAAAAABC+hi5gKF+MFTsk5IKGRARKqPEheEraY1N3iVuFZWNjAAAAAAEHmHgf/////////8AAAABAAAAAAAAAAAAAAABAIl3KAAAAAEAAAAAOrpkr7XmFhrHou/O7TeuXbQW415uATWu3Z/j+rpaRdAAAAACWmlmQ29pbgAAAAAAAAAAAEL6GLmAoX4wVOyTkgoZEBEqo8SF4StpjU3eJW4VlY2MAAAAAAQf6IB//////////wAAAAEAAAAAAAAAAA==",
        "fee_meta_xdr": "AAAAAgAAAAMAiXcnAAAAAAAAAABC+hi5gKF+MFTsk5IKGRARKqPEheEraY1N3iVuFZWNjAAADN7mdeIcAFyvbQABtyEAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAEAiXcoAAAAAAAAAABC+hi5gKF+MFTsk5IKGRARKqPEheEraY1N3iVuFZWNjAAADN7mdeG4AFyvbQABtyIAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAA==",
        "memo_type": "text",
        "memo": "P:0.07722882152882304",
        "signatures": [
            "gV7NunHamX2zihtZ72Pye+Ot8zCjKEjwbNb96Sl6DL9Y5YRRUnjhJSxA2uUnIF4Tlocuswovyc9spSy/hzMvCw=="
        ],
		"ledger_attr": 9008936
	}
}
```

* for failed case

```javascript
{
  status: 400, msg: err_msg, data: error
}
```


## Get operations by transaction hash
GET /api/v1/tx/operations/:hash

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
hash | String | YES | transaction hash


### RETURN

* for successed case
`status code:` 200

```javascript
{
    "status": 200,
    "msg": "success",
    "data": {
        "total": 1,
        "result": [
            {
                "id": "38693085491761153",
                "paging_token": "38693085491761153",
                "source_account": "GBBPUGFZQCQX4MCU5SJZECQZCAISVI6EQXQSW2MNJXPCK3QVSWGYYAA7",
                "type": "payment",
                "type_i": 1,
                "created_at": "2018-05-17T09:04:35Z",
                "transaction_hash": "1e0878471ae283b4d571279f2dde3472682b75cc3ee13ed42e577f30df3ae305",
                "asset_type": "credit_alphanum12",
                "asset_code": "ZifCoin",
                "asset_issuer": "GBBPUGFZQCQX4MCU5SJZECQZCAISVI6EQXQSW2MNJXPCK3QVSWGYYAA7",
                "from": "GBBPUGFZQCQX4MCU5SJZECQZCAISVI6EQXQSW2MNJXPCK3QVSWGYYAA7",
                "to": "GA5LUZFPWXTBMGWHULX453JXVZO3IFXDLZXACNNO3WP6H6V2LJC5BUV7",
                "amount": "0.0100000"
            }, ...
        ]
    }
}
```

* for failed case
`status code:` 400

```javascript
{
  "error": ""   //error message
}
```

## Search by key
GET /api/v1/search/:key

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
key | String | YES | transaction hash or leder sequence or address


### RETURN

* for successed case
`status code:` 200

```javascript
{ status: 200, msg: "success", data: { type } }

type = 'ledger'
type = 'transaction'
type = 'address'
```

* for failed case

```javascript
{
  status: 400, msg: err_msg, data: error
}
```


## Get address balance
GET /api/v1/balance/:address

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
address | String | YES | account address


### RETURN

* for successed case
`status code:` 200

```javascript
{ 
	status: 200, 
	msg: "success", 
	data: [
		{
			"balance": "99992764346.0000000",
			"limit": "922337203685.4775807",
			"asset_type": "credit_alphanum12",
			"asset_code": "nCntGameCoin",
			"asset_issuer": "GDLMDXI6EVVUIXWRU4S2YVZRMELHUEX3WKOX6XFW77QQC6KZJ4CZ7NRB"
		},
		{
			"balance": "9980.0503300",
			"asset_type": "native"
		}
	]
}
```

* for failed case

```javascript
{
  status: 400, msg: err_msg, data: error
}
```


## Get account information by accountID

GET /api/v1/account/:account


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

```javascript
{
  status: 400, msg: err_msg, data: error
}
```


## Post Transaction

POST /api/v1/transaction


Post transaction to stellar net

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
tx | String | YES | transaction data (envaloped signed transaction)


### RETURN

* for successed case
`status code:` 200

```javascript
{
	"status": 200,
	"msg": "success",
	"data": 
	 { _links: { transaction: [Object] },
		hash: '6d280ecd9b348b4b00353e0581f3ee5e15d7ac4e0e25ae96db292d3ebcf08321',
		ledger: 18580569,
		envelope_xdr: 'AAAAAJAPRYlUq6uVOK3tNVnmJwuHPdx4p6jWwrWjL5rf3xXPAAAAZAEZWrsAAAATAAAAAAAAAAAAAAABAAAAAAAAAAEAAAAA/E/doeW0oiCt2yrdaLLphBndHOUksU/FsFi1nI10EYwAAAAAAAAAAAQc20AAAAAAAAAAAd/fFc8AAABA3DQr6Ky3uCqdzinxLeUS8N5MfVXTIekFRk4ViAy/KGaR6xHummAjWy7pwNvQba3uqPZ3Luj2K37b4G6JlpeTCw==',
		result_xdr: 'AAAAAAAAAGQAAAAAAAAAAQAAAAAAAAABAAAAAAAAAAA=',
		result_meta_xdr: 'AAAAAAAAAAEAAAAEAAAAAwEbhFkAAAAAAAAAAJAPRYlUq6uVOK3tNVnmJwuHPdx4p6jWwrWjL5rf3xXPAAAAAAYoNDQBGVq7AAAAEwAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAQEbhFkAAAAAAAAAAJAPRYlUq6uVOK3tNVnmJwuHPdx4p6jWwrWjL5rf3xXPAAAAAAILWPQBGVq7AAAAEwAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAwEbgLwAAAAAAAAAAPxP3aHltKIgrdsq3Wiy6YQZ3RzlJLFPxbBYtZyNdBGMAAAAAAIv/2ABGuH2AAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAQEbhFkAAAAAAAAAAPxP3aHltKIgrdsq3Wiy6YQZ3RzlJLFPxbBYtZyNdBGMAAAAAAZM2qABGuH2AAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAA' } 
	 }

}
```

* for failed case
`status code:` 400

```javascript
{
  status: 400, msg: err_msg, data: error
}
```


## Get operations by account

GET /api/v1/address/operations/:account

### QUERY PARAMS

Name | Type | Mandatory | Default | Description
------------ | ------------ | ------------ | ------------ | ------------
account | String | YES | undefined | account ID
count | Number | NO | 10 | result count
cursor | String | NO | undefined | cursor. undefined means first page


### RETURN

* for successed case
`status code:` 200

```javascript
{
"msg": "success",
"data": {
	status: 200,
	"msg": "success",
	"data": {
        "next": "79702631529902081",
        "prev": "79702837688348673",
        "result": [{
			"id": "79702837688348673",
			"paging_token": "79702837688348673",
			"source_account": "GAQVT5YB7YJKKH6VVFFM7VKRSPL322CCI2YFRWL5MO77C77W26XKM3JB",
			"type": "create_passive_offer",
			"type_i": 4,
			"created_at": "2018-06-23T12:35:29Z",
			"transaction_hash": "12ee4696b9f8d4416136adf964766b3dc061cd261d235ebd9e18b706a128b3ea",
			"amount": "7598.1000000",
			"price": "0.7751940",
			"price_r": {
				"n": 387597,
				"d": 500000
			},
			"buying_asset_type": "native",
			"selling_asset_type": "credit_alphanum4",
			"selling_asset_code": "BCNY",
			"selling_asset_issuer": "GBCNYBHAAPDSU3UIHXXQTHYZVSBJBI4YUNWXMKJBCPDHTVYR75G6NFHD"
		}, ...]
	}
}
```


## Get transactions by account

GET /api/v1/address/txs/:account

### QUERY PARAMS

Name | Type | Mandatory | Default | Description
------------ | ------------ | ------------ | ------------ | ------------
account | String | YES | undefined | account ID
count | Number | NO | 10 | result count
cursor | String | NO | undefined | cursor. undefined means first page


### RETURN

* for successed case
`status code:` 200

```javascript
{
"msg": "success",
"data": {
	status: 200,
	"msg": "success",
	"data": {
		"next": "79751156070371328",
		"prev": "79751211904962560",
		"result": [{
			"id": "bf0944e40388a130e2d98817cf3b234f19797fb05cae67a3471c887d4a99599f",
			"paging_token": "79751211904962560",
			"hash": "bf0944e40388a130e2d98817cf3b234f19797fb05cae67a3471c887d4a99599f",
			"ledger": 18568526,
			"created_at": "2018-06-24T04:14:24Z",
			"source_account": "GAOVLZQ6YVJMIE46EAA2ZAYUU6S3ETKHDDFASFINH4YLWUZKXAUBYBB2",
			"source_account_sequence": "77833036561214610",
			"fee_paid": 100,
			"operation_count": 1,
			"envelope_xdr": "AAAAAB1V5h7FUsQTniABrIMUp6WyTUcYygkVDT8wu1MquCgcAAAAZAEUhLwABWySAAAAAAAAAAAAAAABAAAAAAAAAAMAAAAAAAAAAUJDTlkAAAAARNwE4APHKm6IPe8JnxmsgpCjmKNtdikhE8Z51xH/TeYAAAAAEMaWEAATo4cAD0JAAAAAAAAAAAAAAAAAAAAAASq4KBwAAABAu8kTqK0gyVCE2ExsvZhsMnvbd7ZFKekYxBtJSVv4VuVHD0ODusj/u7fyD8tcYdaRVFns69nEa9wYUw6HCnZHDg==",
			"result_xdr": "AAAAAAAAAGQAAAAAAAAAAQAAAAAAAAADAAAAAAAAAAEAAAAAIVn3Af4SpR/VqUrP1VGT171oQkawWNl9Y7/xf/bXrqYAAAAAAO7yFAAAAAFCQ05ZAAAAAETcBOADxypuiD3vCZ8ZrIKQo5ijbXYpIRPGedcR/03mAAAAABWkA8UAAAAAAAAAABDGlhAAAAACAAAAAA==",
			"result_meta_xdr": "AAAAAAAAAAEAAAAKAAAAAwEbVU4AAAAAAAAAAB1V5h7FUsQTniABrIMUp6WyTUcYygkVDT8wu1MquCgcAAAAM9HOxUMBFIS8AAVskgAAADEAAAABAAAAAMsdeGaJifMJxBIX3uwsq89nIeMdNALfJ9aJeQGHIGp9AAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAQEbVU4AAAAAAAAAAB1V5h7FUsQTniABrIMUp6WyTUcYygkVDT8wu1MquCgcAAAAM8EILzMBFIS8AAVskgAAADEAAAABAAAAAMsdeGaJifMJxBIX3uwsq89nIeMdNALfJ9aJeQGHIGp9AAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAwEbVU0AAAAAAAAAACFZ9wH+EqUf1alKz9VRk9e9aEJGsFjZfWO/8X/2166mAAAAYaAPMxUBCrl7AAAAGQAAAAUAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAQEbVU4AAAAAAAAAACFZ9wH+EqUf1alKz9VRk9e9aEJGsFjZfWO/8X/2166mAAAAYbDVySUBCrl7AAAAGQAAAAUAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAwEbVU0AAAABAAAAAB1V5h7FUsQTniABrIMUp6WyTUcYygkVDT8wu1MquCgcAAAAAUJDTlkAAAAARNwE4APHKm6IPe8JnxmsgpCjmKNtdikhE8Z51xH/TeYAAALEEXJZWn//////////AAAAAQAAAAAAAAAAAAAAAQEbVU4AAAABAAAAAB1V5h7FUsQTniABrIMUp6WyTUcYygkVDT8wu1MquCgcAAAAAUJDTlkAAAAARNwE4APHKm6IPe8JnxmsgpCjmKNtdikhE8Z51xH/TeYAAALEJxZdH3//////////AAAAAQAAAAAAAAAAAAAAAwEbVU0AAAABAAAAACFZ9wH+EqUf1alKz9VRk9e9aEJGsFjZfWO/8X/2166mAAAAAUJDTlkAAAAARNwE4APHKm6IPe8JnxmsgpCjmKNtdikhE8Z51xH/TeYAAAAIgktcVAAACRhOcqAAAAAAAQAAAAAAAAAAAAAAAQEbVU4AAAABAAAAACFZ9wH+EqUf1alKz9VRk9e9aEJGsFjZfWO/8X/2166mAAAAAUJDTlkAAAAARNwE4APHKm6IPe8JnxmsgpCjmKNtdikhE8Z51xH/TeYAAAAIbKdYjwAACRhOcqAAAAAAAQAAAAAAAAAAAAAAAwEbVU0AAAACAAAAACFZ9wH+EqUf1alKz9VRk9e9aEJGsFjZfWO/8X/2166mAAAAAADu8hQAAAABQkNOWQAAAABE3ATgA8cqbog97wmfGayCkKOYo212KSETxnnXEf9N5gAAAAAAAAAIgSlxlAAF6g0AB6EgAAAAAQAAAAAAAAAAAAAAAQEbVU4AAAACAAAAACFZ9wH+EqUf1alKz9VRk9e9aEJGsFjZfWO/8X/2166mAAAAAADu8hQAAAABQkNOWQAAAABE3ATgA8cqbog97wmfGayCkKOYo212KSETxnnXEf9N5gAAAAAAAAAIa4VtzwAF6g0AB6EgAAAAAQAAAAAAAAAA",
			"fee_meta_xdr": "AAAAAgAAAAMBG1VNAAAAAAAAAAAdVeYexVLEE54gAayDFKelsk1HGMoJFQ0/MLtTKrgoHAAAADPRzsWnARSEvAAFbJEAAAAxAAAAAQAAAADLHXhmiYnzCcQSF97sLKvPZyHjHTQC3yfWiXkBhyBqfQAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAEBG1VOAAAAAAAAAAAdVeYexVLEE54gAayDFKelsk1HGMoJFQ0/MLtTKrgoHAAAADPRzsVDARSEvAAFbJIAAAAxAAAAAQAAAADLHXhmiYnzCcQSF97sLKvPZyHjHTQC3yfWiXkBhyBqfQAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAA==",
			"memo_type": "none",
			"signatures": [
				"u8kTqK0gyVCE2ExsvZhsMnvbd7ZFKekYxBtJSVv4VuVHD0ODusj/u7fyD8tcYdaRVFns69nEa9wYUw6HCnZHDg=="
			]
		}, ...
	}
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
