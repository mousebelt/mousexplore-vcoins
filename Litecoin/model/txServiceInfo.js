const mongoose = require('mongoose');

const txServiceInfoSchema = new mongoose.Schema({
  lastblock: Number,
  lastTxIndex: Number,

  updatedAt: Date,
});

txServiceInfoSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const TxServiceInfo = mongoose.model('TxServiceInfo', txServiceInfoSchema);
module.exports = TxServiceInfo;
