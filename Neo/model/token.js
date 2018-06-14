var mongoose = require("mongoose");

var tokenSchema = new mongoose.Schema({
  name: String,
  ticker: String,
  asset: String,
  type: String,
});

var Token = mongoose.model("Token", tokenSchema);
module.exports = Token;