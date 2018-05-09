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
		if (cronServiceInfo) {
			lastCheckedBlock = cronServiceInfo.lastblock;
			lastCheckedIndex = cronServiceInfo.lastTxnIndex;
			console.log("Last checked block number is " + lastCheckedBlock);
			console.log("Last checked txn index is " + lastCheckedIndex);
		}
	}
	catch(e) {
		console.log("getLastCheckedBlock error: ", e);
	}
}

function saveCronServiceInfo() {
	ServiceInofModel.findOne(function(e, info) {
		if (!e) {
			if (info) {
	        	info.set({lastblock: lastCheckedBlock, lastTxnIndex: lastCheckedIndex});
	        }
	        else {
	        	info = new ServiceInofModel({lastblock: lastCheckedBlock, lastTxnIndex: lastCheckedIndex});
	        }
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

                        let fee = gasprice * txnReceipt.gasUsed;

                        var newTxn = new TransactionModel({
                        	hash: hash,
                        	from: from,
                        	to: to,
                        	value: value,
                        	fee: fee,
                        	timestamp: timestamp
                        });

                        await newTxn.save();

                        if (lastCheckedBlock != i || lastCheckedIndex != j) {
                        	console.log("Updating block: " + i);
							lastCheckedBlock = i;
	                        lastCheckedIndex = j;

							await saveCronServiceInfo();
                        }
                    }

                    if (lastCheckedBlock != i || lastCheckedIndex != -1) {
                    	console.log("Updating block: " + i);
						lastCheckedBlock = i;
                        lastCheckedIndex = -1;

						await saveCronServiceInfo();
                    }
    
                }
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


async function transactionService() {
	await CheckUpdatedTransactions();
	setTimeout(transactionService, config.CRON_TIME_INTERVAL);
}

exports.start_cronService = async function() {
	console.log("Start ethereum cron service");
	await getLastCheckedBlock();

	transactionService();
}