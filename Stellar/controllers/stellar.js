var StellarSdk = require('stellar-sdk');
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
* Get latest ledger list.
* @param count count of list to get.
* @return list of ledger information same as the https://steexp.com/ledgers
*/
exports.getLatestLedgers = function(req, res) {
    var count = req.body.count;

    server.ledgers()
    .limit(count)
    .order("desc")
    .call()
    .then(function (ledgerResult) {
        // page 1
        console.log(ledgerResult)
        console.log(ledgerResult.records)

        var records = ledgerResult.records;

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
        res.status(200).json({msg: "success", data: ledgers});
    })
    .catch(function(err) {
        console.log(err)
        res.status(400).json({error: err});
    })
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
* @param count count of list to get.
* @return transactions of ledger 
*/
exports.getLatestTransactions = function(req, res) {
    var count = req.body.count;

    server.transactions()
    .limit(count)
    .order("dsc")
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
                account: info.account,
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
* Get operations by ledger.
* @param count count of list to get.
* @return operations of ledger 
*/
exports.getOperations = function(req, res) {
    var count = req.body.count;

    server.operations()
    .limit(count)
    .order("dsc")
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
      console.log(transactionResult)
    })
    .catch(function(err) {
      console.log(err)
    })
}

/*
* Get account information by accountID.
* @param account   account ID.
* @return account info 
*/
exports.getAccount = function(req, res) {
    var account = req.body.account;

    server.transactions()
    .accountId(account)
    .call()
    .then(function(accountResult) {
      console.log(accountResult)
    })
    .catch(function(err) {
      console.log(err)
    })
}

/*
* Get operations by accountID.
* @param account   account ID.
* @return account info 
*/
exports.getOperationsForAccount = function(req, res) {
    var account = req.body.account;

    server.transactions()
    .forAccount(account)
    .call()
    .then(function(operationsResult) {
      console.log(operationsResult.records)
    })
    .catch(function(err) {
      console.log(err)
    })
}