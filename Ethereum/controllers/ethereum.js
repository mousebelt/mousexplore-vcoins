var Web3 = require('web3');

// Show Web3 where it needs to look for a connection to Ethereum.
var config = require('../config/common').info;
var web3 = new Web3(new Web3.providers.HttpProvider(config.provider));

exports.getBalance = function(req, res) {
    var addr = req.params.address;

    // Show the address in the console.
    //console.log('Address:', addr);

    // Use Wb3 to get the balance of the address, convert it and then show it in the console.
    web3.eth.getBalance(addr, function (error, result) {
        if (!error) {
            var ethervalue = web3.utils.fromWei(result,'ether');
            //console.log('Ether:', ethervalue); // Show the ether balance after converting it from Wei
            res.status(200).json({balance: ethervalue});
        }
        else {
            console.log('we have a promblem: ', error); // Should dump errors here
            res.status(400).json({error: error});
        }
    });
}

exports.createAccount = function(req, res) {
    console.log("createAccount");

    // Use Wb3 to get the balance of the address, convert it and then show it in the console.
    web3.eth.personal.newAccount(config.mainpass, function (error, result) {
        if (!error) {
            console.log('New Account:', result);
            res.status(200).json({address: result});
        }
        else {
            console.log('createAccount error: ', error); // Should dump errors here
            res.status(400).json({error: error});
        }
    });
}

//to enable calls of personal functions, need to set --rpcapi eth,web3,personal when call geth
exports.sendTransaction = function(req, res) {
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
                    res.status(200).json({hash: hash});
                }
                else {
                    console.log('error: ', err);
                    res.status(400).json({error: error});
                }
            })
        }
        else {
            console.log('we have a promblem: ', error); // Should dump errors here
            res.status(400).json({error: error});
        }
    });
}

exports.getUpdatedTransactions = function(req, res) {
    var blocknum = req.body.blocknum;

    var lastblock = web3.eth.getBlockNumber(async  function(error, number) {
        //console.log("lastblock= ", number);

        if (!error) {
            try {
                var blocks = [];
                for (let i = blocknum; i <= number; i ++) {
                    var blockdata = await web3.eth.getBlock(i, true);
                    blocks = blocks.concat(blockdata.transactions);
                }

                res.status(200).json({lastblock: number, data: blocks});
            }
            catch(e) {
                console.log('we have a promblem: ', e); // Should dump errors here
                res.status(400).json({error: e});
            }
        }
        else {
            console.log('we have a promblem: ', error); // Should dump errors here
            res.status(400).json({error: error});
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
*   Reward is Ether unit
*/
exports.blocklist = function(req, res) {
    var start_height = req.body.start_height;
    var count = req.body.count;

    web3.eth.getBlockNumber(async  function(error, number) {
        if (!error) {
            try {
                console.log("last number " + number);
                var blocks = [];
                for (let i = blocknum; i <= number && i < blocknum + count; i ++) {
                    var blockdata = await web3.eth.getBlock(i, true);
                    
                    var Height = blockdata.number;
                    var Age = now - blockdata.timestamp;
                    var txn = blockdata.transactions.lenght;
                    var Uncles = blockdata.uncles.lenght;
                    var Miner = blockdata.miner;
                    var GasUsed = blockdata.gasUsed;
                    var GasLimit = blockdata.gasLimit;
                    
                    var Reward = 0;
                    for (let j = 0; j < txn; j ++) {
                        let hash = blockdata.transactions[j];
                        let txnInfo = await web3.eth.getTransaction(hash);
                        Reward += txnInfo.gasPrice / 1000000000;
                    }
                    var GasPrice = txn ? Reward / txn: 0;
                    Reward = Reward / 1000000000;

                    blocks.push({
                        Height: Height,
                        Age: Age,
                        txn: txn,
                        Uncles: Uncles,
                        Miner: Miner,
                        GasUsed: GasUsed,
                        GasLimit: GasLimit,
                        GasPrice: GasPrice,
                        Reward: Reward
                    });
                }

                console.log("blocks: ", blocks);

                res.status(200).json({data: blocks});
            }
            catch(e) {
                console.log('blocklist: we have a promblem: ', e); // Should dump errors here
                res.status(400).json({error: e});
            }
        }
        else {
            console.log('getBlockNumber: we have a promblem: ', error); // Should dump errors here
            res.status(400).json({error: error});
        }
    });

}
