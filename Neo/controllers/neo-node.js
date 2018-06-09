// define local node object
var config = require("../config");
const localNode = config.localNode;
const client = config.client;

var TransactionModel = require("../model/transactions");
var AddressModel = require("../model/address");

var UtilsModule = require("../modules/utils");

var promisify = UtilsModule.promisify;
var getTxOutFunc = UtilsModule.getTxOutFunc;
var getTxDetailsFunc = UtilsModule.getTxDetailsFunc;
var getBlockDetailsFunc = UtilsModule.getBlockDetailsFunc;

///////////////////////////////////////////////////////////////////////////////////////////////////////
//// RPC Call apis ////
///////////////////////////////////////////////////////////////////////////////////////////////////////

exports.getBalance = async function (req, res) {
  var address = req.params.address;

  // logic
  try {
    var addrRow = await AddressModel.findOne({ address });
    if (!addrRow) return res.json({ status: 400, msg: "No address in db !" });

    var total_received = 0;
    for (let i = 0; i < addrRow.txsOut.length; i++) {
      var value = addrRow.txsOut[i].value;
      total_received += value;
    }

    var total_spent = 0;
    for (let i = 0; i < addrRow.txsIn.length; i++) {
      var value = addrRow.txsIn[i].value;
      total_spent += value;
    }

    var balance = total_received - total_spent;
    return res.json({ status: 200, msg: 'success', data: { address, balance, total_received, total_spent, balance, n_tx: addrRow.txs.length } });
  } catch (error) {
    return res.json({ status: 400, msg: "error occured !" });
  }
};

//Block
/**
 * @description Returns the hash of the tallest block
 *
 * @method GET /lastblockhash
 *
 * @return
 * { "status": 200, "msg": "success", "data": hash }
 *
 * hash: "773dd2dae4a9c9275290f89b56e67d7363ea4826dfd4fc13cc01cf73a44b0d0e"
 */
exports.getLastBlockHash = function (req, res) {
  localNode
    .getLastBlockHash()
    .then(function (result) {
      res.json({ status: 200, msg: "success", data: result });
    })
    .catch(function (err) {
      res.json({ status: 400, msg: "errors", data: err });
    });
};

exports.getBlockByHash = (req, res) => {
  var hash = req.params.hash;
  try {
    if (hash.length < 10) hash = Number(hash);
    client.call("getblock", [hash, 1], function (err, block) {
      if (err) {
        return res.json({ status: 400, msg: "errors", data: err });
      }
      var txs = block.tx;
      if (txs && txs.length > 0) {
        var newTxs = [];
        for (let j = 0; j < txs.length; j++) {
          newTxs.push(txs[j].txid);
        }

        block.tx = newTxs;
      }

      return res.json({ status: 200, msg: "sccuess", data: block });
    });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.getBlockDetails = async (req, res) => {
  var hash = req.params.hash;

  var block = await getBlockDetailsFunc(hash);
  if (block) return res.json({ status: 200, msg: "sccuess", data: block });
  return res.json({ status: 400, msg: "errors" });
};

/**
 * @description Gets the number of blocks.
 *
 * @method GET /blockcount
 *
 * @return
 * { "status": 200, "msg": "success", "data": blockcount }
 *
 * blockcount: 991991
 */
exports.getBlockCount = function (req, res) {
  localNode
    .getBlockCount()
    .then(function (result) {
      res.json({ status: 200, msg: "success", data: result });
    })
    .catch(function (err) {
      res.json({ status: 400, msg: "errors", data: err });
    });
};

/**
 * @description Returns the hash value of the corresponding block, based on the specified index.
 *
 * @method GET /blockhashbyheight
 *
 * @param {Number} height: Block index (block height)
 *
 * @return
 * { "status": 200, "msg": "success", "data": hash }
 *
 * hash: "4c1e879872344349067c3b1a30781eeb4f9040d3795db7922f513f6f9660b9b2"
 */
exports.getBlockHashByHeight = function (req, res) {
  var height = req.params.height;

  localNode
    .getBlockHashByHeight(height)
    .then(function (result) {
      res.json({ status: 200, msg: "success", data: result });
    })
    .catch(function (err) {
      res.json({ status: 400, msg: "errors", data: err });
    });
};

//Net
/**
 * @description Gets the current number of connections for the node.
 *
 * @method GET /connectioncount
 *
 * @return
 * { "status": 200, "msg": "success", "data": count }
 *
 * count: 10
 */
exports.getConnectionCount = function (req, res) {
  localNode
    .getConnectionCount()
    .then(function (result) {
      res.json({ status: 200, msg: "success", data: result });
    })
    .catch(function (err) {
      res.json({ status: 400, msg: "errors", data: err });
    });
};

/**
 * @description Returns the version information about the queried node.
 * 
 * @method GET /version
 * 
 * @return
 * { "status": 200, "msg": "success", "data": version }
 * 
 * version: {
      "port": 0,
      "nonce": 156443862,
      "useragent": "/NEO:2.3.5/"
  }
 */
exports.getVersion = function (req, res) {
  localNode
    .getVersion()
    .then(function (result) {
      res.json({ status: 200, msg: "success", data: result });
    })
    .catch(function (err) {
      res.json({ status: 400, msg: "errors", data: err });
    });
};

//Tx
/**
 * @description Obtains the list of unconfirmed transactions in memory.
 *
 * @method GET /rawmempool
 *
 * @return
 * { "status": 200, "msg": "success", "data": result }
 *
 * result: "B4534f6d4c17cda008a76a1968b7fa6256cd90ca448739eae8e828698ccc44e7"
 */
exports.getRawMemPool = function (req, res) {
  localNode
    .getRawMemPool()
    .then(function (result) {
      res.json({ status: 200, msg: "success", data: result });
    })
    .catch(function (err) {
      res.json({ status: 400, msg: "errors", data: err });
    });
};

/**
 * @description Returns the corresponding transaction information, based on the specified hash value.
 * 
 * @method GET /rawtransaction
 * 
 * @param {String} txId: "f4250dab094c38d8265acc15c366dc508d2e14bf5699e12d9df26577ed74d657"
 * 
 * @return
 * { "status": 200, "msg": "success", "data": tx }
 * 
 * tx: {
    "Txid": "f4250dab094c38d8265acc15c366dc508d2e14bf5699e12d9df26577ed74d657",
    "Size": 262,
    "Type": "ContractTransaction",
    "Version": 0,
    "Attributes":[],
    "Vin": [
      {
        "Txid": "abe82713f756eaeebf6fa6440057fca7c36b6c157700738bc34d3634cb765819",
        "Vout": 0
      }
     ],
     "Vout": [
      {
        "N": 0,
        "Asset": "c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b",
        "Value": "2950",
        "Address": "AHCNSDkh2Xs66SzmyKGdoDKY752uyeXDrt"
      },
      {
        "N": 1,
        "Asset": "c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b",
        "Value": "4050",
        "Address": "ALDCagdWUVV4wYoEzCcJ4dtHqtWhsNEEaR"
       }
    ],
    "Sys_fee": "0",
    "Net_fee": "0",
    "Scripts": [
      {
        "Invocation": "40915467ecd359684b2dc358024ca750609591aa731a0b309c7fb3cab5cd0836ad3992aa0a24da431f43b68883ea5651d548feb6bd3c8e16376e6e426f91f84c58",
        "Verification": "2103322f35c7819267e721335948d385fae5be66e7ba8c748ac15467dcca0693692dac"
      }
    ],
    "Blockhash": "9c814276156d33f5dbd4e1bd4e279bb4da4ca73ea7b7f9f0833231854648a72c",
    "Confirmations": 144,
    "Blocktime": 1496719422
  }
 */
exports.getRawTransaction = function (req, res) {
  var txId = req.params.txId;

  localNode
    .getRawTransaction(txId, 1)
    .then(function (result) {
      res.json({ status: 200, msg: "success", data: result });
    })
    .catch(function (err) {
      res.json({ status: 400, msg: "errors", data: err });
    });
};

/**
 * @description Returns the corresponding unspent transaction output information (returned change), based on the specified hash and index. 
 *              If the transaction output is already spent, the result value will be null.
 * 
 * @method GET /txout
 * 
 * @param {String} txId: "f4250dab094c38d8265acc15c366dc508d2e14bf5699e12d9df26577ed74d657"
 * @param {Number} index: 0: The index of the transaction output to be obtained in the transaction (starts from 0)
 *
 * @return
 * { "status": 200, "msg": "success", "data": result }
 * 
 * result: {
     "N": 0,
     "Asset": "c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b",
     "Value": "2950",
     "Address": "AHCNSDkh2Xs66SzmyKGdoDKY752uyeXDrt"
   }
 */
exports.getTxOut = function (req, res) {
  var txId = req.params.txId;
  var index = req.params.index;

  localNode
    .getTxOut(txId, index)
    .then(function (result) {
      res.json({ status: 200, msg: "success", data: result });
    })
    .catch(function (err) {
      res.json({ status: 400, msg: "errors", data: err });
    });
};

///////////////////////////////////////////////////////////////////////////////////////////////////////
//// Utility apis ////
///////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * GET /blocks 
 * Get block list
 * 
 * @param {Number} offset
 * @param {Number} count
 * 
 * @return
 * { status: 200, msg: 'success', data: [block] }
  block = {
      "hash": "0xd749cffddcf33a5302c2b675ebba305a9534584e91d9f05c639563fc31272c6e",
      "size": 686,
      "version": 0,
      "previousblockhash": "0x0ea28647d7a89f04ac82c5b48be39955a1f040e06a313b510a9aab37970480c5",
      "merkleroot": "0xdda503afb71e64d940cfd2c00995a72503ce901b13760752306d854ed58d9d1b",
      "time": 1479227992,
      "index": 127927,
      "nonce": "19385d2ada9b3096",
      "nextconsensus": "APyEx5f4Zm4oCHwFWiSTaph1fPBxZacYVR",
      "script": {
          "invocation": "403fc6abeb11da17f6b5dd24b5204e5f13e78fee01c658edfefa52bf5095fd1270b0124b2efac72512c4754d7fd54e3feca913ee88fcd530b769e63563fb3a081a40e3b56e3161c4136caaa8e6057ca89bef55615df4ba71d4f72568e9df7aeec6518161362d2f5634a10bca6bb0a48cffc76355a920d0c3228465ef070025fd065640694dc65aa45efbfd0f83ce64314b9e515273c8f69db3bf58eecbc7d796bbb0249f040f8df5a085d72d0fb3df1755ba1cc1f2043343e4c1f0e3fe7f65a989ee784041e59254b31b4a0833878a31ea73491a415273085386a7a065e73cc3123b083e2afb4c62b60108c87e92f967c2f528af2f0e0012f3ba0d8d41dd3381aa79f859406fc02bc4712fe4c5431594036e32a534151f3ef1dc0e55e7ea886fe10f89dacf788a340ee6718add1158ab64b086df6e3448112951d80d5740cb97a7d2599e8c",
          "verification": "552102486fd15702c4490a26703112a5cc1d0923fd697a33406bd5a1c00e0013b09a7021024c7b7fb6c310fccf1ba33b082519d82964ea93868d676662d4a59ad548df0e7d2102aaec38470f6aad0042c6e877cfd8087d2676b0f516fddd362801b9bd3936399e2103b209fd4f53a7170ea4444e0cb0a6bb6a53c2bd016926989cf85f9b0fba17a70c2103b8d9d5771d8f513aa0869b9cc8d50986403b78c6da36890638c3d46a5adce04a2102ca0e27697b9c248f6f16e085fd0061e26f44da85b58ee835c110caa5ec3ba5542102df48f60e8f3e01c48ff40b9b7f1310d7a8b2a193188befe1c2e3df740e89509357ae"
      },
      "tx": [
          {
              "txid": "0xdda503afb71e64d940cfd2c00995a72503ce901b13760752306d854ed58d9d1b",
              "size": 10,
              "type": "MinerTransaction",
              "version": 0,
              "attributes": [],
              "vin": [],
              "vout": [],
              "sys_fee": "0",
              "net_fee": "0",
              "scripts": [],
              "nonce": 3667603606
          }
      ],
      "confirmations": 3,
      "nextblockhash": "0x2697dad3a4b6641600c7c975986152da14df272acb6f1c82a2360a82401fff32"
  }
*/
exports.getBlocks = async function (req, res) {
  var offset = Number(req.query.offset);
  var count = Number(req.query.count);

  if (!offset) offset = 0;
  if (!count || count <= 0) count = 10;

  try {
    // logic
    var blockCount = await localNode.getBlockCount();
    if (!blockCount) {
      return res.json({ status: 400, msg: "Error in getting block count" });
    }

    // logic
    var blocks = [];
    for (let i = 1; i <= count; i++) {
      var height = blockCount - offset - i;
      if (height < 0) break;

      try {
        var block = await localNode.getBlockByHeight(height, 1);

        var txs = block.tx;
        if (txs && txs.length > 0) {
          var newTxs = [];
          for (let j = 0; j < txs.length; j++) {
            newTxs.push(txs[j].txid);
          }

          block.tx = newTxs;
        }

        if (block) blocks.push(block);
      } catch (error) {
        console.log("error occured: ", error);
      }
    }

    return res.json({
      status: 200,
      msg: "success",
      data: { total: blockCount, result: blocks }
    });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.getTx = async function (req, res) {
  var txid = req.params.txid;
  try {
    client.call("getrawtransaction", [txid, 1], function (err, result) {
      if (err) {
        return res.json({ status: 400, msg: "errors", data: err });
      }
      return res.json({ status: 200, msg: "sccuess", data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.getTxDetails = async function (req, res) {
  var txid = req.params.txid;
  var txdetails = await getTxDetailsFunc(txid);
  if (txdetails)
    return res.json({ status: 200, msg: "sccuess", data: txdetails });

  return res.json({ status: 400, msg: "errors" });
};

/**
 * GET /transactions
 * Get transaction list by offset, count, order
 * 
 * @param {Number} offset: 0
 * @param {Number} count: 10
 * @param {Number} order
 * @param {String} token_hash
 * 
 * @return
 * { "status": "200", "msg": "success", 
 *   "data": [tx]
 * }
 * 
 * tx: {
        "txid": "0x6d1cc3aa44b218e1fe052fa3c06c8a0009bfc2c91676c977d80e3d2d8388e2ee",
        "size": 10,
        "type": "MinerTransaction",
        "version": 0,
        "attributes": [],
        "vin": [],
        "vout": [],
        "sys_fee": "0",
        "net_fee": "0",
        "scripts": [],
        "nonce": 870829101,
        "blockhash": "0xbe18be00b930b4147195a25608d69c35ba4e8273779db75c87c66310971e1f96",
        "confirmations": 221559,
        "blocktime": 1478762561
    }
 */
exports.getTransactions = async function (req, res) {
  var contract = req.query.contract;
  var offset = Number(req.query.offset);
  var count = Number(req.query.count);
  var order = Number(req.query.order);

  if (!offset) offset = 0;
  if (!count || count <= 0) count = 10;
  // condition
  var condition;
  if (order) condition = { blockTime: 1 };
  else condition = { blockTime: -1 };

  var findCond = {};
  if (contract && contract != '') findCond = { asset: contract };
  // logic
  try {
    var total = await TransactionModel.find(findCond).count();
    TransactionModel.find(findCond)
      .sort(condition)
      .skip(offset)
      .limit(count)
      .exec(async function (error, rows) {
        if (error) {
          console.log("getTransactionList: we have a promblem: ", error); // Should dump errors here
          return res.json({ status: 400, msg: "errors", data: error });
        }

        var txs = [];
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          // var tx = await getTxDetailsFunc(row.txid);
          // if (tx) txs.push(tx);
          try {
            var tx = await promisify("getrawtransaction", [rows[i].txid, 1]);
            txs.push(tx);
          } catch (error) {
            console.log("get transaction error: ", error);
          }
        }
        return res.json({
          status: 200,
          msg: "success",
          data: { total, result: txs }
        });
      });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

/**
 * GET /address/txs/:address
 * Get tx list from address
 * 
 * @param {String} asset: "0xc56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b"
 * @param {String} address: "AQVh2pG732YvtNaxEGkQUei3YA4cvo7d2i"
 * @param {Number} offset: 0
 * @param {Number} count: 10
 * @param {Boolean} order: If 0, newest order. If 1, oldest order.
 * 
 * @return
 * { "status": "200", "msg": "success", 
 *   "data": { "total": total, "txs": [tx] }
 * }
 * 
 * total: Number
 * tx: {
        "_id": "5afa852c31a9a73db264d7ff",
        "txid": "0xc56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b",
        "size": 107,
        "type": "RegisterTransaction",
        "version": 0,
        "vin": [],
        "vout": [],
        "sys_fee": "0",
        "net_fee": "0",
        "blockIndex": 0,
        "blockTime": 1468595301,
        "updatedAt": "2018-05-15T06:58:52.181Z",
        "__v": 0
    }
 */
exports.getAddressTransactions = async function (req, res) {
  var address = req.params.address;
  var asset = req.query.asset;
  var offset = Number(req.query.offset);
  var count = Number(req.query.count);
  var order = Number(req.query.order);

  // validation
  if (!address || address == "")
    return res.json({ status: 400, msg: "address is empty !" });
  if (!offset) offset = 0;
  if (!count || count == 0) count = 10;

  var cond;
  if (!asset || asset == "") cond = { address };
  else cond = { asset, address };

  // logic
  try {
    if (order > 0) {
      // Oldest first
      var addrTxResult = await AddressModel.aggregate([
        {
          $match: cond
        },
        {
          $project: {
            txs: { $slice: ["$txs", offset, count] },
            total: { $size: "$txs" }
          }
        }
      ]);
      // var addrTxResult = await AddressModel.findOne(
      //   { asset, address },
      //   {
      //     txs: { $slice: [offset, count] },
      //     txsIn: 0,
      //     txsOut: 0
      //   }
      // );
      let { txs, total } = addrTxResult[0];

      var toReturn = [];
      for (let i = 0; i < txs.length; i++) {
        var txid = txs[i];
        var tx = await getTxDetailsFunc(txid);
        toReturn.push(tx);
        // try {
        //   var tx = await promisify("getrawtransaction", [txid, 1]);
        //   toReturn.push(tx);
        // } catch (error) {
        //   console.log("get transaction error: ", error);
        //   toReturn.push({
        //     txid,
        //     unknown: true
        //   });
        // }
      }
      return res.json({
        status: 200,
        msg: "success",
        data: { total, result: toReturn }
      });
    } else {
      offset = -1 * offset - count;
      var addrTxResult = await AddressModel.aggregate([
        {
          $match: cond
        },
        {
          $project: {
            txs: { $slice: ["$txs", offset, count] },
            total: { $size: "$txs" }
          }
        }
      ]);
      let { txs, total } = addrTxResult[0];

      var toReturn = [];
      for (let i = txs.length - 1; i >= 0; i--) {
        var txid = txs[i];
        var tx = await getTxDetailsFunc(txid);
        toReturn.push(tx);
        // try {
        //   var tx = await promisify("getrawtransaction", [txid, 1]);
        //   toReturn.push(tx);
        // } catch (error) {
        //   console.log("get transaction error: ", error);
        //   toReturn.push({
        //     txid,
        //     unknown: true
        //   });
        // }
      }
      return res.json({
        status: 200,
        msg: "success",
        data: { total, result: toReturn }
      });
    }
  } catch (error) {
    return res.json({ status: 400, msg: "error occured !" });
  }
};

exports.getSearch = async (req, res) => {
  var key = req.params.key;

  try {
    if (key.length < 10) {
      // block process
      var block = await getBlockDetailsFunc(key);
      if (block) return res.json({ status: 200, msg: "sccuess", data: { result: block, type: 'block' } });
      return res.json({ status: 400, msg: "Error occured !" });
    } else if (key.length >= 25 && key.length <= 34) {
      // address process
      return res.json({ status: 200, msg: "sccuess", data: { result: `address is not implemented yet, address: ${key} !`, type: 'address' } });
    } else if (key.length >= 64 && key.length <= 66) { // block or txid process
      // txdetails
      var txdetails = await getTxDetailsFunc(key);
      if (txdetails) return res.json({ status: 200, msg: "sccuess", data: { result: txdetails, type: 'transaction' } });

      // block details
      var block = await getBlockDetailsFunc(key);
      if (block) return res.json({ status: 200, msg: "sccuess", data: { result: block, type: 'block' } });

      return res.json({ status: 400, msg: "No result !" });
    } else {
      return res.json({ status: 400, msg: "search key is not correct !" });
    }
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};