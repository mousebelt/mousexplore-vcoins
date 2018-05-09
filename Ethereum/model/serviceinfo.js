var mongoose = require("mongoose");

var serviceInfoSchema = new mongoose.Schema({
	lastblock: Number,
	lastTxnIndex: Number,
	updatedAt: Number
});

serviceInfoSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

var ServiceInfo = mongoose.model("ServiceInfo", serviceInfoSchema);
module.exports = ServiceInfo;