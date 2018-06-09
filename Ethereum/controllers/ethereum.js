var config = require("../config/common").info;
var web3 = require("../config/common").web3;
var TransactionModel = require("../model/transactions");
var TokenModel = require("../model/tokens");

async function getTransactionDetailsFunc(hash) {
  try {
    var transaction = await web3.eth.getTransaction(hash);
    try {
      var blockdata = await web3.eth.getBlock(transaction.blockNumber, false);
      let txreceipt = await web3.eth.getTransactionReceipt(hash);

      let fee = txreceipt.gasUsed * transaction.gasPrice;
      // fee = fee / 1e18;

      transaction.block = blockdata;
      transaction.txreceipt = txreceipt;
      transaction.fee = fee;
    } catch (e) { }
    return transaction;
  } catch (error) {
    console.log("getTransaction: we have a promblem: ", error); // Should dump errors here
    return undefined;
  }
}

exports.getBalance = function (req, res) {
  var addr = req.params.address;

  // Show the address in the console.
  //console.log('Address:', addr);

  // Use Wb3 to get the balance of the address, convert it and then show it in the console.
  web3.eth.getBalance(addr, function (error, result) {
    if (!error) {
      var ethervalue = web3.utils.fromWei(result, "ether");
      //console.log('Ether:', ethervalue); // Show the ether balance after converting it from Wei
      res.json({ status: 200, msg: "success", data: ethervalue });
    } else {
      console.log("we have a promblem: ", error); // Should dump errors here
      return res.json({ status: 400, msg: "Error !", data: error });
    }
  });
};

exports.getBalance = function (req, res) {
  var addr = req.params.address;

  // Show the address in the console.
  //console.log('Address:', addr);

  // Use Wb3 to get the balance of the address, convert it and then show it in the console.
  web3.eth.getBalance(addr, function (error, result) {
    if (!error) {
      var ethervalue = web3.utils.fromWei(result, "ether");
      //console.log('Ether:', ethervalue); // Show the ether balance after converting it from Wei
      return res.json({ status: 200, msg: "success", data: ethervalue });
    } else {
      console.log("we have a promblem: ", error); // Should dump errors here
      return res.json({ status: 400, msg: "Error !", data: error });
    }
  });
};

exports.createAccount = function (req, res) {
  console.log("createAccount");

  // Use Wb3 to get the balance of the address, convert it and then show it in the console.
  web3.eth.personal.newAccount(config.mainpass, function (error, result) {
    if (!error) {
      console.log("New Account:", result);
      return res.json({ status: 200, msg: "success", data: result });
    } else {
      console.log("createAccount error: ", error); // Should dump errors here
      return res.json({ status: 400, msg: "Error !", data: error });
    }
  });
};

//to enable calls of personal functions, need to set --rpcapi eth,web3,personal when call geth
exports.sendTransaction = function (req, res) {
  console.log("sendTransaction", req.body);
  var from = req.body.from;
  var to = req.body.to;
  var value = req.body.value;
  // Use Wb3 to get the balance of the address, convert it and then show it in the console.
  web3.eth.personal.unlockAccount(from, config.mainpass, function (
    error,
    result
  ) {
    if (!error) {
      console.log("Unlocked Account: ", result);
      web3.eth.sendTransaction(
        {
          from: from,
          to: to,
          value: web3.utils.toWei(value)
        },
        function (err, hash) {
          if (!err) {
            console.log("Send transaction: ", hash);
            return res.json({ status: 200, msg: "success", data: hash });
          } else {
            console.log("error: ", err);
            return res.json({
              status: 400,
              msg: "Send transaction error !",
              data: error
            });
          }
        }
      );
    } else {
      console.log("we have a promblem: ", error); // Should dump errors here
      return res.json({
        status: 400,
        msg: "Unlock account error !",
        data: error
      });
    }
  });
};

exports.getUpdatedTransactions = function (req, res) {
  var blocknum = req.body.blocknum;

  var lastblock = web3.eth.getBlockNumber(async function (error, number) {
    //console.log("lastblock= ", number);

    if (!error) {
      try {
        var blocks = [];
        for (let i = blocknum; i <= number; i++) {
          var blockdata = await web3.eth.getBlock(i, true);
          blocks = blocks.concat(blockdata.transactions);
        }

        return res.json({
          status: 200,
          msg: "successs",
          data: { lastblock: number, blocks }
        });
      } catch (e) {
        console.log("we have a promblem: ", e); // Should dump errors here
        return res.json({ status: 400, msg: "Get block error !", data: e });
      }
    } else {
      console.log("we have a promblem: ", error); // Should dump errors here
      return res.json({ status: 400, msg: "Error !", data: error });
    }
  });
};

/*
* Get blocklist of specified count of blocks from certain number.
* @param start_height number of block from where to get block list.
* @param count count of list to get.
* @return list of block information same as the etherscan.io
* Here are some differences:
*   Age is second unit.
*   Miner is address, not the name. In etherscan, name is only comment from user on site. 
*       refer: https://ethereum.stackexchange.com/questions/2620/how-can-i-add-my-name-next-to-address-on-etherscan
*   GasPrice is GWei unit
*   Reward cannot be retrieved from node. Maybe should get it from etherscan
*/
exports.blocklist = function (req, res) {
  var blocknum = req.body.blocknum;
  var count = req.body.count;

  web3.eth.getBlockNumber(async function (error, number) {
    if (!error) {
      try {
        console.log("last number " + number);
        var blocks = [];
        for (let i = blocknum; i <= number && i < blocknum + count; i++) {
          var blockdata = await web3.eth.getBlock(i, true);

          var Height = blockdata.number;
          var Age = blockdata.timestamp;
          var txn = blockdata.transactions.length;
          var Uncles = blockdata.uncles.length;
          var Miner = blockdata.miner;
          var GasUsed = blockdata.gasUsed;
          var GasLimit = blockdata.gasLimit;

          var Reward = 0;
          var gas = 0;
          for (let j = 0; j < txn; j++) {
            let hash = blockdata.transactions[j].hash;
            let gasprice = blockdata.transactions[j].gasPrice;
            let transaction = await web3.eth.getTransactionReceipt(hash);

            let price = gasprice * transaction.gasUsed;
            gas += transaction.gasUsed;
            Reward += price / 1000000000;
          }

          var GasPrice = txn ? Reward / gas : 0;
          Reward = Reward / 1000000000;

          blocks.push({
            blockNumber: Height,
            timeStamp: Age,
            txn: txn,
            uncles: Uncles,
            blockMiner: Miner,
            gasUsed: GasUsed,
            gasLimit: GasLimit,
            avgGasPrice: GasPrice.toFixed(2)
          });
        }

        console.log("blocks: ", blocks);
        return res.json({ status: 200, msg: "success", data: blocks });
      } catch (e) {
        console.log("blocklist: we have a promblem: ", e); // Should dump errors here
        return res.json({ status: 400, msg: "Error !", data: e });
      }
    } else {
      console.log("getBlockNumber: we have a promblem: ", error); // Should dump errors here
      return res.json({ status: 400, msg: "Error !", data: error });
    }
  });
};

/**
 * Get latest blocklist from offset and count.
 *
 * @param {Number} offset
 * @param {Number} count
 *
 * @returns { status: 200, msg: 'success', data: [block] }
 */
exports.getBlocks = function (req, res) {
  var offset = Number(req.query.offset);
  var count = Number(req.query.count);

  if (!offset) offset = 0;
  if (!count || count <= 0) count = 10;

  web3.eth.getBlockNumber(async function (error, number) {
    if (!error) {
      try {
        var blocks = [];
        for (let i = 0; i < count; i++) {
          var height = number - offset - i;
          if (height < 0) break;

          var blockdata = await web3.eth.getBlock(height, false);
          if (blockdata) blocks.push(blockdata);
        }

        return res.json({
          status: 200,
          msg: "success",
          data: { total: number, result: blocks }
        });
      } catch (e) {
        console.log("blocklist: we have a promblem: ", e); // Should dump errors here
        return res.json({ status: 400, msg: "Error !", data: e });
      }
    } else {
      console.log("getBlockNumber: we have a promblem: ", error); // Should dump errors here
      return res.json({ status: 400, msg: "Error !", data: error });
    }
  });
};

exports.getBlockByHash = async function (req, res) {
  var hash = req.params.hash;
  try {
    if (hash.length < 10) hash = Number(hash);
    var blockdata = await web3.eth.getBlock(hash, false);
    return res.json({ status: 200, msg: "success", data: blockdata });
  } catch (e) {
    return res.json({ status: 400, msg: "Error !", data: e });
  }
};

exports.getBlockDetails = async function (req, res) {
  var hash = req.params.hash;
  try {
    if (hash.length < 10) hash = Number(hash);
    var blockdata = await web3.eth.getBlock(hash, true);

    return res.json({ status: 200, msg: "success", data: blockdata });
  } catch (e) {
    return res.json({ status: 400, msg: "Error !", data: e });
  }
};

/**
 * Get transaction list by offset, count, order
 *
 * @param {Number} offset
 * @param {Number} count
 * @param {Number} order
 *
 * @returns transaction list
 */
exports.getTransactions = async function (req, res) {
  var offset = Number(req.query.offset);
  var count = Number(req.query.count);
  var order = Number(req.query.order);

  if (!offset) offset = 0;
  if (!count || count <= 0) count = 10;
  // condition
  var condition;
  if (order) condition = { timestamp: 1 };
  else condition = { timestamp: -1 };

  try {
    var total = await TransactionModel.find().count();
    TransactionModel.find()
      .sort(condition)
      .skip(offset)
      .limit(count)
      .exec(async function (error, rows) {
        if (error) {
          console.log("getTransactionList: we have a promblem: ", error); // Should dump errors here
          return res.json({ status: 400, msg: "DB error !", data: error });
        }
        var txs = [];
        for (let i = 0; i < rows.length; i++) {
          try {
            var tx = await web3.eth.getTransaction(rows[i]["hash"]);
            tx.timestamp = rows[i]["timestamp"];
            txs.push(tx);
          } catch (error) {
            console.log("get transaction error: ", error);
          }
        }
        return res.json({
          status: 200,
          msg: "success",
          data: { total, result: txs }
        });
      });
  } catch (error) {
    return res.json({ status: 400, msg: "Error occured !", data: error });
  }
};

exports.getTransactionsFromAccount = async function (req, res) {
  var address = req.params.address;
  var offset = Number(req.query.offset);
  var count = Number(req.query.count);
  var order = Number(req.query.order);

  if (!offset) offset = 0;
  if (!count || count <= 0) count = 10;

  var cond;
  if (order > 0) cond = { timestamp: 1 };
  else cond = { timestamp: -1 };

  try {
    var total = await TransactionModel.find()
      .or([{ from: address }, { to: address }])
      .count();

    var txs = TransactionModel.find()
      .or([{ from: address }, { to: address }])
      .sort(cond)
      .skip(offset)
      .limit(count)
      .exec(async function (error, rows) {
        if (error) {
          console.log("getTransactionList: we have a promblem: ", error); // Should dump errors here
          return res.json({ status: 400, msg: "DB error !", data: error });
        }
        var txs = [];
        for (let i = 0; i < rows.length; i++) {
          try {
            var tx = await web3.eth.getTransaction(rows[i]["hash"]);
            tx.timestamp = rows[i]["timestamp"];
            txs.push(tx);
          } catch (error) {
            console.log("get transaction error: ", error);
          }
        }
        return res.json({
          status: 200,
          msg: "success",
          data: { total, result: txs }
        });
      });
  } catch (error) {
    return res.json({
      status: 400,
      msg: "Error in reading transactions !",
      data: error
    });
  }
};

/*
* Get transactions count from Account
* @account: account address to get transactions
* @return count
* 
*/
exports.getTransactionCountFromAccount = async function (req, res) {
  var account = req.body.account;

  TransactionModel.find()
    .or([{ from: account }, { to: account }])
    .sort({ timestamp: -1 })
    .exec(function (error, transactions) {
      if (!error) {
        return res.json({
          status: 200,
          msg: "success",
          data: transactions.length
        });
      } else {
        console.log("getTransactionsFromAccount: we have a promblem: ", error); // Should dump errors here
        return res.json({ status: 400, msg: "DB error !", data: error });
      }
    });
};

exports.getTransactionInfo = function (req, res) {
  var hash = req.params.hash;
  web3.eth.getTransaction(hash, async function (error, transaction) {
    if (error) {
      console.log("getTransaction: we have a promblem: ", error); // Should dump errors here
      return res.json({
        status: 400,
        msg: "Get transaction error !",
        data: error
      });
    }
    return res.json({ status: 200, msg: "success", data: transaction });
  });
};

exports.getTransactionDetails = async function (req, res) {
  var hash = req.params.hash;

  var transaction = await getTransactionDetailsFunc(hash);
  if (transaction)
    return res.json({ status: 200, msg: "success", data: transaction });

  return res.json({ status: 400, msg: "errors" });
};

//api for token related
exports.getTokenList = function (req, res) {
  TokenModel.find()
    .sort({ symbol: 1 })
    .exec(function (error, tokens) {
      if (!error) {
        console.log(tokens);
        return res.json({ status: 200, msg: "success", data: tokens });
      } else {
        console.log("getTokenList: we have a promblem: ", error); // Should dump errors here
        return res.json({ status: 400, msg: "DB error !", data: error });
      }
    });
};

exports.addToken = function (req, res) {
  var symbol = req.body.symbol;
  var address = req.body.address;

  TokenModel.find({ symbol: symbol, address: address }).exec(function (
    error,
    tokens
  ) {
    if (!error) {
      if (tokens.length) {
        console.log("addToken: token already exsit"); // Should dump errors here
        return res.json({ status: 400, msg: "token already exsits !" });
      }

      var newToken = new TokenModel({ symbol: symbol, address: address });
      newToken.save(function (err, token) {
        return res.json({ status: 200, msg: "success", data: token });
      });
    } else {
      console.log("addToken: we have a promblem: ", error); // Should dump errors here
      return res.json({ status: 400, msg: "DB error", data: error });
    }
  });
};

exports.removeToken = function (req, res) {
  var symbol = req.body.symbol;
  var address = req.body.address;

  TokenModel.findOneAndRemove({ symbol: symbol, address: address }).exec(
    function (error, tokens) {
      if (!error) {
        return res.json({ status: 200, msg: "success" });
      } else {
        console.log("removeToken: we have a promblem: ", error); // Should dump errors here
        return res.json({ status: 400, msg: "Error !", data: error });
      }
    }
  );
};

exports.getSearch = async (req, res) => {
  var key = req.params.key;

  try {
    if (key.length < 10) {
      // block process
      key = Number(key);
      var blockdata = await web3.eth.getBlock(key, true);
      return res.json({ status: 200, msg: "success", data: blockdata });
    } else if (key.length >= 40 && key.length <= 42) {
      // address process
      return res.json({
        status: 200,
        msg: "sccuess",
        data: {
          result: `address is not implemented yet, address: ${key} !`,
          type: "address"
        }
      });
    } else if (key.length >= 64 && key.length <= 66) {
      // block or txid process
      // txdetails
      var txdetails = await getTransactionDetailsFunc(key);
      if (txdetails)
        return res.json({
          status: 200,
          msg: "sccuess",
          data: { result: txdetails, type: "transaction" }
        });

      // block details
      try {
        var block = await web3.eth.getBlock(key, true);
        if (block)
          return res.json({
            status: 200,
            msg: "sccuess",
            data: { result: block, type: "block" }
          });
      } catch (error) { }

      return res.json({ status: 400, msg: "No result !" });
    } else {
      return res.json({ status: 400, msg: "search key is not correct !" });
    }
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.postSendSignedTransaction = async function (req, res) {
  var raw = req.body.raw;
  try {
    if (String(raw).substring(0, 2) != '0x') raw = `0x${raw}`;

    await web3.eth.sendSignedTransaction(raw)
      .on('receipt', (receipt) => {
        // console.log(JSON.stringify(receipt));
        if (receipt)
          return res.json({ status: 200, msg: "success", data: receipt });
        return res.json({ status: 400, msg: "Empty receipt !" });
      });
    return res.json({ status: 400, msg: "send error !" });
  } catch (error) {
    return res.json({ status: 400, msg: "Error !", data: error });
  }
};
