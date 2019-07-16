/* eslint-disable no-continue, no-await-in-loop, no-plusplus */
const _ = require('lodash');
const fs = require('fs');
const Log = require('log');
const config = require('../config');
// const client = config.localNode;

const TransactionModel = require('../model/transactions');
const ParellelInofModel = require('../model/parellelinfo');
const UtxoModel = require('../model/utxo');
// var AddressModel = require("../model/address");
const UtilsModule = require('../modules/utils');

const log = new Log('debug', fs.createWriteStream(__dirname + '/debug.log', { flags: 'a' })); // eslint-disable-line
// log = new Log('debug');

function filelog(...params) {
  log.info(...params);
}

const { promisify } = UtilsModule;

/*
 * length: CHECK_PARELLEL_BLOCKS
 * [{blocknum, total_txs, synced_index, inprogressing}]
 */
const parellelBlocks = [];
let gLastCheckedNumber = 0;
let gTicker = 1;


async function loadParellInfo() {
  try {
    const piRows = await ParellelInofModel.find().limit(config.CHECK_PARELLEL_BLOCKS);
    if (piRows && piRows.length > 0) {
      for (let i = 0; i < piRows.length; i++) {
        const row = piRows[i];
        parellelBlocks[row.index] = {
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
    const rowCount = await ParellelInofModel.find().count();
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
      blocknumber: parellelBlocks[threadIndex].blocknumber,
      total_txs: parellelBlocks[threadIndex].total_txs,
      synced_index: parellelBlocks[threadIndex].synced_index
    }, { upsert: true });

    // var info = await ParellelInofModel.findOne({ index: threadIndex });

    // if (info) {
    //   info.set({
    //     index: threadIndex,
    //     blocknumber: parellelBlocks[threadIndex].blocknumber,
    //     total_txs: parellelBlocks[threadIndex].total_txs,
    //     synced_index: parellelBlocks[threadIndex].synced_index
    //   });
    // }
    // else {
    //   info = new ParellelInofModel({
    //     index: threadIndex,
    //     blocknumber: parellelBlocks[threadIndex].blocknumber,
    //     total_txs: parellelBlocks[threadIndex].total_txs,
    //     synced_index: parellelBlocks[threadIndex].synced_index
    //   });
    // }
    // await info.save();
  } catch (error) {
    filelog('saveParellelInfo:error: ', error); // Should dump errors here
  }
}

function getNextBlockNum(lastnumber) {
  try {
    if (!lastnumber) return -1;

    let blocknum = -1;
    for (let i = 0; i < config.CHECK_PARELLEL_BLOCKS; i++) {
      if (parellelBlocks[i] && blocknum < parellelBlocks[i].blocknumber) {
        blocknum = parellelBlocks[i].blocknumber;
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
    const txnCount = blockdata.tx.length;

    for (let i = parellelBlocks[threadIndex].synced_index; i < txnCount; i++) {
      const txid = blockdata.tx[i];

      // skip genesis txid
      if (_.indexOf(config.genesisTxids, txid) > -1) {
        parellelBlocks[threadIndex].synced_index = i + 1;

        // save
        await saveParellelInfo(threadIndex);
        continue;
      }

      let txInfo = await TransactionModel.findOne({ txid });
      if (!txInfo) {
        // get from chain
        txInfo = await promisify('getrawtransaction', [txid, 1]);
        if (txInfo) {
          // Save Transaction Info
          const txRow = new TransactionModel({
            txid,
            time: blockdata.time,
            blockheight: blockdata.height,
            blockhash: blockdata.hash,
            vin: txInfo.vin,
            vout: txInfo.vout
          });
          await txRow.save();
        } else throw new Error(`empty tx info(getrawtransaction). txid: ${txid}`);
      }

      // Handle utxo
      const { vin } = txInfo;
      const { vout } = txInfo;

      const inN = vout.length;
      // handle vout
      if (vout && vout.length > 0) {
        for (let j = 0; j < vout.length; j++) {
          const { addresses } = vout[j].scriptPubKey;
          const value = Number(vout[j].value);
          if (addresses && addresses.length > 0 && value > 0) {
            // Save Info
            let utxoRow = await UtxoModel.findOne({ txid, index: j });
            if (!utxoRow) {
              utxoRow = new UtxoModel({
                txid,
                index: j,
                address: addresses[0],
                amount: value,
                time: blockdata.time,
                createdAtBlock: blockdata.height
              });
              await utxoRow.save();
            }
          }
        }
      }

      if (vin && vin.length > 0) {
        for (let j = 0; j < vin.length; j++) {
          const inTxid = vin[j].txid;
          const inVout = Number(vin[j].vout);
          if (!inTxid || inTxid === '' || inVout < 0) continue;
          if (_.indexOf(config.genesisTxids, inTxid) > -1) continue;

          // /////// read vin info from db first, and then get from chain next
          // var inTxResult = await promisify("getrawtransaction", [inTxid, 1]);
          let inTxResult;
          // get from db
          inTxResult = await TransactionModel.findOne({ txid: inTxid });
          if (!inTxResult) {
            // get from chain
            inTxResult = await promisify('getrawtransaction', [inTxid, 1]);
            if (!inTxResult) throw Error(`empty tx info(getrawtransaction). txid: ${txid}`);
          }
          const inTxInfo = inTxResult.vout[inVout];

          const { addresses } = inTxInfo.scriptPubKey;
          const value = Number(inTxInfo.value);
          const index = inN + j;

          if (addresses && addresses.length > 0 && value > 0) {
            // Save Info
            let utxoRow = await UtxoModel.findOne({ txid, index });
            if (!utxoRow) {
              utxoRow = new UtxoModel({
                txid,
                index,
                address: addresses[0],
                amount: 0 - value,
                time: blockdata.time,
                createdAtBlock: blockdata.height
              });
              await utxoRow.save();
            }
          }
        }
      }
      parellelBlocks[threadIndex].synced_index = i + 1;

      // save
      await saveParellelInfo(threadIndex);
    }
    parellelBlocks[threadIndex].inprogressing = false;
  } catch (e) {
    filelog('CheckUpdatedTransactions: error: ', e); // Should dump errors here
    parellelBlocks[threadIndex].inprogressing = false;

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
        !parellelBlocks[i].inprogressing
        && (parellelBlocks[i].total_txs <= parellelBlocks[i].synced_index)
        && parellelBlocks[i].total_txs > -1
      ) {

        const nextnumber = getNextBlockNum(gLastCheckedNumber);
        if (nextnumber === -1) continue;

        parellelBlocks[i] = {
          blocknumber: nextnumber,
          total_txs: -1,
          synced_index: 0,
          inprogressing: true
        };
        await saveParellelInfo(i);

        promisify('getblockhash', [nextnumber])
          .then(async (hash) => {
            try {
              const blockdata = await promisify('getblock', [hash]);
              parellelBlocks[i] = {
                blocknumber: nextnumber,
                total_txs: blockdata.tx.length,
                synced_index: 0,
                inprogressing: true
              };
              await saveParellelInfo(i);
              await CheckUpdatedTransactions(i, blockdata);
            } catch (error) {
              parellelBlocks[i].inprogressing = false;
            }
          })
          .catch(err => { // eslint-disable-line
            filelog('distributeBlocks fails for getblockhash of block: ', nextnumber);
            parellelBlocks[i].inprogressing = false;
            // return;
          });
      } else if (!parellelBlocks[i].inprogressing) {
        promisify('getblockhash', [parellelBlocks[i].blocknumber])
          .then(async (hash) => {
            try {
              parellelBlocks[i].inprogressing = true;
              const blockdata = await promisify('getblock', [hash]);
              if (parellelBlocks[i].total_txs !== blockdata.tx.length) {
                parellelBlocks[i].total_txs = blockdata.tx.length;
                await saveParellelInfo(i);
              }
              await CheckUpdatedTransactions(i, blockdata);
            } catch (error) {
              filelog('distributeBlocks fails for getblock, hash, i: ', parellelBlocks[i].blocknumber, hash, i, error);
              parellelBlocks[i].inprogressing = false;
            }
          })
            .catch(err => { // eslint-disable-line
            filelog('distributeBlocks fails for getblockhash of block: ', parellelBlocks[i].blocknumber);
            parellelBlocks[i].inprogressing = false;
            // return;
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
      gLastCheckedNumber = await promisify('getblockcount', []);
      gTicker = config.TICKER_BLOCK;
    } catch (error) {
      // console.log(error);
    }
  }

  distributeBlocks();
  setTimeout(transactionService, config.CRON_TIME_INTERVAL);
}

exports.start_cronService = async function () {
  await initParellInfo();
  await loadParellInfo();
  transactionService();
};
