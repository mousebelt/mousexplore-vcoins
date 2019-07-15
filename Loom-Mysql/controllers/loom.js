/* eslint-disable no-await-in-loop, no-plusplus */
const models = require('../models');
const { reducedErrorMessage, getPageParams } = require('../utils');
const { web3 } = require('../utils/loom');

exports.getBlocks = function (req, res) {
  let offset = Number(req.query.offset);
  let count = Number(req.query.count);

  if (!offset) offset = 0;
  if (!count || count <= 0) count = 10;

  web3.eth.getBlockNumber(async (error, number) => {
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
  let { hash } = req.params;
  try {
    if (hash.length < 10) hash = Number(hash);
    const block = await web3.eth.getBlock(hash, true);

    return res.status(200).send({ result: 'ok', data: { block } });
  } catch (err) {
    return res.status(400).send({ result: 'error', message: reducedErrorMessage(err) });
  }
};

exports.getBlockByHash = async function (req, res) {
  let { hash } = req.params;
  try {
    if (hash.length < 10) hash = Number(hash);
    const block = await web3.eth.getBlock(hash, false);
    return res.status(200).send({ result: 'ok', data: { block } });
  } catch (err) {
    return res.status(400).send({ result: 'error', message: reducedErrorMessage(err) });
  }
};

exports.getTransactionInfo = function (req, res) {
  const { hash } = req.params;
  web3.eth.getTransaction(hash, async (error, transaction) => {
    if (error) {
      return res.status(400).send({ result: 'error', message: reducedErrorMessage(error) });
    }
    return res.status(200).send({ result: 'ok', data: { transaction } });
  });
};

exports.getTransactions = async (req, res) => {
  const { page, perPage } = getPageParams(req.query);
  let { address } = req.query;

  let where = {};
  if (address) {
    address = address.toLowerCase();
    where = { $or: [{ from: address }, { to: address }] };
  }

  models.loom_tx.findAndCountAll({
    where
  })
    .then((data) => {
      const pages = Math.ceil(data.count / perPage);
      const offset = perPage * (page - 1);
      const pagination = { count: data.count, pages };

      models.loom_tx.findAll({
        limit: perPage,
        offset,
        $sort: { timestamp: -1 },
        where
      })
        .then(async (objs) => {
          const transactions = [];
          for (let i = 0; i < objs.length; i++) {
            try {
              const tx = await web3.eth.getTransaction(objs[i].hash);
              tx.timestamp = objs[i].timestamp;
              transactions.push(tx);
            } catch (err) {
              // eslint-disable-next-line no-console
              console.log('get transaction error: ', err);
            }
          }
          return res.status(200).send({ result: 'ok', data: { pagination, transactions } });
        })
        .catch(err => res.status(400).send({ result: 'error', message: reducedErrorMessage(err) }));
    })
    .catch(err => res.status(400).send({ result: 'error', message: reducedErrorMessage(err) }));
};

exports.getSearch = async (req, res) => {
  let { key } = req.params;

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
