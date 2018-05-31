// define local node object
var config = require("../config");
const client = config.localNode;

const TransactionModel = require("../model/transactions");
const AddressModel = require("../model/address");

// var TransactionModel = require('../model/transactions');

var promisify = function promisify(fn, args) {
  return new Promise((resolve, reject) => {
    try {
      client.call(fn, args, function(err, result) {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    } catch (error) {
      reject(error);
    }
  });
};

///////////////////////////////////////////////////////////////////////////////////////////////////////
//// RPC Call apis ////
///////////////////////////////////////////////////////////////////////////////////////////////////////

exports.getnewaddress = (req, res) => {
  const account = req.body.account;

  try {
    client.call("getnewaddress", [account], function(err, result) {
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
    client.call("setaccount", [address, account], function(err, result) {
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
    client.call("settxfee", [Number(fee)], function(err, result) {
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
    client.call("getreceivedbyaccount", [account, Number(minconf)], function(
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
    client.call("getreceivedbyaddress", [address, Number(minconf)], function(
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
    client.call("getbalance", [account, Number(minconf)], function(
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
      function(err, result) {
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
    client.call("getaccount", [address], function(err, result) {
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
    client.call("getaccountaddress", [account], function(err, result) {
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
    client.call("getaddressesbyaccount", [account], function(err, result) {
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
    client.call("getblockcount", [], function(err, result) {
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
    client.call("getbestblockhash", [], function(err, result) {
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

    client.call("getblock", [hash], function(err, result) {
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
  try {
    if (hash.length < 10) {
      hash = await promisify("getblockhash", [Number(hash)]);
    }
    var block = await promisify("getblock", [hash]);
    var txs = [];
    for (let i = 0; i < block.tx.length; i++) {
      try {
        var tx = await promisify("getrawtransaction", [block.tx[i], 1]);
        txs.push(tx);
      } catch (error) {
        console.log(error);
      }
    }
    block.tx = txs;
    return res.json({ status: 200, msg: "sccuess", data: block });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.getBlockHash = (req, res) => {
  const index = req.params.index;

  try {
    client.call("getblockhash", [Number(index)], function(err, result) {
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
    client.call("gettransaction", [txid], function(err, result) {
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
    client.call("getrawtransaction", [txid, Number(verbose)], function(
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
    client.call("listaccounts", [Number(minconf)], function(err, result) {
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
      function(err, result) {
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
      function(err, result) {
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
      function(err, result) {
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
      function(err, result) {
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
    client.call("listsinceblock", [blockhash, Number(confirm)], function(
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

    return res.json({ status: 200, msg: "sccuess", data: arrBlocks });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.getTransactionInfo = (req, res) => {
  const txid = req.params.txid;
  try {
    client.call("getrawtransaction", [txid, 1], function(err, result) {
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
  try {
    var txInfo = await promisify("getrawtransaction", [txid, 1]);
    return res.json({ status: 200, msg: "sccuess", data: txInfo });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.getTransactions = async function(req, res) {
  var offset = Number(req.query.offset);
  var count = Number(req.query.count);
  var order = Number(req.query.order);

  if (!offset) offset = 0;
  if (!count || count <= 0) count = 10;
  // condition
  var condition;
  if (order) condition = { updatedAt: 1 };
  else condition = { updatedAt: -1 };

  // logic
  try {
    TransactionModel.find()
      .sort(condition)
      .skip(offset)
      .limit(count)
      .exec(async function(error, rows) {
        if (!error) {
          var txs = [];
          for (let i = 0; i < rows.length; i++) {
            try {
              var tx = await promisify("getrawtransaction", [rows[i].txid, 1]);
              txs.push(tx);
            } catch (error) {
              console.log("get transaction error: ", error);
              txs.push({
                txid: rows[i].txid,
                hash: rows[i].txid,
                unknown: true
              });
            }
          }
          return res.json({ status: 200, msg: "success", data: txs });
        } else {
          console.log("getTransactionList: we have a promblem: ", error); // Should dump errors here
          return res.json({ status: 400, msg: "errors", data: error });
        }
      });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.getAddressTransactions = async function(req, res) {
  var address = req.params.address;
  var offset = Number(req.query.offset);
  var count = Number(req.query.count);
  var order = Number(req.query.order);

  if (!offset) offset = 0;
  if (!count || count <= 0) count = 10;

  // logic
  try {
    if (order > 0) {
      // Oldest first
      var addrTxResult = await AddressModel.aggregate([
        {
          $match: { address }
        },
        {
          $project: {
            txs: { $slice: ["$txs", offset, count] },
            total: { $size: "$txs" }
          }
        }
      ]);
      let { txs, total } = addrTxResult[0];

      var toReturn = [];
      for (let i = 0; i < txs.length; i++) {
        var txid = txs[i];
        var txInfo = await promisify("getrawtransaction", [txid, 1]);
        toReturn.push(txInfo);
      }
      return res.json({
        status: 200,
        msg: "success",
        data: { total, txs: toReturn }
      });
    } else {
      offset = -1 * offset - count;
      var addrTxResult = await AddressModel.aggregate([
        {
          $match: { address }
        },
        {
          $project: {
            txs: { $slice: ["$txs", offset, count] },
            total: { $size: "$txs" }
          }
        }
      ]);
      let { txs, total } = addrTxResult[0];

      var toReturn = [];
      for (let i = txs.length - 1; i >= 0; i++) {
        var txid = txs[i];
        var txInfo = await promisify("getrawtransaction", [txid, 1]);
        toReturn.push(txInfo);
      }
      return res.json({
        status: 200,
        msg: "success",
        data: { total, txs: toReturn }
      });
    }
  } catch (error) {
    return res.json({ status: 400, msg: "error occured !" });
  }
};
