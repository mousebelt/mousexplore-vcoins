const config = require('../config');
const { web3 } = require('../modules/utils');

const TransactionModel = require('../model/transactions');
const ParellelInofModel = require('../model/parellelInfo');

const Log = require('log');
// const fs = require('fs');
// const log = new Log('debug', fs.createWriteStream(`${__dirname}/debug.log`, { flags: 'a' }));
const log = new Log('debug');

// global variables
/*
 * length: CHECK_PARELLEL_BLOCKS
 * [{blocknum, total_txs, synced_index, inprogressing}]
 */
const gParellelBlocks = [];
let gLastCheckedNumber = 0;
let gTicker = 1;

// functions

function filelog(...params) {
  log.info(...params);
}

async function loadParellInfo() {
  try {
    const piRows = await ParellelInofModel.find().limit(config.CHECK_PARELLEL_BLOCKS);
    if (piRows && piRows.length > 0) {
      for (let i = 0; i < piRows.length; i++) {
        const row = piRows[i];
        gParellelBlocks[row.index] = {
          blocknumber: row.blocknumber,
          total_txs: row.total_txs,
          synced_index: row.synced_index,
          inprogressing: false
        };
      }
    }
  } catch (e) {
    filelog('loadParellInfo error: ', e);
  }
}

async function initParellInfo() {
  try {
    const rowCount = await ParellelInofModel.countDocuments();
    if (rowCount < 50) {
      for (let i = rowCount; i < 50; i++) {
        const row = new ParellelInofModel({
          index: i,
          blocknumber: -1,
          total_txs: 0,
          synced_index: 0, // synced transactions
        });
        await row.save();
      }
    }
  } catch (e) {
    filelog('initParellInfo error: ', e);
  }
}

async function saveParellelInfo(threadIndex) {
  try {
    await ParellelInofModel.findOneAndUpdate({ index: threadIndex }, {
      index: threadIndex,
      blocknumber: gParellelBlocks[threadIndex].blocknumber,
      total_txs: gParellelBlocks[threadIndex].total_txs,
      synced_index: gParellelBlocks[threadIndex].synced_index
    }, { upsert: true });
  } catch (error) {
    filelog('saveParellelInfo:error: ', error); // Should dump errors here
  }
}

function getNextBlockNum(lastnumber) {
  try {
    if (!lastnumber) return -1;

    let blocknum = -1;
    for (let i = 0; i < config.CHECK_PARELLEL_BLOCKS; i++) {
      if (gParellelBlocks[i] && blocknum < gParellelBlocks[i].blocknumber) {
        blocknum = gParellelBlocks[i].blocknumber;
      }
    }

    blocknum++;

    if (blocknum > lastnumber) {
      return -1;
    }

    return blocknum;
  } catch (error) {
    filelog('getNextBlockNum error: ', error);
    return -1;
  }
}

async function CheckUpdatedTransactions(threadIndex, blockdata) {
  try {
    const txnCount = blockdata.transactions.length;
    gParellelBlocks[threadIndex].total_txs = txnCount;

    if (txnCount <= gParellelBlocks[threadIndex].synced_index) {
      gParellelBlocks[threadIndex].synced_index = txnCount;
      await saveParellelInfo(threadIndex);
    } else {
      for (let j = gParellelBlocks[threadIndex].synced_index; j < txnCount; j++) {
        // transaction model data init
        const blocknumber = gParellelBlocks[threadIndex].blocknumber;
        let hash = null;
        let from = null;
        let to = null;
        let value = null;
        let fee = null;
        let timestamp = null;
        const tokenSymbol = null;
        const tokenFrom = null;
        const tokenTo = null;
        const tokenAmount = null;

        // handle transaction
        const transaction = blockdata.transactions[j];
        hash = transaction.hash;
        from = String(transaction.from).toLowerCase();
        to = String(transaction.to).toLowerCase();
        value = transaction.value;
        timestamp = blockdata.timestamp;

        const gasprice = transaction.gasPrice;
        const txnReceipt = await web3.eth.getTransactionReceipt(hash);
        fee = gasprice * txnReceipt.gasUsed;

        await TransactionModel.findOneAndUpdate({ hash }, {
          blocknumber, hash, from, to, value, fee, timestamp,
          tokenSymbol, tokenFrom, tokenTo, tokenAmount
        }, { upsert: true });

        gParellelBlocks[threadIndex].synced_index = j + 1;

        // save
        await saveParellelInfo(threadIndex);
      }
    }
    gParellelBlocks[threadIndex].inprogressing = false;
  } catch (e) {
    filelog('CheckUpdatedTransactions: error: ', e); // Should dump errors here
    gParellelBlocks[threadIndex].inprogressing = false;
    return;
  }
}

/*
 * Distribute blocks to process threads(promise).
 * If a thread finished process, build new process for new block.
 */
async function distributeBlocks() {
  try {
    for (let i = 0; i < config.CHECK_PARELLEL_BLOCKS; i++) {
      // if a thread is finished
      if (
        !gParellelBlocks[i].inprogressing
        && (gParellelBlocks[i].total_txs <= gParellelBlocks[i].synced_index)
        && gParellelBlocks[i].total_txs > -1
      ) {

        const nextnumber = getNextBlockNum(gLastCheckedNumber);
        if (nextnumber === -1) continue;

        gParellelBlocks[i] = {
          blocknumber: nextnumber,
          total_txs: -1,
          synced_index: 0,
          inprogressing: true
        };
        await saveParellelInfo(i);
        web3.eth.getBlock(nextnumber, true, async function (error, blockdata) {
          try {
            if (error) throw error;

            gParellelBlocks[i] = {
              blocknumber: nextnumber,
              total_txs: blockdata.transactions.length,
              synced_index: 0,
              inprogressing: true
            };

            await saveParellelInfo(i);

            await CheckUpdatedTransactions(i, blockdata);
          } catch (err) {
            filelog('distributeBlocks fails for getBlock of block: ', nextnumber);
            gParellelBlocks[i].inprogressing = false;
          }
        });
      } else {
        if (!gParellelBlocks[i].inprogressing) {
          web3.eth.getBlock(gParellelBlocks[i].blocknumber, true, async function (error, blockdata) {
            try {
              if (error) throw error;

              gParellelBlocks[i].inprogressing = true;
              gParellelBlocks[i].total_txs = blockdata.transactions.length;
              await saveParellelInfo(i);

              await CheckUpdatedTransactions(i, blockdata);
            } catch (err) {
              gParellelBlocks[i].inprogressing = false;
            }
          });
        }
      }
    }
  } catch (e) {
    filelog('distributeBlocks fails: ', e);
  }
}


async function transactionService() {
  gTicker--;
  if (gTicker <= 0) {
    try {
      gLastCheckedNumber = await web3.eth.getBlockNumber();
      gTicker = config.TICKER_BLOCK;
    } catch (error) {
      // console.log(error);
    }
  }

  distributeBlocks();
  setTimeout(transactionService, config.CRON_TIME_INTERVAL);
}

module.exports = async function () {
  await initParellInfo();
  await loadParellInfo();

  transactionService();
};
