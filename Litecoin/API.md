# Public Rest API for Litecoin Node

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
