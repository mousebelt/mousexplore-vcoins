// define local node object
var config = require('../config');
const localNode = config.localNode;
const client = config.client;

///////////////////////////////////////////////////////////////////////////////////////////////////////
//// Client RPC Call apis ////
///////////////////////////////////////////////////////////////////////////////////////////////////////

exports.dumpprivkey = (req, res) => {
  var address = req.body.address;

  try {
    client.call("dumpprivkey", [address], function (err, result) {
      if (err) {
        return res.json({ status: 400, msg: "errors", data: err });
      }
      return res.json({ status: 200, msg: "sccuess", data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.getaccountstate = (req, res) => {
  var address = req.body.address;

  try {
    client.call("getaccountstate", [address], function (err, result) {
      if (err) {
        return res.json({ status: 400, msg: "errors", data: err });
      }
      return res.json({ status: 200, msg: "sccuess", data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.getapplicationlog = (req, res) => {
  var txid = req.body.txid;
  var verbose = Number(req.body.verbose);

  if (!verbose) verbose = 0;

  try {
    client.call("getapplicationlog", [txid, verbose], function (err, result) {
      if (err) {
        return res.json({ status: 400, msg: "errors", data: err });
      }
      return res.json({ status: 200, msg: "sccuess", data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.getassetstate = (req, res) => {
  var asset_id = req.body.asset_id;

  try {
    client.call("getassetstate", [asset_id], function (err, result) {
      if (err) {
        return res.json({ status: 400, msg: "errors", data: err });
      }
      return res.json({ status: 200, msg: "sccuess", data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.getbalance = (req, res) => {
  var asset_id = req.body.asset_id;

  try {
    client.call("getbalance", [asset_id], function (err, result) {
      if (err) {
        return res.json({ status: 400, msg: "errors", data: err });
      }
      return res.json({ status: 200, msg: "sccuess", data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.getbestblockhash = (req, res) => {
  try {
    client.call("getbestblockhash", [], function (err, result) {
      if (err) {
        return res.json({ status: 400, msg: "errors", data: err });
      }
      return res.json({ status: 200, msg: "sccuess", data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.getblock = (req, res) => {
  var hash = req.body.hash;
  var index = Number(req.body.index);
  var verbose = Number(req.body.verbose);
  if (!verbose) verbose = 0;
  if (!hash) hash = index;

  try {
    client.call("getblock", [hash, verbose], function (err, result) {
      if (err) {
        return res.json({ status: 400, msg: "errors", data: err });
      }
      return res.json({ status: 200, msg: "sccuess", data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

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

exports.getblockhash = (req, res) => {
  var index = Number(req.body.index);
  try {
    client.call("getblockhash", [index], function (err, result) {
      if (err) {
        return res.json({ status: 400, msg: "errors", data: err });
      }
      return res.json({ status: 200, msg: "sccuess", data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.getblocksysfee = (req, res) => {
  var index = Number(req.body.index);
  try {
    client.call("getblocksysfee", [index], function (err, result) {
      if (err) {
        return res.json({ status: 400, msg: "errors", data: err });
      }
      return res.json({ status: 200, msg: "sccuess", data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.getconnectioncount = (req, res) => {
  try {
    client.call("getconnectioncount", [], function (err, result) {
      if (err) {
        return res.json({ status: 400, msg: "errors", data: err });
      }
      return res.json({ status: 200, msg: "sccuess", data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.getcontractstate = (req, res) => {
  var script_hash = req.body.script_hash;
  try {
    client.call("getcontractstate", [script_hash], function (err, result) {
      if (err) {
        return res.json({ status: 400, msg: "errors", data: err });
      }
      return res.json({ status: 200, msg: "sccuess", data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.getnewaddress = (req, res) => {
  try {
    client.call("getnewaddress", [], function (err, result) {
      if (err) {
        return res.json({ status: 400, msg: "errors", data: err });
      }
      return res.json({ status: 200, msg: "sccuess", data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.getrawmempool = (req, res) => {
  try {
    client.call("getrawmempool", [], function (err, result) {
      if (err) {
        return res.json({ status: 400, msg: "errors", data: err });
      }
      return res.json({ status: 200, msg: "sccuess", data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.getrawtransaction = (req, res) => {
  var txid = req.body.txid;
  var verbose = Number(req.body.verbose);
  if (!verbose) verbose = 0;

  try {
    client.call("getrawtransaction", [txid, verbose], function (err, result) {
      if (err) {
        return res.json({ status: 400, msg: "errors", data: err });
      }
      return res.json({ status: 200, msg: "sccuess", data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.getstorage = (req, res) => {
  var script_hash = req.body.script_hash;
  var key = req.body.key;
  try {
    client.call("getstorage", [script_hash, key], function (err, result) {
      if (err) {
        return res.json({ status: 400, msg: "errors", data: err });
      }
      return res.json({ status: 200, msg: "sccuess", data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.gettxout = (req, res) => {
  var txid = req.body.txid;
  var n = Number(req.body.n);

  try {
    client.call("gettxout", [txid, n], function (err, result) {
      if (err) {
        return res.json({ status: 400, msg: "errors", data: err });
      }
      return res.json({ status: 200, msg: "sccuess", data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.getpeers = (req, res) => {
  try {
    client.call("getpeers", [], function (err, result) {
      if (err) {
        return res.json({ status: 400, msg: "errors", data: err });
      }
      return res.json({ status: 200, msg: "sccuess", data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.getversion = (req, res) => {
  try {
    client.call("getversion", [], function (err, result) {
      if (err) {
        return res.json({ status: 400, msg: "errors", data: err });
      }
      return res.json({ status: 200, msg: "sccuess", data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.invoke = (req, res) => {
  var script_hash = req.body.script_hash;
  var params = req.body.params;

  try {
    client.call("invoke", [script_hash, params], function (err, result) {
      if (err) {
        return res.json({ status: 400, msg: "errors", data: err });
      }
      return res.json({ status: 200, msg: "sccuess", data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.invokefunction = (req, res) => {
  var script_hash = req.body.script_hash;
  var operation = req.body.operation;
  var params = req.body.params;
  try {
    client.call("invokefunction", [script_hash, operation, params], function (err, result) {
      if (err) {
        return res.json({ status: 400, msg: "errors", data: err });
      }
      return res.json({ status: 200, msg: "sccuess", data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.invokescript = (req, res) => {
  var script = req.body.script;
  try {
    client.call("invokescript", [script], function (err, result) {
      if (err) {
        return res.json({ status: 400, msg: "errors", data: err });
      }
      return res.json({ status: 200, msg: "sccuess", data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.listaddress = (req, res) => {
  try {
    client.call("listaddress", [], function (err, result) {
      if (err) {
        return res.json({ status: 400, msg: "errors", data: err });
      }
      return res.json({ status: 200, msg: "sccuess", data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.sendrawtransaction = (req, res) => {
  var hex = req.body.hex;

  try {
    client.call("sendrawtransaction", [hex], function (err, result) {
      if (err) {
        return res.json({ status: 400, msg: "errors", data: err });
      }
      return res.json({ status: 200, msg: "sccuess", data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.sendtoaddress = (req, res) => {
  var asset_id = req.body.asset_id;
  var address = req.body.address;
  var value = Number(req.body.value);
  var fee = Number(req.body.fee);

  if (!fee) fee = 0;

  try {
    client.call("sendtoaddress", [asset_id, address, value, fee], function (err, result) {
      if (err) {
        return res.json({ status: 400, msg: "errors", data: err });
      }
      return res.json({ status: 200, msg: "sccuess", data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.sendmany = (req, res) => {
  var outputs_array = req.body.outputs_array;
  var fee = Number(req.body.fee);
  var change_address = req.body.change_address;

  if (!fee) fee = 0;

  try {
    client.call("sendmany", [outputs_array, fee, change_address], function (err, result) {
      if (err) {
        return res.json({ status: 400, msg: "errors", data: err });
      }
      return res.json({ status: 200, msg: "sccuess", data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.submitblock = (req, res) => {
  var hex = req.body.hex;

  try {
    client.call("submitblock", [hex], function (err, result) {
      if (err) {
        return res.json({ status: 400, msg: "errors", data: err });
      }
      return res.json({ status: 200, msg: "sccuess", data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};

exports.validateaddress = (req, res) => {
  var address = req.body.address;

  try {
    client.call("validateaddress", [address], function (err, result) {
      if (err) {
        return res.json({ status: 400, msg: "errors", data: err });
      }
      return res.json({ status: 200, msg: "sccuess", data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: "errors", data: error });
  }
};
