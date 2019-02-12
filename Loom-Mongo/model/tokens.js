const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  symbol: String,
  address: String,
  decimal: Number,
});

const Token = mongoose.model('Token', tokenSchema);
module.exports = Token;
