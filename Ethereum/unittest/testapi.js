var EthereumController = require('../controllers/ethereum');
var Web3 = require('web3');

// Show Web3 where it needs to look for a connection to Ethereum.
var config = require('../config/common').info;
var web3 = new Web3(new Web3.providers.HttpProvider(config.provider));


function getblockTest(blocknum, count) {
    console.log("------------ test blocklist API -------------");

    web3.eth.getBlockNumber(async  function(error, number) {
        if (!error) {
            try {
                console.log("last number " + number);
                var blocks = [];
                for (let i = blocknum; i <= number && i < blocknum + count; i ++) {
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
                    for (let j = 0; j < txn; j ++) {
                        let hash = blockdata.transactions[j].hash;
                        let gasprice = blockdata.transactions[j].gasPrice;
                        let transaction = await web3.eth.getTransactionReceipt(hash);

                        let price = gasprice * transaction.gasUsed;
			            gas += transaction.gasUsed;
                        Reward += price / 1000000000;
                    }

                    var GasPrice = txn ? Reward / gas: 0;
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

function latestblocks(count) {

    web3.eth.getBlockNumber(async  function(error, number) {
        if (!error) {
            try {
                console.log("last number " + number);
                
                if (count > number + 1)
                    count = number + 1;
                
                var blocks = [];
                for (let i = number; i > number - count; i --) {
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
                    for (let j = 0; j < txn; j ++) {
                        let hash = blockdata.transactions[j].hash;
                        let gasprice = blockdata.transactions[j].gasPrice;
                        let transaction = await web3.eth.getTransactionReceipt(hash);

                        let price = gasprice * transaction.gasUsed;
                        gas += transaction.gasUsed;
                        Reward += price / 1000000000;
                    }

                    var GasPrice = txn ? Reward / gas: 0;
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

getblockTest(3174639, 40);
latestblocks(20);