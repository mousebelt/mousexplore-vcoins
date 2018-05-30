var config = require("../config/common.js").info;
var web3 = require('../config/common').web3;

var TransactionModel = require("../model/transactions");
var TokenModel = require("../model/tokens");
var ServiceInofModel = require("../model/serviceinfo");


var lastCheckedBlock = 0;
var lastCheckedIndex = 0;
var cronServiceInfo = null;

var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/debug.log', { flags: 'w' });
var log_stdout = process.stdout;

function filelog(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
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
    var number = await web3.eth.getBlockNumber();
    if (!number) return;

    var limit = lastCheckedBlock + config.CRON_TREAT_MAX_BLOCKS;
    for (let i = lastCheckedBlock; i <= number && i <= limit; i++) {
      try {
        var blockdata = await web3.eth.getBlock(i, true);
        var txnCount = blockdata.transactions.length;

        for (let j = lastCheckedIndex + 1; j < txnCount; j++) {
          let transaction = blockdata.transactions[j];
          let hash = transaction.hash;
          let from = transaction.from;
          let to = transaction.to;
          let value = transaction.value;
          var timestamp = blockdata.timestamp;

          let gasprice = transaction.gasPrice;

          try {
            var txnReceipt = await web3.eth.getTransactionReceipt(hash);
          }
          catch (e) {
            filelog('getTransactionReceipt: error: ', e); // Should dump errors here
            return;
          }


          let fee = gasprice * txnReceipt.gasUsed;

          var newTxn = new TransactionModel({
            blocknumber: i,
            hash: hash,
            from: from,
            to: to,
            value: value,
            fee: fee,
            timestamp: timestamp
          });

          try {
            await newTxn.save();
          }
          catch (e) {
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
      }
      catch (e) {
        filelog('getBlock: error: ', e); // Should dump errors here
        return;
      }

      if (lastCheckedBlock != i || lastCheckedIndex != -1) {
        // filelog("Updating block: " + i);
        lastCheckedBlock = i;
        lastCheckedIndex = -1;

        await saveCronServiceInfo();
      }

    }
  } catch (error) {
    filelog('getBlockNumber: we have a promblem: ', error); // Should dump errors here
  }
}

async function transactionService() {
  await CheckUpdatedTransactions();
  setTimeout(transactionService, config.CRON_TIME_INTERVAL);
}

exports.start_cronService = async function () {
  await getLastCheckedBlock();

  transactionService();
  // setInterval(transactionService, config.CRON_TIME_INTERVAL);
}