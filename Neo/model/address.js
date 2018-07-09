var mongoose = require("mongoose");

var addressSchema = new mongoose.Schema({
  address: String, // Ae2d6qj91YL3LVUMkza7WQsaTYjzjHm4z1

  balance: [{
    asset: String, // 0x602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7
    value: Number,
  }],

  txsIn: [{
    txid: String,
    n: Number,
    value: Number, // value of asset & address
    asset: String,
  }],
  txsOut: [{
    txid: String,
    n: Number,
    value: Number,
    asset: String
  }],
  UTXO: [{
    txid: String,
    index: Number,
    value: Number,
    asset: String,
    createdAtBlock: Number,
  }],
  txs: [String],

  updatedAt: Date
});

addressSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

addressSchema.index({
  address: 1
});

var Address = mongoose.model("Address", addressSchema);
module.exports = Address;
