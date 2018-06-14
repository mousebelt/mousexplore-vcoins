var mongoose = require("mongoose");

var transactionSchema = new mongoose.Schema({
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

var Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;