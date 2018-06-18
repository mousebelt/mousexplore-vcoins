var mongoose = require("mongoose");

var txMissingSchema = new mongoose.Schema({
    txid: String, 
    txidRefs: [String],
	updatedAt: Date
});

txMissingSchema.pre('save', function(next) {
	this.updatedAt = Date.now();
	next();
});

var TxMissing = mongoose.model("TxMissing", txMissingSchema);
module.exports = TxMissing;