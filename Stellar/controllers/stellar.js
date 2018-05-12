var StellarSdk = require('stellar-sdk');
var request = require('request');

var config = require('../config/common.js').config;
var port = process.env.PORT || 2000;
var urlAPI = config.url;

var runtype = process.env.RUN_TYPE;

if (runtype == "test") {
    StellarSdk.Network.useTestNetwork();
}

// var server = new StellarSdk.Server('http://127.0.0.1:11626', {allowHttp: true});
var server = new StellarSdk.Server('http://127.0.0.1:8000', {allowHttp: true});
// var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

exports.getBalance = function(req, res) {
    var addr = req.params.address;

    // the JS SDK uses promises for most actions, such as retrieving an account
    server.loadAccount(addr).then(function(account) {
      console.log('Balances for account: ' + addr);
      account.balances.forEach(function(balance) {
        console.log('Type:', balance.asset_type, ', Balance:', balance.balance);
      });
    });
}

/*
* create account.
*
* For main net, in order to prevent people from making a huge number of unnecessary accounts, 
* each account must have a minimum balance of 1 lumen (lumens are the built-in currency of the Stellar network).
* This can be done through any exchange.
*
* for testnet, can get this from Friendbot
*
* Can get keypair from public key or secret
* Keypair.fromPublicKey
* Keypair.fromSecret
* Keypair.fromRawEd25519Seed
*/
exports.createAccount = function(req, res) {
    console.log("createAccount");

    var pair = StellarSdk.Keypair.random();

    console.log("Secret is ", pair.secret());
    console.log("PublicKey is ", pair.publicKey());

    if (runtype == "test") {
        var request = require('request');
        request.get({
            url: 'https://friendbot.stellar.org',
            qs: { addr: pair.publicKey() },
            json: true
        }, function(error, response, body) {
            if (error || response.statusCode !== 200) {
                console.error('ERROR!', error || body);
            }
            else {
                console.log('SUCCESS! You have a new account :)\n', body);
            }
        });
    }
}


/*
*   get cursor value from string liken ledgers?order=asc&limit=2&cursor=8589934592
*/
function getCursor(url) {
    var url = new URL(url);
    var c = url.searchParams.get("cursor");
    console.log(c);

    return c;
}

/*
* Get latest ledger list.
* @param count count of list to get.
* @param cursor page token to start to get ledgers.
* @return list of ledger information same as the https://steexp.com/ledgers
*/
exports.getLatestLedgers = function(req, res) {
    var count = req.body.count;
    var cursor = req.body.cursor;

    var url = urlAPI + "ledgers?limit=" + count + "&order=desc";
    url += cursor? "&cursor=" + cursor : "";
    console.log(url);
    request(url, function(error, response, body) {
        if (!error) {
            body = JSON.parse(body);
            console.log("response: ", body);

            var next = body._links.next.href;//ledgers?order=asc&limit=2&cursor=8589934592
            var prev =  body._links.prev.href;

            console.log("next= ", next);

            next = getCursor(next);
            prev = getCursor(prev);

            console.log("next= ", next);

            var records = body._embedded.records;

            var ledgers = [];
            for (let i = 0; i < records.length; i ++) {
                let ledgerinfo = records[i];
                ledgers.push({
                    sequence: ledgerinfo.sequence,
                    timeStamp: ledgerinfo.closed_at,
                    transactions: ledgerinfo.transaction_count,
                    operations: ledgerinfo.operation_count
                })
            }
            res.status(200).json({msg: "success", next: next, prev: prev, data: ledgers});

        }
        else {
            console.log("getLatestLedgers error: ", err);
            res.status(400).json({error: err});
        }
    });

/*
    //This is using stellar sdk
    
    // server.ledgers()
    // .limit(count)
    // .order("desc")
    // .call()
    // .then(async function (ledgerResult) {
    //     // page 1
    //     console.log(ledgerResult);

    //     var next = await ledgerResult.next();//ledgers?order=asc&limit=2&cursor=8589934592
    //     var prev = await ledgerResult.prev();

    //     console.log("next= ", next);

    //     next = getCursor(next);
    //     prev = getCursor(prev);

    //     console.log("next= ", next);

    //     var records = ledgerResult.records;

    //     var ledgers = [];
    //     for (let i = 0; i < records.length; i ++) {
    //         let ledgerinfo = records[i];
    //         ledgers.push({
    //             sequence: ledgerinfo.sequence,
    //             timeStamp: ledgerinfo.closed_at,
    //             transactions: ledgerinfo.transaction_count,
    //             operations: ledgerinfo.operation_count,
    //             next: next,
    //             prev: prev
    //         })
    //     }
    //     res.status(200).json({msg: "success", data: ledgers});
    // })
    // .catch(function(err) {
    //     console.log(err)
    //     res.status(400).json({error: err});
    // })
*/
}

/*
* Get ledger info.
* @param ledger   hash or sequence.
* @return ledger information 
*/
exports.getLedgerDetail = function(req, res) {
    var ledger = req.body.ledger;

    server.ledgers()
    .ledger(ledger)
    .call()
    .then(function(ledgerResult) {
      console.log(ledgerResult)
      var info = {
        sequence: ledgerResult.sequence, 
        timeStamp: ledgerResult.closed_at, 
        hash: ledgerResult.hash,
        prevHash: ledgerResult.prev_hash,
        feePool: ledgerResult.fee_pool,
        baseFee: ledgerResult.base_fee_in_stroops,
        baseReserve: ledgerResult.base_reserve_in_stroops,
        maxTransactions: ledgerResult.max_tx_set_size,
        totalCoins: ledgerResult.total_coins,
        transactions: ledgerResult.transaction_count, 
        operations: ledgerResult.operation_count
      };

      res.status(200).json({msg: "success", data: info});
    })
    .catch(function(err) {
      console.log(err)
      res.status(400).json({error: err});
    })
}

/*
* Get all latest transactions.
* @param count: count of list to get.
* @param cursor: page token to start to get transactions.
* @return transactions 
*/
exports.getLatestTransactions = function(req, res) {
    var count = req.body.count;
    var cursor = req.body.cursor;

    var url = urlAPI + "transactions?limit=" + count + "&order=desc";
    url += cursor? "&cursor=" + cursor : "";
    console.log(url);
    request(url, function(error, response, body) {
        if (!error) {
            body = JSON.parse(body);
            console.log("response: ", body);

            var next = body._links.next.href;//ledgers?order=asc&limit=2&cursor=8589934592
            var prev =  body._links.prev.href;

            console.log("next= ", next);

            next = getCursor(next);
            prev = getCursor(prev);

            console.log("next= ", next);

            var records = body._embedded.records;

            var transactions = [];
            for (let i = 0; i < records.length; i ++) {
                let info = records[i];
                transactions.push({
                    hash: info.hash,
                    account: info.source_account,
                    ledger: info.ledger,
                    operations: info.operation_count,
                    timestamp: info.created_at
                })
            }
            res.status(200).json({msg: "success", next: next, prev: prev, data: transactions});

        }
        else {
            console.log("getLatestTransactions error: ", err);
            res.status(400).json({error: err});
        }
    });

/*
    //This is using stellar sdk

    var count = req.body.count;

    server.transactions()
    .limit(count)
    .order("desc")
    .call()
    .then(function(txResult) {
        console.log(txResult)
        console.log(txResult.records)

        var records = txResult.records;

        var transactions = [];
        for (let i = 0; i < records.length; i ++) {
            let info = records[i];
            transactions.push({
                hash: info.hash,
                account: info.account,
                ledger: info.ledger,
                operations: info.operation_count,
                timestamp: info.created_at
            })
        }
        res.status(200).json({msg: "success", data: transactions});
    })
    .catch(function(err) {
      console.log(err);
      res.status(400).json({error: err});
    })
*/
}

/*
* Get transactions by ledger.
* @param ledger   hash or sequence.
* @return transactions of ledger 
*/
exports.getTransactionsForLedger = function(req, res) {
    var ledger = req.body.ledger;

    server.transactions()
    .forLedger(ledger)
    .call()
    .then(function(txResult) {
        console.log(txResult)
        console.log(txResult.records)

        var records = txResult.records;

        var transactions = [];
        for (let i = 0; i < records.length; i ++) {
            let info = records[i];
            transactions.push({
                hash: info.hash,
                account: info.source_account,
                operations: info.operation_count,
                timestamp: info.created_at
            })
        }
        res.status(200).json({msg: "success", data: transactions});
    })
    .catch(function(err) {
      console.log(err);
      res.status(400).json({error: err});
    })
}

/*
* Get latest operations.
* @param count count of list to get.
* @param cursor: page token to start to get operations.
* @return operations of ledger 
*/
exports.getOperations = function(req, res) {
    var count = req.body.count;
    var cursor = req.body.cursor;

    var url = urlAPI + "operations?limit=" + count + "&order=desc";
    url += cursor? "&cursor=" + cursor : "";
    console.log(url);
    request(url, function(error, response, body) {
        if (!error) {
            body = JSON.parse(body);
            console.log("response: ", body);

            var next = body._links.next.href;//ledgers?order=asc&limit=2&cursor=8589934592
            var prev =  body._links.prev.href;

            console.log("next= ", next);

            next = getCursor(next);
            prev = getCursor(prev);

            console.log("next= ", next);

            var records = body._embedded.records;

            var operations = [];
            for (let i = 0; i < records.length; i ++) {
                let info = records[i];
                operations.push({
                    transaction: info.transaction_hash,
                    account: info.source_account,
                    type: info.type,
                    asset_type: info.asset_type,
                    asset_code: info.asset_code,
                    asset_issuer: info.asset_issuer,
                    from: info.from,
                    to: info.to,
                    amount: info.amount,
                    timestamp: info.created_at
                })
              }
            res.status(200).json({msg: "success", next: next, prev: prev, data: operations});

        }
        else {
            console.log("getLatestTransactions error: ", err);
            res.status(400).json({error: err});
        }
    });

/*    
    var count = req.body.count;

    server.operations()
    .limit(count)
    .order("desc")
    .call()
    .then(function(operationResult) {
      console.log(operationResult)

      var records = operationResult.records;

      var operations = [];
      for (let i = 0; i < records.length; i ++) {
        let info = records[i];
        operations.push({
            account: info.account,
            type: info.type,
            transaction: info.transaction_hash,
            timestamp: info.created_at
        })
      }
    
      res.status(200).json({msg: "success", data: operations});
    })
    .catch(function(err) {
      console.log(err);
      res.status(400).json({error: err});
    })
*/    
}

/*
* Get operations by transaction.
* @param txHash   hash of transaction.
* @return operations of transaction
*/
exports.getOperationsForTransaction = function(req, res) {
    var txHash = req.body.txHash;

    server.operations()
    .forTransaction(txHash)
    .call()
    .then(function(operationResult) {
      console.log(operationResult);

      var records = operationResult.records;

      var operations = [];
      for (let i = 0; i < records.length; i ++) {
        let info = records[i];
        operations.push({
            account: info.source_account,
            type: info.type,
            asset_type: info.asset_type,
            asset_code: info.asset_code,
            asset_issuer: info.asset_issuer,
            from: info.from,
            to: info.to,
            amount: info.amount,
            timestamp: info.created_at
        })
      }
    
      res.status(200).json({msg: "success", data: operations});
    })
    .catch(function(err) {
      console.log(err);
      res.status(400).json({error: err});
    })
}


/*
* Get transaction by transaction hash.
* @param txHash   hash of transaction.
* @return transaction info 
*/
exports.getTransaction = function(req, res) {
    var txHash = req.body.txHash;

    server.transactions()
    .transaction(txHash)
    .call()
    .then(function(transactionResult) {
      console.log(transactionResult);

      var info = {
        timeStamp: transactionResult.created_at,
        ledger: transactionResult.ledger_attr,
        account: transactionResult.source_account,
        fee: transactionResult.fee_paid,
      };

      res.status(200).json({msg: "success", data: info});
    })
    .catch(function(err) {
      console.log(err);
      res.status(400).json({error: err});
    })
}

/*
* Get account information by accountID.
* @param account   account ID.
* @return account info 
*/
exports.getAccount = function(req, res) {
    var account = req.body.account;

    server.accounts()
    .accountId(account)
    .call()
    .then(function(accountResult) {
      console.log(accountResult);

      var info = {
        subentry_count: accountResult.subentry_count,
        flags: accountResult.flags,
        balances: accountResult.balances,
        thresholds: accountResult.thresholds,
        signers: accountResult.signers
      }

      res.status(200).json({msg: "success", data: info});
    })
    .catch(function(err) {
      console.log(err);
      res.status(400).json({error: err});
    })
}

/*
* Get operations by accountID.
* @param account   account ID.
* @return operation list
*/
exports.getOperationsForAccount = function(req, res) {
    var account = req.body.account;

    server.operations()
    .forAccount(account)
    .call()
    .then(function(operationsResult) {
      console.log(operationsResult.records);

      var records = operationsResult.records;

      var operations = [];
      for (let i = 0; i < records.length; i ++) {
        let info = records[i];
        operations.push({
            type: info.type,
            asset_type: info.asset_type,
            asset_code: info.asset_code,
            asset_issuer: info.asset_issuer,
            from: info.from,
            to: info.to,
            amount: info.amount,
            transaction: info.transaction_hash,
            timestamp: info.created_at
        })
      }

      res.status(200).json({msg: "success", data: operations});
    })
    .catch(function(err) {
      console.log(err)
      res.status(400).json({error: err});
    })
}


/*
* Get transactions by account.
* @param account   account id
* @return transactions of account 
*/
exports.getTransactionsForAccount = function(req, res) {
    var account = req.body.account;

    server.transactions()
    .forAccount(account)
    .call()
    .then(function(txResult) {
        console.log(txResult)
        console.log(txResult.records)

        var records = txResult.records;

        var transactions = [];
        for (let i = 0; i < records.length; i ++) {
            let info = records[i];
            transactions.push({
                hash: info.hash,
                ledger: info.ledger_attr,
                operations: info.operation_count,
                timestamp: info.created_at
            })
        }
        res.status(200).json({msg: "success", data: transactions});
    })
    .catch(function(err) {
      console.log(err);
      res.status(400).json({error: err});
    })
}


/*
* Get payments by accountID.
* @param account   account ID.
* @param count count of list to get.
* @param cursor: page token to start to get operations.
* @return payment list
*/
exports.getPaymentsForAccount = function(req, res) {
    var account = req.body.account;
    var count = req.body.count;
    var cursor = req.body.cursor;

    var url = urlAPI + "accounts/" + account + "/payments?limit=" + count + "&order=desc";
    url += cursor? "&cursor=" + cursor : "";
    console.log(url);
    request(url, function(error, response, body) {
        if (!error) {
            body = JSON.parse(body);
            console.log("response: ", body);

            var next = body._links.next.href;//ledgers?order=asc&limit=2&cursor=8589934592
            var prev =  body._links.prev.href;

            console.log("next= ", next);

            next = getCursor(next);
            prev = getCursor(prev);

            console.log("next= ", next);

            var records = body._embedded.records;

            var operations = [];
                for (let i = 0; i < records.length; i ++) {
                let info = records[i];
                operations.push({
                    asset_type: info.asset_type,
                    asset_code: info.asset_code,
                    asset_issuer: info.asset_issuer,
                    from: info.from,
                    to: info.to,
                    amount: info.amount,
                    transaction: info.transaction_hash,
                    timestamp: info.created_at
                })
            }
            res.status(200).json({msg: "success", next: next, prev: prev, data: operations});

        }
        else {
            console.log("getLatestLedgers error: ", err);
            res.status(400).json({error: err});
        }
    });
/*
    //This is using stellar sdk
    var account = req.body.account;

    server.payments()
    .forAccount(account)
    .call()
    .then(function(paymentsResult) {
      console.log(paymentsResult);

      var records = paymentsResult.records;

      var operations = [];
      for (let i = 0; i < records.length; i ++) {
        let info = records[i];
        operations.push({
            asset_type: info.asset_type,
            asset_code: info.asset_code,
            asset_issuer: info.asset_issuer,
            from: info.from,
            to: info.to,
            amount: info.amount,
            transaction: info.transaction_hash,
            timestamp: info.created_at
        })
      }

      res.status(200).json({msg: "success", data: operations});
    })
    .catch(function(err) {
      console.log(err)
      res.status(400).json({error: err});
    })
    */
}

/*
* Get offers by accountID.
* @param account   account ID.
* @param count count of list to get.
* @param cursor: page token to start to get operations.
* @return payment list
*/
exports.getOffersForAccount = function(req, res) {
    var account = req.body.account;
    var count = req.body.count;
    var cursor = req.body.cursor;

    var url = urlAPI + "accounts/" + account + "/offers?limit=" + count + "&order=desc";
    url += cursor? "&cursor=" + cursor : "";
    console.log(url);
    request(url, function(error, response, body) {
        if (!error) {
            body = JSON.parse(body);
            console.log("response: ", body);

            var next = body._links.next.href;//ledgers?order=asc&limit=2&cursor=8589934592
            var prev =  body._links.prev.href;

            console.log("next= ", next);

            next = getCursor(next);
            prev = getCursor(prev);

            console.log("next= ", next);

            var records = body._embedded.records;

            var operations = [];
                for (let i = 0; i < records.length; i ++) {
                let info = records[i];
                operations.push({
                    sell: info.selling,
                    buy: info.buying,
                    amount: info.amount,
                    price: info.price,
                })
            }
            res.status(200).json({msg: "success", next: next, prev: prev, data: operations});

        }
        else {
            console.log("getLatestLedgers error: ", err);
            res.status(400).json({error: err});
        }
    });
}


/*
* Get effects by accountID.
* @param account   account ID.
* @param count count of list to get.
* @param cursor: page token to start to get operations.
* @return effect list
*/
exports.getEffectsForAccount = function(req, res) {
    var account = req.body.account;
    var count = req.body.count;
    var cursor = req.body.cursor;

    var url = urlAPI + "accounts/" + account + "/effects?limit=" + count + "&order=desc";
    url += cursor? "&cursor=" + cursor : "";
    console.log(url);
    request(url, function(error, response, body) {
        if (!error) {
            body = JSON.parse(body);
            console.log("response: ", body);

            var next = body._links.next.href;//ledgers?order=asc&limit=2&cursor=8589934592
            var prev =  body._links.prev.href;

            console.log("next= ", next);

            next = getCursor(next);
            prev = getCursor(prev);

            console.log("next= ", next);

            var records = body._embedded.records;

            var operations = [];
            for (let i = 0; i < records.length; i ++) {
                let info = records[i];

                delete info._links;
                delete info.paging_token;
                delete info.account;
                delete info.id;

                operations.push(info);
            }
            res.status(200).json({msg: "success", next: next, prev: prev, data: operations});

        }
        else {
            console.log("getLatestLedgers error: ", err);
            res.status(400).json({error: err});
        }
    });
}



/*
* Get effects.
* @param count count of list to get.
* @param cursor: page token to start to get operations.
* @return effect list
*/
exports.getLatestEffects = function(req, res) {
    var count = req.body.count;
    var cursor = req.body.cursor;

    var url = urlAPI + "/effects?limit=" + count + "&order=desc";
    url += cursor? "&cursor=" + cursor : "";
    console.log(url);
    request(url, function(error, response, body) {
        if (!error) {
            body = JSON.parse(body);
            console.log("response: ", body);

            var next = body._links.next.href;//ledgers?order=asc&limit=2&cursor=8589934592
            var prev =  body._links.prev.href;

            console.log("next= ", next);

            next = getCursor(next);
            prev = getCursor(prev);

            console.log("next= ", next);

            var records = body._embedded.records;

            var operations = [];
            for (let i = 0; i < records.length; i ++) {
                let info = records[i];

                delete info._links;
                delete info.paging_token;
                delete info.account;
                delete info.id;

                operations.push(info);
            }
            res.status(200).json({msg: "success", next: next, prev: prev, data: operations});

        }
        else {
            console.log("getLatestLedgers error: ", err);
            res.status(400).json({error: err});
        }
    });
}