var config = require("../config");
var localNode = config.localNode;

var TransactionModel = require("../model/transactions");
var TokenModel = require("../model/tokens");
var ServiceInofModel = require("../model/serviceinfo");
var AddressModel = require("../model/address");


var lastCheckedBlock = 0;
var lastCheckedIndex = 0;
var cronServiceInfo = null;

var fs = require('fs');
var Log = require('log'),
  log = new Log('debug', fs.createWriteStream(__dirname + '/debug.log', { flags: 'a' }));
// log = new Log('debug');

function filelog(...params) { //
  log.info(...params);
  // console.log(...params);
};

async function getLastCheckedBlock() {
  try {
    cronServiceInfo = await ServiceInofModel.findOne();
    if (cronServiceInfo) {
      lastCheckedBlock = cronServiceInfo.lastblock;
      lastCheckedIndex = cronServiceInfo.lastTxnIndex;
      filelog("Last checked block number is " + lastCheckedBlock);
      filelog("Last checked txn index is " + lastCheckedIndex);
    }
  }
  catch (e) {
    filelog("getLastCheckedBlock error: ", e);
  }
}

async function saveCronServiceInfo() {
  await ServiceInofModel.findOne(async function (e, info) {
    if (!e) {
      if (info) {
        info.set({ lastblock: lastCheckedBlock, lastTxnIndex: lastCheckedIndex });
      }
      else {
        info = new ServiceInofModel({ lastblock: lastCheckedBlock, lastTxnIndex: lastCheckedIndex });
      }
      await info.save();
    }
    else {
      filelog('saveCronServiceInfo:error: ', e); // Should dump errors here
    }
  });

}

async function CheckUpdatedTransactions() {
  try {
    var blockCount = await localNode.getBlockCount();
    if (blockCount) {
      var limit = lastCheckedBlock + config.CRON_TREAT_MAX_BLOCKS;
      for (let i = lastCheckedBlock; i < blockCount && i <= limit; i++) {
        try {
          var blockdata = await localNode.getBlockByHeight(i, 1)
          var txs = blockdata.tx;

          for (let j = lastCheckedIndex; j < txs.length; j++) {
            let tx = txs[j]
            let { txid, size, type, version, vin, vout, sys_fee, net_fee, nonce } = tx;

            // Save Transaction Info
            var txRow = await TransactionModel.findOne({ txid });
            if (!txRow) {

              txRow = new TransactionModel({
                txid, size, type, version, vin, vout, sys_fee, net_fee, nonce,
                blockIndex: blockdata.index,
                blockTime: blockdata.time
              });

              try {
                await txRow.save();
              }
              catch (e) {
                filelog(`transaction.save error: txid=${txid}, error: `, e); // Should dump errors here
                return;
              }
            }

            // Save Address Info
            if (vout && vout.length > 0) {
              for (let k = 0; k < vout.length; k++) {
                let { asset, value, address } = vout[k];
                // Save vout Info
                var addressRow = await AddressModel.findOne({ asset, address });
                if (!addressRow) {
                  addressRow = new AddressModel({
                    asset, address,
                    txsIn: [],
                    txsOut: []
                  });
                }
                if (addressRow.txsOut.indexOf(txid) == -1) {
                  addressRow.txsOut.push(txid);
                  try {
                    await addressRow.save();
                  }
                  catch (e) {
                    filelog(`address.save.txsOut: txid: ${txid}, error: `, e); // Should dump errors here
                    return;
                  }
                }
              }
            }

            if (vin && vin.length > 0) {
              for (let k = 0; k < vin.length; k++) {
                var curTxid = vin[k].txid;
                var curVout = vin[k].vout;

                try {
                  var curTx = await localNode.getRawTransaction(curTxid, 1);
                  var curInfo = curTx.vout[curVout];

                  // Save Info
                  var addressRow = await AddressModel.findOne({ asset: curInfo.asset, address: curInfo.address });
                  if (!addressRow) {
                    addressRow = new AddressModel({
                      asset: curInfo.asset, 
                      address: curInfo.address,
                      txsIn: [],
                      txsOut: []
                    });
                  }
                  if (addressRow.txsIn.indexOf(txid) == -1) {
                    addressRow.txsIn.push(txid);
                    try {
                      await addressRow.save();
                    }
                    catch (e) {
                      filelog(`newAddress.save.txsIn error: txid=${txid}, error: `, e); // Should dump errors here
                      return;
                    }
                  }
                } catch (e) {
                  filelog(`address.vin.getTx error: curTxid=${curTxid}, error: `, e); // Should dump errors here
                  return;
                }
              }
            }

            // Save service info
            if (lastCheckedBlock != i || lastCheckedIndex != j) {
              // filelog("Updating block: " + i);
              lastCheckedBlock = i;
              lastCheckedIndex = j;

              await saveCronServiceInfo();
            }
          }

          if (lastCheckedBlock != i || lastCheckedIndex != 0) {
            // filelog("Updating block: " + i);
            lastCheckedBlock = i;
            lastCheckedIndex = 0;

            await saveCronServiceInfo();
          }
        }
        catch (e) {
          filelog('getBlock, error: ', e); // Should dump errors here
          return;
        }
      }
    } else {
      filelog('getBlockCount: blockcount is empty: ', blockCount); // Should dump errors here
    }
  } catch (error) {
    filelog('getBlockCount: we have a promblem: ', error); // Should dump errors here
  }
}


async function transactionService() {
  filelog("lastCheckedBlock = " + lastCheckedBlock);
  await CheckUpdatedTransactions();
  setTimeout(transactionService, config.CRON_TIME_INTERVAL);
}

// async function transactionService() {
//   filelog("lastCheckedBlock = " + lastCheckedBlock);
//   CheckUpdatedTransactions();
// }

exports.start_cronService = async function () {
  filelog("Start neo cron service");
  await getLastCheckedBlock();
  transactionService();
  // setInterval(transactionService, config.CRON_TIME_INTERVAL);
}