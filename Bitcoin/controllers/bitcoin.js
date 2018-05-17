// define local node object
var config = require("../config");
const client = config.localNode;

// var TransactionModel = require('../model/transactions');
///////////////////////////////////////////////////////////////////////////////////////////////////////
//// RPC Call apis ////
///////////////////////////////////////////////////////////////////////////////////////////////////////

exports.createAccount = (req, res) => {
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

exports.associateAddresss = (req, res) => {
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
    client.call("settxfee", [fee], function(err, result) {
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
  const confirm = req.body.confirm;

  try {
    client.call("getreceivedbyaccount", [account, confirm], function(
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
  const confirm = req.body.confirm;

  try {
    client.call("getreceivedbyaddress", [address, confirm], function(
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
  const account = req.params.account;

  try {
    client.call("getbalance", [account], function(err, result) {
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
  const address = req.params.address;

  try {
    client.call("listtransactions", [address], function(err, result) {
      if (err) {
        return res.json({ status: 400, msg: "errors", data: err });
      }
      return res.json({ status: 200, msg: "sccuess", data: result });
    });
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

exports.getBlock = (req, res) => {
  const hash = req.params.hash;

  try {
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

  try {
    client.call("getrawtransaction", [txid], function(err, result) {
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
  try {
    client.call("listaccounts", [], function(err, result) {
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
  const confrim = req.body.confrim;

  try {
    client.call("sendfrom", [fromaccount, toaddress, amount, confrim], function(
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

exports.sendMany = (req, res) => {
  const fromaccount = req.body.fromaccount;
  const toaddresses = req.body.toaddresses;
  const confrim = req.body.confrim;

  try {
    client.call("sendmany", [fromaccount, toaddresses, confrim], function(
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

exports.sendToAddress = (req, res) => {
  const toaddress = req.body.toaddress;
  const amount = req.body.amount;
  const confrim = req.body.confrim;
  try {
    client.call("sendtoaddress", [toaddress, amount, confrim], function(
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

exports.listTransactions = (req, res) => {
  const account = req.body.account;
  const count = req.body.count;
  const from = req.body.from;
  try {
    client.call("listtransactions", [account, count, from], function(
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

exports.listSinceBlock = (req, res) => {
  const blockhash = req.params.blockhash;

  try {
    client.call("listsinceblock", [blockhash, 1], function(err, result) {
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
exports.getBlocksLatest = (req, res) => {
  const count = req.params.count;

  try {
    // get block count
    client.call("getblockcount", [], async function(err, blockCount) {
      if (err) {
        return res.json({ status: 400, msg: "errors", data: err });
      }

      var arrBlocks = [];
      for (var i = 1; i <= count; i++) {
        var index = blockCount - i;

        // promisify('getblockhash', [index])
        //   .then(result => console.log(result))
        //   .catch(e => console.log(e));

        var hash = await promisify("getblockhash", [index]);
        if (hash) {
          var block = await promisify("getblock", [hash]);
          if (block) arrBlocks.push(block);
        }
      }

      return res.json({ status: 200, msg: "sccuess", data: arrBlocks });
    });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.getBlocks = async (req, res) => {
  const height = req.query.height;
  const count = req.query.count;

  try {
    // get block count
    var arrBlocks = [];
    for (var i = 0; i < count; i++) {
      var index = height - i;

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

exports.getBlockHeight = async (req, res) => {
  const height = req.params.height;

  try {
    var hash = await promisify("getblockhash", [Number(height)]);
    if (hash) {
      var block = await promisify("getblock", [hash]);
      if (block) return res.json({ status: 200, msg: "sccuess", data: block });
    }

    return res.json({
      status: 400,
      msg: "errors",
      data: "no existing block !"
    });
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

exports.getBlockTransactions = async (req, res) => {
  const height = req.params.height;

  try {
    var hash = await promisify("getblockhash", [Number(height)]);
    if (hash) {
      var block = await promisify("getblock", [hash]);
      var txs = block["tx"];
      var arrTxs = [];
      for (var i = 0; i < txs.length; i++) {
        var txInfo = await promisify("getrawtransaction", [txs[i], 1]);
        arrTxs.push(txInfo);
      }
      return res.json({ status: 200, msg: "errors", data: arrTxs });
    }

    return res.json({
      status: 400,
      msg: "errors",
      data: "no existing block !"
    });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};
