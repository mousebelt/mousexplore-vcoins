# Public Rest API for Loom Node

>prefix: /api/v1  

# Summary
[Get server working status](#get-server-working-status)  
[Get db working status](#get-db-working-status)  
[Get rpc working status](#get-rpc-working-status)  
[Get out of syncing status](#get-out-of-syncing-status)  

***

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
