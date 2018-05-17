var mongoose = require("mongoose");

var addressServiceInfoSchema = new mongoose.Schema({
  lastTxid: String,
  lastTxOffset: Number,
  updatedAt: Number
});

addressServiceInfoSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

var AddrServiceInfo = mongoose.model("AddrServiceInfo", addressServiceInfoSchema);
module.exports = AddrServiceInfo;