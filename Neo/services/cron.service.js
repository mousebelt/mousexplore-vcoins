var _ = require("lodash");

var config = require("../config");
var localNode = config.localNode;

var TransactionModel = require("../model/transactions");
var AddressModel = require("../model/address");
var TxServiceInofModel = require("../model/txServiceInfo");

var UtilsModule = require("../modules/utils");

var fs = require('fs');
var Log = require('log'),
  log = new Log('debug', fs.createWriteStream('./cron.debug.log', { flags: 'a' }));
// log = new Log('debug');

function filelog(...params) { //
  log.info(...params);
};

async function getTxServiceInfo() {
  try {
    txServiceInfo = await TxServiceInofModel.findOne();
    if (txServiceInfo) return txServiceInfo;
    else return {
      lastblock: -1,
      lastTxIndex: -1,
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

async function CheckUpdatedTransactions() {
  // read last block and txIndex
  var txServiceInfo = await getTxServiceInfo();
  if (!txServiceInfo) {
    filelog('get tx service info error !');
    return;
  }
  var curblock = txServiceInfo.lastblock + 1;
  var curTxIndex = txServiceInfo.lastTxIndex + 1;

  try {
    // var blockCount = await localNode.getBlockCount();
    var blockCount = await UtilsModule.promisify("getblockcount", []);
    if (!blockCount || curblock >= blockCount) throw `curblock is greater than blockcount. curblock: ${curblock}, blockCount: ${blockCount}`

    // var blockdata = await localNode.getBlockByHeight(i, 1);
    var blockdata = await UtilsModule.promisify("getblock", [curblock, 1]);
    if (!blockdata) throw 'getblock error';

    var txs = blockdata.tx;

    for (let i = curTxIndex; i < txs.length; i++) {
      let tx = txs[i]
      let { txid, size, type, version, vin, vout, sys_fee, net_fee, nonce } = tx;

      // Get vin details
      vinDetails = [];
      for (let j = 0; j < vin.length; j++) {
        // var inTx = await TransactionModel.findOne({ txid: inTxid });
        var item = vin[j];
        if (vin[j].txid && vin[j].vout) {
          var inTxInfo = await UtilsModule.getTxOutFunc(vin[j].txid, vin[j].vout)
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
      {
        for (let j = 0; j < vinDetails.length; j++) {
          var item = vinDetails[j];
          if (!item || !item.asset || !item.value || !item.address || !item.txid || !item.vout) continue;

          // Save Info
          var addressRow = await AddressModel.findOne({ address: item.address });
          if (!addressRow) {
            addressRow = new AddressModel({
              address: item.address,
              txsIn: [],
              txsOut: [],
              txs: [],
              balance: [],
            });
          }
          if (_.indexOf(addressRow.txs, txid) == -1) {
            addressRow.txs.push(txid);
          }
          if (_.findIndex(addressRow.txsIn, function (o) { return o.txid == txid && o.n == j }) == -1) {
            addressRow.txsIn.push({ txid, n: j, value: item.value, asset: item.asset });
            // update balance
            var _index = _.findIndex(addressRow.balance, function (o) { return o.asset == item.asset });
            if (_index == -1) {
              var temp = {};
              temp.asset = item.asset;
              temp.value = 0 - item.value;
              addressRow.balance.push(temp);
            } else {
              addressRow.balance[_index].value -= item.value;
            }
          }

          // save
          await addressRow.save();
        }

        for (let j = 0; j < vout.length; j++) {
          let { asset, address, value } = vout[j];
          if (!asset || !address || value === undefined) continue;
          // Save vout Info
          var addressRow = await AddressModel.findOne({ address });
          if (!addressRow) {
            addressRow = new AddressModel({
              address,
              txsIn: [],
              txsOut: [],
              txs: [],
              balance: [],
            });
          }
          if (_.indexOf(addressRow.txs, txid) == -1) {
            addressRow.txs.push(txid);
          }
          if (_.findIndex(addressRow.txsOut, function (o) { return o.txid == txid && o.n == j }) == -1) {
            addressRow.txsOut.push({ txid, n: j, value, asset });
            // update balance
            var _index = _.findIndex(addressRow.balance, function (o) { return o.asset == asset });
            if (_index == -1) {
              var temp = {};
              temp.asset = item.asset;
              temp.value = item.value;
              addressRow.balance.push(temp);
            } else {
              addressRow.balance[_index].value += item.value;
            }
          }

          // save
          await addressRow.save();
        }
      }

      ////////////////////////////////////////////
      // Save service info
      await saveTxServiceInfo(curblock, curTxIndex);
    }
    await saveTxServiceInfo(curblock, -1);
  } catch (error) {
    filelog('error: ', error); // Should dump errors here
  }
}

async function transactionService() {
  await CheckUpdatedTransactions();
  setTimeout(transactionService, config.TX_CRON_TIME);
}

exports.start = async function () {
  require('./init.db').start();

  transactionService();
}
