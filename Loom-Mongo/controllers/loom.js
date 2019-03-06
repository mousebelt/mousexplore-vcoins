const ServiceInfoModel = require('../models/serviceInfo');
const TransactionModel = require('../models/transactions');
const { web3 } = require('../modules/loom');
const { isOutOfSyncing, reducedErrorMessage } = require('../modules/utils');

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
  const address = req.query.address;
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
  if (address) {
    filter = [{ from: address }, { to: address }];
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
