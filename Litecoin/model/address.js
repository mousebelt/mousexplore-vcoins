var mongoose = require("mongoose");

var addressSchema = new mongoose.Schema({
  address: String, // 1BW18n7MfpU35q4MTBSk8pse3XzQF8XvzT

  balance: {
    type: Number,
    default: 0
  },

  txs: [String], // txid array
  txsIn: [{
    txid: String,
    vin: Number,
    value: Number,
  }],

  txsOut: [{
    txid: String,
    vout: Number,
    value: Number,
  }],

  updatedAt: Date
});

addressSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

var Address = mongoose.model("Address", addressSchema);
module.exports = Address;