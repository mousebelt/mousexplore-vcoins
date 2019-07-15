/* eslint-disable no-continue, prefer-destructuring, no-await-in-loop, no-plusplus */
const Log = require('log');
const { CHECK_PARALLEL_BLOCKS, TICKER_BLOCK, CRON_TIME_INTERVAL } = require('../config');
const models = require('../models');
const { web3 } = require('../utils/loom');

// const fs = require('fs');
// const log = new Log('debug', fs.createWriteStream(`${__dirname}/debug.log`, { flags: 'a' }));
const log = new Log('debug');

// global variables
/*
 * length: CHECK_PARALLEL_BLOCKS
 * [{ index, blockNumber, totalTxs, syncedIndex, inProgress }]
 */
const gParallelBlocks = [];
let gLastCheckedNumber = 0;
let gTicker = 1;

// functions

function filelog(...params) {
  log.info(...params);
}

function initParallInfo() {
  return models.parallel_info.findAndCountAll({})
    .then(async (data) => {
      const { count } = data;
      for (let index = count; index < CHECK_PARALLEL_BLOCKS; index++) {
        await models.parallel_info.create({
          index,
          blockNumber: index,
          totalTxs: 0,
          syncedIndex: 0
        });
      }
    })
    .catch(err => filelog('init parallel info error: ', err));
}

function loadParallelInfo() {
  return models.parallel_info.findAll({
    limit: CHECK_PARALLEL_BLOCKS,
    $sort: { index: 1 },
  })
    .then((rows) => {
      for (let i = 0; i < CHECK_PARALLEL_BLOCKS; i++) {
        const {
          index, blockNumber, totalTxs, syncedIndex
        } = rows[i];
        gParallelBlocks[index] = {
          blockNumber,
          totalTxs,
          syncedIndex,
          inProgress: false
        };
      }
    })
    .catch(err => filelog('load parallel info error: ', err));
}

function saveParallelInfo(index) {
  const { blockNumber, totalTxs, syncedIndex } = gParallelBlocks[index];
  return models.parallel_info.upsert(
    { blockNumber, totalTxs, syncedIndex },
    { index }
  );
}

function getNextBlockNumber(lastNumber) {
  if (!lastNumber) return -1;

  let blockNumber = -1;
  for (let i = 0; i < CHECK_PARALLEL_BLOCKS; i++) {
    if (gParallelBlocks[i] && blockNumber < gParallelBlocks[i].blockNumber) {
      blockNumber = gParallelBlocks[i].blockNumber;
    }
  }

  blockNumber++;
  if (blockNumber > lastNumber) return -1;
  return blockNumber;
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
        const { blockNumber } = gParallelBlocks[threadIndex];
        let hash = null;
        let from = null;
        let to = null;
        let value = null;
        const fee = 0;
        let timestamp = null;

        // handle transaction
        const transaction = blockdata.transactions[j];
        hash = transaction.hash;
        from = String(transaction.from).toLowerCase();
        to = String(transaction.to).toLowerCase();
        value = transaction.value;
        timestamp = blockdata.timestamp;

        // const gasprice = transaction.gasPrice;
        // const txnReceipt = await web3.eth.getTransactionReceipt(hash);
        // fee = gasprice * txnReceipt.gasUsed;

        await models.loom_tx.upsert({
          hash, blockNumber, from, to, value, fee, timestamp
        }, { hash });
        gParallelBlocks[threadIndex].syncedIndex = j + 1;
        await saveParallelInfo(threadIndex);
      }
    }
    gParallelBlocks[threadIndex].inProgress = false;
  } catch (err) {
    filelog('CheckUpdatedTransactions: error: ', err);
    gParallelBlocks[threadIndex].inProgress = false;
  }
}

/*
 * Distribute blocks to process threads(promise).
 * If a thread finished process, build new process for new block.
 */
async function distributeBlocks() {
  try {
    for (let i = 0; i < CHECK_PARALLEL_BLOCKS; i++) {
      // if a thread is finished
      if (
        !gParallelBlocks[i].inProgress
        && (gParallelBlocks[i].totalTxs <= gParallelBlocks[i].syncedIndex)
        && gParallelBlocks[i].totalTxs > -1
      ) {
        const nextNumber = getNextBlockNumber(gLastCheckedNumber);
        if (nextNumber === -1) continue;

        gParallelBlocks[i] = {
          blockNumber: nextNumber,
          totalTxs: -1,
          syncedIndex: 0,
          inProgress: true
        };
        await saveParallelInfo(i);
        web3.eth.getBlock(nextNumber, true, async (error, blockdata) => {
          try {
            if (error) throw error;
            gParallelBlocks[i] = {
              blockNumber: nextNumber,
              totalTxs: blockdata.transactions.length,
              syncedIndex: 0,
              inProgress: true
            };
            await saveParallelInfo(i);
            await CheckUpdatedTransactions(i, blockdata);
          } catch (err) {
            filelog('distributeBlocks fails for getBlock of block: ', nextNumber);
            gParallelBlocks[i].inProgress = false;
          }
        });
      } else if (!gParallelBlocks[i].inProgress) {
        web3.eth.getBlock(gParallelBlocks[i].blockNumber, true, async (error, blockdata) => {
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
  } catch (e) {
    filelog('distributeBlocks fails: ', e);
  }
}

async function transactionService() {
  gTicker--;
  if (gTicker <= 0) {
    try {
      gLastCheckedNumber = await web3.eth.getBlockNumber();
      gTicker = TICKER_BLOCK;
    } catch (error) { } // eslint-disable-line
  }
  distributeBlocks();
  setTimeout(transactionService, CRON_TIME_INTERVAL);
}

module.exports = async function () {
  await initParallInfo();
  await loadParallelInfo();
  transactionService();
};
