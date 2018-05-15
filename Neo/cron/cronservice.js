var config = require("../config");
var localNode = config.localNode;

var TransactionModel = require("../model/transactions");
var TokenModel = require("../model/tokens");
var ServiceInofModel = require("../model/serviceinfo");


var lastCheckedBlock = 0;
var lastCheckedIndex = 0;
var cronServiceInfo = null;

var fs = require('fs');
var Log = require('log'),
  log = new Log('debug', fs.createWriteStream(__dirname + '/debug.log', { flags: 'a' }));
// log = new Log('debug');

function filelog(...params) { //
  log.info(...params);
  console.log(...params);
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
      var iCount = 0;
      for (let i = lastCheckedBlock; i < blockCount && i < limit; i++) {
        try {
          var blockdata = await localNode.getBlockByHeight(i, 1)
          var txs = blockdata.tx;

          for (let j = lastCheckedIndex; j < txs.length; j++) {
            let tx = txs[j]
            let { txid, size, type, version, vin, vout, sys_fee, net_fee, nonce } = tx;

            var txModel = await TransactionModel.findOne({ txid });
            if (txModel) continue;

            txModel = new TransactionModel({
              txid, size, type, version, vin, vout, sys_fee, net_fee, nonce,
              blockIndex: blockdata.index,
              blockTime: blockdata.time
            });

            try {
              await txModel.save();
            }
            catch (e) {
              filelog("iCount --------------" + iCount++);
              filelog('newTxn.save: error: ', e); // Should dump errors here
              return;
            }

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
          filelog("iCount --------------" + iCount++);
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


// async function transactionService() {
// 	filelog("lastCheckedBlock = " + lastCheckedBlock);
// 	await CheckUpdatedTransactions();
// 	setTimeout(transactionService, config.CRON_TIME_INTERVAL);
// }

async function transactionService() {
  filelog("lastCheckedBlock = " + lastCheckedBlock);
  CheckUpdatedTransactions();
}

exports.start_cronService = async function () {
  filelog("Start neo cron service");
  await getLastCheckedBlock();
  transactionService();
  // setInterval(transactionService, config.CRON_TIME_INTERVAL);
}