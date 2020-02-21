var WanchainController = require('../controllers/wanchain');
var Web3 = require('web3');

// Show Web3 where it needs to look for a connection to Wanchain.
var config = require('../config');
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
        var timestamp = blockdata.timestamp;
        var transactions = blockdata.transactions;

        var txnlist = [];
        for (let i = 0; i < transactions.length; i ++) {
            let transaction = transactions[i];

            let txreceipt = await web3.eth.getTransactionReceipt(hash);

            let fee = txreceipt.gasUsed * transaction.gasPrice;
            fee = fee / 1e18;

            txnlist.push({
                blockNumber: blockNumber,
                timeStamp: timestamp,
                txHash: transaction.hash,
                from: transaction.from,
                to: transaction.to,
                value: transaction.value / 1e18,
                txFee: fee
            })
        }

        console.log("data: ", txnlist);
    }
    catch(e) {
        console.log('blocklist: we have a promblem: ', e); // Should dump errors here
    }
}

function getTransactionList(offset, count) {

    web3.eth.getBlockNumber(async  function(error, number) {
        if (!error) {
            try {
                console.log("last number " + number);
                
                var txnlist = [];
                for (let i = number; i > 0; i --) {
                    var blockdata = await web3.eth.getBlock(i, true); 
                    
                    var blocknumber = blockdata.number;
                    var timestamp = blockdata.timestamp;
                    var txn = blockdata.transactions.length;

                    if (txn <= offset) {
                        offset -= txn;
                        continue;
                    }
                    
                    for (let j = txn - 1; j > 0; j --) {
                        offset --;
                        if (offset > 0)
                            continue;

                        let transaction = blockdata.transactions[j];

                        let hash = transaction.hash;
                        let from = transaction.from;
                        let to = transaction.to;
                        let value = transaction.value / 1e18;

                        console.log("tx=" +hash + " gasprice =" + transaction.gasprice + " gas =" + transaction.gas);
            
                        let txreceipt = await web3.eth.getTransactionReceipt(hash);

                        console.log("receipt gas =" + txreceipt.gasUsed);

                        let fee = txreceipt.gasUsed * transaction.gasPrice;
                        fee = fee / 1e18;

                        txnlist.push({
                            blockNumber: blocknumber,
                            timeStamp: timestamp,
                            txHash: transaction.hash,
                            from: transaction.from,
                            to: transaction.to,
                            value: transaction.value / 1e18,
                            txFee: fee
                        })

                        count --;
                        if (count <= 0)
                            break;
                    }

                    if (count <= 0)
                            break;

                }

                console.log("txnlist: ", txnlist);
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

function getTransactionInfo(txHash) {

    web3.eth.getTransaction(txHash, async  function(error, transaction) {
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

// getblockTest(3174639, 40);
// latestblocks(20);
// getblockdetail(3174639);
// getTransactions(3179897);
//getTransactionList(5, 20);
getTransactionInfo("0xcdcab7444862ccedbbe10409ef0de3c2a663283edf164ad04f4296012cd5949c");