var config = require("../config");
var web3 = require('../config').web3;

var TransactionModel = require("../model/transactions");
var TokenModel = require("../model/tokens");
var ServiceInofModel = require("../model/serviceinfo");


var lastCheckedBlock = 0;
var lastCheckedIndex = -1;
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
  try {
    var info = await ServiceInofModel.findOne({});
    if (info) {
      info.set({ lastblock: lastCheckedBlock, lastTxnIndex: lastCheckedIndex });
    }
    else {
      info = new ServiceInofModel({ lastblock: lastCheckedBlock, lastTxnIndex: lastCheckedIndex });
    }
    await info.save();
  } catch (error) {
    filelog('saveCronServiceInfo:error: ', e); // Should dump errors here
  }
}

async function CheckUpdatedTransactions() {
  try {
    var number = await web3.eth.getBlockNumber();
    if (!number) return;

    try {
      var blockdata = await web3.eth.getBlock(lastCheckedBlock, true);
      var txnCount = blockdata.transactions.length;

      for (let j = lastCheckedIndex + 1; j < txnCount; j++) {
        let transaction = blockdata.transactions[j];
        let hash = transaction.hash;
        let from = transaction.from;
        let to = transaction.to;
        let value = transaction.value;
        var timestamp = blockdata.timestamp;

        let gasprice = transaction.gasPrice;
        var txnReceipt = await web3.eth.getTransactionReceipt(hash);
        let fee = gasprice * txnReceipt.gasUsed;

        var newTxn = await TransactionModel.findOne({ hash });
        if (!newTxn) {
          var newTxn = new TransactionModel({
            blocknumber: lastCheckedBlock,
            hash,
            from,
            to,
            value,
            fee,
            timestamp
          });
          await newTxn.save();
        }

        // save
        lastCheckedIndex = j;
        await saveCronServiceInfo();
      }
    }
    catch (e) {
      filelog('getBlock: error: ', e); // Should dump errors here
      return;
    }

    // save
    lastCheckedBlock++;
    lastCheckedIndex = -1;
    await saveCronServiceInfo();
  } catch (error) {
    filelog('getBlockNumber: we have a promblem: ', error); // Should dump errors here
  }
}

async function transactionService() {
  await CheckUpdatedTransactions();
  setTimeout(transactionService, config.CRON_TIME_INTERVAL);
}

exports.start_cronService = async function () {
  require('./init.db').start();

  await getLastCheckedBlock();
  transactionService();
}