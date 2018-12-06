// define local node object
const config = require('../config');
// const localNode = config.localNode;
const client = config.client;

// /////////////////////////////////////////////////////////////////////////////////////////////////////
// // Client RPC Call apis ////
// /////////////////////////////////////////////////////////////////////////////////////////////////////

exports.dumpprivkey = (req, res) => {
  const address = req.body.address;

  try {
    return client.call('dumpprivkey', [address], (err, result) => {
      if (err) {
        return res.json({ status: 400, msg: 'errors', data: err });
      }
      return res.json({ status: 200, msg: 'sccuess', data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};

exports.getaccountstate = (req, res) => {
  const address = req.body.address;

  try {
    return client.call('getaccountstate', [address], (err, result) => {
      if (err) {
        return res.json({ status: 400, msg: 'errors', data: err });
      }
      return res.json({ status: 200, msg: 'sccuess', data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};

exports.getapplicationlog = (req, res) => {
  const txid = req.body.txid;
  let verbose = Number(req.body.verbose);

  if (!verbose) verbose = 0;

  try {
    return client.call('getapplicationlog', [txid, verbose], (err, result) => {
      if (err) {
        return res.json({ status: 400, msg: 'errors', data: err });
      }
      return res.json({ status: 200, msg: 'sccuess', data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};

exports.getassetstate = (req, res) => {
  const assetId = req.body.asset_id;

  try {
    return client.call('getassetstate', [assetId], (err, result) => {
      if (err) {
        return res.json({ status: 400, msg: 'errors', data: err });
      }
      return res.json({ status: 200, msg: 'sccuess', data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};

exports.getbalance = (req, res) => {
  const assetId = req.body.asset_id;

  try {
    return client.call('getbalance', [assetId], (err, result) => {
      if (err) {
        return res.json({ status: 400, msg: 'errors', data: err });
      }
      return res.json({ status: 200, msg: 'sccuess', data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};

exports.getbestblockhash = (req, res) => {
  try {
    return client.call('getbestblockhash', [], (err, result) => {
      if (err) {
        return res.json({ status: 400, msg: 'errors', data: err });
      }
      return res.json({ status: 200, msg: 'sccuess', data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};

exports.getblock = (req, res) => {
  let hash = req.body.hash;
  const index = Number(req.body.index);
  let verbose = Number(req.body.verbose);
  if (!verbose) verbose = 0;
  if (!hash) hash = index;

  try {
    return client.call('getblock', [hash, verbose], (err, result) => {
      if (err) {
        return res.json({ status: 400, msg: 'errors', data: err });
      }
      return res.json({ status: 200, msg: 'sccuess', data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};

exports.getblockcount = (req, res) => {
  try {
    return client.call('getblockcount', [], (err, result) => {
      if (err) {
        return res.json({ status: 400, msg: 'errors', data: err });
      }
      return res.json({ status: 200, msg: 'sccuess', data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};

exports.getblockhash = (req, res) => {
  const index = Number(req.body.index);
  try {
    return client.call('getblockhash', [index], (err, result) => {
      if (err) {
        return res.json({ status: 400, msg: 'errors', data: err });
      }
      return res.json({ status: 200, msg: 'sccuess', data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};

exports.getblocksysfee = (req, res) => {
  const index = Number(req.body.index);
  try {
    return client.call('getblocksysfee', [index], (err, result) => {
      if (err) {
        return res.json({ status: 400, msg: 'errors', data: err });
      }
      return res.json({ status: 200, msg: 'sccuess', data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};

exports.getconnectioncount = (req, res) => {
  try {
    return client.call('getconnectioncount', [], (err, result) => {
      if (err) {
        return res.json({ status: 400, msg: 'errors', data: err });
      }
      return res.json({ status: 200, msg: 'sccuess', data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};

exports.getcontractstate = (req, res) => {
  const scriptHash = req.body.script_hash;
  try {
    return client.call('getcontractstate', [scriptHash], (err, result) => {
      if (err) {
        return res.json({ status: 400, msg: 'errors', data: err });
      }
      return res.json({ status: 200, msg: 'sccuess', data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};

exports.getnewaddress = (req, res) => {
  try {
    return client.call('getnewaddress', [], (err, result) => {
      if (err) {
        return res.json({ status: 400, msg: 'errors', data: err });
      }
      return res.json({ status: 200, msg: 'sccuess', data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};

exports.getrawmempool = (req, res) => {
  try {
    return client.call('getrawmempool', [], (err, result) => {
      if (err) {
        return res.json({ status: 400, msg: 'errors', data: err });
      }
      return res.json({ status: 200, msg: 'sccuess', data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};

exports.getrawtransaction = (req, res) => {
  const txid = req.body.txid;
  let verbose = Number(req.body.verbose);
  if (!verbose) verbose = 0;

  try {
    return client.call('getrawtransaction', [txid, verbose], (err, result) => {
      if (err) {
        return res.json({ status: 400, msg: 'errors', data: err });
      }
      return res.json({ status: 200, msg: 'sccuess', data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};

exports.getstorage = (req, res) => {
  const scriptHash = req.body.script_hash;
  const key = req.body.key;
  try {
    return client.call('getstorage', [scriptHash, key], (err, result) => {
      if (err) {
        return res.json({ status: 400, msg: 'errors', data: err });
      }
      return res.json({ status: 200, msg: 'sccuess', data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};

exports.gettxout = (req, res) => {
  const txid = req.body.txid;
  const n = Number(req.body.n);

  try {
    return client.call('gettxout', [txid, n], (err, result) => {
      if (err) {
        return res.json({ status: 400, msg: 'errors', data: err });
      }
      return res.json({ status: 200, msg: 'sccuess', data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};

exports.getpeers = (req, res) => {
  try {
    return client.call('getpeers', [], (err, result) => {
      if (err) {
        return res.json({ status: 400, msg: 'errors', data: err });
      }
      return res.json({ status: 200, msg: 'sccuess', data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};

exports.getversion = (req, res) => {
  try {
    return client.call('getversion', [], (err, result) => {
      if (err) {
        return res.json({ status: 400, msg: 'errors', data: err });
      }
      return res.json({ status: 200, msg: 'sccuess', data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};

exports.invoke = (req, res) => {
  const scriptHash = req.body.script_hash;
  const params = req.body.params;

  try {
    return client.call('invoke', [scriptHash, params], (err, result) => {
      if (err) {
        return res.json({ status: 400, msg: 'errors', data: err });
      }
      return res.json({ status: 200, msg: 'sccuess', data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};

exports.invokefunction = (req, res) => {
  const scriptHash = req.body.script_hash;
  const operation = req.body.operation;
  const params = req.body.params;
  try {
    return client.call('invokefunction', [scriptHash, operation, params], (err, result) => {
      if (err) {
        return res.json({ status: 400, msg: 'errors', data: err });
      }
      return res.json({ status: 200, msg: 'sccuess', data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};

exports.invokescript = (req, res) => {
  const script = req.body.script;
  try {
    return client.call('invokescript', [script], (err, result) => {
      if (err) {
        return res.json({ status: 400, msg: 'errors', data: err });
      }
      return res.json({ status: 200, msg: 'sccuess', data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};

exports.listaddress = (req, res) => {
  try {
    return client.call('listaddress', [], (err, result) => {
      if (err) {
        return res.json({ status: 400, msg: 'errors', data: err });
      }
      return res.json({ status: 200, msg: 'sccuess', data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};

exports.sendrawtransaction = (req, res) => {
  const hex = req.body.hex;

  try {
    return client.call('sendrawtransaction', [hex], (err, result) => {
      if (err) {
        return res.json({ status: 400, msg: 'errors', data: err });
      }
      return res.json({ status: 200, msg: 'sccuess', data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};

exports.sendtoaddress = (req, res) => {
  const assetId = req.body.asset_id;
  const address = req.body.address;
  const value = Number(req.body.value);
  let fee = Number(req.body.fee);

  if (!fee) fee = 0;

  try {
    return client.call('sendtoaddress', [assetId, address, value, fee], (err, result) => {
      if (err) {
        return res.json({ status: 400, msg: 'errors', data: err });
      }
      return res.json({ status: 200, msg: 'sccuess', data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};

exports.sendmany = (req, res) => {
  const outputsArray = req.body.outputs_array;
  let fee = Number(req.body.fee);
  const changeAddress = req.body.change_address;

  if (!fee) fee = 0;

  try {
    return client.call('sendmany', [outputsArray, fee, changeAddress], (err, result) => {
      if (err) {
        return res.json({ status: 400, msg: 'errors', data: err });
      }
      return res.json({ status: 200, msg: 'sccuess', data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};

exports.submitblock = (req, res) => {
  const hex = req.body.hex;

  try {
    return client.call('submitblock', [hex], (err, result) => {
      if (err) {
        return res.json({ status: 400, msg: 'errors', data: err });
      }
      return res.json({ status: 200, msg: 'sccuess', data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};

exports.validateaddress = (req, res) => {
  const address = req.body.address;

  try {
    return client.call('validateaddress', [address], (err, result) => {
      if (err) {
        return res.json({ status: 400, msg: 'errors', data: err });
      }
      return res.json({ status: 200, msg: 'sccuess', data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};
