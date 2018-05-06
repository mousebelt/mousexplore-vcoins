var EthereumController = require('../controllers/ethereum');
var Web3 = require('web3');

// Show Web3 where it needs to look for a connection to Ethereum.
var config = require('../config/common').info;
var web3 = new Web3(new Web3.providers.HttpProvider(config.providerTest));


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
    console.log("------------ test latestblocks API -------------");

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

async function getblockdetail(blockNumber) {
    console.log("------------ test getblockdetail API -------------");
 
    try {
        var blockdata = await web3.eth.getBlock(blockNumber, true); 
        
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
    }
    catch(e) {
        console.log('blocklist: we have a promblem: ', e); // Should dump errors here
    }
}

async function getTransactions(blockNumber) {

    try {
        var blockdata = await web3.eth.getBlock(blockNumber, true); 
        var timeStamp = blockdata.timestamp;
        var transactions = blockdata.transactions;

        var txnlist = [];
        for (let i = 0; i < transactions.length; i ++) {
            let transaction = transactions[i];
            let fee = transaction.gas * transaction.gasPrice;
            fee = fee / 1e18;

            txnlist.push({
                blockNumber: blockNumber,
                timeStamp: timestamp,
                txHash: transaction.hash,
                from: transaction.from,
                to: transaction.to,
                value: transaction.value,
                txFee: fee
            })
        }

        console.log("data: ", txnlist);
    }
    catch(e) {
        console.log('blocklist: we have a promblem: ', e); // Should dump errors here
    }
}

// getblockTest(3174639, 40);
// latestblocks(20);
// getblockdetail(3174639);
getTransactions(3179897);