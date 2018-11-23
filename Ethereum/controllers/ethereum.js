var config = require("../config");
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider(config.provider));

var TransactionModel = require("../model/transactions");
var TokenModel = require("../model/tokens");

/*
contract methodid
dd62ed3e allowance(address,address)
095ea7b3 approve(address,uint256)
70a08231 balanceOf(address)
313ce567 decimals()
06fdde03 name()
95d89b41 symbol()
18160ddd totalSupply()
a9059cbb transfer(address,uint256)
23b872dd transferFrom(address,address,uint256)
54fd4d50 version()
*/

async function getTransactionDetailsFunc(hash) {
  try {
    var transaction = await web3.eth.getTransaction(hash);
    var blockdata = await web3.eth.getBlock(transaction.blockNumber, false);
    let txreceipt = await web3.eth.getTransactionReceipt(hash);

    let fee = txreceipt.gasUsed * transaction.gasPrice;
    // fee = fee / 1e18;

    transaction.block = blockdata;
    transaction.txreceipt = txreceipt;
    transaction.fee = fee;

    let tokenAddress = txreceipt.to.toLowerCase();
    let tokens = await TokenModel.find({ address: tokenAddress });

    if (tokens.length) {
      token = tokens[0];

      var inputdata = transaction.input;
      let methodid = inputdata.slice(0, 10);
      if (methodid == "0xa9059cbb") {

        let to = inputdata.slice(10, 74);
        let amount = inputdata.slice(74, 138);

        to = to.replace(/^(0)*/, '');
        amount = amount.replace(/^(0)*/, '');
        amount = parseInt('0x' + amount, 16);
        amount = amount / Math.pow(10, token.decimal);

        transaction.txtoken = { symbol: token.symbol, from: txreceipt.from, to: to, amount: amount }
      }
      else if (methodid == "0x23b872dd") {
        let from = inputdata.slice(10, 74);
        let to = inputdata.slice(74, 138);
        let amount = inputdata.slice(138, 202);

        from = from.replace(/^(0)*/, '')
        to = to.replace(/^(0)*/, '')
        amount = amount.replace(/^(0)*/, '')
        amount = parseInt('0x' + amount, 16);
        amount = amount / Math.pow(10, token.decimal);

        transaction.txtoken = { symbol: token.symbol, from: from, to: to, amount: amount }
      }
    }
    return transaction;
  } catch (error) {
    console.log("getTransaction: we have a promblem: ", error); // Should dump errors here
    return undefined;
  }
}

exports.getBalance = async function (req, res) {
  var address = req.params.address;

  var balances = []
  try {
    // Use Wb3 to get the balance of the address, convert it and then show it in the console.
    var ethBalance = await web3.eth.getBalance(address);
    var ethervalue = web3.utils.fromWei(ethBalance, "ether");
    balances.push({ symbol: "ETH", balance: ethervalue })

    var tokens = await TokenModel.find({});

    if (address.slice(0, 2) == "0x") {
      address = address.substring(2)
    }

    for (let i = 0; i < tokens.length; i++) {
      var token = tokens[i];

      // '0x70a08231' is the contract 'balanceOf()' ERC20 token function in hex. A zero buffer is required and then we add the previously defined address with tokens
      var contractData = ('0x70a08231000000000000000000000000' + address);

      // Now we call the token contract with the variables from above, response will be a big number string 
      var result = await web3.eth.call({ to: token.address, data: contractData });

      // Convert the result to a usable number string
      var tokenBalance = web3.utils.toBN(result).toString();

      if (tokenBalance > 0) {
        // Change the string to be in Ether not Wei
        //tokenBalance = web3.utils.fromWei(tokenBalance, 'ether')
        tokenBalance = tokenBalance / Math.pow(10, token.decimal);
        balances.push({ symbol: token.symbol, balance: tokenBalance.toString() });
      }
    }

    res.json({ status: 200, msg: "success", data: { balances: balances } });

  } catch (e) {
    console.log("we have a promblem: ", e); // Should dump errors here
    return res.json({ status: 400, msg: "Error !", data: e });
  }
};

exports.createAccount = function (req, res) {
  // Use Wb3 to get the balance of the address, convert it and then show it in the console.
  web3.eth.personal.newAccount(config.mainpass, function (error, result) {
    if (!error) {
      return res.json({ status: 200, msg: "success", data: result });
    } else {
      console.log("createAccount error: ", error); // Should dump errors here
      return res.json({ status: 400, msg: "Error !", data: error });
    }
  });
};

//to enable calls of personal functions, need to set --rpcapi eth,web3,personal when call geth
exports.sendTransaction = function (req, res) {
  var from = req.body.from;
  var to = req.body.to;
  var value = req.body.value;
  // Use Wb3 to get the balance of the address, convert it and then show it in the console.
  web3.eth.personal.unlockAccount(from, config.mainpass, function (
    error,
    result
  ) {
    if (!error) {
      web3.eth.sendTransaction(
        {
          from: from,
          to: to,
          value: web3.utils.toWei(value)
        },
        function (err, hash) {
          if (!err) {
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
 * @param {Number} contract
 * @param {Number} offset
 * @param {Number} count
 * @param {Number} order
 *
 * @returns transaction list
 */
exports.getTransactions = async function (req, res) {
  var contract = Number(req.query.contract);
  var offset = Number(req.query.offset);
  var count = Number(req.query.count);
  var order = Number(req.query.order);

  if (!offset) offset = 0;
  if (!count || count <= 0) count = 10;
  // condition
  var condition;
  if (order) condition = { timestamp: 1 };
  else condition = { timestamp: -1 };

  var filter = {}
  if (contract) {
    filter = { from: contract, to: contract }
  }

  try {
    var total = await TransactionModel.find(filter).count();
    TransactionModel.find()
      .or(filter)
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

  if (address) {
    address = address.toLowerCase();
  }

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
* Get transacti0n count from Account
* @account: account address to get transaction count
* @return transaction count
* 
*/
exports.getTransactionCount = async function (req, res) {
  var address = req.params.address;

  web3.eth.getTransactionCount(address, "pending", async function (error, count) {
    if (!error) {
      return res.json({
        status: 200,
        msg: "success",
        data: count
      });
    } else {
      console.log("getTransactionCount: we have a promblem: ", error); // Should dump errors here
      return res.json({ status: 400, msg: "fail", data: error });
    }
  })
}

exports.getTransactionInfo = function (req, res) {
  var hash = req.params.hash;
  web3.eth.getTransaction(hash, async function (error, transaction) {
    if (error) {
      console.log("getTransactionInfo: we have a promblem: ", error); // Should dump errors here
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

  if (address) {
    address = address.toLowerCase();
  }

  TokenModel.find({ symbol: symbol, address: address }).exec(function (
    error,
    tokens
  ) {
    if (!error) {
      if (tokens.length) {
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

  if (address) {
    address = address.toLowerCase();
  }

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
      if (blockdata) return res.json({ status: 200, msg: "success", data: { type: 'block' } });
    } else if (key.length >= 40 && key.length <= 42) {
      // address process
      return res.json({ status: 200, msg: "sccuess", data: { type: "address" } });
    } else if (key.length >= 64 && key.length <= 66) {
      // block or txid process
      try {
        var transaction = await web3.eth.getTransaction(key);
        if (transaction) return res.json({ status: 200, msg: "sccuess", data: { type: "transaction" } });
      } catch (error) { }

      // block details
      try {
        var block = await web3.eth.getBlock(key, false);
        if (block) return res.json({ status: 200, msg: "sccuess", data: { type: "block" } });
      } catch (error) { }
    }

    return res.json({ status: 400, msg: "search key is not correct !" });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.postSendSignedTransaction = async function (req, res) {
  var raw = req.body.raw;
  try {
    if (String(raw).substring(0, 2) != '0x') raw = `0x${raw}`;

    web3.eth.sendSignedTransaction(raw, function (err, hash) {
      if (!err) {
        return res.json({ status: 200, msg: "success", data: hash });
      } else {
        return res.json({ status: 400, msg: "errors", data: err.toString() });
      }
    });

    // web3.eth.sendSignedTransaction(raw)
    //   .on('transactionHash', function (hash) {
    //     return res.json({ status: 200, msg: 'success', data: hash })
    //   })
    //   // .on('confirmation', function (confirmationNumber, receipt) {
    //   // })
    //   .on('error', function (err) {
    //     return res.json({ status: 400, msg: "errors", data: err.toString() });
    //   });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error.toString() });
  }
};

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
    web3.eth.getProtocolVersion()
      .then(result => {
        return res.json({ status: 200, msg: "success", data: { protocolVersion: result } });
      })
      .catch(err => {
        return res.status(400).json({ status: 400, msg: "errors", data: err.toString() });
      })
  } catch (err) {
    return res.status(400).json({ status: 400, msg: "errors", data: err.toString() });
  }
};
