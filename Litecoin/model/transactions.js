const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  txid: String,
  time: Number,

  blockhash: String,
  blockheight: Number,

  vin: [{}],
  vout: [{}],

  updatedAt: Date
});

transactionSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

transactionSchema.index({
  txid: 1,
});

transactionSchema.index({
  blockhash: 1,
});

transactionSchema.index({
  blockheight: -1
});

transactionSchema.index({
  time: -1
});

transactionSchema.index({
  time: 1
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
