var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var addrServiceInfoSchema = new mongoose.Schema({
	utxo_id: Schema.ObjectId,
	updatedAt: Date
});

addrServiceInfoSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

var AddrServiceInfo = mongoose.model("AddrServiceInfo", addrServiceInfoSchema);
module.exports = AddrServiceInfo;