var mongoose = require("mongoose");

var transactionSchema = new mongoose.Schema({
	txid: String, 
	updatedAt: Date
});

transactionSchema.pre('save', function(next) {
	this.updatedAt = new Date();
	next();
});

var Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;