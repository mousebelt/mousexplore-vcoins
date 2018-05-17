// define local node object
var config = require("../config");
const client = config.localNode;

// var TransactionModel = require('../model/transactions');
///////////////////////////////////////////////////////////////////////////////////////////////////////
//// RPC Call apis ////
///////////////////////////////////////////////////////////////////////////////////////////////////////

exports.getBlockCount = (req, res) => {
  try {
    client.call("getblockcount", [], function(err, result) {
      if (err) {
        return res.json({ status: 400, msg: "errors", data: err });
      }
      return res.json({ status: 200, msg: "sccuess", data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

// exports.getTxOut = function(req, res) {
//   var txId = req.params.txId;
//   var index = req.params.index;

//   localNode
//     .getTxOut(txId, index)
//     .then(function(result) {
//       res.json({ status: 200, msg: "success", data: result });
//     })
//     .catch(function(err) {
//       res.json({ status: 400, msg: "errors", data: err });
//     });
// };

///////////////////////////////////////////////////////////////////////////////////////////////////////
//// Utility apis ////
///////////////////////////////////////////////////////////////////////////////////////////////////////
// exports.postTx = async function(req, res) {
//   var { txId } = req.body;

//   // validation
//   if (!txId) res.json({ status: 400, msg: "errors", data: "empty txId !" });

//   // logic
//   try {
//     var tx = await localNode.getRawTransaction(txId, 1);
//     return res.json({ status: 200, msg: "success", data: tx });
//   } catch (error) {
//     return res.json({ status: 400, msg: "errors", data: error });
//   }
// };
