# Install Ethereum node
## testnet
screen
>geth --testnet --networkid=3 –-syncmode=fast –-cache=1024 console --rpcapi eth,web3,personal
>ctrl+a and d will detach from new console.

## run as service

* using systemctl
https://medium.com/pactum/geth-node-via-ubuntu-quick-start-90e6cfea7a62

>cp ./geth.service /etc/systemd/system/geth.service
>systemctl daemon-reload
>systemctl enable geth.service
>systemctl start geth

* check the status
>service geth status

* attach
>geth attach ipc:/root/.ethereum/testnet/geth.ipc

# Public Rest API for Ethereum Node
# General API Information
* The base endpoint is: **http://**
* All endpoints return a JSON object.

* For `GET` endpoints, parameters must be sent as a `query string`.
* For `POST`, `PUT`, and `DELETE` endpoints, the parameters may be sent as a
  `query string` or in the `request body` with content type
  `application/x-www-form-urlencoded`. You may mix parameters between both the
  `query string` and `request body` if you wish to do so.
* Parameters may be sent in any order.
* If a parameter sent in both the `query string` and `request body`, the
  `query string` parameter will be used.

# Endpoint security type
* Endpoint can only be accessed from specified client for provided REST APIs.
* Every APIs needs Authorization.

# Get Balance
```
GET /api/get_address_balance/:address
```
Get balance of specified address as unit of ETH.

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
address | STRING | YES | address to get balance

### RETURN

* for successed case
`status code:` 200

```javascript
{
  "balance": 0.2   //ether value of balance 
}
```

* for failed case
`status code:` 400

```javascript
{
  "error": ""   //error message
}
```

# Create Account
```
POST /api/create_account
```
Create new account on Ethereum node.

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------

### RETURN

* for successed case
`status code:` 200

```javascript
{
  "address": "0xD7781938264e9BAc311Addba7D59de130a6C15f2"   //ether value of balance 
}
```

* for failed case
`status code:` 400

```javascript
{
  "error": "unknown error"   //error message
}
```

# Make Transaction
```
POST /api/make_transaction
```
Make transaction. In Ethereum, this means send ether to another address.

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
from | STRING | YES | address who sends ether
to | STRING | YES | address who receives ether
value | Number | YES | amount of ether

### RETURN

* for successed case
`status code:` 200

```javascript
{
  "hash": "0xf167e7a3d6d6e13fd0d197be10743ce00c04398aab6f2836b2a8cc09d5be0da8"   //ether value of balance 
}
```

* for failed case
`status code:` 400

```javascript
{
  "error": ""   //error message
}
```

# Get Updated Transaction
```
POST /api/get_updated_transaction
```
get transactions information from specified block to last block.

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
blocknum | Number | YES | start block number

### RETURN

* for successed case
`status code:` 200

```javascript
{
`data:` [
        {   
            hash: '0x9be9bc9fbbdb65d56ff055fef10f7380e188c6cf86526caa245aafb3d0778e53',
            nonce: 1,
            blockHash: '0x7158bcd54e5f10682503968989befdf794788b2d40dc5c836f82d2227f02d290',
            blockNumber: 6,
            transactionIndex: 0,
            from: '0x0625FE5DFBC10BE45abd49c33aC377E45D9eFA6a',
            to: '0x89718DE358A73343bd0F9D71E5f623131792E43d',
            value: '40000000000000000000',
            gas: 90000,
            gasPrice: '20000000000',
            input: '0x0' 
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
