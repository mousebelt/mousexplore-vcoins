// define local node object
var config = require("../config");
const client = config.localNode;

exports.promisify = function promisify(fn, args) {
  return new Promise((resolve, reject) => {
    try {
      client.call(fn, args, function (err, result) {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    } catch (error) {
      reject(error);
    }
  });
};

exports.getTxOutFunc = async function getTxOutFunc(txid, vout) {
  try {
    if (txid !== undefined && vout !== undefined) {
      var out = await promisify("getrawtransaction", [txid, 1]);
      return out.vout[vout] ? out.vout[vout] : undefined;
    }
  } catch (error) { }
  return undefined;
}

exports.getTxDetailsFunc = async function getTxDetailsFunc(txid) {
  try {
    var tx = await promisify("getrawtransaction", [txid, 1]);

    if (tx && tx.vin && tx.vin.length > 0) {
      var vins = [];
      for (let j = 0; j < tx.vin.length; j++) {
        var vin = tx.vin[j];
        var address = await getTxOutFunc(vin['txid'], vin['vout']);
        if (address) vin.address = address;
        vins.push(vin);
      }
      tx.vin = vins;
    }
    return tx;
  } catch (error) {
    console.log(error);
  }
  return undefined;
}

exports.getBlockDetailsFunc = async function getBlockDetailsFunc(hash) {
  try {
    if (String(hash).length < 10) {
      hash = await promisify("getblockhash", [Number(hash)]);
    }
    var block = await promisify("getblock", [hash]);
    var txs = [];
    for (let i = 0; i < block.tx.length; i++) {
      var txdetails = await getTxDetailsFunc(block.tx[i]);
      if (txdetails) txs.push(txdetails);
    }
    block.tx = txs;
    return block;
  } catch (error) {
    return undefined;
  }
}
