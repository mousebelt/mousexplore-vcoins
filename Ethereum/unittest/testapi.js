var EthereumController = require('../controllers/ethereum');
var Web3 = require('web3');

// Show Web3 where it needs to look for a connection to Ethereum.
var config = require('../config/common').info;
var web3 = new Web3(new Web3.providers.HttpProvider(config.provider));


function getblockTest() {
    console.log("------------ test blocklist API -------------");

    var blocknum = 3168614;
    var count = 100;
    web3.eth.getBlockNumber(async  function(error, number) {
        if (!error) {
            try {
                console.log("last number " + number);
                var blocks = [];
                for (let i = blocknum; i <= number && i < blocknum + count; i ++) {
                    var blockdata = await web3.eth.getBlock(i, true);
                    
                    var Height = blockdata.number;
                    var Age = Date.now() - blockdata.timestamp;
                    var txn = blockdata.transactions.length;
                    var Uncles = blockdata.uncles.length;
                    var Miner = blockdata.miner;
                    var GasUsed = blockdata.gasUsed;
                    var GasLimit = blockdata.gasLimit;
                    
                    var Reward = 0;
                    for (let j = 0; j < txn; j ++) {
                        let price = blockdata.transactions[j].gasPrice;
                        Reward += price / 1000000000;
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
            }
            catch(e) {
                console.log('blocklist: we have a promblem: ', e); // Should dump errors here
            }
        }
        else {
            console.log('getBlockNumber: we have a promblem: ', error); // Should dump errors here
        }
    });
}

getblockTest();