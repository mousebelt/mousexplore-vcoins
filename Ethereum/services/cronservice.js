/* eslint-disable prefer-destructuring, no-restricted-globals, no-restricted-properties,
no-continue, no-await-in-loop, no-console, no-plusplus */

const _ = require('lodash');
const Web3 = require('web3');
const fs = require('fs');
const Log = require('log');
const config = require('../config');

const web3 = new Web3(new Web3.providers.HttpProvider(config.provider));

const TransactionModel = require('../model/transactions');
const tokenModel = require('../model/tokens');
const ParellelInofModel = require('../model/parellelinfo');

const log = new Log('debug', fs.createWriteStream(`${__dirname}/debug.log`, { flags: 'a' }));
// const log = new Log('debug');

// global variables
/*
 * length: CHECK_PARELLEL_BLOCKS
 * [{blocknum, total_txs, synced_index, inprogressing}]
 */
const gParellelBlocks = [];
let gTokens = [];
let gLastCheckedNumber = 0;
let gTicker = 1;

// functions

function filelog(...params) {
  log.info(...params);
}

async function initTokenDb() {
  try {
    const count = await tokenModel.countDocuments();
    if (count === 0) {
      await tokenModel.insertMany(config.tokens);
      console.log('created token collection !');
    }
  } catch (e) {
    filelog('init token collection error: ', e);
  }
}

async function loadTokens() {
  try {
    const rows = await tokenModel.find();
    gTokens = _.map(rows, row => ({ symbol: row.symbol, address: row.address, decimal: row.decimal }));
  } catch (e) {
    filelog('load tokens error: ', e);
  }
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
      for (let i = 0; i < 50; i++) {
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
        const { blocknumber } = gParellelBlocks[threadIndex];
        let hash = null;
        let from = null;
        let to = null;
        let value = null;
        let fee = null;
        let timestamp = null;
        let tokenSymbol = null;
        let tokenFrom = null;
        let tokenTo = null;
        let tokenAmount = null;

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

        //
        const token = _.find(gTokens, o => (o.address === to));
        if (token !== undefined) {
          const inputdata = transaction.input;
          const methodid = inputdata.slice(0, 10);
          if (methodid === '0xa9059cbb') {
            tokenSymbol = token.symbol;
            // tokenTo = inputdata.slice(10, 74);
            // tokenTo = tokenTo.replace(/^(0)*/, '');
            tokenTo = inputdata.slice(34, 74);
            if (tokenTo) tokenTo = `0x${tokenTo.toLowerCase()}`;

            tokenAmount = inputdata.slice(74, 138);
            tokenAmount = tokenAmount.replace(/^(0)*/, '');
            if (tokenAmount !== '') {
              tokenAmount = parseInt(`0x${tokenAmount}`, 16);
              tokenAmount /= Math.pow(10, token.decimal);
            } else {
              tokenAmount = null;
            }

            tokenFrom = txnReceipt.from;
          } else if (methodid === '0x23b872dd') {
            tokenSymbol = token.symbol;
            // tokenFrom = inputdata.slice(10, 74);
            // tokenFrom = tokenFrom.replace(/^(0)*/, '');
            tokenFrom = inputdata.slice(34, 74);
            if (tokenFrom) tokenFrom = `0x${tokenFrom.toLowerCase()}`;

            // tokenTo = inputdata.slice(74, 138);
            // tokenTo = tokenTo.replace(/^(0)*/, '');
            tokenTo = inputdata.slice(98, 138);
            if (tokenTo) tokenTo = `0x${tokenTo.toLowerCase()}`;

            tokenAmount = inputdata.slice(138, 202);
            tokenAmount = tokenAmount.replace(/^(0)*/, '');
            if (tokenAmount !== '') {
              tokenAmount = parseInt(`0x${tokenAmount}`, 16);
              tokenAmount /= Math.pow(10, token.decimal);
            } else {
              tokenAmount = null;
            }
          }
        }

        // Handle db insert error
        if (isNaN(tokenAmount)) tokenAmount = null;

        await TransactionModel.findOneAndUpdate({ hash }, {
          blocknumber,
          hash,
          from,
          to,
          value,
          fee,
          timestamp,
          tokenSymbol,
          tokenFrom,
          tokenTo,
          tokenAmount
        }, { upsert: true });

        gParellelBlocks[threadIndex].synced_index = j + 1;

        // save
        await saveParellelInfo(threadIndex);
      }
    }
    gParellelBlocks[threadIndex].inprogressing = false;
  } catch (e) {
    // filelog('CheckUpdatedTransactions: error: ', e); // Should dump errors here
    gParellelBlocks[threadIndex].inprogressing = false;

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
        web3.eth.getBlock(nextnumber, true, async (error, blockdata) => {
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
            // filelog("distributeBlocks fails for getBlock of block: " + nextnumber);
            gParellelBlocks[i].inprogressing = false;
          }
        });
      } else if (!gParellelBlocks[i].inprogressing) {
        web3.eth.getBlock(gParellelBlocks[i].blocknumber, true, async (error, blockdata) => {
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

exports.start_cronService = async function () {
  await initTokenDb();
  await loadTokens();

  await initParellInfo();
  await loadParellInfo();

  transactionService();
};
