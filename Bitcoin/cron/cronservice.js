var config = require("../config");
var client = config.localNode;

var TransactionModel = require("../model/transactions");
var TxServiceInofModel = require("../model/txServiceInfo");

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

async function CheckUpdatedTransactions() {
  filelog('CheckUpdatedTransactions starting...');
  var lastblock;
  var txServiceInfo = await getTxServiceInfo();
  if (txServiceInfo) {
    lastblock = txServiceInfo.lastblock;
  } else {
    filelog({ txServiceInfo });
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
                filelog(`transaction save error: txid=${txid}, error: `, e); // Should dump errors here
                return;
              }
            }
          }

          if (lastblock != i) {
            lastblock = i;
            await saveTxServiceInfo(lastblock);
          }
        }
        catch (e) {
          filelog('client getBlock error: ', e); // Should dump errors here
          return;
        }
      }
    } else {
      filelog('client getBlockCount: blockcount is empty'); // Should dump errors here
    }
  } catch (error) {
    filelog('client getBlockCount error: ', error); // Should dump errors here
  }
}

async function transactionService() {
  filelog("Start transaction service ...");
  await CheckUpdatedTransactions();
  setTimeout(transactionService, config.TX_CRON_TIME);
  filelog("Done transaction service .");
}

exports.start_cronService = async function () {
  filelog("Start neo cron service");

  transactionService();
}
