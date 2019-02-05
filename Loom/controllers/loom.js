const mongoose = require('mongoose');
const ServiceInfoModel = require('../model/serviceinfo');
const { isOutOfSyncing } = require('../modules/utils');

const loom = require('loom-js');

const privateKey = loom.CryptoUtils.generatePrivateKey();
const publicKey = loom.CryptoUtils.publicKeyFromPrivateKey(privateKey);

// Create the client
const client = new loom.Client(
  'default',
  'ws://68.183.20.43:46658/websocket',
  'ws://68.183.20.43:9999/queryws'
);

const from = loom.LocalAddress.fromPublicKey(publicKey).toString(); // eslint-disable-line
const loomProvider = new loom.LoomProvider(client, privateKey);

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
    return res.status(400).json({ result: 'error', message: 'node rpc is not working' });
  }
};

exports.getMonitorSyncing = async (req, res) => {
  try {
    const jsonRPCString = '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":83}';
    const { result } = await loomProvider.sendAsync(JSON.parse(jsonRPCString));
    return ServiceInfoModel.findOne()
      .then(row => {
        if (row) {
          if ((result === row.lastblock) && isOutOfSyncing(row.updatedAt)) {
            return res.status(400).send({ result: 'error', message: 'Out of syncing' });
          }
          return res.status(200).send({ result: 'ok' });
        }
        return res.status(400).send({ result: 'error', msg: 'Db error occurred' });
      })
      .catch(err => res.status(400).send({ result: 'error', msg: 'Db error occurred' })); // eslint-disable-line
  } catch (error) {
    return res.status(400).send({ result: 'error', msg: 'Error occurred' });
  }
};
