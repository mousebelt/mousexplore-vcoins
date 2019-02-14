const mongoose = require('mongoose');
const GameSchema = new mongoose.Schema({
  desc: String,
  gameAddr: String,
  gameOwner: String,
  image: String,
  name: String,
  rarityNames: [String],
  rarityPercs: [Number],
  symbol: String,
  totalSupply: Number,
  isWhitelisted: { type: Boolean, default: false },
  updated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Game', GameSchema);
