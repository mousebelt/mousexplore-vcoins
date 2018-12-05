const mongoose = require('mongoose');

const txMissingSchema = new mongoose.Schema({
  txid: String,
  txidRefs: [String],
  updatedAt: Date
});

txMissingSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const TxMissing = mongoose.model('TxMissing', txMissingSchema);
module.exports = TxMissing;
