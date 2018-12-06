const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  txid: String,
  size: Number,
  type: String,
  version: Number,
  vin: [{}],
  vout: [{}],
  sys_fee: String,
  net_fee: String,
  nonce: Number,

  blockIndex: Number,
  blockTime: Number,

  assets: {
    type: [String],
    default: []
  },

  updatedAt: Date
});

transactionSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

transactionSchema.index({
  txid: -1,
});

transactionSchema.index({
  blockTime: -1
});

transactionSchema.index({
  blockTime: 1
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
