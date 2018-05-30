var config = require('../config/common').info;
var web3 = require('../config/common').web3;
var TransactionModel = require("../model/transactions");
var TokenModel = require("../model/tokens");

exports.getBalance = function (req, res) {
  var addr = req.params.address;

  // Show the address in the console.
  //console.log('Address:', addr);

  // Use Wb3 to get the balance of the address, convert it and then show it in the console.
  web3.eth.getBalance(addr, function (error, result) {
    if (!error) {
      var ethervalue = web3.utils.fromWei(result, 'ether');
      //console.log('Ether:', ethervalue); // Show the ether balance after converting it from Wei
      res.status(200).json({ balance: ethervalue });
    }
    else {
      console.log('we have a promblem: ', error); // Should dump errors here
      res.status(400).json({ error: error });
    }
  });
}

exports.createAccount = function (req, res) {
  console.log("createAccount");

  // Use Wb3 to get the balance of the address, convert it and then show it in the console.
  web3.eth.personal.newAccount(config.mainpass, function (error, result) {
    if (!error) {
      console.log('New Account:', result);
      res.status(200).json({ address: result });
    }
    else {
      console.log('createAccount error: ', error); // Should dump errors here
      res.status(400).json({ error: error });
    }
  });
}

//to enable calls of personal functions, need to set --rpcapi eth,web3,personal when call geth
exports.sendTransaction = function (req, res) {
  console.log("sendTransaction", req.body);
  var from = req.body.from;
  var to = req.body.to;
  var value = req.body.value;
  // Use Wb3 to get the balance of the address, convert it and then show it in the console.
  web3.eth.personal.unlockAccount(from, config.mainpass, function (error, result) {
    if (!error) {
      console.log('Unlocked Account: ', result);
      web3.eth.sendTransaction({
        from: from,
        to: to,
        value: web3.utils.toWei(value),
      }, function (err, hash) {
        if (!err) {
          console.log("Send transaction: ", hash);
          res.status(200).json({ hash: hash });
        }
        else {
          console.log('error: ', err);
          res.status(400).json({ error: error });
        }
      })
    }
    else {
      console.log('we have a promblem: ', error); // Should dump errors here
      res.status(400).json({ error: error });
    }
  });
}

exports.getUpdatedTransactions = function (req, res) {
  var blocknum = req.body.blocknum;

  var lastblock = web3.eth.getBlockNumber(async function (error, number) {
    //console.log("lastblock= ", number);

    if (!error) {
      try {
        var blocks = [];
        for (let i = blocknum; i <= number; i++) {
          var blockdata = await web3.eth.getBlock(i, true);
          blocks = blocks.concat(blockdata.transactions);
        }

        res.status(200).json({ lastblock: number, data: blocks });
      }
      catch (e) {
        console.log('we have a promblem: ', e); // Should dump errors here
        res.status(400).json({ error: e });
      }
    }
    else {
      console.log('we have a promblem: ', error); // Should dump errors here
      res.status(400).json({ error: error });
    }
  });

}

/*
* Get blocklist of specified count of blocks from certain number.
* @param start_height number of block from where to get block list.
* @param count count of list to get.
* @return list of block information same as the etherscan.io
* Here are some differences:
*   Age is second unit.
*   Miner is address, not the name. In etherscan, name is only comment from user on site. 
*       refer: https://ethereum.stackexchange.com/questions/2620/how-can-i-add-my-name-next-to-address-on-etherscan
*   GasPrice is GWei unit
*   Reward cannot be retrieved from node. Maybe should get it from etherscan
*/
exports.blocklist = function (req, res) {
  var blocknum = req.body.blocknum;
  var count = req.body.count;

  web3.eth.getBlockNumber(async function (error, number) {
    if (!error) {
      try {
        console.log("last number " + number);
        var blocks = [];
        for (let i = blocknum; i <= number && i < blocknum + count; i++) {
          var blockdata = await web3.eth.getBlock(i, true);

          var Height = blockdata.number;
          var Age = blockdata.timestamp;
          var txn = blockdata.transactions.length;
          var Uncles = blockdata.uncles.length;
          var Miner = blockdata.miner;
          var GasUsed = blockdata.gasUsed;
          var GasLimit = blockdata.gasLimit;

          var Reward = 0;
          var gas = 0;
          for (let j = 0; j < txn; j++) {
            let hash = blockdata.transactions[j].hash;
            let gasprice = blockdata.transactions[j].gasPrice;
            let transaction = await web3.eth.getTransactionReceipt(hash);

            let price = gasprice * transaction.gasUsed;
            gas += transaction.gasUsed;
            Reward += price / 1000000000;
          }

          var GasPrice = txn ? Reward / gas : 0;
          Reward = Reward / 1000000000;

          blocks.push({
            blockNumber: Height,
            timeStamp: Age,
            txn: txn,
            uncles: Uncles,
            blockMiner: Miner,
            gasUsed: GasUsed,
            gasLimit: GasLimit,
            avgGasPrice: GasPrice.toFixed(2),
          });
        }

        console.log("blocks: ", blocks);
        res.status(200).json({ msg: "success", data: blocks });
      }
      catch (e) {
        console.log('blocklist: we have a promblem: ', e); // Should dump errors here
        res.status(400).json({ error: e });
      }
    }
    else {
      console.log('getBlockNumber: we have a promblem: ', error); // Should dump errors here
      res.status(400).json({ error: error });
    }
  });
}

/**
 * Get latest blocklist from offset and count.
 * 
 * @param {Number} offset
 * @param {Number} count
 * 
 * @returns { status: 200, msg: 'success', data: [block] }
 * block = {
            "difficulty": "2609994988",
            "extraData": "0xda83010807846765746888676f312e31302e318777696e646f7773",
            "gasLimit": 58000000,
            "gasUsed": 5233537,
            "hash": "0xe3b092cff27d1c3488a7043173c8d4ab016ac9c8a3a6b2ee43087946e792e1bf",
            "logsBloom": "0x0000080000008a0000000000000040000202000000000010000000000000000000000080000000000000008000000000000100000000000000000000000400400000000000200000000000080000000000000000200500000000000000000000000000000200002000020000000008200000000000004000100000100000000000000000100100000000000000000c0400000000000000010004000000080000000080000000000000000000008000000000000000000000000000000100000000100a02000200000000000008000000000000020000000000000000100060000000000000000000000000040000000001000000000000000000000000000000",
            "miner": "0xe24246e6dCBb07BC15A1f9C3833fc1877DF4c80e",
            "mixHash": "0x64a8f940cf2e65c719526f505292e4af9229a72477559da720bb0b9c2454c447",
            "nonce": "0x937b2b8a430d1eeb",
            "number": 3332474,
            "parentHash": "0x38cd4923a32040c54957da1fa8ce37f2dd109f314b5eeba18a36fc407c5cc3e5",
            "receiptsRoot": "0xdde230f13416b1aa7fbc249cc01f42cb249a2c3ce25b4c411322858f990897f1",
            "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
            "size": 21803,
            "stateRoot": "0x716e7237186911968b734006e2ff76b6b7b84525dff883fc5d0adf82e067d12e",
            "timestamp": 1527583261,
            "totalDifficulty": "8399454833308733",
            "transactions": [
                {
                    "blockHash": "0xe3b092cff27d1c3488a7043173c8d4ab016ac9c8a3a6b2ee43087946e792e1bf",
                    "blockNumber": 3332474,
                    "from": "0x4B8E0fCDdca42a238DA3b930d0a5543B6B0e7A19",
                    "gas": 6721975,
                    "gasPrice": "100000000000",
                    "hash": "0x204e704b27602180d7bd11d5575449022b30b02124c6f10704bfbb3e60949ce8",
                    "input": "0x60806040526103e96004556103e9600555600060065560006007556000600855336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550610b208061006e6000396000f300608060405260043610610149576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680630a8256331461014e5780630ba3c8ac1461017b5780632ce62e50146101a65780633f252506146101f35780634cb81417146102205780634d717c681461024d578063554fe557146102785780635c2b1119146102c35780635f92cf2b146102ee5780636a19e6de1461035b5780636fdbd52a146103a657806379ba5097146103d35780638da5cb5b146103ea57806393a332801461044157806399e6f76d1461046c578063a439847814610497578063a91f14cc146104c4578063acc1ed32146104ef578063bd773a7a1461051a578063cbe5486814610545578063d4ee1d9014610572578063d6c7a59b146105c9578063e8a96b46146105f4578063eb63eadd14610661578063f2fde38b146106a2575b600080fd5b34801561015a57600080fd5b50610179600480360381019080803590602001909291905050506106e5565b005b34801561018757600080fd5b506101906106f9565b6040518082815260200191505060405180910390f35b3480156101b257600080fd5b506101f160048036038101908080359060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610703565b005b3480156101ff57600080fd5b5061021e60048036038101908080359060200190929190505050610763565b005b34801561022c57600080fd5b5061024b60048036038101908080359060200190929190505050610777565b005b34801561025957600080fd5b5061026261078b565b6040518082815260200191505060405180910390f35b34801561028457600080fd5b506102ad6004803603810190808035906020019092919080359060200190929190505050610791565b6040518082815260200191505060405180910390f35b3480156102cf57600080fd5b506102d86107b8565b6040518082815260200191505060405180910390f35b3480156102fa57600080fd5b50610319600480360381019080803590602001909291905050506107c2565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561036757600080fd5b5061039060048036038101908080359060200190929190803590602001909291905050506107f5565b6040518082815260200191505060405180910390f35b3480156103b257600080fd5b506103d160048036038101908080359060200190929190505050610821565b005b3480156103df57600080fd5b506103e8610835565b005b3480156103f657600080fd5b506103ff610937565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561044d57600080fd5b5061045661095c565b6040518082815260200191505060405180910390f35b34801561047857600080fd5b50610481610962565b6040518082815260200191505060405180910390f35b3480156104a357600080fd5b506104c26004803603810190808035906020019092919050505061096c565b005b3480156104d057600080fd5b506104d9610976565b6040518082815260200191505060405180910390f35b3480156104fb57600080fd5b5061050461097c565b6040518082815260200191505060405180910390f35b34801561052657600080fd5b5061052f610982565b6040518082815260200191505060405180910390f35b34801561055157600080fd5b5061057060048036038101908080359060200190929190505050610988565b005b34801561057e57600080fd5b5061058761099c565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156105d557600080fd5b506105de6109c2565b6040518082815260200191505060405180910390f35b34801561060057600080fd5b5061061f600480360381019080803590602001909291905050506109cc565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561066d57600080fd5b506106a0600480360381019080803590602001909291908035906020019092919080359060200190929190505050610a09565b005b3480156106ae57600080fd5b506106e3600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610a4a565b005b600115156106ef57fe5b8060088190555050565b6000600754905090565b6001151561070d57fe5b806003600084815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505050565b6001151561076d57fe5b8060048190555050565b6001151561078157fe5b8060078190555050565b60065481565b6002602052816000526040600020816008811015156107ac57fe5b01600091509150505481565b6000600454905090565b60036020528060005260406000206000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000600260008481526020019081526020016000208260088110151561081757fe5b0154905092915050565b6001151561082b57fe5b8060058190555050565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561089157600080fd5b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506000600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60045481565b6000600854905090565b8060068190555050565b60075481565b60085481565b60055481565b6001151561099257fe5b8060068190555050565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000600554905090565b60006003600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b60011515610a1357fe5b600882101515610a1f57fe5b806002600085815260200190815260200160002083600881101515610a4057fe5b0181905550505050565b60011515610a5457fe5b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614151515610ab057600080fd5b80600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550505600a165627a7a7230582030a8696067780fc1d67e60146922903f04fecf62e1d15bf5a312dadca8df3fc30029",
                    "nonce": 227,
                    "to": null,
                    "transactionIndex": 0,
                    "value": "0",
                    "v": "0x2a",
                    "r": "0x97538fc245070412cc153bd130c9875684da92e7052431e811fcb400af27abe1",
                    "s": "0x4c9caaeeb82e2559e43c08b9464def81cbddf065e0b242bfb990de9b3b9df0e9"
                },
            ],
            "transactionsRoot": "0x75a94c75fb1e56c1d14961308da23e36586fbf824e42d316ea4744ccf7959991",
            "uncles": []
        }
 */
exports.getBlocks = function (req, res) {
  var offset = Number(req.query.offset);
  var count = Number(req.query.count);

  if (!offset) offset = 0;
  if (!count || count <= 0) count = 10;

  web3.eth.getBlockNumber(async function (error, number) {
    if (!error) {
      try {
        var blocks = [];
        for (let i = 0; i < count; i++) {
          var height = number - offset - i;
          if (height < 0) break;

          var blockdata = await web3.eth.getBlock(height, true);
          if (blockdata) blocks.push(blockdata);
        }

        res.status(200).json({ status: 200, msg: "success", data: blocks });
      }
      catch (e) {
        console.log('blocklist: we have a promblem: ', e); // Should dump errors here
        res.status(400).json({ error: e });
      }
    }
    else {
      console.log('getBlockNumber: we have a promblem: ', error); // Should dump errors here
      res.status(400).json({ error: error });
    }
  });
}

/*
* Get Latest blocklist of specified count of blocks
* @param count count of list to get.
* @return list of block information same as the etherscan.io
* Here are some differences:
*   Age is second unit.
*   Miner is address, not the name. In etherscan, name is only comment from user on site. 
*       refer: https://ethereum.stackexchange.com/questions/2620/how-can-i-add-my-name-next-to-address-on-etherscan
*   GasPrice is GWei unit
*   Reward cannot be retrieved from node. Maybe should get it from etherscan
*/
exports.latestblocks = function (req, res) {
  var count = req.body.count;

  web3.eth.getBlockNumber(async function (error, number) {
    if (!error) {
      try {
        console.log("last number " + number);

        if (count > number + 1)
          count = number + 1;

        var blocks = [];
        for (let i = number; i > number - count; i--) {
          var blockdata = await web3.eth.getBlock(i, true);

          var Height = blockdata.number;
          var Age = blockdata.timestamp;
          var txn = blockdata.transactions.length;
          var Uncles = blockdata.uncles.length;
          var Miner = blockdata.miner;
          var GasUsed = blockdata.gasUsed;
          var GasLimit = blockdata.gasLimit;

          var Reward = 0;
          var gas = 0;
          for (let j = 0; j < txn; j++) {
            let hash = blockdata.transactions[j].hash;
            let gasprice = blockdata.transactions[j].gasPrice;
            let transaction = await web3.eth.getTransactionReceipt(hash);

            let price = gasprice * transaction.gasUsed;
            gas += transaction.gasUsed;
            Reward += price / 1000000000;
          }

          var GasPrice = txn ? Reward / gas : 0;
          Reward = Reward / 1000000000;

          blocks.push({
            blockNumber: Height,
            timeStamp: Age,
            txn: txn,
            uncles: Uncles,
            blockMiner: Miner,
            gasUsed: GasUsed,
            gasLimit: GasLimit,
            avgGasPrice: GasPrice.toFixed(2),
          });
        }

        console.log("blocks: ", blocks);
        res.status(200).json({ msg: "success", data: blocks });
      }
      catch (e) {
        console.log('blocklist: we have a promblem: ', e); // Should dump errors here
        res.status(400).json({ error: e });
      }
    }
    else {
      console.log('getBlockNumber: we have a promblem: ', error); // Should dump errors here
      res.status(400).json({ error: error });
    }
  });
}

/*
* Get block detail
* @blockNumber block number.
* @return block detail information
* 
* comment to internal transactions: 
*   There's not currently any way to do this using the web3 API. 
    Internal transactions, despite the name (which isn't part of the yellowpaper; 
    it's a convention people have settled on) aren't actual transactions, 
    and aren't included directly in the blockchain; 
    they're value transfers that were initiated by executing a contract.

    As such, they're not stored explicitly anywhere: 
    they're the effects of running the transaction in question on the blockchain state. 
    Blockchain explorers like etherscan obtain them by running a modified node with an instrumented EVM, 
    which record all the value transfers that took place as part of transaction execution, 
    storing them separately.
*/
exports.getblockdetail = async function (req, res) {
  var blockNumber = req.body.blocknum;

  try {
    var blockdata = await web3.eth.getBlock(blockNumber, false);

    var timestamp = blockdata.timestamp;
    var txn = blockdata.transactions.length;
    var Uncles = blockdata.uncles.length;
    var hash = blockdata.hash;
    var parentHash = blockdata.parentHash;
    var sha3Uncles = blockdata.sha3Uncles;
    var Miner = blockdata.miner;
    var difficulty = blockdata.difficulty;
    var totalDifficulty = blockdata.totalDifficulty;
    var size = blockdata.size;
    var nonce = blockdata.nonce;
    var extraData = blockdata.extraData;
    var GasUsed = blockdata.gasUsed;
    var GasLimit = blockdata.gasLimit;


    var blockdetail = {
      blockNumber: blockNumber,
      timeStamp: timestamp,
      transactions: txn,
      hash: hash,
      parentHash: parentHash,
      sha3Uncles: sha3Uncles,
      minedBy: Miner,
      difficulty: difficulty,
      totalDifficulty, totalDifficulty,
      size: size,
      gasUsed: GasUsed,
      gasLimit: GasLimit,
      nonce: nonce,
      extraData: extraData
    };

    console.log("data: ", blockdetail);
    res.status(200).json({ msg: "success", data: blockdetail });
  }
  catch (e) {
    console.log('blockdeatil: we have a promblem: ', e); // Should dump errors here
    res.status(400).json({ error: e });
  }
}

/*
* Get transactions of blocknumber
* @blockNumber block number.
* @return transaction information
* 
*/
exports.postTransactions = async function (req, res) {
  var blockNumber = req.body.blockNumber;

  try {
    var blockdata = await web3.eth.getBlock(blockNumber, true);
    var timestamp = blockdata.timestamp;
    var transactions = blockdata.transactions;

    var txnlist = [];
    for (let i = 0; i < transactions.length; i++) {
      let transaction = transactions[i];
      let hash = transaction.hash;
      let txreceipt = await web3.eth.getTransactionReceipt(hash);

      let fee = txreceipt.gasUsed * transaction.gasPrice;
      fee = fee / 1e18;

      txnlist.push({
        status: txreceipt.status,
        blockNumber: blockNumber,
        timeStamp: timestamp,
        txHash: hash,
        from: transaction.from,
        to: transaction.to,
        value: transaction.value / 1e18,
        txFee: fee
      })
    }

    console.log("data: ", txnlist);
    res.status(200).json({ msg: "success", data: txnlist });
  }
  catch (e) {
    console.log('blocklist: we have a promblem: ', e); // Should dump errors here
    res.status(400).json({ error: e });
  }
}

/**
 * Get transaction list by offset, count, order
 * 
 * @param {Number} offset
 * @param {Number} count
 * @param {Number} order
 * 
 * @returns transaction list
 */
exports.getTransactions = async function (req, res) {
  var offset = Number(req.query.offset);
  var count = Number(req.query.count);
  var order = Number(req.query.order);

  if (!offset) offset = 0;
  if (!count || count <= 0) count = 10;
  // condition
  var condition;
  if (order) condition = { timestamp: 1 };
  else condition = { timestamp: -1 };

  TransactionModel.find()
    .sort(condition)
    .skip(offset)
    .limit(count)
    .exec(async function (error, rows) {
      if (error) {
        console.log('getTransactionList: we have a promblem: ', error); // Should dump errors here
        return res.json({ status: 400, msg: 'errors', data: error });
      }
      // var txs = [];
      // for (let i = 0; i < rows.length; i++) {
      //   try {
      //     var tx = await web3.eth.getTransaction(rows[i]['hash'])
      //     txs.push(tx);
      //   } catch (error) {
      //     console.log('get transaction error: ', error);
      //     txs.push({
      //       hash: rows[i].hash,
      //       error: true
      //     })
      //   }
      // }
      return res.json({ status: 200, msg: "success", data: rows });
    });
}

/*
* Get transactions list from Account
* @account: account address to get transactions
* @offset: offset to get list
* @count transaction count
* @return transactions list
* 
*/
exports.getTransactionsFromAccount = async function (req, res) {
  var account = req.body.account;
  var offset = req.body.offset;
  var count = req.body.count;

  TransactionModel.find()
    .or([{ from: account }, { to: account }])
    .sort({ timestamp: -1 })
    .skip(offset)
    .limit(count)
    .exec(function (error, transactions) {
      if (!error) {
        res.status(200).json({ msg: "success", data: transactions });
      }
      else {
        console.log('getTransactionsFromAccount: we have a promblem: ', error); // Should dump errors here
        res.status(400).json({ error: error });
      }
    });
}


/*
* Get transactions count from Account
* @account: account address to get transactions
* @return count
* 
*/
exports.getTransactionCountFromAccount = async function (req, res) {
  var account = req.body.account;

  TransactionModel.find()
    .or([{ from: account }, { to: account }])
    .sort({ timestamp: -1 })
    .exec(function (error, transactions) {
      if (!error) {
        res.status(200).json({ msg: "success", data: transactions.length });
      }
      else {
        console.log('getTransactionsFromAccount: we have a promblem: ', error); // Should dump errors here
        res.status(400).json({ error: error });
      }
    });
}

/*
* Get transactions info
* @hash transactin has to get info
* @return transaction detail info
* 
*/
exports.getTransactionInfo = function (req, res) {
  var txHash = req.body.txHash;

  web3.eth.getTransaction(txHash, async function (error, transaction) {
    if (!error) {
      try {
        let blocknumber = transaction.blockNumber;

        var blockdata = await web3.eth.getBlock(blocknumber, true);

        var timestamp = blockdata.timestamp;

        let txreceipt = await web3.eth.getTransactionReceipt(txHash);

        let fee = txreceipt.gasUsed * transaction.gasPrice;
        fee = fee / 1e18;

        let txinfo = {
          "txHash": transaction.hash,
          "timeStamp": timestamp,
          "status": txreceipt.status,
          "block": blocknumber,
          "from": transaction.from,
          "to": transaction.to,
          "value": transaction.value / 1e18,
          "gasLimit": transaction.gas,
          "gasUsedByTxn": txreceipt.gasUsed,
          "gasPrice": transaction.gasPrice,
          "actualTxCostFee": fee,
          "nonce": transaction.nonce,
          "inputData": transaction.input
        };

        console.log("txinfo: ", txinfo);
        res.status(200).json({ msg: "success", data: txinfo });
      }
      catch (e) {
        console.log('blocklist: we have a promblem: ', e); // Should dump errors here
        res.status(400).json({ error: e });
      }
    }
    else {
      console.log('getTransaction: we have a promblem: ', error); // Should dump errors here
      res.status(400).json({ error: error });
    }
  });
}



//api for token related
exports.getTokenList = function (req, res) {
  TokenModel.find()
    .sort({ symbol: 1 })
    .exec(function (error, tokens) {
      if (!error) {
        console.log(tokens);
        res.status(200).json({ msg: "success", data: tokens });
      }
      else {
        console.log('getTokenList: we have a promblem: ', error); // Should dump errors here
        res.status(400).json({ error: error });
      }
    });
}

exports.addToken = function (req, res) {
  var symbol = req.body.symbol;
  var address = req.body.address;

  TokenModel.find({ symbol: symbol, address: address })
    .exec(function (error, tokens) {
      if (!error) {
        if (tokens.length) {
          console.log('addToken: token already exsit'); // Should dump errors here
          res.status(400).json({ error: "token already exsit" });
          return;
        }

        var newToken = new TokenModel({ symbol: symbol, address: address });
        newToken.save(function (err, token) {
          res.status(200).json({ msg: "success", data: token });
        });
      }
      else {
        console.log('addToken: we have a promblem: ', error); // Should dump errors here
        res.status(400).json({ error: error });
      }
    })
}

exports.removeToken = function (req, res) {
  var symbol = req.body.symbol;
  var address = req.body.address;

  TokenModel.findOneAndRemove({ symbol: symbol, address: address })
    .exec(function (error, tokens) {
      if (!error) {
        res.status(200).json({ msg: "success" });
      }
      else {
        console.log('removeToken: we have a promblem: ', error); // Should dump errors here
        res.status(400).json({ error: error });
      }
    })

}
