var Config = require('../config');
var TokenModel = require("../model/tokens");

exports.start = () => {
  TokenModel.find({}, (err, rows) => {
    if (err) {
      console.log("Token DB error !");
    }

    if (!rows || rows.length === 0) {
      try {
        TokenModel.insertMany(Config.tokens);
        console.log("created token collection !");
      } catch (e) {
        console.log("error in creating token collecetion !", e);
      }
    }
  });
};
