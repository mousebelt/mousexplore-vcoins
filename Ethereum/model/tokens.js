var mongoose = require("mongoose");

var tokenSchema = new mongoose.Schema({
  symbol: String,
  address: String 
});

var Token = mongoose.model("Token", tokenSchema);
module.exports = Token;