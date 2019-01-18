// define local node object
const _ = require('lodash');
const config = require('../config');
const client = config.localNode;
const TransactionModel = require('../model/transactions');
const UtxoModel = require('../model/utxo');
const ServiceInfoModel = require('../model/serviceinfo');
const UtilsModule = require('../modules/utils');
const promisify = UtilsModule.promisify;
const { isOutOfSyncing } = UtilsModule;

// Rpc apis

exports.getnewaddress = (req, res) => {
  const account = req.body.account;

  try {
    return client.call('getnewaddress', [account], (err, result) => {
      if (err) {
        return res.json({ status: 400, msg: 'errors', data: err });
      }
      return res.json({ status: 200, msg: 'sccuess', data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};

exports.setaccount = (req, res) => {
  const account = req.body.account;
  const address = req.body.address;

  try {
    return client.call('setaccount', [address, account], (err, result) => {
      if (err) {
        return res.json({ status: 400, msg: 'errors', data: err });
      }
      return res.json({ status: 200, msg: 'sccuess', data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};

exports.setTxFee = (req, res) => {
  const fee = req.body.fee;

  try {
    return client.call('settxfee', [Number(fee)], (err, result) => {
      if (err) {
        return res.json({ status: 400, msg: 'errors', data: err });
      }
      return res.json({ status: 200, msg: 'sccuess', data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};

exports.getReceivedByAccount = (req, res) => {
  const account = req.body.account;
  let minconf = req.body.minconf;

  if (!minconf) minconf = 1;

  try {
    return client.call('getreceivedbyaccount', [account, Number(minconf)], (
      err,
      result
    ) => {
      if (err) {
        return res.json({ status: 400, msg: 'errors', data: err });
      }
      return res.json({ status: 200, msg: 'sccuess', data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};

exports.getReceivedByAddress = (req, res) => {
  const address = req.body.address;
  let minconf = req.body.minconf;

  if (!minconf) minconf = 1;

  try {
    return client.call('getreceivedbyaddress', [address, Number(minconf)], (
      err,
      result
    ) => {
      if (err) {
        return res.json({ status: 400, msg: 'errors', data: err });
      }
      return res.json({ status: 200, msg: 'sccuess', data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};

exports.getAccountBalance = (req, res) => {
  const account = req.query.account;
  let minconf = req.query.minconf;

  if (!minconf) minconf = 1;

  try {
    return client.call('getbalance', [account, Number(minconf)], (
      err,
      result
    ) => {
      if (err) {
        return res.json({ status: 400, msg: 'errors', data: err });
      }
      return res.json({ status: 200, msg: 'sccuess', data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};

exports.getAllTransactionsByAccount = (req, res) => {
  const account = req.query.account;
  let count = req.query.count;
  let from = req.query.from;

  if (!count) count = 10;
  if (!from) from = 0;

  try {
    return client.call(
      'listtransactions',
      [account, Number(count), Number(from)],
      (err, result) => {
        if (err) {
          return res.json({ status: 400, msg: 'errors', data: err });
        }
        return res.json({ status: 200, msg: 'sccuess', data: result });
      }
    );
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};

exports.getAccount = (req, res) => {
  const address = req.params.address;

  try {
    return client.call('getaccount', [address], (err, result) => {
      if (err) {
        return res.json({ status: 400, msg: 'errors', data: err });
      }
      return res.json({ status: 200, msg: 'sccuess', data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};

exports.getAccountAddress = (req, res) => {
  const account = req.params.account;

  try {
    return client.call('getaccountaddress', [account], (err, result) => {
      if (err) {
        return res.json({ status: 400, msg: 'errors', data: err });
      }
      return res.json({ status: 200, msg: 'sccuess', data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};

exports.getAccountByAddress = (req, res) => {
  const account = req.params.account;

  try {
    return client.call('getaddressesbyaccount', [account], (err, result) => {
      if (err) {
        return res.json({ status: 400, msg: 'errors', data: err });
      }
      return res.json({ status: 200, msg: 'sccuess', data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};

exports.getBlockCount = (req, res) => {
  try {
    return client.call('getblockcount', [], (err, result) => {
      if (err) {
        return res.json({ status: 400, msg: 'errors', data: err });
      }
      return res.json({ status: 200, msg: 'sccuess', data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};

exports.getBestBlockHash = (req, res) => {
  try {
    return client.call('getbestblockhash', [], (err, result) => {
      if (err) {
        return res.json({ status: 400, msg: 'errors', data: err });
      }
      return res.json({ status: 200, msg: 'sccuess', data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};

exports.getBlock = async (req, res) => {
  let hash = req.params.hash;

  try {
    if (hash.length < 10) {
      hash = await promisify('getblockhash', [Number(hash)]);
    }

    return client.call('getblock', [hash], (err, result) => {
      if (err) {
        return res.json({ status: 400, msg: 'errors', data: err });
      }

      return res.json({ status: 200, msg: 'sccuess', data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};

exports.getBlockDetails = async (req, res) => {
  const hash = req.params.hash;

  const block = await UtilsModule.getBlockDetailsFunc(hash);
  if (block) return res.json({ status: 200, msg: 'sccuess', data: block });
  return res.json({ status: 400, msg: 'Error occured !' });
};

exports.getBlockHash = (req, res) => {
  const index = req.params.index;

  try {
    return client.call('getblockhash', [Number(index)], (err, result) => {
      if (err) {
        return res.json({ status: 400, msg: 'errors', data: err });
      }
      return res.json({ status: 200, msg: 'sccuess', data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};

exports.getTransaction = (req, res) => {
  const txid = req.params.txid;

  try {
    return client.call('gettransaction', [txid], (err, result) => {
      if (err) {
        return res.json({ status: 400, msg: 'errors', data: err });
      }
      return res.json({ status: 200, msg: 'sccuess', data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};

exports.getRawTransaction = (req, res) => {
  const txid = req.params.txid;
  const verbose = req.query.verbose;

  try {
    return client.call('getrawtransaction', [txid, Number(verbose)], (
      err,
      result
    ) => {
      if (err) {
        return res.json({ status: 400, msg: 'errors', data: err });
      }
      return res.json({ status: 200, msg: 'sccuess', data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};

exports.listAccounts = (req, res) => {
  let minconf = req.query.minconf;
  if (!minconf) minconf = 1;

  try {
    return client.call('listaccounts', [Number(minconf)], (err, result) => {
      if (err) {
        return res.json({ status: 400, msg: 'errors', data: err });
      }
      return res.json({ status: 200, msg: 'sccuess', data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};

exports.sendFrom = (req, res) => {
  const fromaccount = req.body.fromaccount;
  const toaddress = req.body.toaddress;
  const amount = req.body.amount;
  let minconf = req.body.minconf;
  const comment = req.body.comment;
  const commentto = req.body.commentto;

  if (!minconf) minconf = 1;

  try {
    return client.call(
      'sendfrom',
      [
        fromaccount,
        toaddress,
        Number(amount),
        Number(minconf),
        comment,
        commentto
      ],
      (err, result) => {
        if (err) {
          return res.json({ status: 400, msg: 'errors', data: err });
        }
        return res.json({ status: 200, msg: 'sccuess', data: result });
      }
    );
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};

exports.sendMany = (req, res) => {
  const fromaccount = req.body.fromaccount;
  const toaddresses = req.body.toaddresses;
  let minconf = req.body.minconf;
  const comment = req.body.comment;

  if (!minconf) minconf = 1;

  try {
    return client.call(
      'sendmany',
      [fromaccount, toaddresses, Number(minconf), comment],
      (err, result) => {
        if (err) {
          return res.json({ status: 400, msg: 'errors', data: err });
        }
        return res.json({ status: 200, msg: 'sccuess', data: result });
      }
    );
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};

exports.sendToAddress = (req, res) => {
  const toaddress = req.body.toaddress;
  const amount = req.body.amount;
  const comment = req.body.comment;
  const commentto = req.body.commentto;
  try {
    return client.call(
      'sendtoaddress',
      [toaddress, Number(amount), comment, commentto],
      (err, result) => {
        if (err) {
          return res.json({ status: 400, msg: 'errors', data: err });
        }
        return res.json({ status: 200, msg: 'sccuess', data: result });
      }
    );
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};

exports.listTransactions = (req, res) => {
  const account = req.body.account;
  let count = req.body.count;
  let from = req.body.from;

  if (!count) count = 10;
  if (!from) from = 0;

  try {
    return client.call(
      'listtransactions',
      [account, Number(count), Number(from)],
      (err, result) => {
        if (err) {
          return res.json({ status: 400, msg: 'errors', data: err });
        }
        return res.json({ status: 200, msg: 'sccuess', data: result });
      }
    );
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};

exports.listSinceBlock = (req, res) => {
  const blockhash = req.query.blockhash;
  const confirm = req.query.confirm;

  try {
    return client.call('listsinceblock', [blockhash, Number(confirm)], (
      err,
      result
    ) => {
      if (err) {
        return res.json({ status: 400, msg: 'errors', data: err });
      }
      return res.json({ status: 200, msg: 'sccuess', data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};

// /////////////////////////////////////////////////////////////////////////////////////////////////////
// // Utility apis ////
// /////////////////////////////////////////////////////////////////////////////////////////////////////
exports.getMonitor = async (req, res) => res.json({ status: 200, msg: 'success', data: 'Server is working now !' });

exports.getMonitorDb = async (req, res) => {
  try {
    if (require('mongoose').connection.readyState) { // eslint-disable-line
      return res.json({ status: 200, msg: 'success', data: 'Db is working now !' });
    }

    throw new Error('db error');
  } catch (error) {
    return res.status(400).json({ status: 400, msg: 'errors', data: 'Db is not working now !' });
  }
};

exports.getMonitorRpc = async (req, res) => {
  try {
    return client.call('getblockchaininfo', [], (err, result) => {
      if (err) {
        return res.status(400).json({ status: 400, msg: 'errors', data: err.toString() });
      }
      return res.json({ status: 200, msg: 'sccuess', data: result });
    });
  } catch (err) {
    return res.status(400).json({ status: 400, msg: 'errors', data: err.toString() });
  }
};

exports.getMonitorSyncing = async (req, res) => {
  try {
    return client.call('getblockcount', [], (err, lastblock) => {
      if (err) {
        return res.status(400).send({ result: 'error', msg: 'Rpc error occurred', error: err.toString() });
      }

      return ServiceInfoModel.findOne()
        .then(row => {
          if (row) {
            if ((lastblock === row.lastblock) && isOutOfSyncing(row.updatedAt)) {
              return res.status(400).send({ result: 'error', msg: 'Out of syncing' });
            }

            return res.status(200).send({ result: 'ok' });
          }
          return res.status(400).send({ result: 'error', msg: 'Db error occurred' });
        })
        .catch(err => res.status(400).send({ result: 'error', msg: 'Db error occurred', error: err.toString() })); // eslint-disable-line

    });
  } catch (error) {
    return res.status(400).send({ result: 'error', msg: 'Error occurred', error: error.toString() });
  }
};

exports.getSearch = async (req, res) => {
  const key = req.params.key;

  try {
    if (key.length < 10) {
      // block process
      const hash = await promisify('getblockhash', [Number(key)]);
      if (hash) return res.json({ status: 200, msg: 'sccuess', data: { type: 'block' } });
    } else if (key.length >= 25 && key.length <= 34) {
      // address process
      return res.json({
        status: 200,
        msg: 'sccuess',
        data: { type: 'address' }
      });
    } else if (key.length >= 64 && key.length <= 66) {
      // block or txid process
      try {
        const tx = await promisify('getrawtransaction', [key, 1]);
        if (tx) return res.json({ status: 200, msg: 'sccuess', data: { type: 'transaction' } });
      } catch (error) {
        // console.log(error);
      }

      // block details
      try {
        const block = await promisify('getblock', [key]);
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

exports.getBlocks = async (req, res) => {
  let offset = Number(req.query.offset);
  let count = Number(req.query.count);

  if (!offset) offset = 0;
  if (!count || count <= 0) count = 10;

  try {
    const blockCount = await promisify('getblockcount', []);
    if (!blockCount) {
      return res.json({ status: 400, msg: 'empty blockcount !' });
    }

    const height = blockCount - offset;
    // get block count
    const arrBlocks = [];
    for (let i = 1; i <= count; i++) {
      const index = height - i;
      if (index < 0) break;

      const hash = await promisify('getblockhash', [index]);
      if (hash) {
        const block = await promisify('getblock', [hash]);
        if (block) arrBlocks.push(block);
      }
    }

    return res.json({
      status: 200,
      msg: 'sccuess',
      data: { total: blockCount, result: arrBlocks }
    });
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};

exports.getTransactionInfo = (req, res) => {
  const txid = req.params.txid;
  try {
    return client.call('getrawtransaction', [txid, 1], (err, result) => {
      if (err) {
        return res.json({ status: 400, msg: 'errors', data: err });
      }
      return res.json({ status: 200, msg: 'sccuess', data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};

exports.getTransactionDetails = async (req, res) => {
  const txid = req.params.txid;
  const txdetails = await UtilsModule.getTxDetailsFunc(txid);
  if (txdetails) return res.json({ status: 200, msg: 'sccuess', data: txdetails });

  return res.json({ status: 400, msg: 'errors' });
};

exports.getTransactions = async function (req, res) {
  let offset = Number(req.query.offset);
  let count = Number(req.query.count);
  const order = Number(req.query.order);

  if (!offset) offset = 0;
  if (!count || count <= 0) count = 10;
  // condition
  let condition;
  if (order) condition = { time: 1 };
  else condition = { time: -1 };

  // logic
  try {
    const total = await TransactionModel.find().count();
    return TransactionModel.find()
      .sort(condition)
      .skip(offset)
      .limit(count)
      .exec(async function (error, rows) {
        if (!error) {
          const txs = [];
          for (let i = 0; i < rows.length; i++) {
            // var tx = await UtilsModule.getTxDetailsFunc(rows[i].txid);
            // if (tx) txs.push(tx);

            // try {
            const tx = await promisify('getrawtransaction', [rows[i].txid, 1]);
            if (tx) txs.push(tx);
            // } catch (error) {}
          }
          return res.json({
            status: 200,
            msg: 'success',
            data: { total, result: txs }
          });
        }
        console.log('getTransactionList: we have a promblem: ', error); // Should dump errors here
        return res.json({ status: 400, msg: 'errors', data: error });
      });
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};

exports.getAddressTransactions = async function (req, res) {
  const address = req.params.address;
  let offset = Number(req.query.offset);
  let count = Number(req.query.count);
  let order = Number(req.query.order);

  if (!offset) offset = 0;
  if (!count || count <= 0) count = 10;

  if (order) order = { time: 1 };
  else order = { time: -1 };

  // logic
  try {
    const rows = await UtxoModel.find({ address })
      .sort(order);

    let arrTxid = _.map(rows, 'txid');
    arrTxid = _.uniqBy(arrTxid, (e) => e);

    // response
    const total = arrTxid.length;
    const txids = _.slice(arrTxid, offset, offset + count);

    const result = [];
    for (let i = 0; i < txids.length; i++) {
      const txid = txids[i];
      const txInfo = await UtilsModule.getTxDetailsFunc(txid);
      if (txInfo) result.push(txInfo);
    }
    return res.json({
      status: 200,
      msg: 'success',
      data: { total, result }
    });
  } catch (error) {
    // return res.json({ status: 400, msg: "error occured !" });
    return res.json({
      status: 200,
      msg: 'success',
      data: { total: 0, result: [] }
    });
  }
};

exports.getBalance = async function (req, res) {
  const address = req.params.address;

  // logic
  try {
    const utxoRows = await UtxoModel.find({ address });

    let balance = 0;
    for (let i = 0; i < utxoRows.length; i++) {
      balance += utxoRows[i].amount;
    }

    balance = Number(balance.toFixed(8));
    return res.json({
      status: 200,
      msg: 'success',
      data: { address, balance }
    });
  } catch (error) {
    return res.json({ status: 400, msg: 'error occured !', data: error });
  }
};
