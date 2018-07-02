const _ = require("lodash");
var config = require("../config");
var client = config.localNode;

var TransactionModel = require("../model/transactions");
var TxServiceInofModel = require("../model/txServiceInfo");
var AddressModel = require("../model/address");
var TxMissingModel = require("../model/txMissing");

var UtilsModule = require("../modules/utils");

var fs = require("fs");
var Log = require("log"),
  log = new Log(
    "debug",
    fs.createWriteStream(__dirname + "/debug.log", { flags: "a" })
  );
// log = new Log('debug');

function filelog(...params) {
  log.info(...params);
}

var promisify = UtilsModule.promisify;

////////////////////////////////////////////////////////////////////////////

var lastblock = 0;
var lastTxIndex = 0;

async function getTxServiceInfo() {
  try {
    var info = await TxServiceInofModel.findOne();
    if (!info) {
      lastblock = 0;
      lastTxIndex = 0;
    } else {
      lastblock = info.lastblock;
      lastTxIndex = info.lastTxIndex;
    }

    return true;
  } catch (e) {
    filelog("getTxServiceInfo error: ", e);
    return false;
  }
}

async function saveTxServiceInfo(lastblock, lastTxIndex) {
  await TxServiceInofModel.findOne(async function(e, info) {
    if (!e) {
      if (info) {
        info.set({ lastblock, lastTxIndex });
      } else {
        info = new TxServiceInofModel({ lastblock, lastTxIndex });
      }
      await info.save();
    } else {
      filelog("saveTxServiceInfo error: ", e); // Should dump errors here
    }
  });
}

async function CheckUpdatedTransactions() {
  try {
    var blockCount = await promisify("getblockcount", []);
    if (!blockCount) throw "client getBlockCount: blockcount is empty";
    if (lastblock >= blockCount) return;

    var blockhash = await promisify("getblockhash", [lastblock]);
    var blockdata = await promisify("getblock", [blockhash]);
    var txs = blockdata.tx;

    for (let i = lastTxIndex; i < txs.length; i++) {
      let txid = txs[i];

      // skip genesis txid
      if (_.indexOf(config.genesisTxids, txid) > -1) continue;

      var txInfo;
      try {
        txInfo = await promisify("getrawtransaction", [txid, 1]);
        if (!txInfo) throw new Error("empty tx info !");
      } catch (error) {
        filelog(`error in getrawtransaction: i=${i}, txid=${txid}`, error);
        return;

        var txMissingRow = await TxMissingModel.findOne({ txid });
        if (!txMissingRow) {
          txMissingRow = new TxMissingModel({
            txid,
            txidRefs: []
          });
          await txMissingRow.save();
        }
        continue;
      }

      // Save Transaction Info
      var txRow = await TransactionModel.findOne({ txid });
      if (!txRow) {
        txRow = new TransactionModel({
          txid,
          time: blockdata.time,
          blockheight: lastblock,
          blockhash
        });
      }
      txRow.vin = txInfo.vin ? txInfo.vin : [];
      txRow.vout = txInfo.vout ? txInfo.vout : [];
      await txRow.save();

      // Handle address
      try {
        var vin = txInfo.vin;
        var vout = txInfo.vout;
        // Save Address Info
        if (vin && vin.length > 0) {
          for (let j = 0; j < vin.length; j++) {
            var inTxid = vin[j].txid;
            var inVout = Number(vin[j].vout);
            if (!inTxid || inTxid == "" || inVout < 0) continue;
            if (_.indexOf(config.genesisTxids, inTxid) > -1) continue;

            var inTxInfo;
            try {
              var inTxRow = await TransactionModel.findOne({ txid: inTxid });
              inTxInfo = inTxRow.vout[inVout];
              if (!inTxInfo) throw new Error("tx vin get error !");
            } catch (error) {
              return;

              var txMissingRow = await TxMissingModel.findOne({
                txid: inTxid
              });
              if (!txMissingRow) {
                txMissingRow = new TxMissingModel({
                  txid: inTxid,
                  txidRefs: []
                });
              }
              if (txMissingRow.txidRefs.indexOf(txid) == -1)
                txMissingRow.txidRefs.push(txid);
              await txMissingRow.save();
              continue;
            }

            var addresses = inTxInfo.scriptPubKey.addresses;
            var value = Number(inTxInfo.value);

            if (addresses && addresses.length > 0 && value > 0) {
              for (let k = 0; k < addresses.length; k++) {
                // Save Info
                var addressRow = await AddressModel.findOne({
                  address: addresses[k]
                });
                if (!addressRow) {
                  addressRow = new AddressModel({
                    address: addresses[k],
                    txs: [],
                    txsIn: [],
                    txsOut: [],
                    balance: 0
                  });
                }
                if (addressRow.txs.indexOf(txid) == -1) {
                  addressRow.txs.push(txid);
                }

                var index = _.findIndex(addressRow.txsIn, function(o) {
                  return o.txid == txid && o.vin == j;
                });
                if (index == -1) {
                  addressRow.txsIn.push({
                    txid: txid,
                    vin: j,
                    value
                  });
                }
                addressRow.balance -= value;
                await addressRow.save();
              }
            }
          }
        }
        if (vout && vout.length > 0) {
          for (let j = 0; j < vout.length; j++) {
            var addresses = vout[j].scriptPubKey.addresses;
            var value = Number(vout[j].value);
            if (addresses && addresses.length > 0 && value > 0) {
              for (let k = 0; k < addresses.length; k++) {
                // Save Info
                var addressRow = await AddressModel.findOne({
                  address: addresses[k]
                });
                if (!addressRow) {
                  addressRow = new AddressModel({
                    address: addresses[k],
                    txs: [],
                    txsIn: [],
                    txsOut: [],
                    balance: 0
                  });
                }
                if (addressRow.txs.indexOf(txid) == -1) {
                  addressRow.txs.push(txid);
                }

                var index = _.findIndex(addressRow.txsOut, function(o) {
                  return o.txid == txid && o.vout == j;
                });
                if (index == -1) {
                  addressRow.txsOut.push({ txid, vout: j, value });
                }
                addressRow.balance += value;
                await addressRow.save();
              }
            }
          }
        }
      } catch (error) {
        filelog(`Address update error ! i=${i}, error: `, error);
        return;
      }
      lastTxIndex++;
      await saveTxServiceInfo(lastblock, lastTxIndex);
    }

    lastblock++;
    lastTxIndex = 0;
    await saveTxServiceInfo(lastblock, lastTxIndex);
  } catch (error) {
    filelog("CheckUpdatedTransactions error: ", error); // Should dump errors here
  }
}

async function transactionService() {
  await CheckUpdatedTransactions();
  // setTimeout(transactionService, config.TX_CRON_TIME);
  transactionService();
}

exports.start_cronService = async function() {
  var infoRes = await getTxServiceInfo();
  if (!infoRes) {
    filelog("getting info error !");
    return;
  }

  transactionService();
};
