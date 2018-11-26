// const _ = require('lodash');
const config = require('../config');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(config.provider));

const TransactionModel = require('../model/transactions');
const TokenModel = require('../model/tokens');

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
    const transaction = await web3.eth.getTransaction(hash);
    const blockdata = await web3.eth.getBlock(transaction.blockNumber, false);
    const txreceipt = await web3.eth.getTransactionReceipt(hash);

    const fee = txreceipt.gasUsed * transaction.gasPrice;
    // fee = fee / 1e18;

    transaction.block = blockdata;
    transaction.txreceipt = txreceipt;
    transaction.fee = fee;

    const tokenAddress = txreceipt.to.toLowerCase();
    const tokens = await TokenModel.find({ address: tokenAddress });

    if (tokens.length) {
      const token = tokens[0];

      const inputdata = transaction.input;
      const methodid = inputdata.slice(0, 10);
      if (methodid === '0xa9059cbb') {

        let to = inputdata.slice(10, 74);
        let amount = inputdata.slice(74, 138);

        to = to.replace(/^(0)*/, '');
        amount = amount.replace(/^(0)*/, '');
        amount = parseInt(`0x${amount}`, 16);
        amount = amount / Math.pow(10, token.decimal);

        transaction.txtoken = { symbol: token.symbol, from: txreceipt.from, to, amount };
      } else if (methodid === '0x23b872dd') {
        let from = inputdata.slice(10, 74);
        let to = inputdata.slice(74, 138);
        let amount = inputdata.slice(138, 202);

        from = from.replace(/^(0)*/, '');
        to = to.replace(/^(0)*/, '');
        amount = amount.replace(/^(0)*/, '');
        amount = parseInt(`0x${amount}`, 16);
        amount = amount / Math.pow(10, token.decimal);

        transaction.txtoken = { symbol: token.symbol, from, to, amount };
      }
    }
    return transaction;
  } catch (error) {
    console.log('getTransaction: we have a promblem: ', error); // Should dump errors here
    return undefined;
  }
}

exports.getBalance = async (req, res) => {
  let address = req.params.address;

  const balances = [];
  try {
    // Use Wb3 to get the balance of the address, convert it and then show it in the console.
    const ethBalance = await web3.eth.getBalance(address);
    const ethervalue = web3.utils.fromWei(ethBalance, 'ether');
    balances.push({ symbol: 'ETH', balance: ethervalue });

    const tokens = await TokenModel.find({});

    if (address.slice(0, 2) === '0x') {
      address = address.substring(2);
    }

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      // '0x70a08231' is the contract 'balanceOf()' ERC20 token function in hex.
      // A zero buffer is required and then we add the previously defined address with tokens
      const contractData = (`0x70a08231000000000000000000000000${address}`);

      // Now we call the token contract with the variables from above, response will be a big number string
      const result = await web3.eth.call({ to: token.address, data: contractData });

      // Convert the result to a usable number string
      let tokenBalance = web3.utils.toBN(result).toString();

      if (tokenBalance > 0) {
        // Change the string to be in Ether not Wei
        // tokenBalance = web3.utils.fromWei(tokenBalance, 'ether')
        tokenBalance = tokenBalance / Math.pow(10, token.decimal);
        balances.push({ symbol: token.symbol, balance: tokenBalance.toString() });
      }
    }

    return res.json({ status: 200, msg: 'success', data: { balances } });
  } catch (e) {
    console.log('we have a promblem: ', e); // Should dump errors here
    return res.json({ status: 400, msg: 'Error !', data: e });
  }
};

exports.createAccount = function (req, res) {
  // Use Wb3 to get the balance of the address, convert it and then show it in the console.
  web3.eth.personal.newAccount(config.mainpass, (error, result) => {
    if (!error) return res.json({ status: 200, msg: 'success', data: result });

    console.log('createAccount error: ', error); // Should dump errors here
    return res.json({ status: 400, msg: 'Error !', data: error });
  });
};

// to enable calls of personal functions, need to set --rpcapi eth,web3,personal when call geth
exports.sendTransaction = function (req, res) {
  const from = req.body.from;
  const to = req.body.to;
  const value = req.body.value;
  // Use Wb3 to get the balance of the address, convert it and then show it in the console.
  web3.eth.personal.unlockAccount(from, config.mainpass, (error, result) => { // eslint-disable-line
    if (!error) {
      web3.eth.sendTransaction(
        {
          from,
          to,
          value: web3.utils.toWei(value)
        },
        (err, hash) => {
          if (!err) return res.json({ status: 200, msg: 'success', data: hash });

          console.log('error: ', err);
          return res.json({
            status: 400,
            msg: 'Send transaction error !',
            data: error
          });
        }
      );
    } else {
      console.log('we have a promblem: ', error); // Should dump errors here
      return res.json({
        status: 400,
        msg: 'Unlock account error !',
        data: error
      });
    }
  });
};

exports.getUpdatedTransactions = function (req, res) {
  const blocknum = req.body.blocknum;

  web3.eth.getBlockNumber(async function (error, number) {

    if (!error) {
      try {
        let blocks = [];
        for (let i = blocknum; i <= number; i++) {
          const blockdata = await web3.eth.getBlock(i, true);
          blocks = blocks.concat(blockdata.transactions);
        }

        return res.json({
          status: 200,
          msg: 'success',
          data: { lastblock: number, blocks }
        });
      } catch (e) {
        console.log('we have a promblem: ', e); // Should dump errors here
        return res.json({ status: 400, msg: 'Get block error !', data: e });
      }
    } else {
      console.log('we have a promblem: ', error); // Should dump errors here
      return res.json({ status: 400, msg: 'Error !', data: error });
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
  const blocknum = req.body.blocknum;
  const count = req.body.count;

  web3.eth.getBlockNumber(async function (error, number) {
    if (!error) {
      try {
        const blocks = [];
        for (let i = blocknum; i <= number && i < blocknum + count; i++) {
          const blockdata = await web3.eth.getBlock(i, true);

          const Height = blockdata.number;
          const Age = blockdata.timestamp;
          const txn = blockdata.transactions.length;
          const Uncles = blockdata.uncles.length;
          const Miner = blockdata.miner;
          const GasUsed = blockdata.gasUsed;
          const GasLimit = blockdata.gasLimit;

          let Reward = 0;
          let gas = 0;
          for (let j = 0; j < txn; j++) {
            const hash = blockdata.transactions[j].hash;
            const gasprice = blockdata.transactions[j].gasPrice;
            const transaction = await web3.eth.getTransactionReceipt(hash);

            const price = gasprice * transaction.gasUsed;
            gas += transaction.gasUsed;
            Reward += price / 1000000000;
          }

          const GasPrice = txn ? Reward / gas : 0;
          Reward = Reward / 1000000000;

          blocks.push({
            blockNumber: Height,
            timeStamp: Age,
            txn,
            uncles: Uncles,
            blockMiner: Miner,
            gasUsed: GasUsed,
            gasLimit: GasLimit,
            avgGasPrice: GasPrice.toFixed(2)
          });
        }

        return res.json({ status: 200, msg: 'success', data: blocks });
      } catch (e) {
        console.log('blocklist: we have a promblem: ', e); // Should dump errors here
        return res.json({ status: 400, msg: 'Error !', data: e });
      }
    } else {
      console.log('getBlockNumber: we have a promblem: ', error); // Should dump errors here
      return res.json({ status: 400, msg: 'Error !', data: error });
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
  let offset = Number(req.query.offset);
  let count = Number(req.query.count);

  if (!offset) offset = 0;
  if (!count || count <= 0) count = 10;

  web3.eth.getBlockNumber(async function (error, number) {
    if (!error) {
      try {
        const blocks = [];
        for (let i = 0; i < count; i++) {
          const height = number - offset - i;
          if (height < 0) break;

          const blockdata = await web3.eth.getBlock(height, false);
          if (blockdata) blocks.push(blockdata);
        }

        return res.json({
          status: 200,
          msg: 'success',
          data: { total: number, result: blocks }
        });
      } catch (e) {
        console.log('blocklist: we have a promblem: ', e); // Should dump errors here
        return res.json({ status: 400, msg: 'Error !', data: e });
      }
    } else {
      console.log('getBlockNumber: we have a promblem: ', error); // Should dump errors here
      return res.json({ status: 400, msg: 'Error !', data: error });
    }
  });
};

exports.getBlockByHash = async function (req, res) {
  let hash = req.params.hash;
  try {
    if (hash.length < 10) hash = Number(hash);
    const blockdata = await web3.eth.getBlock(hash, false);
    return res.json({ status: 200, msg: 'success', data: blockdata });
  } catch (e) {
    return res.json({ status: 400, msg: 'Error !', data: e });
  }
};

exports.getBlockDetails = async function (req, res) {
  let hash = req.params.hash;
  try {
    if (hash.length < 10) hash = Number(hash);
    const blockdata = await web3.eth.getBlock(hash, true);

    return res.json({ status: 200, msg: 'success', data: blockdata });
  } catch (e) {
    return res.json({ status: 400, msg: 'Error !', data: e });
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
exports.getTransactions = async (req, res) => {
  const contract = Number(req.query.contract);
  let offset = Number(req.query.offset);
  let count = Number(req.query.count);
  const order = Number(req.query.order);

  if (!offset) offset = 0;
  if (!count || count <= 0) count = 10;
  // condition
  let condition;
  if (order) condition = { timestamp: 1 };
  else condition = { timestamp: -1 };

  let filter = {};
  if (contract) {
    filter = { from: contract, to: contract };
  }

  try {
    const total = await TransactionModel.find(filter).count();
    return TransactionModel.find()
      .or(filter)
      .sort(condition)
      .skip(offset)
      .limit(count)
      .exec(async function (error, rows) {
        if (error) {
          console.log('getTransactionList: we have a promblem: ', error); // Should dump errors here
          return res.json({ status: 400, msg: 'DB error !', data: error });
        }
        const txs = [];
        for (let i = 0; i < rows.length; i++) {
          try {
            const tx = await web3.eth.getTransaction(rows[i].hash);
            tx.timestamp = rows[i].timestamp;
            txs.push(tx);
          } catch (e) {
            console.log('get transaction error: ', e);
          }
        }
        return res.json({
          status: 200,
          msg: 'success',
          data: { total, result: txs }
        });
      });
  } catch (error) {
    return res.json({ status: 400, msg: 'Error occured !', data: error });
  }
};

exports.getTransactionsFromAccount = async (req, res) => {
  let address = req.params.address;

  if (address) {
    address = address.toLowerCase();
  }

  let offset = Number(req.query.offset);
  let count = Number(req.query.count);
  const order = Number(req.query.order);

  if (!offset) offset = 0;
  if (!count || count <= 0) count = 10;

  let cond;
  if (order > 0) cond = { timestamp: 1 };
  else cond = { timestamp: -1 };

  try {
    const total = await TransactionModel.find()
      .or([{ from: address }, { to: address }])
      .count();

    return TransactionModel.find()
      .or([{ from: address }, { to: address }])
      .sort(cond)
      .skip(offset)
      .limit(count)
      .exec(async function (error, rows) {
        if (error) {
          console.log('getTransactionList: we have a promblem: ', error); // Should dump errors here
          return res.json({ status: 400, msg: 'DB error !', data: error });
        }
        const txs = [];
        for (let i = 0; i < rows.length; i++) {
          try {
            const tx = await web3.eth.getTransaction(rows[i].hash);
            tx.timestamp = rows[i].timestamp;
            txs.push(tx);
          } catch (e) {
            console.log('get transaction error: ', e);
          }
        }
        return res.json({
          status: 200,
          msg: 'success',
          data: { total, result: txs }
        });
      });
  } catch (error) {
    return res.json({
      status: 400,
      msg: 'Error in reading transactions !',
      data: error
    });
  }
};


/*
* Get transacti0n count from Account
* @account: account address to get transaction count
* @return transaction count
*/
exports.getTransactionCount = async function (req, res) {
  const address = req.params.address;

  web3.eth.getTransactionCount(address, 'pending', async function (error, count) {
    if (!error) {
      return res.json({
        status: 200,
        msg: 'success',
        data: count
      });
    }
    console.log('getTransactionCount: we have a promblem: ', error); // Should dump errors here
    return res.json({ status: 400, msg: 'fail', data: error });
  });
};

exports.getTransactionInfo = function (req, res) {
  const hash = req.params.hash;
  web3.eth.getTransaction(hash, async function (error, transaction) {
    if (error) {
      console.log('getTransactionInfo: we have a promblem: ', error); // Should dump errors here
      return res.json({
        status: 400,
        msg: 'Get transaction error !',
        data: error
      });
    }
    return res.json({ status: 200, msg: 'success', data: transaction });
  });
};

exports.getTransactionDetails = async function (req, res) {
  const hash = req.params.hash;

  const transaction = await getTransactionDetailsFunc(hash);
  if (transaction) return res.json({ status: 200, msg: 'success', data: transaction });

  return res.json({ status: 400, msg: 'errors' });
};

// api for token related
exports.getTokenList = function (req, res) {
  TokenModel.find()
    .sort({ symbol: 1 })
    .exec((error, tokens) => {
      if (!error) return res.json({ status: 200, msg: 'success', data: tokens });

      console.log('getTokenList: we have a promblem: ', error); // Should dump errors here
      return res.json({ status: 400, msg: 'DB error !', data: error });
    });
};

exports.addToken = function (req, res) {
  const symbol = req.body.symbol;
  let address = req.body.address;

  if (address) {
    address = address.toLowerCase();
  }

  TokenModel.find({ symbol, address }).exec((error, tokens) => {
    if (!error) {
      if (tokens.length) {
        return res.json({ status: 400, msg: 'token already exsits !' });
      }

      const newToken = new TokenModel({ symbol, address });
      return newToken.save((err, token) => { // eslint-disable-line
        return res.json({ status: 200, msg: 'success', data: token });
      });
    }

    console.log('addToken: we have a promblem: ', error); // Should dump errors here
    return res.json({ status: 400, msg: 'DB error', data: error });
  });
};

exports.removeToken = function (req, res) {
  const symbol = req.body.symbol;
  let address = req.body.address;

  if (address) {
    address = address.toLowerCase();
  }

  TokenModel.findOneAndRemove({ symbol, address }).exec(
    (error, tokens) => { // eslint-disable-line
      if (!error) {
        return res.json({ status: 200, msg: 'success' });
      }
      console.log('removeToken: we have a promblem: ', error); // Should dump errors here
      return res.json({ status: 400, msg: 'Error !', data: error });
    }
  );
};

exports.getSearch = async (req, res) => {
  let key = req.params.key;

  try {
    if (key.length < 10) {
      // block process
      key = Number(key);
      const blockdata = await web3.eth.getBlock(key, true);
      if (blockdata) return res.json({ status: 200, msg: 'success', data: { type: 'block' } });
    } else if (key.length >= 40 && key.length <= 42) {
      // address process
      return res.json({ status: 200, msg: 'sccuess', data: { type: 'address' } });
    } else if (key.length >= 64 && key.length <= 66) {
      // block or txid process
      try {
        const transaction = await web3.eth.getTransaction(key);
        if (transaction) return res.json({ status: 200, msg: 'sccuess', data: { type: 'transaction' } });
      } catch (error) {
        // console.log(error);
      }

      // block details
      try {
        const block = await web3.eth.getBlock(key, false);
        if (block) return res.json({ status: 200, msg: 'sccuess', data: { type: 'block' } });
      } catch (error) {
        // console.log(error);
      }
    }

    return res.json({ status: 400, msg: 'search key is not correct !' });
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};

exports.postSendSignedTransaction = async (req, res) => {
  let raw = req.body.raw;
  try {
    if (String(raw).substring(0, 2) !== '0x') raw = `0x${raw}`;

    return web3.eth.sendSignedTransaction(raw, (err, hash) => {
      if (!err) {
        return res.json({ status: 200, msg: 'success', data: hash });
      } else { // eslint-disable-line
        return res.json({ status: 400, msg: 'errors', data: err.toString() });
      }
    });
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error.toString() });
  }
};

exports.getMonitor = async (req, res) => { // eslint-disable-line
  return res.json({ status: 200, msg: 'success', data: 'Server is working now !' });
};

exports.getMonitorDb = async (req, res) => {
  try {
    if (require('mongoose').connection.readyState) return res.json({ status: 200, msg: 'success', data: 'Db is working now !' }); // eslint-disable-line
    throw new Error('db error');
  } catch (error) {
    return res.status(400).json({ status: 400, msg: 'errors', data: 'Db is not working now !' });
  }
};

exports.getMonitorRpc = async (req, res) => {
  try {
    return web3.eth.getProtocolVersion()
      .then(result => { // eslint-disable-line
        return res.json({ status: 200, msg: 'success', data: { protocolVersion: result } });
      })
      .catch(err => { // eslint-disable-line
        return res.status(400).json({ status: 400, msg: 'errors', data: err.toString() });
      });
  } catch (err) {
    return res.status(400).json({ status: 400, msg: 'errors', data: err.toString() });
  }
};

exports.getSentReceivedTxHistory = async (req, res) => {
  const address = String(req.params.address).toLowerCase();

  let offset = Number(req.query.offset);
  let count = Number(req.query.count);
  const order = Number(req.query.order);
  const mode = String(req.query.mode).toLowerCase(); // sent, received, all

  if (!offset) offset = 0;
  if (!count || count <= 0) count = 10;

  let querySort;
  if (order > 0) querySort = { timestamp: 1 };
  else querySort = { timestamp: -1 };

  try {
    let query = [{ to: address }, { tokenTo: address }, { from: address }, { tokenFrom: address }];
    if (mode === 'sent') {
      query = [{ from: address }, { tokenFrom: address }];
    } else if (mode === 'received') {
      query = [{ to: address }, { tokenTo: address }];
    } else {
      query = [{ to: address }, { tokenTo: address }, { from: address }, { tokenFrom: address }];
    }
    const total = await TransactionModel.find()
      .or(query)
      .countDocuments();

    return TransactionModel.find()
      .or(query)
      .sort(querySort)
      .skip(offset)
      .limit(count)
      .exec(async function (error, rows) {
        if (error) {
          console.log('getTransactionList: we have a promblem: ', error); // Should dump errors here
          return res.json({ status: 400, msg: 'Error occurred !' });
        }
        return res.json({ status: 200, msg: 'success', data: { total, result: rows } });
      });
  } catch (error) {
    return res.json({ status: 400, msg: 'Error occurred !', data: error });
  }
};

exports.getTxHistoryByTicker = async (req, res) => {
  const address = String(req.params.address).toLowerCase();

  const ticker = req.query.ticker ? String(req.query.ticker).toUpperCase() : 'ETH';
  let offset = Number(req.query.offset);
  let count = Number(req.query.count);
  const order = Number(req.query.order);

  if (!offset) offset = 0;
  if (!count || count <= 0) count = 10;

  let querySort;
  if (order > 0) querySort = { timestamp: 1 };
  else querySort = { timestamp: -1 };

  try {
    if (ticker === 'ETH') {
      const total = await TransactionModel.find()
        // .or([{ from: address }, { to: address }])
        .and([
          { $or: [{ from: address }, { to: address }] },
          { tokenSymbol: null }
        ])
        .countDocuments();

      return TransactionModel.find()
        .and([
          { $or: [{ from: address }, { to: address }] },
          { tokenSymbol: null }
        ])
        .sort(querySort)
        .skip(offset)
        .limit(count)
        .exec(async function (error, rows) {
          if (error) {
            console.log('getTransactionList: we have a promblem: ', error); // Should dump errors here
            return res.json({ status: 400, msg: 'Error occurred !' });
          }
          return res.json({
            status: 200,
            msg: 'success',
            data: {
              total,
              result: rows
              // result: _.map(rows, (row) => _.pick(
              //   row, ['hash', 'blocknumber', 'fee', 'from', 'timestamp', 'to', 'value', '']
              // ))
            }
          });
        });
    }

    const token = await TokenModel.findOne({ symbol: ticker });
    if (!token) return res.json({ status: 400, msg: 'Ticker is not found !' });

    // find erc20 token txs
    const total = await TransactionModel.find()
      .and([
        { $or: [{ tokenFrom: address }, { tokenTo: address }] },
        { to: token.address }
      ])
      .countDocuments();

    return TransactionModel.find()
      .and([
        { $or: [{ tokenFrom: address }, { tokenTo: address }] },
        { to: token.address }
      ])
      .sort(querySort)
      .skip(offset)
      .limit(count)
      .exec(async function (error, rows) {
        if (error) {
          console.log('getTransactionList: we have a promblem: ', error); // Should dump errors here
          return res.json({ status: 400, msg: 'Error occurred !' });
        }
        return res.json({ status: 200, msg: 'success', data: { total, result: rows } });
      });
  } catch (error) {
    return res.json({ status: 400, msg: 'Error occurred !', data: error });
  }
};
