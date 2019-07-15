/* eslint-disable no-await-in-loop, no-plusplus */
const config = require('../config');

const client = config.localNode;

function promisify(fn, args) {
  return new Promise((resolve, reject) => {
    try {
      client.call(fn, args, (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    } catch (error) {
      reject(error);
    }
  });
}

async function getTxOutFunc(txid, vout) {
  try {
    if (txid !== undefined && vout !== undefined) {
      const out = await promisify('getrawtransaction', [txid, 1]);
      return out.vout[vout] ? out.vout[vout] : undefined;
    }
  } catch (error) {
    // console.log(error);
  }
  return undefined;
}

async function getTxDetailsFunc(txid) {
  try {
    const tx = await promisify('getrawtransaction', [txid, 1]);

    if (tx && tx.vin && tx.vin.length > 0) {
      const vins = [];
      for (let j = 0; j < tx.vin.length; j++) {
        const vin = tx.vin[j];
        const address = await getTxOutFunc(vin.txid, vin.vout);
        if (address) vin.address = address;
        vins.push(vin);
      }
      tx.vin = vins;
    }
    return tx;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
  return undefined;
}

async function getBlockDetailsFunc(hash) {
  try {
    if (String(hash).length < 10) {
      hash = await promisify('getblockhash', [Number(hash)]);
    }
    const block = await promisify('getblock', [hash]);
    const txs = [];
    for (let i = 0; i < block.tx.length; i++) {
      const txdetails = await getTxDetailsFunc(block.tx[i]);
      if (txdetails) txs.push(txdetails);
    }
    block.tx = txs;
    return block;
  } catch (error) {
    return undefined;
  }
}

exports.promisify = promisify;
exports.getTxOutFunc = getTxOutFunc;
exports.getTxDetailsFunc = getTxDetailsFunc;
exports.getBlockDetailsFunc = getBlockDetailsFunc;

exports.isOutOfSyncing = (curMillis) => {
  const limit = config.CRON_SYNCING_MINUTES * 60 * 1000;
  const diff = Date.now - curMillis;
  return diff > limit;
};
