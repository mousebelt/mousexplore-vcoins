var config = require("../config/common.js").info;
var web3 = require('../config/common').web3;

var TransactionModel = require("../model/transactions");
var TokenModel = require("../model/tokens");
var ServiceInofModel = require("../model/serviceinfo");


var lastCheckedBlock = 0;
var lastCheckedIndex = 0;
var cronServiceInfo = null;

async function getLastCheckedBlock() {
	try {
		cronServiceInfo = await ServiceInofModel.findOne();
		lastCheckedBlock = cronServiceInfo.lastblock;
		lastCheckedIndex = cronServiceInfo.lastTxnIndex;
		console.log("Last checked block number is " + lastCheckedBlock);
		console.log("Last checked txn index is " + lastCheckedIndex);
	}
	catch(e) {
		console.log("getLastCheckedBlock error: ", e);
	}
}

function saveCronServiceInfo() {
	ServiceInofModel.findOne(function(e, info) {
		if (!e) {
	        info.set({lastblock: lastCheckedBlock, lastTxnIndex: lastCheckedIndex});
	        info.save();
	    }
	    else {
	    	console.log('saveCronServiceInfo:error: ', e); // Should dump errors here
	    }
	});
	    
}

function CheckUpdatedTransactions() {
    web3.eth.getBlockNumber(async  function(error, number) {
        if (!error) {
            try {
                console.log("last number " + number);
                
                for (let i = lastCheckedBlock; i <= number && i < lastCheckedBlock + config.CRON_TREAT_MAX_BLOCKS; i ++) {
                    var blockdata = await web3.eth.getBlock(i, true); 
                    
                    var txnCount = blockdata.transactions.length;
                    
                    for (let j = lastCheckedIndex + 1; j < txnCount; j ++) {
                    	let transaction = blockdata.transactions[j];
                        let hash = transaction.hash;
                        let from = transaction.from;
                        let to = transaction.to;
                        let value = transaction.value;
	                    var timestamp = blockdata.timestamp;

                        let gasprice = transaction.gasPrice;
                        let txnReceipt = await web3.eth.getTransactionReceipt(hash);

                        let fee = gasprice * transaction.gasUsed;

                        var newTxn = TransactionModel.new({
                        	hash: hash,
                        	from: from,
                        	to: to,
                        	value: value,
                        	fee: fee,
                        	timestamp: timestamp
                        });

                        await newTxn.save();

						lastCheckedBlock = i;
                        lastCheckedIndex = j;

						await saveCronServiceInfo();
                    }

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


function transactionService() {
	CheckUpdatedTransactions();
	setTimeout(transactionService, config.CRON_TIME_INTERVAL);
}

exports.start_cronService = function() {
	console.log("Start ethereum cron service");
	getLastCheckedBlock();

	transactionService();
}