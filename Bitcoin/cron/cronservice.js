var config = require("../config");
var client = config.localNode;

var TransactionModel = require("../model/transactions");
var TxServiceInofModel = require("../model/txServiceInfo");
var AddressModel = require("../model/address");
var AddrServiceInofModel = require("../model/addrServiceInfo");

var fs = require('fs');
var Log = require('log'),
  log = new Log('debug', fs.createWriteStream(__dirname + '/debug.log', { flags: 'a' }));
// log = new Log('debug');

function filelog(...params) { //
  log.info(...params);
  // console.log(...params);
};

var promisify = function promisify(fn, args) {
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

////////////////////////////////////////////////////////////////////////////

async function getTxServiceInfo() {
  try {
    txServiceInfo = await TxServiceInofModel.findOne();
    if (txServiceInfo) return txServiceInfo;
    else return { lastblock: -1 }
  }
  catch (e) {
    filelog("getTxServiceInfo error: ", e);
    return undefined;
  }
}

async function saveTxServiceInfo(lastblock) {
  await TxServiceInofModel.findOne(async function (e, info) {
    if (!e) {
      if (info) {
        info.set({ lastblock });
      }
      else {
        info = new TxServiceInofModel({ lastblock });
      }
      await info.save();
    }
    else {
      filelog('saveTxServiceInfo error: ', e); // Should dump errors here
    }
  });
}

async function getAddrServiceInfo() {
  try {
    addrServiceInfo = await AddrServiceInofModel.findOne();
    if (addrServiceInfo) return addrServiceInfo;
    else return {
      lastTxid: "",
      lastTxOffset: 0,
    }
  }
  catch (e) {
    filelog("getAddrServiceInfo error: ", e);
    return undefined;
  }
}

async function saveAddrServiceInfo(lastTxid, lastTxOffset) {
  await AddrServiceInofModel.findOne(async function (e, info) {
    if (!e) {
      if (info) {
        info.set({
          lastTxid,
          lastTxOffset,
        });
      }
      else {
        info = new AddrServiceInofModel({
          lastTxid: "",
          lastTxOffset: 0,
        });
      }
      await info.save();
    }
    else {
      filelog('saveAddrServiceInfo error: ', e); // Should dump errors here
    }
  });
}

async function CheckUpdatedTransactions() {
  filelog('CheckUpdatedTransactions starting...');
  var lastblock;
  var txServiceInfo = await getTxServiceInfo();
  if (txServiceInfo) {
    lastblock = txServiceInfo.lastblock;
  } else {
    filelog('getTxServiceInfo error !');
    return;
  }

  try {
    var blockCount = await promisify("getblockcount", []);
    if (blockCount) {
      var limit = lastblock + config.TX_CRON_BLOCK_COUNT;
      for (let i = lastblock + 1; i < blockCount && i <= limit; i++) {
        try {
          var blockhash = await promisify("getblockhash", [i]);
          var blockdata = await promisify("getblock", [blockhash]);
          var txs = blockdata.tx;

          for (let j = 0; j < txs.length; j++) {
            let txid = txs[j]

            // Save Transaction Info
            var txRow = await TransactionModel.findOne({ txid });
            if (!txRow) {
              txRow = new TransactionModel({ txid });
              try {
                await txRow.save();
              }
              catch (e) {
                filelog(`transaction save error: i=${i}, j=${j}, txid=${txid}`); // Should dump errors here
                throw e;
              }
            }
          }

          if (lastblock != i) {
            lastblock = i;
            await saveTxServiceInfo(lastblock);
          }
        }
        catch (e) {
          filelog(`client getBlock error: i=${i}`);
          throw e;
        }
      }
    } else {
      throw 'client getBlockCount: blockcount is empty'; // Should dump errors here
    }
  } catch (error) {
    filelog('CheckUpdatedTransactions error: ', error); // Should dump errors here
  }
}

async function CheckUpdatedAddresses() {
  filelog('CheckUpdatedAddresses starting...');

  var lastTxid, lastTxOffset;
  var serviceInfo = await getAddrServiceInfo();
  if (serviceInfo) {
    lastTxid = serviceInfo.lastTxid;
    lastTxOffset = serviceInfo.lastTxOffset;
  } else {
    filelog('getAddrServiceInfo error !');
    return;
  }

  var arrTxs = await TransactionModel.find().skip(lastTxOffset).limit(config.ADDR_CRON_TX_COUNT);

  if (arrTxs && arrTxs.length > 0) {
    for (let i = 0; i < arrTxs.length; i++) {
      let { txid } = arrTxs[i];

      try {
        var txInfo = await promisify("getrawtransaction", [txid, 1]);
        if (!txInfo) {
          throw 'txInfo is null !'
        }

        var vin = txInfo.vin;
        var vout = txInfo.vout;
        // Save Address Info
        if (vin && vin.length > 0) {
          for (let j = 0; j < vin.length; j++) {
            var inTxid = vin[j].txid;
            var inVout = Number(vin[j].vout);

            if (!inTxid && inTxid != '' && inVout >= 0) continue;
            var inTxInfo = await promisify("gettxout", [inTxid, inVout]);
            if (!inTxInfo) {
              throw `inTxInfo not found. inTxid=${inTxid}`;
            }

            var addresses = inTxInfo.scriptPubKey.addresses;
            for (let k = 0; k < addresses.length; k++) {
              // Save Info
              var addressRow = await AddressModel.findOne({ address: addresses[k] });
              if (!addressRow) {
                addressRow = new AddressModel({
                  address: addresses[k],
                  txs: [],
                });
              }
              if (addressRow.txs.indexOf(addresses[k]) == -1) {
                addressRow.txs.push(addresses[k]);
                try {
                  await addressRow.save();
                }
                catch (e) {
                  filelog(`vin addressRow.save.txs error: i=${i}, j=${j}, k=${k}, addressRow=${addressRow}`); // Should dump errors here
                  throw e;
                }
              }
            }
          }
        }
        if (vout && vout.length > 0) {
          for (let j = 0; j < vout.length; j++) {
            var addresses = vout[j].scriptPubKey.addresses;
            for (let k = 0; k < addresses.length; k++) {
              // Save Info
              var addressRow = await AddressModel.findOne({ address: addresses[k] });
              if (!addressRow) {
                addressRow = new AddressModel({
                  address: addresses[k],
                  txs: [],
                });
              }
              if (addressRow.txs.indexOf(addresses[k]) == -1) {
                addressRow.txs.push(addresses[k]);
                try {
                  await addressRow.save();
                }
                catch (e) {
                  filelog(`addressRow.save.txs error: i=${i}, j=${j}, k=${k} addressRow=${addressRow}`); // Should dump errors here
                  throw e;
                }
              }
            }
          }
        }

        // Save service info
        lastTxid = txid;
        lastTxOffset++;
        await saveAddrServiceInfo(lastTxid, lastTxOffset);
      } catch (error) {
        filelog(`Address update error ! i=${i}, error: `, error);
        return;
      }
    }
  }
}

async function transactionService() {
  filelog("Start transaction service ...");
  await CheckUpdatedTransactions();
  setTimeout(transactionService, config.TX_CRON_TIME);
  filelog("Done transaction service .");
}

async function addressService() {
  filelog("Start address service ...");
  await CheckUpdatedAddresses();
  setTimeout(addressService, config.ADDR_CRON_TIME);
  filelog("Done address service .");
}

exports.start_cronService = async function () {
  filelog("Start neo cron service");

  transactionService();
  addressService();
}
