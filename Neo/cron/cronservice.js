var config = require("../config");
var localNode = config.localNode;

var sleepms = require('sleep-ms');
var TransactionModel = require("../model/transactions");
var AddressModel = require("../model/address");
var TokenModel = require("../model/tokens");
var TxServiceInofModel = require("../model/txServiceInfo");
var AddrServiceInofModel = require("../model/addrServiceInfo");

var fs = require('fs');
var Log = require('log'),
  log = new Log('debug', fs.createWriteStream(__dirname + '/debug.log', { flags: 'a' }));
// log = new Log('debug');

function filelog(...params) { //
  log.info(...params);
  // console.log(...params);
};

async function getTxServiceInfo() {
  try {
    txServiceInfo = await TxServiceInofModel.findOne();
    if (txServiceInfo) return txServiceInfo;
    else return {
      lastblock: 0,
      lastTxIndex: 0
    }
  }
  catch (e) {
    filelog("getTxServiceInfo error: ", e);
    return undefined;
  }
}

async function saveTxServiceInfo(lastblock, lastTxIndex) {
  await TxServiceInofModel.findOne(async function (e, info) {
    if (!e) {
      if (info) {
        info.set({ lastblock, lastTxIndex });
      }
      else {
        info = new TxServiceInofModel({ lastblock, lastTxIndex });
      }
      await info.save();
    }
    else {
      filelog('saveTxServiceInfo error: ', e); // Should dump errors here
    }
  });
}

async function getAddrServiceInfo() {
  try {
    addrServiceInfo = await AddrServiceInofModel.findOne();
    if (addrServiceInfo) return addrServiceInfo;
    else return {
      lastTxid: "",
      lastTxOffset: 0,
    }
  }
  catch (e) {
    filelog("getAddrServiceInfo error: ", e);
    return undefined;
  }
}

async function saveAddrServiceInfo(lastTxid, lastTxOffset) {
  await AddrServiceInofModel.findOne(async function (e, info) {
    if (!e) {
      if (info) {
        info.set({
          lastTxid,
          lastTxOffset,
        });
      }
      else {
        info = new AddrServiceInofModel({
          lastTxid: "",
          lastTxOffset: 0,
        });
      }
      await info.save();
    }
    else {
      filelog('saveAddrServiceInfo error: ', e); // Should dump errors here
    }
  });
}

async function CheckUpdatedTransactions() {
  filelog('CheckUpdatedTransactions starting...');
  var lastblock = 0, lastTxIndex = 0;
  var txServiceInfo = await getTxServiceInfo();
  if (txServiceInfo) {
    lastblock = txServiceInfo.lastblock;
    lastTxIndex = txServiceInfo.lastTxIndex;
  }
  filelog({ txServiceInfo });

  try {
    var blockCount = await localNode.getBlockCount();
    if (blockCount) {
      var limit = lastblock + config.TX_CRON_BLOCK_COUNT;
      for (let i = lastblock; i < blockCount && i <= limit; i++) {
        try {
          var blockdata = await localNode.getBlockByHeight(i, 1);
          var txs = blockdata.tx;

          for (let j = lastTxIndex; j < txs.length; j++) {
            let tx = txs[j]
            let { txid, size, type, version, vin, vout, sys_fee, net_fee, nonce } = tx;

            // Save Transaction Info
            var txRow = await TransactionModel.findOne({ txid });
            if (!txRow) {

              txRow = new TransactionModel({
                txid, size, type, version, vin, vout, sys_fee, net_fee, nonce,
                blockIndex: blockdata.index,
                blockTime: blockdata.time
              });

              try {
                await txRow.save();
              }
              catch (e) {
                filelog(`transaction save error: txid=${txid}, error: `, e); // Should dump errors here
                return;
              }
            }

            // Save service info
            lastblock = i;
            lastTxIndex = j;
            await saveTxServiceInfo(lastblock, lastTxIndex);
          }

          if (lastblock != i || lastTxIndex != 0) {
            lastblock = i;
            lastTxIndex = 0;
            await saveTxServiceInfo(lastblock, lastTxIndex);
          }
        }
        catch (e) {
          filelog('localNode getBlockByHeight error: ', e); // Should dump errors here
          return;
        }
      }
    } else {
      filelog('localNode getBlockCount: blockcount is empty'); // Should dump errors here
    }
  } catch (error) {
    filelog('localNode getBlockCount error: ', error); // Should dump errors here
  }
}

async function CheckUpdatedAddresses() {
  filelog('CheckUpdatedAddresses starting...');

  var lastTxid = "", lastTxOffset = 0;
  var serviceInfo = await getAddrServiceInfo();
  if (serviceInfo) {
    lastTxid = serviceInfo.lastTxid;
    lastTxOffset = serviceInfo.lastTxOffset;
  }
  filelog({ serviceInfo });

  var arrTxs = await TransactionModel.find().skip(lastTxOffset).limit(config.ADDR_CRON_TX_COUNT);

  if (arrTxs && arrTxs.length > 0) {
    for (let i = 0; i < arrTxs.length; i++) {
      let { txid, vin, vout } = arrTxs[i];

      // Save Address Info
      if (vout && vout.length > 0) {
        for (let j = 0; j < vout.length; j++) {
          let { asset, address } = vout[j];
          // Save vout Info
          var addressRow = await AddressModel.findOne({ asset, address });
          if (!addressRow) {
            addressRow = new AddressModel({
              asset, address,
              txsIn: [],
              txsOut: []
            });
          }
          if (addressRow.txsOut.indexOf(txid) == -1) {
            addressRow.txsOut.push(txid);
            try {
              await addressRow.save();
            }
            catch (e) {
              filelog(`address.save.txsOut: txid: ${txid}, error: `, e); // Should dump errors here
              return;
            }
          }
        }
      }

      if (vin && vin.length > 0) {
        for (let j = 0; j < vin.length; j++) {
          var inTxid = vin[j].txid;
          var inVout = vin[j].vout;

          var inTx = await TransactionModel.findOne({ txid: inTxid });
          if (!inTx) {
            filelog(`inTx not found. inTxid=${inTxid}`);
            return;
          }

          var inTxInfo = inTx.vout[inVout];
          // Save Info
          var addressRow = await AddressModel.findOne({ asset: inTxInfo.asset, address: inTxInfo.address });
          if (!addressRow) {
            addressRow = new AddressModel({
              asset: inTxInfo.asset,
              address: inTxInfo.address,
              txsIn: [],
              txsOut: []
            });
          }
          if (addressRow.txsIn.indexOf(txid) == -1) {
            addressRow.txsIn.push(txid);
            try {
              await addressRow.save();
            }
            catch (e) {
              filelog(`addressRow.save.txsIn error: txid=${txid}, error: `, e); // Should dump errors here
              return;
            }
          }
        }
      }

      // Save service info
      lastTxid = txid;
      lastTxOffset++;
      await saveAddrServiceInfo(lastTxid, lastTxOffset);
    }
  }
}

async function transactionService() {
  filelog("Start transaction service ...");
  await CheckUpdatedTransactions();
  setTimeout(transactionService, config.TX_CRON_TIME);
  filelog("Done transaction service .");
}

async function addressService() {
  filelog("Start address service ...");
  await CheckUpdatedAddresses();
  setTimeout(addressService, config.ADDR_CRON_TIME);
  filelog("Done address service .");
}

exports.start_cronService = async function () {
  filelog("Start neo cron service");

  transactionService();
  // setInterval(transactionService, config.CRON_TIME_INTERVAL);
  addressService();
}
