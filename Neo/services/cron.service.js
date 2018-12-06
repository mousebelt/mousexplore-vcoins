const _ = require('lodash');

const config = require('../config');
// const localNode = config.localNode;

const ParellelInofModel = require('../model/parellelinfo');
const TransactionModel = require('../model/transactions');
const UtxoModel = require('../model/utxo');

const UtilsModule = require('../modules/utils');

const fs = require('fs');
const Log = require('log');
const log = new Log('debug', fs.createWriteStream('./cron.debug.log', { flags: 'a' }));
// log = new Log('debug');

function filelog(...params) {
  log.info(...params);
}

const promisify = UtilsModule.promisify;

// ///////////////////////////////////////////////////////////////////////////////////
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
      for (let i = 0; i < 50; i++) {
        const row = new ParellelInofModel({
          index: i,
          blocknumber: -1,
          total_txs: 0,
          synced_index: 0,	// synced transactions
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
      const tx = blockdata.tx[i];
      const { txid, size, type, version, vin, vout, sys_fee, net_fee, nonce } = tx;

      // Get vin details
      const vinDetails = [];
      for (let j = 0; j < vin.length; j++) {
        let item = vin[j];
        if (vin[j].txid && vin[j].vout >= 0) {
          let inTxInfo = await TransactionModel.findOne({ txid: vin[j].txid });
          if (inTxInfo) inTxInfo = inTxInfo.vout[vin[j].vout];
          else inTxInfo = await UtilsModule.getTxOutFunc(vin[j].txid, vin[j].vout);

          if (inTxInfo) item = _.merge({}, item, inTxInfo);
          else throw Error(`txout function error. txid: ${vin[j].txid}, vout: ${vin[j].vout}`);
        }
        vinDetails.push(item);
      }

      // //////////////////////////////////////////
      // Save Transaction Info
      // //////////////////////////////////////////
      let txRow = await TransactionModel.findOne({ txid });
      if (!txRow) {
        txRow = new TransactionModel({
          txid, size, type, version, vin, vout, sys_fee, net_fee, nonce,
          blockIndex: blockdata.index,
          blockTime: blockdata.time,
          assets: [],
        });
      }
      for (let j = 0; j < vinDetails.length; j++) {
        const item = vinDetails[j];
        if (!item.asset) continue;

        // save asset to transaction
        if (_.indexOf(txRow.assets, item.asset) === -1) txRow.assets.push(item.asset);
      }
      for (let j = 0; j < vout.length; j++) {
        const item = vout[j];
        if (!item.asset) continue;

        // save asset to transaction
        if (_.indexOf(txRow.assets, item.asset) === -1) txRow.assets.push(item.asset);
      }
      await txRow.save();

      // //////////////////////////////////////////
      // Save Address Info
      // //////////////////////////////////////////
      if (vout && vout.length > 0) {
        for (let j = 0; j < vout.length; j++) {
          const { asset, address } = vout[j];
          const value = Number(vout[j].value);
          if (!asset || !address || !value) continue;
          // Save vout Info
          let utxoRow = await UtxoModel.findOne({ txid, index: j });
          if (!utxoRow) {
            utxoRow = new UtxoModel({
              txid,
              index: j,
              address,
              asset,
              amount: value,
              time: blockdata.time,
              createdAtBlock: blockdata.index
            });
            await utxoRow.save();
          }
        }
      }

      const inN = vout.length;

      if (vinDetails && vinDetails.length > 0) {
        for (let j = 0; j < vinDetails.length; j++) {
          const item = vinDetails[j];
          const { asset, address } = item;
          const value = Number(item.value);
          if (!asset || !address || !value) continue;
          const index = inN + j;
          // Save vout Info
          let utxoRow = await UtxoModel.findOne({ txid, index });
          if (!utxoRow) {
            utxoRow = new UtxoModel({
              txid,
              index,
              address,
              asset,
              amount: 0 - value,
              time: blockdata.time,
              createdAtBlock: blockdata.index
            });
            await utxoRow.save();
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
    // return;
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
      // if (!parellelBlocks[i].inprogressing && (parellelBlocks[i].total_txs == parellelBlocks[i].synced_index)) {
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
        promisify('getblock', [nextnumber, 1])
          .then(async (blockdata) => {
            try {
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
            // filelog("distributeBlocks fails for getblockhash of block: " + nextnumber, err);
            parellelBlocks[i].inprogressing = false;
            // return;
          });
      } else {
        if (!parellelBlocks[i].inprogressing) {
          promisify('getblock', [parellelBlocks[i].blocknumber, 1])
            .then(async (blockdata) => {
              try {
                parellelBlocks[i].inprogressing = true;
                if (parellelBlocks[i].total_txs !== blockdata.tx.length) {
                  parellelBlocks[i].total_txs = blockdata.tx.length;
                  await saveParellelInfo(i);
                }
                await CheckUpdatedTransactions(i, blockdata);
              } catch (error) {
                parellelBlocks[i].inprogressing = false;
              }
            })
            .catch(err => { // eslint-disable-line
              // filelog("distributeBlocks fails for getblockhash of block (else): " + parellelBlocks[i].blocknumber, err);
              parellelBlocks[i].inprogressing = false;
              // return;
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
  require('./init.db').start(); // eslint-disable-line

  await initParellInfo();
  await loadParellInfo();
  transactionService();
};
