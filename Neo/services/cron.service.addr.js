// const _ = require('lodash');

const config = require('../config');
const UtxoModel = require('../model/utxo');
const AddressModel = require('../model/address');
const AddrServiceInfoModel = require('../model/addServiceInfo');

const fs = require('fs');
const Log = require('log');
const log = new Log('debug', fs.createWriteStream('./addr.cron.debug.log', { flags: 'a' }));
// log = new Log('debug');

function filelog(...params) {
  log.info(...params);
}

// ///////////////////////////////////////////////////////////////////////////////////

let gAddrServiceInfoRow = undefined;

async function initAddrServiceInfo() {
  try {
    gAddrServiceInfoRow = await AddrServiceInfoModel.findOne();
    if (!gAddrServiceInfoRow) {
      gAddrServiceInfoRow = new AddrServiceInfoModel({
        utxo_id: undefined
      });
      await gAddrServiceInfoRow.save();
    }
  } catch (e) {
    filelog('initAddrServiceInfo error: ', e);
  }
}

async function handleUtxo() {
  try {
    let utxoRow;
    if (!gAddrServiceInfoRow || !gAddrServiceInfoRow.utxo_id) {
      const _rows = await UtxoModel.find().limit(1);
      utxoRow = _rows[0];
    } else {
      const _rows = await UtxoModel.find({ _id: { $gt: gAddrServiceInfoRow.utxo_id } }).limit(1);
      utxoRow = _rows[0];
    }
    if (!utxoRow) return;

    // save
    // const _id = utxoRow._id;
    const { address, asset, amount } = utxoRow;

    let addressRow = await AddressModel.findOne({ address, asset });
    if (!addressRow) {
      addressRow = new AddressModel({ address, asset, balance: amount });
      await addressRow.save();
    } else {
      // await AddressModel.findOneAndUpdate({ _id: addressRow._id }, { $inc: { balance: Number(amount) } });
      addressRow.balance += Number(amount);
      await addressRow.save();
    }

    // save service info
    gAddrServiceInfoRow.utxo_id = utxoRow._id;
    await gAddrServiceInfoRow.save();
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
