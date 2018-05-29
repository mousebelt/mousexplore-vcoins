var mongoose = require("mongoose");

var addressServiceInfoSchema = new mongoose.Schema({
  lastTxid: String,
  lastTxOffset: Number,
  updatedAt: Date
});

addressServiceInfoSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

var AddrServiceInfo = mongoose.model("AddrServiceInfo", addressServiceInfoSchema);
module.exports = AddrServiceInfo;