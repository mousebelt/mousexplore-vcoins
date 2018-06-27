// define local node object
var config = require("../config");

var promisify = function promisify(fn, args) {
  return new Promise((resolve, reject) => {
    try {
      var rpc = require("json-rpc2");
      var client = rpc.Client.$create(
        config.rpc_port, // RPC_PORT
        config.rpc_host, // RPC_HOST
      );

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

async function getTxOutFunc(txid, vout) {
  try {
    if (txid !== undefined && vout !== undefined) {
      var out = await promisify("getrawtransaction", [txid, 1]);
      return out.vout[vout] ? out.vout[vout] : undefined;
    }
  } catch (error) { }
  return undefined;
}

async function getTxDetailsFunc(txid) {
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

async function getBlockDetailsFunc(hash) {
  try {
    if (String(hash).length < 10) hash = Number(hash);
    var block = await promisify('getblock', [hash, 1]);
    return block;
  } catch (error) {
    return undefined;
  }
}

exports.promisify = promisify;
exports.getTxOutFunc = getTxOutFunc;
exports.getTxDetailsFunc = getTxDetailsFunc;
exports.getBlockDetailsFunc = getBlockDetailsFunc;
