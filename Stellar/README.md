# Stellar node
## Compute requirements
CPU, RAM, Disk and network depends on network activity.

As of early 2018, stellar-core with PostgreSQL running on the same machine has no problem running on a m5.large in AWS (dual core 2.5 GHz Intel Xeon, 8 GB RAM).

Storage wise, 20 GB seems to be an excellent working set as it leaves plenty of room for growth.

## Network access
### Interaction with the peer to peer network
* inbound: stellar-core needs to allow all ips to connect to its PEER_PORT (default 11625) over TCP.
* outbound: stellar-core needs access to connect to other peers on the internet on PEER_PORT (most use the default as well) over TCP.

### Interaction with other internal systems
* outbound:
stellar-core needs access to a database (postgresql for example), which may reside on a different machine on the network
other connections can safely be blocked
* inbound: stellar-core exposes an unauthenticated HTTP endpoint on port HTTP_PORT (default 11626)
it is used by other systems (such as Horizon) to submit transactions (so may have to be exposed to the rest of your internal ips)
query information (info, metrics, …) for humans and automation perform administrative commands (schedule upgrades, change log levels, …)

# Install node
## installation of horizon and stella-core

* install Go
https://golang.org/doc/install
https://medium.com/@patdhlk/how-to-install-go-1-9-1-on-ubuntu-16-04-ee64c073cd79

>sudo curl -O https://storage.googleapis.com/golang/go1.10.2.linux-amd64.tar.gz
>sudo tar -xvf go1.9.1.linux-amd64.tar.gz
>sudo mv go /usr/local


* install horizon 
https://github.com/stellar/go/tree/master/services/horizon

>sudo wget https://github.com/stellar/go/releases/download/horizon-v0.12.3/horizon-v0.12.3-linux-amd64.tar.gz
>sudo tar -xvf horizon-v0.12.3-linux-amd64.tar.gz
>sudo cp ./horizon-v0.12.3-linux-amd64/horizon /usr/bin/horizon

* install pandoc
https://github.com/jgm/pandoc/releases/tag/2.2

>sudo wget https://github.com/jgm/pandoc/releases/download/2.2/pandoc-2.2-1-amd64.deb
>sudo dpkg -i pandoc-2.2-1-amd64.deb

* install stella-core
https://github.com/stellar/stellar-core/blob/master/INSTALL.md

>sudo add-apt-repository ppa:ubuntu-toolchain-r/test
>sudo apt-get update
>sudo apt-get install git build-essential pkg-config autoconf automake libtool bison flex libpq-dev clang++-4.9 gcc-4.9 g++-4.9 cpp-4.9

>git clone https://github.com/stellar/stellar-core.git
>cd stellar-core
>git submodule init
>git submodule update
>./autogen.sh.
>./configure (If configure complains about compiler versions, try CXX=clang-3.5 ./configure or CXX=g++-4.9 ./configure or >similar, depending on your compiler.)
>Type make or make -j (for aggressive parallel build)
>Type make check to run tests.
>Type make install to install.

## install environment
https://www.stellar.org/developers/horizon/reference/admin.html
https://github.com/stellar/stellar-core/blob/master/docs/software/admin.md

### install postgresql

https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-ubuntu-16-04

>sudo apt-get update
>sudo apt-get install postgresql postgresql-contrib

### create role of current system user

>sudo -u postgres createuser --interactive
>Enter name of role to add: ubuntu
>Shall the new role be a superuser? (y/n) y

enter postgres console and set password to user
>sudo -u postgres psql
>postgres=# ALTER USER ubuntu PASSWORD 'a';

### stellar-core config
https://github.com/stellar/stellar-core/blob/master/docs/software/testnet.md

* Need to add db
>createdb stellar

>sudo cp config/stellar_core_public.cfg /usr/local/bin/stellar-core.cfg

here do this if get error of some tables not exists.
>stellar-core --newdb

>sudo stellar-core --forcescp                ---------?

>sudo stellar-core

This will run stellar-core server

### horizon config

* create db
>createdb horizon_testnet

* set environment at /root/.bashrc

>export DATABASE_URL="postgres://ubuntu:a@localhost/horizon_testnet"
>export STELLAR_CORE_DATABASE_URL="postgres://ubuntu:a@localhost/stellar"
>export STELLAR_CORE_URL="http://localhost:11626"

source /root/.bashrc

* db initialize 

>horizon db init

* run horizon
>horizon 
or
>horizon serve

## make stellar-core and horizon as service

>cp ./stellar-core.service /etc/systemd/system/stellar-core.service
>cp ./horizon.service /etc/systemd/system/horizon.service
>systemctl daemon-reload
>systemctl enable stellar-core.service
>systemctl enable horizon.service
>systemctl start stellar-core
>systemctl start horizon

* check service status
>service stellar-core status
>service horizon status

## Mainnet setting
need to edit stellar-core.cfg.
need inserting validating node, crafting a quorum set
set all urls as live and history storage

Maybe only for getting transaction history, we don't need main net setting

# test API
>node -e 'process.env.RUN_TYPE = "test"'

## createAccount
>node ./unittest/testAccount.js


# Public Rest API for Stellar Node
## General API Information
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

## Endpoint security type
* Endpoint can only be accessed from specified client for provided REST APIs.
* Every APIs needs Authorization.
## Get tx info from txHash
```
 POST /api/v1/tx
```

## Get latest ledgers

Get latest ledger list.

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
count | Number | YES | ledger count to get


### RETURN

* for successed case
`status code:` 200

```javascript
{
"msg": "success",
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

### QUERY PARAMS

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
count | Number | YES | count of transactions


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
		  "hash": "8febfdb00d2920f65af42d4f28d118742a95b0f3ea134ebd980cf302e7818317",
		  "account": "GARMAQQ45FYTFSCLBREX5M3JTTBZ5MWDMU5DOGZRHXU6SG2GX4CB7IAF",
		  "timeStamp": "2015-09-24T10:07:09Z",
		  "type": 11,
		  "ledger": "payment",
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
Get operations from transaction 

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
		  "timeStamp": "2015-09-24T10:07:09Z",
		  "type": 11,
		  "ledger": "payment",
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
	   "txHash": "8febfdb00d2920f65af42d4f28d118742a95b0f3ea134ebd980cf302e7818317",
	   "ledgerSequence": 17733198,
	   "sourceAccount": GA4K4BUZ4SLAKQA5T2OE64FM3BWTUJXQQ3J4QPCEQBHCQZWQHRHGPPSO,
	   "sourceAccountSequence": 70914226499158536,
	   "fee": 0.00004 XLM,
	   "Signatures": "X74ykBLM6rVaJmtEP0LgnTh8ugm5ykaVCD8p+JfRGMm2HiaWrIV2VckmxU02z2xqSiKrq+Oomx6GxlTwpf9ABg==",
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
		   "balance": "2.9999947 XLM",
		   "other info"
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
	   "type": "Manage Offer" | "Payment" | "Change Trust" | "manage_data",
	   data according to type
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