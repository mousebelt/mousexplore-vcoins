const models = require('../models');
const { reducedErrorMessage, isOutOfSyncing } = require('../utils');
const { web3, loomProvider } = require('../utils/loom');
const { SYNCING_MONITOR_INFO_KEY } = require('../utils/constants');

exports.getServiceMonitor = async (req, res) => { // eslint-disable-line
  return res.status(200).send({ result: 'ok', message: 'Server is working now !' });
};

exports.getDbMonitor = async (req, res) => { // eslint-disable-line
  models.sequelize
    .authenticate()
    .then(() => res.status(200).send({ result: 'ok', message: 'Connection has been established successfully.' }))
    .catch(err => res.status(200).send({ result: 'ok', message: reducedErrorMessage(err) }));
};

exports.getRpcMonitor = async (req, res) => {
  try {
    const jsonRPCString = '{"jsonrpc":"2.0","method":"net_version","params":[],"id":67}';
    const jsonResponse = await loomProvider.sendAsync(JSON.parse(jsonRPCString));
    return res.status(200).json({ result: 'ok', data: { net_version: jsonResponse } });
  } catch (err) {
    return res.status(400).json({ result: 'error', message: reducedErrorMessage(err) });
  }
};

exports.getSyncingMonitor = async (req, res) => { // eslint-disable-line
  web3.eth.getBlockNumber((error, lastblock) => {
    if (error) return res.status(400).send({ result: 'error', message: reducedErrorMessage(error) });
    return models.service_info.findOne({
      where: { key: SYNCING_MONITOR_INFO_KEY }
    })
      .then((obj) => {
        if (!obj) return res.status(400).send({ result: 'error', message: 'Syncing info does not exist' });
        if ((lastblock === obj.data) && isOutOfSyncing(obj.updatedAt)) {
          return res.status(400).send({ result: 'error', message: 'Out of syncing' });
        }

        return res.status(200).send({ result: 'ok' });
      })
      .catch(err => res.status(400).send({ result: 'error', message: reducedErrorMessage(err) }));
  });
};
