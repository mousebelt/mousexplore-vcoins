var rp = require('request-promise');
var StellarSdk = require("stellar-sdk");
var request = require("request");
var requestpromise = require("request-promise");
let axios = require("axios");
var URL = require("url");
let URI = require("urijs");

var config = require("../config/common.js").config;
var port = process.env.PORT || 2000;
var urlAPI = config.url;

var runtype = process.env.RUN_TYPE;

if (runtype == "test") {
  StellarSdk.Network.useTestNetwork();
}

// var server = new StellarSdk.Server('http://127.0.0.1:11626', {allowHttp: true});
var server = new StellarSdk.Server("http://127.0.0.1:8000", {
  allowHttp: true
});
// var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

exports.getBalance = function (req, res) {
  var addr = req.params.address;

  // the JS SDK uses promises for most actions, such as retrieving an account
  server.loadAccount(addr).then(function (account) {
    // account.balances.forEach(function (balance) {
    //   console.log("Type:", balance.asset_type, ", Balance:", balance.balance);
    // });
    res.json({ status: 200, msg: 'success', data: account.balances });
  }).catch(function (err) {
    res.json({ status: 400, msg: 'Error !', data: err });
  });
};

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
exports.createAccount = function (req, res) {
  console.log("createAccount");

  var pair = StellarSdk.Keypair.random();

  console.log("Secret is ", pair.secret());
  console.log("PublicKey is ", pair.publicKey());

  if (runtype == "test") {
    request.get(
      {
        url: "https://friendbot.stellar.org",
        qs: { addr: pair.publicKey() },
        json: true
      },
      function (error, response, body) {
        if (error || response.statusCode !== 200) {
          console.error("ERROR!", error || body);
        } else {
          console.log("SUCCESS! You have a new account :)\n", body);
        }
      }
    );
  }
};

/*
*   get cursor value from string liken ledgers?order=asc&limit=2&cursor=8589934592
*/
function getCursor(url) {
  var url_parts = URL.parse(url, true);
  var query = url_parts.query;
  var c = query.cursor;

  return c;
}

/**
 * get ledgers
 * 
 * @param {Number} count 
 * @param {Number} order 
 * @param {String} cursor
 * 
 * @returns ledgers 
 */
exports.getLatestLedgers = async function (req, res) {
  var count = Number(req.query.count);
  var order = Number(req.query.order);
  var cursor = req.query.cursor;
  if (!count || count <= 0) count = 10;
  if (order > 0) order = 'asc';
  else order = 'desc';

  // get total count
  // var total = undefined;
  // try {
  //   var options = {
  //     uri: `${config.url}ledgers?limit=1&order=desc`,
  //     json: true
  //   };

  //   var resp = await rp(options);
  //   var records = resp._embedded.records;
  //   total = records[0].sequence;
  // } catch (error) {
  //   return res.json({ status: 400, msg: 'Error in getting total count !', data: error });
  // }

  // get data
  var url = urlAPI + "ledgers?limit=" + count + `&order=${order}`;
  url += cursor ? "&cursor=" + cursor : "";

  request(url, function (error, response, body) {
    if (!error) {
      body = JSON.parse(body);

      var next = body._links.next.href; //ledgers?order=asc&limit=2&cursor=8589934592
      var prev = body._links.prev.href;

      next = getCursor(next);
      prev = getCursor(prev);

      var records = body._embedded.records;

      // var ledgers = [];
      // for (let i = 0; i < records.length; i++) {
      //   let ledgerinfo = records[i];
      //   ledgers.push({
      //     sequence: ledgerinfo.sequence,
      //     timeStamp: ledgerinfo.closed_at,
      //     transactions: ledgerinfo.transaction_count,
      //     operations: ledgerinfo.operation_count
      //   });
      // }
      res.json({ status: 200, msg: "success", data: { next, prev, result: records } });
    } else {
      res.json({ status: 400, msg: 'Error !', data: error });
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
};

exports.getLedgerBySequence = function (req, res) {
  var sequence = req.params.sequence;
  if (sequence.length < 10) sequence = Number(sequence);
  try {
    server
      .ledgers()
      .ledger(sequence)
      .call()
      .then(function (result) {
        res.json({ status: 200, msg: "success", data: result });
      })
      .catch(function (err) {
        res.json({ status: 400, msg: 'Error !', data: err });
      });
  } catch (error) {
    res.json({ status: 400, msg: 'Error !', data: error });
  }
};

/**
 * Get transactions.
 * 
 * @param {Number} count
 * @param {Number} order
 * @param {String} cursor
 * 
 * @returns transactions
 */
exports.getLatestTransactions = function (req, res) {
  var count = Number(req.query.count);
  var order = Number(req.query.order);
  var cursor = req.query.cursor;

  if (!count || count <= 0) count = 10;
  if (order > 0) order = 'asc';
  else order = 'desc';

  var url = urlAPI + "transactions?limit=" + count + `&order=${order}`;
  url += cursor ? "&cursor=" + cursor : "";

  request(url, function (error, response, body) {
    if (!error) {
      body = JSON.parse(body);

      var next = body._links.next.href; //ledgers?order=asc&limit=2&cursor=8589934592
      var prev = body._links.prev.href;

      next = getCursor(next);
      prev = getCursor(prev);

      var records = body._embedded.records;

      // var transactions = [];
      // for (let i = 0; i < records.length; i++) {
      //   let info = records[i];
      //   transactions.push({
      //     hash: info.hash,
      //     account: info.source_account,
      //     ledger: info.ledger,
      //     operations: info.operation_count,
      //     timestamp: info.created_at
      //   });
      // }
      res.json({ status: 200, msg: "success", data: { next, prev, result: records } });
    } else {
      res.json({ status: 400, msg: 'Error !', data: error });
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
};

/*
* Get transactions by ledger.
* @param ledger   hash or sequence.
* @return transactions of ledger 
*/
exports.getTransactionsForLedger = function (req, res) {
  var sequence = req.params.sequence;

  if (sequence.length<10) sequence = Number(sequence);
  server
    .transactions()
    .forLedger(sequence)
    .call()
    .then(function (txResult) {
      var records = txResult.records;

      // var transactions = [];
      // for (let i = 0; i < records.length; i++) {
      //   let info = records[i];
      //   transactions.push({
      //     hash: info.hash,
      //     account: info.source_account,
      //     operations: info.operation_count,
      //     timestamp: info.created_at
      //   });
      // }
      res.json({ status: 200, msg: "success", data: { total: records.length, result: records } });
    })
    .catch(function (err) {
      res.json({ status: 400, msg: 'Error !', data: err });
    });
};

/*
* Get latest operations.
* @param count count of list to get.
* @param cursor: page token to start to get operations.
* @return operations of ledger 
*/
exports.getOperations = function (req, res) {
  var count = Number(req.query.count);
  var cursor = req.query.cursor;

  if (!count) count = 10;

  var url = urlAPI + "operations?limit=" + count + "&order=desc";
  url += cursor ? "&cursor=" + cursor : "";

  request(url, function (error, response, body) {
    if (!error) {
      body = JSON.parse(body);

      var next = body._links.next.href; //ledgers?order=asc&limit=2&cursor=8589934592
      var prev = body._links.prev.href;

      next = getCursor(next);
      prev = getCursor(prev);

      var records = body._embedded.records;

      // var operations = [];
      // for (let i = 0; i < records.length; i++) {
      //   let info = records[i];
      //   operations.push({
      //     transaction: info.transaction_hash,
      //     account: info.source_account,
      //     type: info.type,
      //     asset_type: info.asset_type,
      //     asset_code: info.asset_code,
      //     asset_issuer: info.asset_issuer,
      //     from: info.from,
      //     to: info.to,
      //     amount: info.amount,
      //     timestamp: info.created_at
      //   });
      // }
      res.json({ status: 200, msg: "success", data: { prev, next, result: records } });
    } else {
      res.json({ status: 400, msg: 'Error !', data: error });
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
};

/*
* Get operations by transaction.
* @param txHash   hash of transaction.
* @return operations of transaction
*/
exports.getOperationsForTransaction = function (req, res) {
  var hash = req.params.hash;

  server
    .operations()
    .forTransaction(hash)
    .call()
    .then(function (operationResult) {
      var records = operationResult.records;

      // var operations = [];
      // for (let i = 0; i < records.length; i++) {
      //   let info = records[i];
      //   operations.push({
      //     account: info.source_account,
      //     type: info.type,
      //     asset_type: info.asset_type,
      //     asset_code: info.asset_code,
      //     asset_issuer: info.asset_issuer,
      //     from: info.from,
      //     to: info.to,
      //     amount: info.amount,
      //     timestamp: info.created_at
      //   });
      // }

      res.json({ status: 200, msg: "success", data: { total: records.length, result: records } });
    })
    .catch(function (err) {
      res.json({ status: 400, msg: 'Error !', data: err });
    });
};

/*
* Get transaction by transaction hash.
* @param txHash   hash of transaction.
* @return transaction info 
*/
exports.getTransaction = function (req, res) {
  var hash = req.params.hash;

  server
    .transactions()
    .transaction(hash)
    .call()
    .then(function (transactionResult) {
      // var info = {
      //   timeStamp: transactionResult.created_at,
      //   ledger: transactionResult.ledger_attr,
      //   account: transactionResult.source_account,
      //   fee: transactionResult.fee_paid
      // };

      res.json({ status: 200, msg: "success", data: transactionResult });
    })
    .catch(function (err) {
      res.json({ status: 400, msg: 'Error !', data: err });
    });
};

/*
* Get account information by accountID.
* @param account   account ID.
* @return account info 
*/
exports.getAccount = function (req, res) {
  var account = req.params.account;

  server
    .accounts()
    .accountId(account)
    .call()
    .then(function (accountResult) {
      var info = {
        subentry_count: accountResult.subentry_count,
        flags: accountResult.flags,
        balances: accountResult.balances,
        thresholds: accountResult.thresholds,
        signers: accountResult.signers,
        sequence: accountResult.sequence,
      };

      res.json({ status: 200, msg: "success", data: info });
    })
    .catch(function (err) {
      res.json({ status: 400, msg: 'Error !', data: err });
    });
};

/*
* Get operations by accountID.
* @param account   account ID.
* @return operation list
*/
exports.getOperationsForAccount = function (req, res) {
  var account = req.body.account;

  server
    .operations()
    .forAccount(account)
    .call()
    .then(function (operationsResult) {
      console.log(operationsResult.records);

      var records = operationsResult.records;

      var operations = [];
      for (let i = 0; i < records.length; i++) {
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
        });
      }

      res.status(200).json({ msg: "success", data: operations });
    })
    .catch(function (err) {
      console.log(err);
      res.status(400).json({ error: err });
    });
};

/*
* Get transactions by account.
* @param account   account id
* @return transactions of account 
*/
exports.getTransactionsForAccount = function (req, res) {
  var account = req.body.account;

  server
    .transactions()
    .forAccount(account)
    .call()
    .then(function (txResult) {
      console.log(txResult);
      console.log(txResult.records);

      var records = txResult.records;

      var transactions = [];
      for (let i = 0; i < records.length; i++) {
        let info = records[i];
        transactions.push({
          hash: info.hash,
          ledger: info.ledger_attr,
          operations: info.operation_count,
          timestamp: info.created_at
        });
      }
      res.status(200).json({ msg: "success", data: transactions });
    })
    .catch(function (err) {
      console.log(err);
      res.status(400).json({ error: err });
    });
};

/*
* Get payments by accountID.
* @param account   account ID.
* @param count count of list to get.
* @param cursor: page token to start to get operations.
* @return payment list
*/
exports.getPaymentsForAccount = function (req, res) {
  var account = req.body.account;
  var count = req.body.count;
  var cursor = req.body.cursor;

  var url =
    urlAPI + "accounts/" + account + "/payments?limit=" + count + "&order=desc";
  url += cursor ? "&cursor=" + cursor : "";
  console.log(url);
  request(url, function (error, response, body) {
    if (!error) {
      body = JSON.parse(body);
      console.log("response: ", body);

      var next = body._links.next.href; //ledgers?order=asc&limit=2&cursor=8589934592
      var prev = body._links.prev.href;

      console.log("next= ", next);

      next = getCursor(next);
      prev = getCursor(prev);

      console.log("next= ", next);

      var records = body._embedded.records;

      var operations = [];
      for (let i = 0; i < records.length; i++) {
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
        });
      }
      res
        .status(200)
        .json({ msg: "success", next: next, prev: prev, data: operations });
    } else {
      console.log("getLatestLedgers error: ", error);
      res.status(400).json({ error: error });
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
};

/*
* Get offers by accountID.
* @param account   account ID.
* @param count count of list to get.
* @param cursor: page token to start to get operations.
* @return payment list
*/
exports.getOffersForAccount = function (req, res) {
  var account = req.body.account;
  var count = req.body.count;
  var cursor = req.body.cursor;

  var url =
    urlAPI + "accounts/" + account + "/offers?limit=" + count + "&order=desc";
  url += cursor ? "&cursor=" + cursor : "";
  console.log(url);
  request(url, function (error, response, body) {
    if (!error) {
      body = JSON.parse(body);
      console.log("response: ", body);

      var next = body._links.next.href; //ledgers?order=asc&limit=2&cursor=8589934592
      var prev = body._links.prev.href;

      console.log("next= ", next);

      next = getCursor(next);
      prev = getCursor(prev);

      console.log("next= ", next);

      var records = body._embedded.records;

      var operations = [];
      for (let i = 0; i < records.length; i++) {
        let info = records[i];
        operations.push({
          sell: info.selling,
          buy: info.buying,
          amount: info.amount,
          price: info.price
        });
      }
      res
        .status(200)
        .json({ msg: "success", next: next, prev: prev, data: operations });
    } else {
      console.log("getLatestLedgers error: ", error);
      res.status(400).json({ error: error });
    }
  });
};

/*
* Get effects by accountID.
* @param account   account ID.
* @param count count of list to get.
* @param cursor: page token to start to get operations.
* @return effect list
*/
exports.getEffectsForAccount = function (req, res) {
  var account = req.body.account;
  var count = req.body.count;
  var cursor = req.body.cursor;

  var url =
    urlAPI + "accounts/" + account + "/effects?limit=" + count + "&order=desc";
  url += cursor ? "&cursor=" + cursor : "";
  console.log(url);
  request(url, function (error, response, body) {
    if (!error) {
      body = JSON.parse(body);
      console.log("response: ", body);

      var next = body._links.next.href; //ledgers?order=asc&limit=2&cursor=8589934592
      var prev = body._links.prev.href;

      console.log("next= ", next);

      next = getCursor(next);
      prev = getCursor(prev);

      console.log("next= ", next);

      var records = body._embedded.records;

      var operations = [];
      for (let i = 0; i < records.length; i++) {
        let info = records[i];

        delete info._links;
        delete info.paging_token;
        delete info.account;
        delete info.id;

        operations.push(info);
      }
      res
        .status(200)
        .json({ msg: "success", next: next, prev: prev, data: operations });
    } else {
      console.log("getLatestLedgers error: ", error);
      res.status(400).json({ error: error });
    }
  });
};

/*
* Get effects.
* @param count count of list to get.
* @param cursor: page token to start to get operations.
* @return effect list
*/
exports.getLatestEffects = function (req, res) {
  var count = req.body.count;
  var cursor = req.body.cursor;

  var url = urlAPI + "/effects?limit=" + count + "&order=desc";
  url += cursor ? "&cursor=" + cursor : "";
  console.log(url);
  request(url, async function (error, response, body) {
    if (!error) {
      body = JSON.parse(body);
      // console.log("response: ", body);

      var next = body._links.next.href; //ledgers?order=asc&limit=2&cursor=8589934592
      var prev = body._links.prev.href;

      next = getCursor(next);
      prev = getCursor(prev);

      var records = body._embedded.records;

      var operations = [];
      for (let i = 0; i < records.length; i++) {
        let info = records[i];

        opUrl = info._links.operation.href;

        var timestamp = 0;
        var transaction_hash = "";
        try {
          var option = {
            method: "GET",
            uri: opUrl,
            json: true
          };
          var operationDetail = await requestpromise(option);

          timestamp = operationDetail.created_at;
          transaction_hash = operationDetail.transaction_hash;
        } catch (e) {
          console.log("reqeust error: ", e);
        }

        delete info._links;
        delete info.paging_token;
        delete info.id;

        info.timestamp = timestamp;
        info.transaction_hash = transaction_hash;

        operations.push(info);
      }
      res
        .status(200)
        .json({ msg: "success", next: next, prev: prev, data: operations });
    } else {
      console.log("getLatestLedgers error: ", error);
      res.status(400).json({ error: error });
    }
  });
};

exports.getSearch = function (req, res) {
  var key = req.params.key;
  try {
    if (key.length >= 64 && key.length <= 66) { // transaction
      server
        .transactions()
        .transaction(key)
        .call()
        .then(function (transactionResult) {
          res.json({ status: 200, msg: "success", data: { result: transactionResult, type: 'transaction' } });
        })
        .catch(function (err) {
          res.json({ status: 400, msg: 'Get transaction error !', data: err });
        });
    } else if (key.length < 10) {
      key = Number(key);
      server
        .ledgers()
        .ledger(key)
        .call()
        .then(function (result) {
          res.json({ status: 200, msg: "success", data: { result, type: 'ledger' } });
        })
        .catch(function (err) {
          res.json({ status: 400, msg: "Get ledger error !", data: err });
        });
    } else if (key.length <= 56) {
      // address
      return res.json({ status: 200, msg: "sccuess", data: { result: `address is not implemented yet, address: ${key} !`, type: 'address' } });
    } else {
      res.json({ status: 400, msg: "Invalid key !" });
    }
  } catch (error) {
    res.json({ status: 400, msg: "Invalid key !", data: error });
  }
};

exports.postTransaction = async function (req, res) {
  var tx = req.body.tx;
  if (!tx) res.json({ status: 400, msg: "Empty transaction !" });

  console.log("tx: ", tx);

  console.log("URI: ", URI(urlAPI).segment('transactions').toString());
  axios.post(
    URI(urlAPI).segment('transactions').toString(),
    `tx=${tx}`,
    {timeout: config.SUBMIT_TRANSACTION_TIMEOUT}
  )
  .then(function(response) {
    console.log("response: ", response.data);
    res.json({ status: 200, msg: "success", data: response.data });
  })
  .catch(function (response) {
    console.log(response.data);
    res.json({ status: 400, msg: "Transaction submission failed.", data: response.data});
  });
};

//http://localhost:2000/test
exports.TestTransaction = function (req, res) {
  
  //test net seq num is 41275142520700928
  var server = new StellarSdk.Server('https://horizon-testnet.stellar.org'); 
  server.loadAccount("GCIA6RMJKSV2XFJYVXWTKWPGE4FYOPO4PCT2RVWCWWRS7GW734K472WH")
  .then(function(account) { console.log(account.sequence) })

  //main net
  // var tx = "AAAAAJAPRYlUq6uVOK3tNVnmJwuHPdx4p6jWwrWjL5rf3xXPAAAAZAEZWrsAAAABAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAA/E/doeW0oiCt2yrdaLLphBndHOUksU/FsFi1nI10EYwAAAAAAJiWgAAAAAAAAAAB398VzwAAAECl5LlwxkGKwRJrS5R/ASJThg3CjrsmieQaWnV9RDk4LY6E9D8AmLXi3Cg/EJF1Ul6yFhExHMnrdZTCtnzrLoEL";

  //test net
  var tx = "AAAAAJAPRYlUq6uVOK3tNVnmJwuHPdx4p6jWwrWjL5rf3xXPAAAAZACSo4YAAAABAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAA%2FE%2FdoeW0oiCt2yrdaLLphBndHOUksU%2FFsFi1nI10EYwAAAAAAJiWgAAAAAAAAAAB398VzwAAAEDkaZhbzoqjE9K%2FCoaTA6bo6LzMZj3dgp%2Fu1v3c%2BePsd5u15b%2BYSayLVAv4VydGCLS4jlMwMwHMn9tQh%2Bt9UFMJ";
  urlAPI = "https://horizon-testnet.stellar.org";

  axios.post(
    URI(urlAPI).segment('transactions').toString(),
    `tx=${tx}`,
    {timeout: config.SUBMIT_TRANSACTION_TIMEOUT}
  )
  .then(function(response) {
    console.log("response: ", response.data);
    res.json({ status: 200, msg: "success", data: response.data });
  })
  .catch(function (response) {
    console.log(response.data);
    res.json({ status: 400, msg: "Transaction submission failed.", data: response.data});
  });
}
