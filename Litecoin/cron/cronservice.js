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
  // log = new Log(
  //   "debug",
  //   fs.createWriteStream(__dirname + "/debug.log", { flags: "a" })
  // );
log = new Log('debug');

function filelog(...params) {
  log.info(...params);
}

var promisify = UtilsModule.promisify;

////////////////////////////////////////////////////////////////////////////

async function getTxServiceInfo() {
  try {
    txServiceInfo = await TxServiceInofModel.findOne();
    if (txServiceInfo) return txServiceInfo;
    else return { lastblock: -1 };
  } catch (e) {
    filelog("getTxServiceInfo error: ", e);
    return undefined;
  }
}

async function saveTxServiceInfo(lastblock) {
  await TxServiceInofModel.findOne(async function(e, info) {
    if (!e) {
      if (info) {
        info.set({ lastblock });
      } else {
        info = new TxServiceInofModel({ lastblock });
      }
      await info.save();
    } else {
      filelog("saveTxServiceInfo error: ", e); // Should dump errors here
    }
  });
}

async function CheckUpdatedTransactions() {
  try {
    var curblock;
    var txServiceInfo = await getTxServiceInfo();
    if (txServiceInfo) {
      curblock = txServiceInfo.lastblock + 1;
    } else {
      throw "getTxServiceInfo error !";
    }

    var blockCount = await promisify("getblockcount", []);
    if (!blockCount) throw "client getBlockCount: blockcount is empty";
    if (curblock >= blockCount) return;

    var blockhash = await promisify("getblockhash", [curblock]);
    var blockdata = await promisify("getblock", [blockhash]);
    var txs = blockdata.tx;

    for (let i = 0; i < txs.length; i++) {
      let txid = txs[i];
      // Save Transaction Info
      var txRow = await TransactionModel.findOne({ txid });
      if (!txRow) {
        txRow = new TransactionModel({
          txid,
          time: blockdata.time,
          blockheight: curblock,
          blockhash
        });
        await txRow.save();
      }

      // Handle address
      try {
        var txInfo;
        try {
          txInfo = await promisify("getrawtransaction", [txid, 1]);
        } catch (error) {
          filelog(`error in getrawtransaction: i=${i}, txid=${txid}`, error);

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

        if (txInfo) {
          var vin = txInfo.vin;
          var vout = txInfo.vout;
          // Save Address Info
          if (vin && vin.length > 0) {
            for (let j = 0; j < vin.length; j++) {
              var inTxid = vin[j].txid;
              var inVout = Number(vin[j].vout);
              if (!inTxid || inTxid == "" || inVout < 0) continue;
              var inTxInfo = await UtilsModule.getTxOutFunc(inTxid, inVout);
              // var inTxInfo = await promisify("gettxout", [inTxid, inVout]);
              if (!inTxInfo) {
                filelog(
                  `inTxInfo not found. inTxid=${inTxid}, vout: ${inVout}`
                );
                var txMissingRow = await TxMissingModel.findOne({
                  txid: vin[j].txid
                });
                if (!txMissingRow) {
                  txMissingRow = new TxMissingModel({
                    txid: vin[j].txid,
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
        }
      } catch (error) {
        filelog(`Address update error ! i=${i}, error: `, error);
        continue;
      }
    }

    await saveTxServiceInfo(curblock);
  } catch (error) {
    filelog("CheckUpdatedTransactions error: ", error); // Should dump errors here
  }
}

async function transactionService() {
  await CheckUpdatedTransactions();
  setTimeout(transactionService, config.TX_CRON_TIME);
}

exports.start_cronService = async function() {
  transactionService();
};
