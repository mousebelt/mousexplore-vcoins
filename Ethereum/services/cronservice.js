const _ = require('lodash');
var config = require("../config");
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider(config.provider));

var TransactionModel = require("../model/transactions");
var tokenModel = require("../model/tokens");
var ParellelInofModel = require("../model/parellelinfo");

/*
 * length: CHECK_PARELLEL_BLOCKS
 * [{blocknum, total_txs, synced_index, inprogressing}] 
 */
var parellel_blocks = [];
var gTokens = [];

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

async function initTokenDb() {
  try {
    var count = await tokenModel.find().count();
    if (count == 0) {
      await tokenModel.insertMany(config.tokens);
      console.log("created token collection !");
    }
  }
  catch (e) {
    filelog("init token collection error: ", e);
  }
}

async function loadTokens() {
  try {
    var rows = await tokenModel.find();
    gTokens = _.map(rows, (row) => {
      return { symbol: row.symbol, address: row.address, decimal: row.decimal };
    });
  }
  catch (e) {
    filelog("load tokens error: ", e);
  }
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
          synced_index: row.synced_index,
          inprogressing: false
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
    await ParellelInofModel.findOneAndUpdate({ index: threadIndex }, {
      index: threadIndex,
      blocknumber: parellel_blocks[threadIndex].blocknumber,
      total_txs: parellel_blocks[threadIndex].total_txs,
      synced_index: parellel_blocks[threadIndex].synced_index
    }, { upsert: true });
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
async function distributeBlocks() {
  try {
    for (let i = 0; i < config.CHECK_PARELLEL_BLOCKS; i++) {
      //if a thread is finished
      if (!parellel_blocks[i].inprogressing && (parellel_blocks[i].total_txs <= parellel_blocks[i].synced_index) && parellel_blocks[i].total_txs > -1) {

        let nextnumber = getNextBlockNum(g_lastCheckedNumber);
        if (nextnumber == -1)
          continue;

        parellel_blocks[i] = {
          blocknumber: nextnumber,
          total_txs: -1,
          synced_index: 0,
          inprogressing: true
        }
        await saveParellelInfo(i);
        web3.eth.getBlock(nextnumber, true, async function (error, blockdata) {
          try {
            if (error) throw error;

            parellel_blocks[i] = {
              blocknumber: nextnumber,
              total_txs: blockdata.transactions.length,
              synced_index: 0,
              inprogressing: true
            }

            await saveParellelInfo(i);

            await CheckUpdatedTransactions(i, blockdata);
          } catch (error) {
            // filelog("distributeBlocks fails for getBlock of block: " + nextnumber);
            parellel_blocks[i].inprogressing = false;
          }
        })
      }
      else {
        if (!parellel_blocks[i].inprogressing) {
          web3.eth.getBlock(parellel_blocks[i].blocknumber, true, async function (error, blockdata) {
            try {
              if (error) throw error;

              parellel_blocks[i].inprogressing = true;
              parellel_blocks[i].total_txs = blockdata.transactions.length;
              await saveParellelInfo(i);

              await CheckUpdatedTransactions(i, blockdata);
            } catch (error) {
              parellel_blocks[i].inprogressing = false;
            }
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
    parellel_blocks[threadIndex].total_txs = txnCount;

    if (txnCount <= parellel_blocks[threadIndex].synced_index) {
      parellel_blocks[threadIndex].synced_index = txnCount;
      await saveParellelInfo(threadIndex);
    }
    else {
      for (let j = parellel_blocks[threadIndex].synced_index; j < txnCount; j++) {
        // transaction model data init
        let blocknumber = parellel_blocks[threadIndex].blocknumber;
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
        let transaction = blockdata.transactions[j];
        hash = transaction.hash;
        from = String(transaction.from).toLowerCase();
        to = String(transaction.to).toLowerCase();
        value = transaction.value;
        timestamp = blockdata.timestamp;

        let gasprice = transaction.gasPrice;
        var txnReceipt = await web3.eth.getTransactionReceipt(hash);
        fee = gasprice * txnReceipt.gasUsed;

        // 
        let token = _.find(gTokens, function(o) { return o.address === to; });
        if (token !== undefined) {
          tokenSymbol = token.symbol;
          var inputdata = transaction.input;
          let methodid = inputdata.slice(0, 10);
          if (methodid == "0xa9059cbb") {
            tokenTo = inputdata.slice(10, 74);
            tokenTo = tokenTo.replace(/^(0)*/, '');

            tokenAmount = inputdata.slice(74, 138);
            tokenAmount = tokenAmount.replace(/^(0)*/, '');
            tokenAmount = parseInt('0x' + tokenAmount, 16);
            tokenAmount = tokenAmount / Math.pow(10, token.decimal);

            tokenFrom = txnReceipt.from;
          }
          else if (methodid == "0x23b872dd") {
            tokenFrom = inputdata.slice(10, 74);
            tokenFrom = tokenFrom.replace(/^(0)*/, '')

            tokenTo = inputdata.slice(74, 138);
            tokenTo = tokenTo.replace(/^(0)*/, '')

            tokenAmount = inputdata.slice(138, 202);
            tokenAmount = tokenAmount.replace(/^(0)*/, '')
            tokenAmount = parseInt('0x' + tokenAmount, 16);
            tokenAmount = tokenAmount / Math.pow(10, token.decimal);
          }
        }

        await TransactionModel.findOneAndUpdate({ hash }, {
          blocknumber, hash, from, to, value, fee, timestamp,
          tokenSymbol, tokenFrom, tokenTo, tokenAmount
        }, { upsert: true });
    
        // var newTxn = await TransactionModel.findOne({ hash });
        // if (!newTxn) {
        //   var newTxn = new TransactionModel({
        //     blocknumber: parellel_blocks[threadIndex].blocknumber,
        //     hash,
        //     from: from.toLowerCase(),
        //     to: to.toLowerCase(),
        //     value,
        //     fee,
        //     timestamp
        //   });
        //   await newTxn.save();
        // }

        parellel_blocks[threadIndex].synced_index = j + 1;

        // save
        await saveParellelInfo(threadIndex);
      }
    }
    parellel_blocks[threadIndex].inprogressing = false;
  }
  catch (e) {
    // filelog('CheckUpdatedTransactions: error: ', e); // Should dump errors here
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
  // require('./init.db').start();
  await initTokenDb();
  await loadTokens();

  await initParellInfo();
  await loadParellInfo();

  transactionService();
}