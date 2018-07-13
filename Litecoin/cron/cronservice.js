const _ = require("lodash");
var config = require("../config");
var client = config.localNode;

var TransactionModel = require("../model/transactions");
var ParellelInofModel = require("../model/parellelinfo");
var UtxoModel = require("../model/utxo");
// var AddressModel = require("../model/address");
var UtilsModule = require("../modules/utils");
var fs = require("fs");
var Log = require("log"),
  log = new Log(
    "debug",
    fs.createWriteStream(__dirname + "/debug.log", { flags: "a" })
  );
// log = new Log('debug');

function filelog(...params) {
  log.info(...params);
}

var promisify = UtilsModule.promisify;

////////////////////////////////////////////////////////////////////////////
/*
 * length: CHECK_PARELLEL_BLOCKS
 * [{blocknum, total_txs, synced_index, inprogressing}] 
 */
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

        promisify('getblockhash', [nextnumber])
          .then(async (hash) => {
            var blockdata = await promisify("getblock", [hash]);
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
          promisify('getblockhash', [parellel_blocks[i].blocknumber])
            .then(async (hash) => {
              var blockdata = await promisify("getblock", [hash]);
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
      let txid = blockdata.tx[i];

      // skip genesis txid
      if (_.indexOf(config.genesisTxids, txid) > -1) {
        parellel_blocks[threadIndex].synced_index = i + 1;

        // save
        await saveParellelInfo(threadIndex);
        continue;
      }

      var txInfo = await TransactionModel.findOne({ txid });
      if (!txInfo) {
        // get from chain
        txInfo = await promisify("getrawtransaction", [txid, 1]);
        if (txInfo) {
          // Save Transaction Info
          var txRow = new TransactionModel({
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
      var vin = txInfo.vin;
      var vout = txInfo.vout;

      var in_n = vout.length;
      // handle vout
      if (vout && vout.length > 0) {
        for (let j = 0; j < vout.length; j++) {
          var addresses = vout[j].scriptPubKey.addresses;
          var value = Number(vout[j].value);
          if (addresses && addresses.length > 0 && value > 0) {
            // Save Info
            var utxoRow = await UtxoModel.findOne({ txid, index: j });
            if (!utxoRow) {
              utxoRow = new UtxoModel({
                txid,
                index: j,
                address: addresses[0],
                amount: value,
                time: blockdata.time,
                createdAtBlock: blockdata.height
              })
              await utxoRow.save();
            }
          }
        }
      }

      if (vin && vin.length > 0) {
        for (let j = 0; j < vin.length; j++) {
          var inTxid = vin[j].txid;
          var inVout = Number(vin[j].vout);
          if (!inTxid || inTxid == "" || inVout < 0) continue;
          if (_.indexOf(config.genesisTxids, inTxid) > -1) continue;

          ///////// read vin info from db first, and then get from chain next
          // var inTxResult = await promisify("getrawtransaction", [inTxid, 1]);
          var inTxResult, inTxInfo;
          // get from db
          inTxResult = await TransactionModel.findOne({ txid: inTxid });
          if (!inTxResult) {
            // get from chain
            inTxResult = await promisify("getrawtransaction", [inTxid, 1]);
            if (!inTxResult) new Error(`empty tx info(getrawtransaction). txid: ${txid}`)
          }
          var inTxInfo = inTxResult.vout[inVout];

          var addresses = inTxInfo.scriptPubKey.addresses;
          var value = Number(inTxInfo.value);
          var index = in_n + j;

          if (addresses && addresses.length > 0 && value > 0) {
              // Save Info
              var utxoRow = await UtxoModel.findOne({ txid, index });
              if (!utxoRow) {
                utxoRow = new UtxoModel({
                  txid,
                  index,
                  address: addresses[0],
                  amount: 0 - value,
                  time: blockdata.time,
                  createdAtBlock: blockdata.height
                })
                await utxoRow.save();
              }
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
  await initParellInfo();
  await loadParellInfo();
  transactionService();
};
