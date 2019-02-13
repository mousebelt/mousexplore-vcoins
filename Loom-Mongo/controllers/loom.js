const mongoose = require('mongoose');
const ServiceInfoModel = require('../model/serviceinfo');
const TransactionModel = require('../model/transactions');
const { isOutOfSyncing, reducedErrorMessage, web3, loomProvider } = require('../modules/utils');

// apis

exports.getMonitor = async (req, res) => { // eslint-disable-line
  return res.status(200).send({ result: 'ok', message: 'Server is working now !' });
};

exports.getMonitorDb = async (req, res) => {
  try {
    if (mongoose.connection.readyState) {
      return res.status(200).send({ result: 'ok', message: 'Db is working now !' });
    }
    throw new Error('db error');
  } catch (error) {
    return res.status(400).send({ result: 'error', message: 'Db is not working now !' });
  }
};

exports.getMonitorRpc = async (req, res) => {
  try {
    const jsonRPCString = '{"jsonrpc":"2.0","method":"net_version","params":[],"id":67}';
    const jsonResponse = await loomProvider.sendAsync(JSON.parse(jsonRPCString));
    return res.status(200).json({ result: 'ok', data: { net_version: jsonResponse } });
  } catch (err) {
    return res.status(400).json({ result: 'error', message: reducedErrorMessage(err) });
  }
};

exports.getMonitorSyncing = async (req, res) => {
  web3.eth.getBlockNumber((error, lastblock) => {
    if (error) return res.status(400).send({ result: 'error', message: reducedErrorMessage(error) });
    return ServiceInfoModel.findOne()
      .then(row => {
        if (row) {
          if ((lastblock === row.lastblock) && isOutOfSyncing(row.updatedAt)) {
            return res.status(400).send({ result: 'error', message: 'Out of syncing' });
          }

          return res.status(200).send({ result: 'ok' });
        }
        return res.status(400).send({ result: 'error', message: 'Db error occurred' });
      })
      .catch(err => res.status(400).send({ result: 'error', message: reducedErrorMessage(err) }));
  });
};

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

        return res.status(200).send({ result: 'ok', data: { total: number, blocks } });
      } catch (err) {
        return res.status(400).send({ result: 'error', message: reducedErrorMessage(err) });
      }
    } else {
      return res.status(400).send({ result: 'error', data: reducedErrorMessage(error) });
    }
  });
};

exports.getBlockDetails = async function (req, res) {
  let hash = req.params.hash;
  try {
    if (hash.length < 10) hash = Number(hash);
    const block = await web3.eth.getBlock(hash, true);

    return res.status(200).send({ result: 'ok', data: { block } });
  } catch (err) {
    return res.status(400).send({ result: 'error', message: reducedErrorMessage(err) });
  }
};

exports.getBlockByHash = async function (req, res) {
  let hash = req.params.hash;
  try {
    if (hash.length < 10) hash = Number(hash);
    const block = await web3.eth.getBlock(hash, false);
    return res.status(200).send({ result: 'ok', data: { block } });
  } catch (err) {
    return res.status(400).send({ result: 'error', message: reducedErrorMessage(err) });
  }
};

exports.getTransactionInfo = function (req, res) {
  const hash = req.params.hash;
  web3.eth.getTransaction(hash, async function (error, transaction) {
    if (error) {
      return res.status(400).send({ result: 'error', message: reducedErrorMessage(error) });
    }
    return res.status(200).send({ result: 'ok', data: { transaction } });
  });
};

exports.getTransactions = async (req, res) => {
  const contract = req.query.contract;
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
    filter = [{ from: contract }, { to: contract }];
  }

  try {
    const total = await TransactionModel.find().or(filter).count();
    return TransactionModel.find()
      .or(filter)
      .sort(condition)
      .skip(offset)
      .limit(count)
      .exec(async function (error, rows) {
        if (error) {
          return res.status(400).send({ result: 'error', message: reducedErrorMessage(error) });
        }
        const txs = [];
        for (let i = 0; i < rows.length; i++) {
          try {
            const tx = await web3.eth.getTransaction(rows[i].hash);
            tx.timestamp = rows[i].timestamp;
            txs.push(tx);
          } catch (err) {
            console.log('get transaction error: ', err);
          }
        }
        return res.status(200).send({ result: 'ok', data: { total, transactions: txs } });
      });
  } catch (error) {
    return res.status(400).send({ result: 'error', message: reducedErrorMessage(error) });
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
          return res.status(400).send({ result: 'error', message: reducedErrorMessage(error) });
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
        return res.status(200).send({ result: 'ok', data: { total, transactions: txs } });
      });
  } catch (error) {
    return res.status(400).send({ result: 'error', message: reducedErrorMessage(error) });
  }
};

exports.getSearch = async (req, res) => {
  let key = req.params.key;

  try {
    if (key.length < 10) {
      // block process
      key = Number(key);
      const blockdata = await web3.eth.getBlock(key, true);
      if (blockdata) return res.status(200).send({ result: 'ok', data: { type: 'block' } });
    } else if (key.length >= 40 && key.length <= 42) {
      // address process
      return res.status(200).send({ result: 'ok', data: { type: 'address' } });
    } else if (key.length >= 64 && key.length <= 66) {
      // block or txid process
      try {
        const transaction = await web3.eth.getTransaction(key);
        if (transaction) return res.status(200).send({ result: 'ok', data: { type: 'transaction' } });
      } catch (error) {
        // console.log(error);
      }

      // block details
      try {
        const block = await web3.eth.getBlock(key, false);
        if (block) return res.status(200).send({ result: 'ok', data: { type: 'block' } });
      } catch (error) {
        // console.log(error);
      }
    }

    return res.status(400).send({ result: 'error', message: 'Search key is not correct !' });
  } catch (error) {
    return res.status(400).send({ result: 'error', message: reducedErrorMessage(error) });
  }
};
