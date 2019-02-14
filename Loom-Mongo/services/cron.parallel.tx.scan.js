const { PARALLEL_BLOCK_COUNT, CRON_TX_SCAN_INTERVAL, TICKER_BLOCK_COUNT } = require('../config');
const { web3 } = require('../utils/loom');
const TransactionModel = require('../models/transactions');
const ParallelInofModel = require('../models/parallelInfo');
const Log = require('log');
const fs = require('fs');
const log = new Log('debug', fs.createWriteStream(`${__dirname}/debug.log`, { flags: 'a' }));
// const log = new Log('debug');
function filelog(...params) {
  log.info(...params);
}

/*
 * length: PARALLEL_BLOCK_COUNT
 * [{blockNumber, totalTxs, syncedIndex, inProgress}]
 */
const gParallelBlocks = [];
let gLastCheckedNumber = 0;
let gTicker = 1;

async function initParallelInfo() {
  try {
    const rowCount = await ParallelInofModel.countDocuments();
    if (rowCount < PARALLEL_BLOCK_COUNT) {
      for (let i = rowCount; i < PARALLEL_BLOCK_COUNT; i++) {
        const row = new ParallelInofModel({
          index: i,
          blockNumber: -1,
          totalTxs: 0,
          syncedIndex: 0, // synced transactions
        });
        await row.save();
      }
    }
  } catch (e) {
    filelog('initParallelInfo error: ', e);
  }
}

async function loadParallelInfo() {
  try {
    const piRows = await ParallelInofModel.find().sort({ index: 1 }).limit(PARALLEL_BLOCK_COUNT);
    if (piRows && piRows.length > 0) {
      for (let i = 0; i < piRows.length; i++) {
        const row = piRows[i];
        gParallelBlocks[row.index] = {
          blockNumber: row.blockNumber,
          totalTxs: row.totalTxs,
          syncedIndex: row.syncedIndex,
          inProgress: false
        };
      }
    }
  } catch (e) {
    filelog('loadParallelInfo error: ', e);
  }
}

async function saveParallelInfo(threadIndex) {
  try {
    await ParallelInofModel.findOneAndUpdate({ index: threadIndex }, {
      index: threadIndex,
      blockNumber: gParallelBlocks[threadIndex].blockNumber,
      totalTxs: gParallelBlocks[threadIndex].totalTxs,
      syncedIndex: gParallelBlocks[threadIndex].syncedIndex
    }, { upsert: false });
  } catch (error) {
    filelog('saveParallelInfo:error: ', error); // Should dump errors here
  }
}

function getNextBlockNum(lastnumber) {
  try {
    if (!lastnumber) return -1;

    let blockNumber = -1;
    for (let i = 0; i < PARALLEL_BLOCK_COUNT; i++) {
      if (gParallelBlocks[i] && blockNumber < gParallelBlocks[i].blockNumber) {
        blockNumber = gParallelBlocks[i].blockNumber;
      }
    }

    blockNumber++;
    if (blockNumber > lastnumber) return -1;

    return blockNumber;
  } catch (error) {
    filelog('getNextBlockNum error: ', error);
    return -1;
  }
}

async function CheckUpdatedTransactions(threadIndex, blockdata) {
  try {
    const txnCount = blockdata.transactions.length;
    gParallelBlocks[threadIndex].totalTxs = txnCount;

    if (txnCount <= gParallelBlocks[threadIndex].syncedIndex) {
      gParallelBlocks[threadIndex].syncedIndex = txnCount;
      await saveParallelInfo(threadIndex);
    } else {
      for (let j = gParallelBlocks[threadIndex].syncedIndex; j < txnCount; j++) {
        // transaction model data init
        const blockNumber = gParallelBlocks[threadIndex].blockNumber;
        let hash = null;
        let from = null;
        let to = null;
        let value = null;
        let timestamp = null;

        // handle transaction
        const transaction = blockdata.transactions[j];
        hash = transaction.hash;
        from = transaction.from;
        to = transaction.to;
        value = transaction.value;
        timestamp = blockdata.timestamp;

        await TransactionModel.findOneAndUpdate({ hash }, {
          blockNumber, hash, from, to, value, timestamp,
        }, { upsert: true });

        gParallelBlocks[threadIndex].syncedIndex = j + 1;

        // save
        await saveParallelInfo(threadIndex);
      }
    }
    gParallelBlocks[threadIndex].inProgress = false;
  } catch (e) {
    filelog('CheckUpdatedTransactions: error: ', e); // Should dump errors here
    gParallelBlocks[threadIndex].inProgress = false;
    return;
  }
}

/*
 * Distribute blocks to process threads(promise).
 * If a thread finished process, build new process for new block.
 */
async function distributeBlocks() {
  try {
    for (let i = 0; i < PARALLEL_BLOCK_COUNT; i++) {
      // if a thread is finished
      if (
        !gParallelBlocks[i].inProgress
        && (gParallelBlocks[i].totalTxs <= gParallelBlocks[i].syncedIndex)
        && gParallelBlocks[i].totalTxs > -1
      ) {

        const nextnumber = getNextBlockNum(gLastCheckedNumber);
        if (nextnumber === -1) continue;

        gParallelBlocks[i] = {
          blockNumber: nextnumber,
          totalTxs: -1,
          syncedIndex: 0,
          inProgress: true
        };
        await saveParallelInfo(i);
        web3.eth.getBlock(nextnumber, true, async function (error, blockdata) {
          try {
            if (error) throw error;

            gParallelBlocks[i] = {
              blockNumber: nextnumber,
              totalTxs: blockdata.transactions.length,
              syncedIndex: 0,
              inProgress: true
            };

            await saveParallelInfo(i);
            await CheckUpdatedTransactions(i, blockdata);
          } catch (err) {
            filelog('distributeBlocks fails for getBlock of block: ', nextnumber);
            gParallelBlocks[i].inProgress = false;
          }
        });
      } else {
        if (!gParallelBlocks[i].inProgress) {
          web3.eth.getBlock(gParallelBlocks[i].blockNumber, true, async function (error, blockdata) {
            try {
              if (error) throw error;

              gParallelBlocks[i].inProgress = true;
              gParallelBlocks[i].totalTxs = blockdata.transactions.length;
              await saveParallelInfo(i);
              await CheckUpdatedTransactions(i, blockdata);
            } catch (err) {
              gParallelBlocks[i].inProgress = false;
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
      gTicker = TICKER_BLOCK_COUNT;
    } catch (error) {
      // console.log(error);
    }
  }

  distributeBlocks();
  setTimeout(transactionService, CRON_TX_SCAN_INTERVAL);
}

module.exports = async function () {
  await initParallelInfo();
  await loadParallelInfo();
  transactionService();
};
