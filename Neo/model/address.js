var mongoose = require("mongoose");

var addressSchema = new mongoose.Schema({
  asset: String, // 0x602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7
  address: String, // Ae2d6qj91YL3LVUMkza7WQsaTYjzjHm4z1

  txsIn: [{
    txid: String,
    inIndex: Number,
    value: String, // value of asset & address
  }],
  txsOut: [{
    txid: String,
    outIndex: Number,
    value: String
  }],
  txs: [String],

  updatedAt: Date
});

addressSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

var Address = mongoose.model("Address", addressSchema);
module.exports = Address;