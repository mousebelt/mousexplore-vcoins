var mongoose = require("mongoose");

var transactionSchema = new mongoose.Schema({
	txid: String, 
	time: Number,
	blockhash: Number,
	blockheight: Number,
	updatedAt: Date
});

transactionSchema.pre('save', function(next) {
	this.updatedAt = Date.now();
	next();
});

var Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;