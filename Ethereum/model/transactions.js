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
	timestamp: Number,

	// erc20 token values
	tokenSymbol: {
		type: String,
		uppercase: true,
		// default: 'ETH',
	},
	tokenFrom: {
		type: String,
		lowercase: true,
	},
	tokenTo: {
		type: String,
		lowercase: true,
	},
	tokenAmount: Number,
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
	tokenFrom: 1
});

transactionSchema.index({
	tokenTo: 1
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