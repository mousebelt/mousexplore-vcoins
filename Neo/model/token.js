const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  name: String,
  ticker: String,
  asset: String,
  type: String,
});

const Token = mongoose.model('Token', tokenSchema);
module.exports = Token;
