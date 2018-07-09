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
  console.log(...params);
  log.info(...params);
}

async function loadParellInfo() {
  try {
    var piRows = await ParellelInofModel.find().limit(config.CHECK_PARELLEL_BLOCKS);
    if (piRows && piRows.length > 0) {
      for (let i = 0; i < piRows.length; i ++) {
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

async function saveParellelInfo(threadIndex) {
  try {
    var info = await ParellelInofModel.findOne({index: threadIndex});

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

async function getNextBlockNum() {
  try {
    var lastnumber = await web3.eth.getBlockNumber();
    if (!lastnumber) return -1;
  
    var blocknum = 0;
    for (let i = 0; i < config.CHECK_PARELLEL_BLOCKS; i ++) {
      if (parellel_blocks && parellel_blocks[i] && parellel_blocks[i].blocknumber && blocknum < parellel_blocks[i].blocknumber) {
        blocknum = parellel_blocks[i].blocknumber;
      }
    }
  
    blocknum ++;
  
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
async function distributeBlocks() {
  try {
    for (let i = 0; i < config.CHECK_PARELLEL_BLOCKS; i ++) {
      //if a thread is finished
      if (!parellel_blocks[i] || parellel_blocks[i].total_txs == parellel_blocks[i].synced_index) {
        let nextnumber = await getNextBlockNum();

        if (nextnumber == -1)
          continue;
        web3.eth.getBlock(nextnumber, true, async function(error, blockdata) {
          if (error) {
            filelog("distributeBlocks fails for getBlock of block: " + nextnumber);
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
          web3.eth.getBlock(parellel_blocks[i].blocknumber, true, async function(error, blockdata) {
            if (error) {
              filelog("distributeBlocks fails for getBlock of block: " + parellel_blocks[i].blocknumber);
              return;
            }

            parellel_blocks[i].inprogressing = true;

            await CheckUpdatedTransactions(i, blockdata);
          });
        }
      }
    }
  } catch(e) {
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
  }
  catch (e) {
    filelog('CheckUpdatedTransactions: error: ', e); // Should dump errors here
    return;
  }
}

async function transactionService() {
  await distributeBlocks();
  setTimeout(transactionService, config.CRON_TIME_INTERVAL);
}

exports.start_cronService = async function () {
  require('./init.db').start();

  await loadParellInfo();
  transactionService();
}