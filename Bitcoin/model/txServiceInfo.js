var mongoose = require("mongoose");

var txServiceInfoSchema = new mongoose.Schema({
	lastblock: Number,
	lastTxIndex: Number,
	updatedAt: Number
});

txServiceInfoSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

var TxServiceInfo = mongoose.model("TxServiceInfo", txServiceInfoSchema);
module.exports = TxServiceInfo;