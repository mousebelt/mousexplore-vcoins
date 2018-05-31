var config = require("../config");
var client = config.localNode;

var TransactionModel = require("../model/transactions");
var TxServiceInofModel = require("../model/txServiceInfo");
var AddressModel = require("../model/address");
var AddrServiceInofModel = require("../model/addrServiceInfo");

var fs = require("fs");
var Log = require("log"),
  log = new Log(
    "debug",
    fs.createWriteStream(__dirname + "/debug.log", { flags: "a" })
  );
// log = new Log('debug');

function filelog(...params) {
  //
  log.info(...params);
  // console.log(...params);
}

var promisify = function promisify(fn, args) {
  return new Promise((resolve, reject) => {
    try {
      client.call(fn, args, function(err, result) {
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

////////////////////////////////////////////////////////////////////////////

async function getTxServiceInfo() {
  try {
    txServiceInfo = await TxServiceInofModel.findOne();
    if (txServiceInfo) return txServiceInfo;
    else return { lastblock: -1 };
  } catch (e) {
    filelog("getTxServiceInfo error: ", e);
    return undefined;
  }
}

async function saveTxServiceInfo(lastblock) {
  await TxServiceInofModel.findOne(async function(e, info) {
    if (!e) {
      if (info) {
        info.set({ lastblock });
      } else {
        info = new TxServiceInofModel({ lastblock });
      }
      await info.save();
    } else {
      filelog("saveTxServiceInfo error: ", e); // Should dump errors here
    }
  });
}

async function getAddrServiceInfo() {
  try {
    addrServiceInfo = await AddrServiceInofModel.findOne();
    if (addrServiceInfo) return addrServiceInfo;
    else
      return {
        lastTxid: "",
        lastTxOffset: 0
      };
  } catch (e) {
    filelog("getAddrServiceInfo error: ", e);
    return undefined;
  }
}

async function saveAddrServiceInfo(lastTxid, lastTxOffset) {
  await AddrServiceInofModel.findOne(async function(e, info) {
    if (!e) {
      if (info) {
        info.set({
          lastTxid,
          lastTxOffset
        });
      } else {
        info = new AddrServiceInofModel({
          lastTxid: "",
          lastTxOffset: 0
        });
      }
      await info.save();
    } else {
      filelog("saveAddrServiceInfo error: ", e); // Should dump errors here
    }
  });
}

async function CheckUpdatedTransactions() {
  filelog("CheckUpdatedTransactions starting...");
  var lastblock;
  var txServiceInfo = await getTxServiceInfo();
  if (txServiceInfo) {
    lastblock = txServiceInfo.lastblock;
  } else {
    filelog("getTxServiceInfo error !");
    return;
  }

  try {
    var blockCount = await promisify("getblockcount", []);
    if (blockCount) {
      var limit = lastblock + config.TX_CRON_BLOCK_COUNT;
      for (let i = lastblock + 1; i < blockCount && i <= limit; i++) {
        try {
          var blockhash = await promisify("getblockhash", [i]);
          var blockdata = await promisify("getblock", [blockhash]);
          var txs = blockdata.tx;

          for (let j = 0; j < txs.length; j++) {
            let txid = txs[j];
            // Save Transaction Info
            var txRow = await TransactionModel.findOne({ txid });
            if (!txRow) {
              txRow = new TransactionModel({ txid });
              try {
                await txRow.save();
              } catch (e) {
                filelog(`transaction save error: i=${i}, j=${j}, txid=${txid}`); // Should dump errors here
                throw e;
              }
            }
          }

          if (lastblock != i) {
            lastblock = i;
            await saveTxServiceInfo(lastblock);
          }
        } catch (e) {
          filelog(`client getBlock error: i=${i}`);
          throw e;
        }
      }
    } else {
      throw "client getBlockCount: blockcount is empty"; // Should dump errors here
    }
  } catch (error) {
    filelog("CheckUpdatedTransactions error: ", error); // Should dump errors here
  }
}

async function CheckUpdatedAddresses() {
  // TODO: solve genesis block coinbase transactions - 4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b
  filelog("CheckUpdatedAddresses starting...");

  var lastTxid, lastTxOffset;
  var serviceInfo = await getAddrServiceInfo();
  if (serviceInfo) {
    lastTxid = serviceInfo.lastTxid;
    lastTxOffset = serviceInfo.lastTxOffset;
  } else {
    filelog("getAddrServiceInfo error !");
    return;
  }

  var arrTxs = await TransactionModel.find()
    .skip(lastTxOffset)
    .limit(config.ADDR_CRON_TX_COUNT);

  if (arrTxs && arrTxs.length > 0) {
    for (let i = 0; i < arrTxs.length; i++) {
      let { txid } = arrTxs[i];
      try {
        var txInfo;
        // if (txid == '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b') {
        //   txInfo = {
        //     "txid": "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b",
        //     "version": 1,
        //     "locktime": 0,
        //     "vin": [
        //       {
        //         "coinbase": "04ffff001d0104455468652054696d65732030332f4a616e2f32303039204368616e63656c6c6f72206f6e206272696e6b206f66207365636f6e64206261696c6f757420666f722062616e6b73",
        //         "sequence": 4294967295
        //       }
        //     ],
        //     "vout": [
        //       {
        //         "value": 50.00000000,
        //         "n": 0,
        //         "scriptPubKey": {
        //           "asm": "04678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb649f6bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf11d5f OP_CHECKSIG",
        //           "hex": "4104678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb649f6bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf11d5fac",
        //           "reqSigs": 1,
        //           "type": "pubkey",
        //           "addresses": [
        //             "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
        //           ]
        //         }
        //       }
        //     ]
        //   }
        // } else {
        //   txInfo = await promisify("getrawtransaction", [txid, 1]);
        // }
        try {
          txInfo = await promisify("getrawtransaction", [txid, 1]);
        } catch (error) {
          filelog(
            `error in getrawtransaction: i=${i}, txid=${txid}, lasttxid:${lastTxid}, lasttxoffset:${lastTxOffset}`,
            error
          );
        }

        if (txInfo) {
          var vin = txInfo.vin;
          var vout = txInfo.vout;
          // Save Address Info
          if (vin && vin.length > 0) {
            for (let j = 0; j < vin.length; j++) {
              var inTxid = vin[j].txid;
              var inVout = Number(vin[j].vout);
              if (!inTxid || inTxid == "" || inVout < 0) continue;
              var inTxInfo = await promisify("gettxout", [inTxid, inVout]);
              if (!inTxInfo) {
                continue;
                // throw `inTxInfo not found. inTxid=${inTxid}`;
              }

              var addresses = inTxInfo.scriptPubKey.addresses;
              for (let k = 0; k < addresses.length; k++) {
                // Save Info
                var addressRow = await AddressModel.findOne({
                  address: addresses[k]
                });
                if (!addressRow) {
                  addressRow = new AddressModel({
                    address: addresses[k],
                    txs: []
                  });
                }
                if (addressRow.txs.indexOf(txid) == -1) {
                  addressRow.txs.push(txid);
                  try {
                    await addressRow.save();
                  } catch (e) {
                    filelog(
                      `vin addressRow.save.txs error: i=${i}, j=${j}, k=${k}, addressRow=${addressRow}`
                    ); // Should dump errors here
                    throw e;
                  }
                }
              }
            }
          }
          if (vout && vout.length > 0) {
            for (let j = 0; j < vout.length; j++) {
              var addresses = vout[j].scriptPubKey.addresses;
              if (!addresses || addresses.length > 0) {
                for (let k = 0; k < addresses.length; k++) {
                  // Save Info
                  var addressRow = await AddressModel.findOne({
                    address: addresses[k]
                  });
                  if (!addressRow) {
                    addressRow = new AddressModel({
                      address: addresses[k],
                      txs: []
                    });
                  }
                  if (addressRow.txs.indexOf(txid) == -1) {
                    addressRow.txs.push(txid);
                    try {
                      await addressRow.save();
                    } catch (e) {
                      filelog(
                        `addressRow.save.txs error: i=${i}, j=${j}, k=${k} addressRow=${addressRow}`
                      ); // Should dump errors here
                      throw e;
                    }
                  }
                }
              }
            }
          }
        }
        // Save service info
        lastTxid = txid;
        lastTxOffset++;
        await saveAddrServiceInfo(lastTxid, lastTxOffset);
      } catch (error) {
        filelog(`Address update error ! i=${i}, error: `, error);
        return;
      }
    }
  }
}

async function transactionService() {
  filelog("Start transaction service ...");
  await CheckUpdatedTransactions();
  setTimeout(transactionService, config.TX_CRON_TIME);
  filelog("Done transaction service .");
}

async function addressService() {
  filelog("Start address service ...");
  await CheckUpdatedAddresses();
  setTimeout(addressService, config.ADDR_CRON_TIME);
  filelog("Done address service .");
}

exports.start_cronService = async function() {
  filelog("Start cron service");

  transactionService();
  addressService();
};
