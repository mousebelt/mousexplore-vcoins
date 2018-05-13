var mongoose = require("mongoose");

var transactionSchema = new mongoose.Schema({
	Txid: String,
	Type: String,
	Vin: any,
	Vout: any,
	Confirmations: Number,
	Sys_fee: String,
	Net_fee: String,
	Nonce: Number,
	Time: Number
});

var Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;