var config = require("../config");
var web3 = config.web3;

var TransactionModel = require("../model/transactions");
// var TokenModel = require("../model/tokens");
// var ServiceInofModel = require("../model/serviceinfo");
var ParellelInofModel = require("../model/parellelinfo");

/*
 * length: CHECK_PARELLEL_BLOCKS
 * [{blocknum, total_txs, synced_index, inprogressing}] 
 */
var parellel_blocks = [];

var fs = require('fs');
var Log = require("log"),
  log = new Log(
    "debug",
    fs.createWriteStream(__dirname + "/debug.log", { flags: "a" })
  );
// log = new Log('debug');

function filelog(...params) {
  log.info(...params);
}

async function loadParellInfo() {
  try {
    var piRows = await ParellelInofModel.find().limit(config.CHECK_PARELLEL_BLOCKS);
    if (piRows && piRows.length > 0) {
      for (let i = 0; i < piRows.length; i++) {
        var row = piRows[i];
        parellel_blocks[row.index] = {
          blocknumber: row.blocknumber,
          total_txs: row.total_txs,
          synced_index: row.synced_index
        };
      }
    }
  }
  catch (e) {
    filelog("loadParellInfo error: ", e);
  }
}

async function initParellInfo() {
  try {
    var rowCount = await ParellelInofModel.find().count();
    if (rowCount < 50) {
      for (let i = 0; i < 50; i++) {
        var row = new ParellelInofModel({
          index: i,
          blocknumber: -1,
          total_txs: 0,
          synced_index: 0,	//synced transactions
        });
        await row.save();
      }
    }
  }
  catch (e) {
    filelog("initParellInfo error: ", e);
  }
}

async function saveParellelInfo(threadIndex) {
  try {
    var info = await ParellelInofModel.findOne({ index: threadIndex });

    if (info) {
      info.set({
        blocknumber: parellel_blocks[threadIndex].blocknumber,
        total_txs: parellel_blocks[threadIndex].total_txs,
        synced_index: parellel_blocks[threadIndex].synced_index
      });
    }
    else {
      info = new ParellelInofModel({
        index: threadIndex,
        blocknumber: parellel_blocks[threadIndex].blocknumber,
        total_txs: parellel_blocks[threadIndex].total_txs,
        synced_index: parellel_blocks[threadIndex].synced_index
      });
    }
    await info.save();
  } catch (error) {
    filelog('saveParellelInfo:error: ', error); // Should dump errors here
  }
}

function getNextBlockNum(lastnumber) {
  try {
    if (!lastnumber) return -1;

    var blocknum = 0;
    for (let i = 0; i < config.CHECK_PARELLEL_BLOCKS; i++) {
      if (parellel_blocks[i] && parellel_blocks[i].blocknumber && blocknum < parellel_blocks[i].blocknumber) {
        blocknum = parellel_blocks[i].blocknumber;
      }
    }

    blocknum++;

    if (blocknum > lastnumber) {
      console.log("Lastnode is syncing!");
      return -1;
    }

    return blocknum;
  } catch (error) {
    filelog('getNextBlockNum error: ', error);
    return -1;
  }
}
/*
 * Distribute blocks to process threads(promise).
 * If a thread finished process, build new process for new block.
 */
function distributeBlocks() {
  try {
    for (let i = 0; i < config.CHECK_PARELLEL_BLOCKS; i++) {
      //if a thread is finished
      if (!parellel_blocks[i].inprogressing && (!parellel_blocks[i] || parellel_blocks[i].total_txs == parellel_blocks[i].synced_index)) {

        let nextnumber = getNextBlockNum(g_lastCheckedNumber);
        if (nextnumber == -1)
          continue;

        parellel_blocks[i] = {
          blocknumber: nextnumber,
          total_txs: -1,
          synced_index: 0,
          inprogressing: true
        }
        web3.eth.getBlock(nextnumber, true, async function (error, blockdata) {
          if (error) {
            filelog("distributeBlocks fails for getBlock of block: " + nextnumber);
            parellel_blocks[i].inprogressing = false;
            return;
          }

          parellel_blocks[i] = {
            blocknumber: nextnumber,
            total_txs: blockdata.transactions.length,
            synced_index: 0,
            inprogressing: true
          }

          saveParellelInfo(i);

          await CheckUpdatedTransactions(i, blockdata);
        })
      }
      else {
        if (!parellel_blocks[i].inprogressing) {
          web3.eth.getBlock(parellel_blocks[i].blocknumber, true, async function (error, blockdata) {
            if (error) {
              filelog("distributeBlocks fails for getBlock of block: " + parellel_blocks[i].blocknumber);
              return;
            }

            parellel_blocks[i].inprogressing = true;
            parellel_blocks[i].total_txs = blockdata.transaction.length;

            await CheckUpdatedTransactions(i, blockdata);
          });
        }
      }
    }
  } catch (e) {
    filelog("distributeBlocks fails: ", e)
  }
}


async function CheckUpdatedTransactions(threadIndex, blockdata) {
  try {
    var txnCount = blockdata.transactions.length;

    for (let j = parellel_blocks[threadIndex].synced_index; j < txnCount; j++) {
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
          blocknumber: parellel_blocks[threadIndex].blocknumber,
          hash,
          from,
          to,
          value,
          fee,
          timestamp
        });
        await newTxn.save();
      }

      parellel_blocks[threadIndex].synced_index = j + 1;

      // save
      await saveParellelInfo(threadIndex);
    }
    parellel_blocks[threadIndex].inprogressing = false;
  }
  catch (e) {
    filelog('CheckUpdatedTransactions: error: ', e); // Should dump errors here
    parellel_blocks[threadIndex].inprogressing = false;
    return;
  }
}

var g_lastCheckedNumber = 0;
var g_ticker = 1;

async function transactionService() {
  g_ticker--;
  if (g_ticker <= 0) {
    try {
      g_lastCheckedNumber = await web3.eth.getBlockNumber();
      g_ticker = config.TICKER_BLOCK;
    } catch (error) { }
  }

  distributeBlocks();
  setTimeout(transactionService, config.CRON_TIME_INTERVAL);
}

exports.start_cronService = async function () {
  require('./init.db').start();

  await initParellInfo();
  await loadParellInfo();
  transactionService();
}