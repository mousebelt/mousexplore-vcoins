// define local node object
const _ = require('lodash');
var config = require("../config");
const client = config.localNode;

const TransactionModel = require("../model/transactions");
const AddressModel = require("../model/address");
const UtxoModel = require("../model/utxo");

const UtilsModule = require("../modules/utils");

// var TransactionModel = require('../model/transactions');

var promisify = UtilsModule.promisify;

///////////////////////////////////////////////////////////////////////////////////////////////////////
//// RPC Call apis ////
///////////////////////////////////////////////////////////////////////////////////////////////////////

exports.getnewaddress = (req, res) => {
  const account = req.body.account;

  try {
    client.call("getnewaddress", [account], function (err, result) {
      if (err) {
        return res.json({ status: 400, msg: "errors", data: err });
      }
      return res.json({ status: 200, msg: "sccuess", data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.setaccount = (req, res) => {
  const account = req.body.account;
  const address = req.body.address;

  try {
    client.call("setaccount", [address, account], function (err, result) {
      if (err) {
        return res.json({ status: 400, msg: "errors", data: err });
      }
      return res.json({ status: 200, msg: "sccuess", data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.setTxFee = (req, res) => {
  const fee = req.body.fee;

  try {
    client.call("settxfee", [Number(fee)], function (err, result) {
      if (err) {
        return res.json({ status: 400, msg: "errors", data: err });
      }
      return res.json({ status: 200, msg: "sccuess", data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.getReceivedByAccount = (req, res) => {
  const account = req.body.account;
  var minconf = req.body.minconf;

  if (!minconf) minconf = 1;

  try {
    client.call("getreceivedbyaccount", [account, Number(minconf)], function (
      err,
      result
    ) {
      if (err) {
        return res.json({ status: 400, msg: "errors", data: err });
      }
      return res.json({ status: 200, msg: "sccuess", data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.getReceivedByAddress = (req, res) => {
  const address = req.body.address;
  var minconf = req.body.minconf;

  if (!minconf) minconf = 1;

  try {
    client.call("getreceivedbyaddress", [address, Number(minconf)], function (
      err,
      result
    ) {
      if (err) {
        return res.json({ status: 400, msg: "errors", data: err });
      }
      return res.json({ status: 200, msg: "sccuess", data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.getAccountBalance = (req, res) => {
  const account = req.query.account;
  var minconf = req.query.minconf;

  if (!minconf) minconf = 1;

  try {
    client.call("getbalance", [account, Number(minconf)], function (
      err,
      result
    ) {
      if (err) {
        return res.json({ status: 400, msg: "errors", data: err });
      }
      return res.json({ status: 200, msg: "sccuess", data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.getAllTransactionsByAccount = (req, res) => {
  const account = req.query.account;
  const count = req.query.count;
  const from = req.query.from;

  if (!count) count = 10;
  if (!from) from = 0;

  try {
    client.call(
      "listtransactions",
      [account, Number(count), Number(from)],
      function (err, result) {
        if (err) {
          return res.json({ status: 400, msg: "errors", data: err });
        }
        return res.json({ status: 200, msg: "sccuess", data: result });
      }
    );
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.getAccount = (req, res) => {
  const address = req.params.address;

  try {
    client.call("getaccount", [address], function (err, result) {
      if (err) {
        return res.json({ status: 400, msg: "errors", data: err });
      }
      return res.json({ status: 200, msg: "sccuess", data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.getAccountAddress = (req, res) => {
  const account = req.params.account;

  try {
    client.call("getaccountaddress", [account], function (err, result) {
      if (err) {
        return res.json({ status: 400, msg: "errors", data: err });
      }
      return res.json({ status: 200, msg: "sccuess", data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.getAccountByAddress = (req, res) => {
  const account = req.params.account;

  try {
    client.call("getaddressesbyaccount", [account], function (err, result) {
      if (err) {
        return res.json({ status: 400, msg: "errors", data: err });
      }
      return res.json({ status: 200, msg: "sccuess", data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.getBlockCount = (req, res) => {
  try {
    client.call("getblockcount", [], function (err, result) {
      if (err) {
        return res.json({ status: 400, msg: "errors", data: err });
      }
      return res.json({ status: 200, msg: "sccuess", data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.getBestBlockHash = (req, res) => {
  try {
    client.call("getbestblockhash", [], function (err, result) {
      if (err) {
        return res.json({ status: 400, msg: "errors", data: err });
      }
      return res.json({ status: 200, msg: "sccuess", data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.getBlock = async (req, res) => {
  var hash = req.params.hash;

  try {
    if (hash.length < 10) {
      hash = await promisify("getblockhash", [Number(hash)]);
    }

    client.call("getblock", [hash], function (err, result) {
      if (err) {
        return res.json({ status: 400, msg: "errors", data: err });
      }

      return res.json({ status: 200, msg: "sccuess", data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.getBlockDetails = async (req, res) => {
  var hash = req.params.hash;

  var block = await UtilsModule.getBlockDetailsFunc(hash);
  if (block) return res.json({ status: 200, msg: "sccuess", data: block });
  return res.json({ status: 400, msg: "Error occured !" });
};

exports.getBlockHash = (req, res) => {
  const index = req.params.index;

  try {
    client.call("getblockhash", [Number(index)], function (err, result) {
      if (err) {
        return res.json({ status: 400, msg: "errors", data: err });
      }
      return res.json({ status: 200, msg: "sccuess", data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.getTransaction = (req, res) => {
  const txid = req.params.txid;

  try {
    client.call("gettransaction", [txid], function (err, result) {
      if (err) {
        return res.json({ status: 400, msg: "errors", data: err });
      }
      return res.json({ status: 200, msg: "sccuess", data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.getRawTransaction = (req, res) => {
  const txid = req.params.txid;
  var verbose = req.query.verbose;

  try {
    client.call("getrawtransaction", [txid, Number(verbose)], function (
      err,
      result
    ) {
      if (err) {
        return res.json({ status: 400, msg: "errors", data: err });
      }
      return res.json({ status: 200, msg: "sccuess", data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.listAccounts = (req, res) => {
  var minconf = req.query.minconf;
  if (!minconf) minconf = 1;

  try {
    client.call("listaccounts", [Number(minconf)], function (err, result) {
      if (err) {
        return res.json({ status: 400, msg: "errors", data: err });
      }
      return res.json({ status: 200, msg: "sccuess", data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.sendFrom = (req, res) => {
  const fromaccount = req.body.fromaccount;
  const toaddress = req.body.toaddress;
  const amount = req.body.amount;
  var minconf = req.body.minconf;
  var comment = req.body.comment;
  var commentto = req.body.commentto;

  if (!minconf) minconf = 1;

  try {
    client.call(
      "sendfrom",
      [
        fromaccount,
        toaddress,
        Number(amount),
        Number(minconf),
        comment,
        commentto
      ],
      function (err, result) {
        if (err) {
          return res.json({ status: 400, msg: "errors", data: err });
        }
        return res.json({ status: 200, msg: "sccuess", data: result });
      }
    );
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.sendMany = (req, res) => {
  const fromaccount = req.body.fromaccount;
  const toaddresses = req.body.toaddresses;
  var minconf = req.body.minconf;

  if (!minconf) minconf = 1;

  try {
    client.call(
      "sendmany",
      [fromaccount, toaddresses, Number(minconf), comment],
      function (err, result) {
        if (err) {
          return res.json({ status: 400, msg: "errors", data: err });
        }
        return res.json({ status: 200, msg: "sccuess", data: result });
      }
    );
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.sendToAddress = (req, res) => {
  const toaddress = req.body.toaddress;
  const amount = req.body.amount;
  const comment = req.body.comment;
  const commentto = req.body.commentto;
  try {
    client.call(
      "sendtoaddress",
      [toaddress, Number(amount), comment, commentto],
      function (err, result) {
        if (err) {
          return res.json({ status: 400, msg: "errors", data: err });
        }
        return res.json({ status: 200, msg: "sccuess", data: result });
      }
    );
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.listTransactions = (req, res) => {
  const account = req.body.account;
  var count = req.body.count;
  var from = req.body.from;

  if (!count) count = 10;
  if (!from) from = 0;

  try {
    client.call(
      "listtransactions",
      [account, Number(count), Number(from)],
      function (err, result) {
        if (err) {
          return res.json({ status: 400, msg: "errors", data: err });
        }
        return res.json({ status: 200, msg: "sccuess", data: result });
      }
    );
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.listSinceBlock = (req, res) => {
  const blockhash = req.query.blockhash;
  const confirm = req.query.confirm;

  try {
    client.call("listsinceblock", [blockhash, Number(confirm)], function (
      err,
      result
    ) {
      if (err) {
        return res.json({ status: 400, msg: "errors", data: err });
      }
      return res.json({ status: 200, msg: "sccuess", data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

///////////////////////////////////////////////////////////////////////////////////////////////////////
//// Utility apis ////
///////////////////////////////////////////////////////////////////////////////////////////////////////
exports.getMonitor = async (req, res) => {
  return res.json({ status: 200, msg: "success", data: "Server is working now !" });
};

exports.getMonitorDb = async (req, res) => {
  try {
    if (require("mongoose").connection.readyState)
      return res.json({ status: 200, msg: "success", data: "Db is working now !" });

    throw new Error('db error');
  } catch (error) {
    return res.status(400).json({ status: 400, msg: "errors", data: "Db is not working now !" });
  }
};

exports.getMonitorRpc = async (req, res) => {
  try {
    client.call("getblockchaininfo", [], function (err, result) {
      if (err) {
        return res.status(400).json({ status: 400, msg: "errors", data: err.toString() });
      }
      return res.json({ status: 200, msg: "sccuess", data: result });
    });
  } catch (err) {
    return res.status(400).json({ status: 400, msg: "errors", data: err.toString() });
  }
};

exports.getSearch = async (req, res) => {
  var key = req.params.key;

  try {
    if (key.length < 10) {
      // block process
      var hash = await promisify("getblockhash", [Number(key)]);
      if (hash)
        return res.json({
          status: 200,
          msg: "sccuess",
          data: { type: "block" }
        });
    } else if (key.length >= 25 && key.length <= 34) {
      // address process
      return res.json({
        status: 200,
        msg: "sccuess",
        data: { type: "address" }
      });
    } else if (key.length >= 64 && key.length <= 66) {
      // block or txid process
      try {
        var tx = await promisify("getrawtransaction", [key, 1]);
        if (tx)
          return res.json({
            status: 200,
            msg: "sccuess",
            data: { type: "transaction" }
          });
      } catch (error) { }

      // block details
      try {
        var block = await promisify("getblock", [key]);
        if (block)
          return res.json({
            status: 200,
            msg: "sccuess",
            data: { type: "block" }
          });
      } catch (error) { }
    }
    return res.json({ status: 400, msg: "search key is not correct !" });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.getBlocks = async (req, res) => {
  var offset = Number(req.query.offset);
  var count = Number(req.query.count);

  if (!offset) offset = 0;
  if (!count || count <= 0) count = 10;

  try {
    var blockCount = await promisify("getblockcount", []);
    if (!blockCount) {
      return res.json({ status: 400, msg: "empty blockcount !" });
    }

    var height = blockCount - offset;
    // get block count
    var arrBlocks = [];
    for (var i = 1; i <= count; i++) {
      var index = height - i;
      if (index < 0) break;

      var hash = await promisify("getblockhash", [index]);
      if (hash) {
        var block = await promisify("getblock", [hash]);
        if (block) arrBlocks.push(block);
      }
    }

    return res.json({
      status: 200,
      msg: "sccuess",
      data: { total: blockCount, result: arrBlocks }
    });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.getTransactionInfo = (req, res) => {
  const txid = req.params.txid;
  try {
    client.call("getrawtransaction", [txid, 1], function (err, result) {
      if (err) {
        return res.json({ status: 400, msg: "errors", data: err });
      }
      return res.json({ status: 200, msg: "sccuess", data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.getTransactionDetails = async (req, res) => {
  const txid = req.params.txid;
  var txdetails = await UtilsModule.getTxDetailsFunc(txid);
  if (txdetails)
    return res.json({ status: 200, msg: "sccuess", data: txdetails });

  return res.json({ status: 400, msg: "errors" });
};

exports.getTransactions = async function (req, res) {
  var offset = Number(req.query.offset);
  var count = Number(req.query.count);
  var order = Number(req.query.order);

  if (!offset) offset = 0;
  if (!count || count <= 0) count = 10;
  // condition
  var condition;
  if (order) condition = { time: 1 };
  else condition = { time: -1 };

  // logic
  try {
    var total = await TransactionModel.find().count();
    TransactionModel.find()
      .sort(condition)
      .skip(offset)
      .limit(count)
      .exec(async function (error, rows) {
        if (!error) {
          var txs = [];
          for (let i = 0; i < rows.length; i++) {
            // var tx = await UtilsModule.getTxDetailsFunc(rows[i].txid);
            // if (tx) txs.push(tx);

            // try {
              var tx = await promisify("getrawtransaction", [rows[i].txid, 1]);
              if (tx) txs.push(tx);
            // } catch (error) {}
          }
          return res.json({
            status: 200,
            msg: "success",
            data: { total, result: txs }
          });
        } else {
          console.log("getTransactionList: we have a promblem: ", error); // Should dump errors here
          return res.json({ status: 400, msg: "errors", data: error });
        }
      });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.getAddressTransactions = async function (req, res) {
  var address = req.params.address;
  var offset = Number(req.query.offset);
  var count = Number(req.query.count);
  var order = Number(req.query.order);

  if (!offset) offset = 0;
  if (!count || count <= 0) count = 10;

  if (order) order = {time: 1};
  else order = {time: -1};

  // logic
  try {
    var rows = await UtxoModel.find({address})
    .sort(order);

    var arr_txid = _.map(rows, 'txid');
    arr_txid = _.uniqBy(arr_txid, function (e) {
      return e;
    });

    // response
    var total = arr_txid.length;
    var txids = _.slice(arr_txid, offset, offset + count);

    var result = [];
    for (let i = 0; i < txids.length; i++) {
      var txid = txids[i];
      var txInfo = await UtilsModule.getTxDetailsFunc(txid);
      if (txInfo) result.push(txInfo);
    }
    return res.json({
      status: 200,
      msg: "success",
      data: { total, result }
    });
  } catch (error) {
    // return res.json({ status: 400, msg: "error occured !" });
    return res.json({
      status: 200,
      msg: "success",
      data: { total: 0, result: [] }
    });
  }
};

exports.getBalance = async function (req, res) {
  var address = req.params.address;

  // logic
  try {
    var utxoRows = await UtxoModel.find({ address });

    var balance = 0;
    for (let i = 0; i < utxoRows.length; i++) {
      balance += utxoRows[i].amount;
    }

    balance = Number(balance.toFixed(8));
    return res.json({
      status: 200,
      msg: "success",
      data: { address, balance }
    });
  } catch (error) {
    return res.json({ status: 400, msg: "error occured !", data: error });
  }
};
