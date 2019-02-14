const mongoose = require('mongoose');
const TokenSchema = new mongoose.Schema({
  tokenId: Number,
  cap: Number,
  desc: String,
  gameAddr: String,
  image: String,
  name: String,
  owners: [String],
  rarity: Number,
  totalSupply: Number,
  val: Number,
  updated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Token', TokenSchema);
