const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addrServiceInfoSchema = new mongoose.Schema({
  utxo_id: Schema.ObjectId,
  updatedAt: Date
});

addrServiceInfoSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const AddrServiceInfo = mongoose.model('AddrServiceInfo', addrServiceInfoSchema);
module.exports = AddrServiceInfo;
