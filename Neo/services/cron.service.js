var _ = require("lodash");

var config = require("../config");
var localNode = config.localNode;

var ParellelInofModel = require("../model/parellelinfo");
var TransactionModel = require("../model/transactions");
var UtxoModel = require("../model/utxo");

var UtilsModule = require("../modules/utils");

var fs = require('fs');
var Log = require('log'),
  log = new Log('debug', fs.createWriteStream('./cron.debug.log', { flags: 'a' }));
// log = new Log('debug');

function filelog(...params) {
  log.info(...params);
};

var promisify = UtilsModule.promisify;

/////////////////////////////////////////////////////////////////////////////////////
var parellel_blocks = [];

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

    var blocknum = -1;
    for (let i = 0; i < config.CHECK_PARELLEL_BLOCKS; i++) {
      if (parellel_blocks[i] && blocknum < parellel_blocks[i].blocknumber) {
        blocknum = parellel_blocks[i].blocknumber;
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

/*
 * Distribute blocks to process threads(promise).
 * If a thread finished process, build new process for new block.
 */
function distributeBlocks() {
  try {
    for (let i = 0; i < config.CHECK_PARELLEL_BLOCKS; i++) {
      //if a thread is finished
      if (!parellel_blocks[i].inprogressing && (parellel_blocks[i].total_txs == parellel_blocks[i].synced_index)) {

        let nextnumber = getNextBlockNum(g_lastCheckedNumber);
        if (nextnumber == -1)
          continue;

        parellel_blocks[i] = {
          blocknumber: nextnumber,
          total_txs: -1,
          synced_index: 0,
          inprogressing: true
        }
        saveParellelInfo(i);
        promisify('getblock', [nextnumber, 1])
          .then(async (blockdata) => {
            parellel_blocks[i] = {
              blocknumber: nextnumber,
              total_txs: blockdata.tx.length,
              synced_index: 0,
              inprogressing: true
            }

            saveParellelInfo(i);

            await CheckUpdatedTransactions(i, blockdata);
          })
          .catch(err => {
            filelog("distributeBlocks fails for getblockhash of block: " + nextnumber);
            parellel_blocks[i].inprogressing = false;
            return;
          })
      }
      else {
        if (!parellel_blocks[i].inprogressing) {
          promisify('getblock', [parellel_blocks[i].blocknumber, 1])
            .then(async (blockdata) => {
              parellel_blocks[i].inprogressing = true;
              if (parellel_blocks[i].total_txs != blockdata.tx.length) {
                parellel_blocks[i].total_txs = blockdata.tx.length;
                saveParellelInfo(i);
              }

              await CheckUpdatedTransactions(i, blockdata);
            })
            .catch(err => {
              filelog("distributeBlocks fails for getblockhash of block: " + parellel_blocks[i].blocknumber);
              parellel_blocks[i].inprogressing = false;
              return;
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
    var txnCount = blockdata.tx.length;

    for (let i = parellel_blocks[threadIndex].synced_index; i < txnCount; i++) {
      let tx = blockdata.tx[i];
      let { txid, size, type, version, vin, vout, sys_fee, net_fee, nonce } = tx;

      // Get vin details
      var vinDetails = [];
      for (let j = 0; j < vin.length; j++) {
        var item = vin[j];
        if (vin[j].txid && vin[j].vout >= 0) {
          var inTxInfo = await TransactionModel.findOne({ txid: vin[j].txid });
          if (inTxInfo) inTxInfo = inTxInfo.vout[vin[j].vout];
          else inTxInfo = await UtilsModule.getTxOutFunc(vin[j].txid, vin[j].vout);
          
          if (inTxInfo) item = _.merge({}, item, inTxInfo);
          else throw `txout function error. txid: ${vin[j].txid}, vout: ${vin[j].vout}`;
        }
        vinDetails.push(item);
      }

      ////////////////////////////////////////////
      // Save Transaction Info
      ////////////////////////////////////////////
      {
        var txRow = await TransactionModel.findOne({ txid });
        if (!txRow) {
          txRow = new TransactionModel({
            txid, size, type, version, vin, vout, sys_fee, net_fee, nonce,
            blockIndex: blockdata.index,
            blockTime: blockdata.time,
            assets: [],
          });
        }
        for (let j = 0; j < vinDetails.length; j++) {
          var item = vinDetails[j];
          if (!item.asset) continue;

          // save asset to transaction
          if (_.indexOf(txRow.assets, item.asset) == -1) txRow.assets.push(item.asset);
        }
        for (let j = 0; j < vout.length; j++) {
          var item = vout[j];
          if (!item.asset) continue;

          // save asset to transaction
          if (_.indexOf(txRow.assets, item.asset) == -1) txRow.assets.push(item.asset);
        }
        await txRow.save();
      }

      ////////////////////////////////////////////
      // Save Address Info
      ////////////////////////////////////////////
      if (vout && vout.length > 0) {
        for (let j = 0; j < vout.length; j++) {
          let { asset, address } = vout[j];
          var value = Number(vout[j].value);
          if (!asset || !address || !value) continue;
          // Save vout Info
          var utxoRow = await UtxoModel.findOne({ txid, index: j });
          if (!utxoRow) {
            utxoRow = new UtxoModel({
              txid,
              index: j,
              address: address,
              asset,
              amount: value,
              time: blockdata.time,
              createdAtBlock: blockdata.index
            })
            await utxoRow.save();
          }
        }
      }

      var in_n = vout.length;

      if (vinDetails && vinDetails.length > 0) {
        for (let j = 0; j < vinDetails.length; j++) {
          var item = vinDetails[j];
          let { asset, address } = item;
          var value = Number(item.value);
          if (!asset || !address || !value) continue;
          var index = in_n + j;
          // Save vout Info
          var utxoRow = await UtxoModel.findOne({ txid, index });
          if (!utxoRow) {
            utxoRow = new UtxoModel({
              txid,
              index,
              address: address,
              asset,
              amount: 0 - value,
              time: blockdata.time,
              createdAtBlock: blockdata.index
            })
            await utxoRow.save();
          }
        }
      }
      parellel_blocks[threadIndex].synced_index = i + 1;

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
      g_lastCheckedNumber = await promisify("getblockcount", []);
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
};
