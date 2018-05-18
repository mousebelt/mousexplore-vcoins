// define local node object
var config = require('../config');
const localNode = config.localNode;
const client = config.client;

var promisify = function promisify(fn, args) {
  return new Promise((resolve, reject) => {
    try {
      client.call(fn, args, function (err, result) {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    } catch (error) {
      reject(error);
    }
  });
};

///////////////////////////////////////////////////////////////////////////////////////////////////////
//// Client RPC Call apis ////
///////////////////////////////////////////////////////////////////////////////////////////////////////
exports.getblockcount = (req, res) => {
  try {
    client.call("getblockcount", [], function (err, result) {
      if (err) {
        return res.json({ status: 400, msg: "errors", data: err });
      }
      return res.json({ status: 200, msg: "sccuess", data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};
