const config = require('../config');
const { Client, CryptoUtils, LoomProvider, LocalAddress } = require('loom-js');
const Web3 = require('web3');

const privateKey = CryptoUtils.generatePrivateKey();
const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey);

// Create the client
const client = new Client(
  config.client.chainId,
  config.client.writeUrl,
  config.client.readUrl
);

const from = LocalAddress.fromPublicKey(publicKey).toString(); // eslint-disable-line
const loomProvider = new LoomProvider(client, privateKey);
exports.loomProvider = loomProvider;
const web3 = new Web3(loomProvider);
exports.web3 = web3;
