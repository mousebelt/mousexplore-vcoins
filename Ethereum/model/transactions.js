var mongoose = require("mongoose");

var transactionSchema = new mongoose.Schema({
	blocknumber: Number,
	hash: String,
	from: {
		type: String,
		lowercase: true,
	},
	to: {
		type: String,
		lowercase: true,
	},
	value: Number,
	fee: Number,
	timestamp: Number
});

transactionSchema.index({
	blocknumber: -1
});

transactionSchema.index({
	from: 1,
	to: 1
});

transactionSchema.index({
	from: 1
});

transactionSchema.index({
	to: 1
});

transactionSchema.index({
	hash: 1
});

transactionSchema.index({
	timestamp: -1
});

transactionSchema.index({
	timestamp: 1
});

var Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;