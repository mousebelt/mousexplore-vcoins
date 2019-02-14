const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  blockNumber: Number,
  hash: String,
  from: String,
  to: String,
  value: Number,
  timestamp: Number,
});

transactionSchema.index({
  blockNumber: -1
});

transactionSchema.index({
  hash: 1
});

transactionSchema.index({
  from: 1,
  to: 1
});

transactionSchema.index({
  from: 1
});

transactionSchema.index({
  to: 1
});

transactionSchema.index({
  timestamp: -1
});

transactionSchema.index({
  timestamp: 1
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
