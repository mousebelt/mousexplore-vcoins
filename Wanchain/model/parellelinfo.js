var mongoose = require("mongoose");

var parellelInfoSchema = new mongoose.Schema({
	index: Number,	//0 ~ config.CHECK_PARELLEL_BLOCKS - 1
	blocknumber: Number,
	total_txs: Number,
	synced_index: Number,	//synced transactions
	updatedAt: Number
});

parellelInfoSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

var ParellelInfo = mongoose.model("ParellelInfo", parellelInfoSchema);
module.exports = ParellelInfo;