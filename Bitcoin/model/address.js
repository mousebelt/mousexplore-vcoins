var mongoose = require("mongoose");

var addressSchema = new mongoose.Schema({
  address: String, // 1BW18n7MfpU35q4MTBSk8pse3XzQF8XvzT

  txs: [String], // txid array

  updatedAt: Date
});

addressSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

var Address = mongoose.model("Address", addressSchema);
module.exports = Address;