var config = require("../config");
var localNode = config.localNode;

var TransactionModel = require("../model/transactions");
var AddressModel = require("../model/address");
var TokenModel = require("../model/tokens");
var TxServiceInofModel = require("../model/txServiceInfo");
var AddrServiceInofModel = require("../model/addrServiceInfo");

var UtilsModule = require("../modules/utils");

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
  var lastblock = 0, lastTxIndex = 0;
  var txServiceInfo = await getTxServiceInfo();
  if (txServiceInfo) {
    lastblock = txServiceInfo.lastblock;
    lastTxIndex = txServiceInfo.lastTxIndex;
  }

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
              var asset;
              try {
                asset = vout[0].asset;
              } catch (error) { }
              txRow = new TransactionModel({
                txid, size, type, version, vin, vout, sys_fee, net_fee, nonce,
                blockIndex: blockdata.index,
                blockTime: blockdata.time,
                asset
              });

              try {
                await txRow.save();
              }
              catch (e) {
                filelog(`transaction save error: txid=${txid}, error: `, e); // Should dump errors here
              }
            }

            // Save service info
            lastblock = i;
            lastTxIndex = j;
            await saveTxServiceInfo(lastblock, lastTxIndex);
          }
        }
        catch (e) {
          filelog('localNode getBlockByHeight error: ', e); // Should dump errors here
        }
        if (lastblock != i || lastTxIndex != 0) {
          lastblock = i;
          lastTxIndex = 0;
          await saveTxServiceInfo(lastblock, lastTxIndex);
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
  var lastTxid = "", lastTxOffset = 0;
  var serviceInfo = await getAddrServiceInfo();
  if (serviceInfo) {
    lastTxid = serviceInfo.lastTxid;
    lastTxOffset = serviceInfo.lastTxOffset;
  }

  var arrTxs = await TransactionModel.find().skip(lastTxOffset).limit(config.ADDR_CRON_TX_COUNT);

  if (arrTxs && arrTxs.length > 0) {
    for (let i = 0; i < arrTxs.length; i++) {
      let { txid, vin, vout } = arrTxs[i];

      // Save Address Info
      if (vin && vin.length > 0) {
        for (let j = 0; j < vin.length; j++) {
          // var inTx = await TransactionModel.findOne({ txid: inTxid });
          var inTxInfo = await UtilsModule.getTxOutFunc(vin[j].txid, vin[j].vout)
          if (!inTxInfo) continue;

          // Save Info
          var addressRow = await AddressModel.findOne({ asset: inTxInfo.asset, address: inTxInfo.address });
          if (!addressRow) {
            addressRow = new AddressModel({
              asset: inTxInfo.asset,
              address: inTxInfo.address,
              txsIn: [],
              txsOut: [],
              txs: [],
            });
          }
          if (addressRow.txs.indexOf(txid) == -1) {
            addressRow.txs.push(txid);
            try {
              await addressRow.save();
            }
            catch (e) {
              filelog(`addressRow.save.txs error: addressRow=${addressRow}, error: `, e); // Should dump errors here
            }
          }
          if (addressRow.txsIn.indexOf({ txid, inIndex: j, value: inTxInfo.value }) == -1) {
            addressRow.txsIn.push({ txid, inIndex: j, value: inTxInfo.value });
            try {
              await addressRow.save();
            }
            catch (e) {
              filelog(`addressRow.save.txsIn error: addressRow=${addressRow}, error: `, e); // Should dump errors here
            }
          }
        }
      }
      if (vout && vout.length > 0) {
        for (let j = 0; j < vout.length; j++) {
          let { asset, address, value } = vout[j];
          // Save vout Info
          var addressRow = await AddressModel.findOne({ asset, address });
          if (!addressRow) {
            addressRow = new AddressModel({
              asset, address,
              txsIn: [],
              txsOut: [],
              txs: [],
            });
          }
          if (addressRow.txs.indexOf(txid) == -1) {
            addressRow.txs.push(txid);
            try {
              await addressRow.save();
            }
            catch (e) {
              filelog(`addressRow.save.txs error: addressRow=${addressRow}, error: `, e); // Should dump errors here
            }
          }
          if (addressRow.txsOut.indexOf({ txid, outIndex: j, value }) == -1) {
            addressRow.txsOut.push({ txid, outIndex: j, value });
            try {
              await addressRow.save();
            }
            catch (e) {
              filelog(`addressRow.save.txsOut error: addressRow=${addressRow}, error: `, e); // Should dump errors here
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
  await CheckUpdatedTransactions();
  setTimeout(transactionService, config.TX_CRON_TIME);
}

async function addressService() {
  await CheckUpdatedAddresses();
  setTimeout(addressService, config.ADDR_CRON_TIME);
}

exports.start_cronService = async function () {
  filelog("Start neo cron service");

  transactionService();
  // setInterval(transactionService, config.CRON_TIME_INTERVAL);
  addressService();
}
