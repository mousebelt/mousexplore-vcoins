var _ = require("lodash");

var config = require("../config");
var UtxoModel = require("../model/utxo");
var AddressModel = require("../model/address");
var AddrServiceInfoModel = require("../model/addServiceInfo");

var fs = require('fs');
var Log = require('log'),
  log = new Log('debug', fs.createWriteStream('./addr.cron.debug.log', { flags: 'a' }));
// log = new Log('debug');

function filelog(...params) {
  log.info(...params);
};

/////////////////////////////////////////////////////////////////////////////////////

var g_addrServiceInfoRow = undefined;

async function initAddrServiceInfo() {
  try {
    g_addrServiceInfoRow = await AddrServiceInfoModel.findOne();
    if (!g_addrServiceInfoRow) {
      g_addrServiceInfoRow = new AddrServiceInfoModel({
        utxo_id: undefined
      });
      await g_addrServiceInfoRow.save();
    }
  }
  catch (e) {
    filelog("initAddrServiceInfo error: ", e);
  }
}

async function handleUtxo() {
  try {
    let utxoRow;
    if (!g_addrServiceInfoRow || !g_addrServiceInfoRow.utxo_id) {
      var _rows = await UtxoModel.find().limit(1);
      utxoRow = _rows[0];
    } else {
      var _rows = await UtxoModel.find({ '_id': { '$gt': g_addrServiceInfoRow.utxo_id } }).limit(1);
      utxoRow = _rows[0];
    }
    if (!utxoRow) return;

    // save
    let { _id, address, asset, amount } = utxoRow;

    let addressRow = await AddressModel.findOne({ address, asset });
    if (!addressRow) {
      addressRow = new AddressModel({ address, asset, balance: amount });
      await addressRow.save();
    }
    else {
      // await AddressModel.findOneAndUpdate({ _id: addressRow._id }, { $inc: { balance: Number(amount) } });
      addressRow.balance += Number(amount);
      await addressRow.save();
    }

    // save service info
    g_addrServiceInfoRow.utxo_id = utxoRow._id;
    await g_addrServiceInfoRow.save();
  } catch (error) {
    filelog('handleUtxo error, ', error);
  }
}

async function addressService() {
  await handleUtxo();
  // addressService();
  setTimeout(addressService, config.ADDR_CRON_TIME_INTERVAL);
}

exports.start = async function () {
  await initAddrServiceInfo();
  addressService();
};
