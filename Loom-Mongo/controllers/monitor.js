const mongoose = require('mongoose');
const ServiceInfoModel = require('../models/serviceInfo');
const { reducedErrorMessage, isOutOfSyncing } = require('../modules/utils');
const { web3, loomProvider } = require('../modules/loom');
const { SYNCING_MONITOR_INFO_KEY } = require('../modules/constants');

exports.getServiceMonitor = async (req, res) => { // eslint-disable-line
  return res.status(200).send({ result: 'ok' });
};

exports.getDbMonitor = async (req, res) => { // eslint-disable-line
  try {
    if (mongoose.connection.readyState) {
      return res.status(200).send({ result: 'ok' });
    }
    throw new Error('db error');
  } catch (error) {
    return res.status(400).send({ result: 'error', message: reducedErrorMessage(error) });
  }
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

    return ServiceInfoModel.findOne({ key: SYNCING_MONITOR_INFO_KEY })
      .then((row) => {
        if (row) {
          if ((lastblock === row.data) && isOutOfSyncing(row.updated)) {
            return res.status(400).send({ result: 'error', message: 'Out of syncing' });
          }

          return res.status(200).send({ result: 'ok' });
        }
        return res.status(400).send({ result: 'error', message: 'Syncing info does not exist' });
      })
      .catch(err => res.status(400).send({ result: 'error', message: reducedErrorMessage(err) }));
  });
};
