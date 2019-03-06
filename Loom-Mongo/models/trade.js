const mongoose = require('mongoose');
const TradeSchema = new mongoose.Schema({
  index: Number,
  gameAddr: String,
  offeredId: Number,
  trader: String,
  taker: String,
  wantedAmount: Number,
  wantedId: Number,
  offeredAmount: Number,
  createdOn: Number,
  state: Number
});

module.exports = mongoose.model('Trade', TradeSchema);
