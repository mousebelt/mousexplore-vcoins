var config = require("../config");
var web3 = config.web3;

var TransactionModel = require("../model/transactions");
var TokenModel = require("../model/tokens");
var ServiceInofModel = require("../model/serviceinfo");
var ParellelInofModel = require("../model/parellelinfo");


var lastCheckedBlock = 0;

var block_checkout = 1;

/*
 * length: CHECK_PARELLEL_BLOCKS
 * [{blocknum, total_txs, synced_index, inprogressing}] 
 */
var parellel_blocks = [];

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
    var cronServiceInfo = await ServiceInofModel.findOne();
    if (cronServiceInfo) {
      lastCheckedBlock = cronServiceInfo.lastblock;
      filelog("Last checked block number is " + lastCheckedBlock);
    }
  }
  catch (e) {
    filelog("getLastCheckedBlock error: ", e);
  }
}

async function loadParellInfo() {
  try {
    var parellInfo = await ParellelInofModel.find().limit(config.CHECK_PARELLEL_BLOCKS);
    if (parellInfo) {
      for (let i = 0; i < cronServiceInfo.length; i ++) {
        parellel_blocks[parellInfo.index] = {	
          blocknumber: parellInfo.blocknumber,
          total_txs: parellInfo.total_txs,
          synced_index: parellInfo.synced_index
        };
      }
    }
  }
  catch (e) {
    filelog("loadParellInfo error: ", e);
  }
}

function getNextBlockNum() {
  var blocknum = lastCheckedBlock;
  for (let i = 0; i < config.CHECK_PARELLEL_BLOCKS; i ++) {
    if (blocknum < parellel_blocks[i].blocknumber) {
      blocknum = parellel_blocks[i].blocknumber;
    }
  }

  return blocknum + 1;
}
/*
 * Distribute blocks to process threads(promise).
 * If a thread finished process, build new process for new block.
 */
function distributeBlocks() {
  for (let i = 0; i < config.CHECK_PARELLEL_BLOCKS; i ++) {
    //if a thread is finished
    if (!parellel_blocks[i] || parellel_blocks[i].total_txs == parellel_blocks[i].synced_index) {
      let nextnumber = getNextBlockNum();
      web3.eth.getBlock(nextnumber, true, async function(error, blockdata) {
        if (error) {
          filelog("distributeBlocks fails for getBlock of block: " + nextnumber);
          return;
        }

        parellel_blocks[i] = {
          blocknumber: nextnumber,
          total_txs: txnCount,
          synced_index: 0,
          inprogressing: true
        }

        var parellelinfo = await ParellelInofModel.find({index: i});
        if (!parellelinfo) {
          parellelinfo = new ParellelInofModel({
            index: i,
            blocknumber: nextnumber,
            total_txs: blockdata.transactions.length,
            synced_index: 0
          })
        }
        else {
          parellelinfo.set({
            blocknumber: nextnumber,
            total_txs: blockdata.transactions.length,
            synced_index: 0
          })
        }

        parellelinfo.save();

        await CheckUpdatedTransactions(i, blockdata);
      })
    }
    else {
      if (!parellel_blocks[i].inprogressing) {
        web3.eth.getBlock(parellel_blocks[i].blocknumber, true, async function(error, blockdata) {
          if (error) {
            filelog("distributeBlocks fails for getBlock of block: " + parellel_blocks[i].blocknumber);
            return;
          }

          parellel_blocks[i].inprogressing = true;

          await CheckUpdatedTransactions(i, blockdata);
        }
    }
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

async function updateLastBlockNumber() {
  block_checkout --;
  if (block_checkout == 0) {
    block_checkout = config.CHECK_LATEST_BLOCK;

    var number = await web3.eth.getBlockNumber();
    if (!number) return;

    blocknumber = number;
  }
}


async function CheckUpdatedTransactions(blockdata) {
  try {
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
}

async function transactionService() {
  await CheckUpdatedTransactions();
  setTimeout(transactionService, config.CRON_TIME_INTERVAL);
}

exports.start_cronService = async function () {
  require('./init.db').start();

  await getLastCheckedBlock();
  await loadParellInfo();
  transactionService();
}