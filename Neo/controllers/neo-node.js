// define local node object
const _ = require('lodash');
const config = require('../config');
const localNode = config.localNode;
const client = config.client;

const TransactionModel = require('../model/transactions');
const UtxoModel = require('../model/utxo');
const AddressModel = require('../model/address');
const TokenModel = require('../model/token');

const UtilsModule = require('../modules/utils');

const promisify = UtilsModule.promisify;
// const getTxOutFunc = UtilsModule.getTxOutFunc;
const getTxDetailsFunc = UtilsModule.getTxDetailsFunc;
const getBlockDetailsFunc = UtilsModule.getBlockDetailsFunc;

// /////////////////////////////////////////////////////////////////////////////////////////////////////
// // RPC Call apis ////
// /////////////////////////////////////////////////////////////////////////////////////////////////////

// exports.getBalance = async function (req, res) {
//   var address = req.params.address;

//   // logic
//   try {
//     var utxoRows = await UtxoModel.find({ address });

//     var balance = [];
//     if (utxoRows.length == 0) {
//       if (address.length >= 25 && address.length <= 34) {
//         var neo_token = await TokenModel.findOne({ ticker: "NEO" });
//         balance.push({
//           asset: neo_token.asset,
//           value: 0,
//           token: neo_token,
//           ticker: neo_token.ticker
//         })
//         return res.json({ status: 200, msg: "success", data: { address, balance } });
//       } else return res.json({ status: 400, msg: "Invalid address !" });
//     }

//     var tokenRows = await TokenModel.find({});

//     for (let i = 0; i < utxoRows.length; i++) {
//       let { asset, amount, createdAtBlock } = utxoRows[i];

//       var _index = _.findIndex(balance, function (o) { return o.asset == asset; });
//       if (_index == -1) {
//         var item = {};
//         item.asset = asset;
//         item.value = amount;

//         var tokenRow = _.find(tokenRows, { asset });
//         if (tokenRow) {
//           item.token = tokenRow;
//           item.ticker = tokenRow.ticker;
//         }
//         balance.push(item);
//       } else {
//         balance[_index].value += amount;
//       }
//     }
//     return res.json({ status: 200, msg: 'success', data: { address, balance } });
//   } catch (error) {
//     return res.json({ status: 400, msg: "error occured !" });
//   }
// };

exports.getBalance = async function (req, res) {
  const address = req.params.address;

  // logic
  try {
    const addressRows = await AddressModel.find({ address });

    const balance = [];
    if (addressRows.length === 0) {
      if (address.length >= 25 && address.length <= 34) {
        const neoToken = await TokenModel.findOne({ ticker: 'NEO' });
        balance.push({
          asset: neoToken.asset,
          value: 0,
          token: neoToken,
          ticker: neoToken.ticker
        });
        return res.json({ status: 200, msg: 'success', data: { address, balance } });
      }
      return res.json({ status: 400, msg: 'Invalid address !' });
    }

    const tokenRows = await TokenModel.find({});

    for (let i = 0; i < addressRows.length; i++) {
      const asset = addressRows[i].asset;
      const amount = addressRows[i].balance;

      const item = {};
      item.asset = asset;
      item.value = amount;

      const tokenRow = _.find(tokenRows, { asset });
      if (tokenRow) {
        item.token = tokenRow;
        item.ticker = tokenRow.ticker;
      }
      balance.push(item);
    }
    return res.json({ status: 200, msg: 'success', data: { address, balance } });
  } catch (error) {
    return res.json({ status: 400, msg: 'error occured !' });
  }
};

exports.getAddressUTXO = async function (req, res) {
  const address = req.params.address;

  // logic
  try {
    const utxoRows = await UtxoModel.find({ address });
    if (utxoRows.length === 0) return res.json({ status: 400, msg: 'No address in db !' });

    const data = _.filter(utxoRows, (o) => (o.amount > 0));
    const _minusData = _.filter(utxoRows, (o) => (o.amount < 0));

    for (let i = 0; i < _minusData.length; i++) {
      const _item = _minusData[i];
      const txRow = await TransactionModel.findOne({ txid: _item.txid });
      const _vin = txRow.vin;
      const _n = _item.index - txRow.vout.length;
      const _inItem = _vin[_n];

      const _txid = _inItem.txid;
      const _vout = _inItem.vout;

      _.remove(data, (o) => ((o.txid === _txid) && (o.index === _vout)));
    }
    return res.json({ status: 200, msg: 'success', data });
  } catch (error) {
    return res.json({ status: 400, msg: 'error occured !', data: error });
  }
};

// Block
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
    .then((result) => {
      res.json({ status: 200, msg: 'success', data: result });
    })
    .catch((err) => {
      res.json({ status: 400, msg: 'errors', data: err });
    });
};

exports.getBlockByHash = (req, res) => {
  let hash = req.params.hash;
  try {
    if (hash.length < 10) hash = Number(hash);
    return client.call('getblock', [hash, 1], (err, block) => {
      if (err) {
        return res.json({ status: 400, msg: 'errors', data: err });
      }
      const txs = block.tx;
      if (txs && txs.length > 0) {
        const newTxs = [];
        for (let j = 0; j < txs.length; j++) {
          newTxs.push(txs[j].txid);
        }

        block.tx = newTxs;
      }

      return res.json({ status: 200, msg: 'sccuess', data: block });
    });
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};

exports.getBlockDetails = async (req, res) => {
  const hash = req.params.hash;

  const block = await getBlockDetailsFunc(hash);
  if (block) return res.json({ status: 200, msg: 'sccuess', data: block });
  return res.json({ status: 400, msg: 'errors' });
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
    .then((result) => {
      res.json({ status: 200, msg: 'success', data: result });
    })
    .catch((err) => {
      res.json({ status: 400, msg: 'errors', data: err });
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
  const height = req.params.height;

  localNode
    .getBlockHashByHeight(height)
    .then((result) => {
      res.json({ status: 200, msg: 'success', data: result });
    })
    .catch((err) => {
      res.json({ status: 400, msg: 'errors', data: err });
    });
};

// Net
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
    .then((result) => {
      res.json({ status: 200, msg: 'success', data: result });
    })
    .catch((err) => {
      res.json({ status: 400, msg: 'errors', data: err });
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
    .then((result) => {
      res.json({ status: 200, msg: 'success', data: result });
    })
    .catch((err) => {
      res.json({ status: 400, msg: 'errors', data: err });
    });
};

// Tx
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
    .then((result) => {
      res.json({ status: 200, msg: 'success', data: result });
    })
    .catch((err) => {
      res.json({ status: 400, msg: 'errors', data: err });
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
        "Invocation": "40915467ecd359684b2dc358024ca750609591aa731a0b309c7fb3cab5cd0836ad3992aa0a24d
        a431f43b68883ea5651d548feb6bd3c8e16376e6e426f91f84c58",
        "Verification": "2103322f35c7819267e721335948d385fae5be66e7ba8c748ac15467dcca0693692dac"
      }
    ],
    "Blockhash": "9c814276156d33f5dbd4e1bd4e279bb4da4ca73ea7b7f9f0833231854648a72c",
    "Confirmations": 144,
    "Blocktime": 1496719422
  }
 */
exports.getRawTransaction = function (req, res) {
  const txId = req.params.txId;

  localNode
    .getRawTransaction(txId, 1)
    .then((result) => {
      res.json({ status: 200, msg: 'success', data: result });
    })
    .catch((err) => {
      res.json({ status: 400, msg: 'errors', data: err });
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
  const txId = req.params.txId;
  const index = req.params.index;

  localNode
    .getTxOut(txId, index)
    .then((result) => {
      res.json({ status: 200, msg: 'success', data: result });
    })
    .catch((err) => {
      res.json({ status: 400, msg: 'errors', data: err });
    });
};

// /////////////////////////////////////////////////////////////////////////////////////////////////////
// // Utility apis ////
// /////////////////////////////////////////////////////////////////////////////////////////////////////

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
          "invocation": "dummy data",
          "verification": "dummy data"
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
  let offset = Number(req.query.offset);
  let count = Number(req.query.count);

  if (!offset) offset = 0;
  if (!count || count <= 0) count = 10;

  try {
    // logic
    const blockCount = await localNode.getBlockCount();
    if (!blockCount) {
      return res.json({ status: 400, msg: 'Error in getting block count' });
    }

    // logic
    const blocks = [];
    for (let i = 1; i <= count; i++) {
      const height = blockCount - offset - i;
      if (height < 0) break;

      try {
        const block = await localNode.getBlockByHeight(height, 1);

        const txs = block.tx;
        if (txs && txs.length > 0) {
          const newTxs = [];
          for (let j = 0; j < txs.length; j++) {
            newTxs.push(txs[j].txid);
          }

          block.tx = newTxs;
        }

        if (block) blocks.push(block);
      } catch (error) {
        console.log('error occured: ', error);
      }
    }

    return res.json({
      status: 200,
      msg: 'success',
      data: { total: blockCount, result: blocks }
    });
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};

exports.getTx = async function (req, res) {
  const txid = req.params.txid;
  try {
    return client.call('getrawtransaction', [txid, 1], (err, result) => {
      if (err) {
        return res.json({ status: 400, msg: 'errors', data: err });
      }
      return res.json({ status: 200, msg: 'sccuess', data: result });
    });
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};

exports.getTxDetails = async function (req, res) {
  const txid = req.params.txid;
  const txdetails = await getTxDetailsFunc(txid);
  if (txdetails) return res.json({ status: 200, msg: 'sccuess', data: txdetails });

  return res.json({ status: 400, msg: 'errors' });
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
  const contract = req.query.contract;
  let offset = Number(req.query.offset);
  let count = Number(req.query.count);
  const order = Number(req.query.order);

  if (!offset) offset = 0;
  if (!count || count <= 0) count = 10;
  // condition
  let condition;
  if (order) condition = { blockTime: 1 };
  else condition = { blockTime: -1 };

  let findCond = {};
  if (contract && contract !== '') findCond = { assets: { $elemMatch: { $eq: contract } } };
  // logic
  try {
    const total = await TransactionModel.find(findCond).count();
    return TransactionModel.find(findCond)
      .sort(condition)
      .skip(offset)
      .limit(count)
      .exec(async function (error, rows) {
        if (error) {
          console.log('getTransactionList: we have a promblem: ', error); // Should dump errors here
          return res.json({ status: 400, msg: 'errors', data: error });
        }

        const txs = [];
        for (let i = 0; i < rows.length; i++) {
          // const row = rows[i];
          // var tx = await getTxDetailsFunc(row.txid);
          // if (tx) txs.push(tx);
          try {
            const tx = await promisify('getrawtransaction', [rows[i].txid, 1]);
            txs.push(tx);
          } catch (e) {
            console.log('get transaction error: ', e);
          }
        }
        return res.json({
          status: 200,
          msg: 'success',
          data: { total, result: txs }
        });
      });
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
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
  const address = req.params.address;
  const asset = req.query.asset;
  let offset = Number(req.query.offset);
  let count = Number(req.query.count);
  let order = Number(req.query.order);

  // validation
  if (!address || address === '') return res.json({ status: 400, msg: 'address is empty !' });
  if (!offset) offset = 0;
  if (!count || count === 0) count = 10;

  let cond;
  if (!asset || asset === '') cond = { address };
  else cond = { asset, address };

  if (order) order = { time: 1 };
  else order = { time: -1 };

  // logic
  try {
    const rows = await UtxoModel.find(cond)
      .sort(order);

    let arrTxid = _.map(rows, 'txid');
    arrTxid = _.uniqBy(arrTxid, (e) => e);

    // response
    const total = arrTxid.length;
    const txids = _.slice(arrTxid, offset, offset + count);

    const result = [];
    for (let i = 0; i < txids.length; i++) {
      const txid = txids[i];
      // var txInfo = await promisify("getrawtransaction", [txid, 1]);
      const txInfo = await UtilsModule.getTxDetailsFunc(txid);
      if (txInfo) result.push(txInfo);
    }
    return res.json({
      status: 200,
      msg: 'success',
      data: { total, result }
    });
  } catch (error) {
    // return res.json({ status: 400, msg: "error occured !" });
    return res.json({
      status: 200,
      msg: 'success',
      data: { total: 0, result: [] }
    });
  }
};

exports.getSearch = async (req, res) => {
  const key = req.params.key;

  try {
    if (key.length < 10) {
      // block process
      const block = await promisify('getblock', [Number(key), 1]);
      if (block) return res.json({ status: 200, msg: 'sccuess', data: { type: 'block' } });
    } else if (key.length >= 25 && key.length <= 34) {
      // address process
      return res.json({ status: 200, msg: 'sccuess', data: { type: 'address' } });
    } else if (key.length >= 64 && key.length <= 66) { // block or txid process
      try {
        const tx = await promisify('getrawtransaction', [key, 1]);
        if (tx) return res.json({ status: 200, msg: 'sccuess', data: { type: 'transaction' } });
      } catch (error) {
        // console.log(error);
      }

      // block details
      try {
        const block = await promisify('getblock', [key, 1]);
        if (block) return res.json({ status: 200, msg: 'sccuess', data: { type: 'block' } });
      } catch (error) {
        // console.log(error);
      }
    }
    return res.json({ status: 400, msg: 'search key is not correct !' });
  } catch (error) {
    return res.json({ status: 400, msg: 'errors', data: error });
  }
};

exports.getMonitor = async (req, res) => res.json({ status: 200, msg: 'success', data: 'Server is working now !' });

exports.getMonitorDb = async (req, res) => {
  try {
    if (require('mongoose').connection.readyState) { // eslint-disable-line
      return res.json({ status: 200, msg: 'success', data: 'Db is working now !' });
    }

    throw new Error('db error');
  } catch (err) {
    return res.status(400).json({ status: 400, msg: 'errors', data: 'Db is not working now !' });
  }
};

exports.getMonitorRpc = async (req, res) => {
  try {
    return client.call('getblockcount', [], (err, result) => {
      if (err) {
        return res.status(400).json({ status: 400, msg: 'errors', data: err.toString() });
      }
      return res.json({ status: 200, msg: 'sccuess', data: result });
    });
  } catch (err) {
    return res.status(400).json({ status: 400, msg: 'errors', data: err.toString() });
  }
};
