var Web3 = require('web3');

var ganache = require("ganache-cli");
var config = require('../config/common').info;
web3 = new Web3(new Web3.providers.HttpProvider(config.provider));//ganache.provider()

exports.testTransaction = function (from, to, value) {

    // Use Wb3 to get the balance of the address, convert it and then show it in the console.
    web3.eth.personal.newAccount(config.mainpass, function (error, newaddr) {
        if (!error) {
            console.log('New Account:', newaddr);
            /*
            // Use Wb3 to get the balance of the address, convert it and then show it in the console.
            web3.eth.personal.unlockAccount(from, config.mainpass, function (error, result) {
                if (!error) {
                    console.log('Unlocked Account: ', result);
                    web3.eth.sendTransaction({
                        from: from,
                        to: newaddr,
                        value: web3.utils.toWei(value),
                    }, function (err, hash) {
                        if (!err) {
                            console.log("Send transaction: ", hash);
                            web3.eth.getBalance(from, function (error, result) {
                                if (!error) {
                                    console.log("Send getBalance: ", result);
                                }
                            });
                        }
                        else {
                            console.log('error: ', err);
                        }
                    });
                    
                }
                else {
                    console.log('we have a promblem: ', error); // Should dump errors here
                }
            });*/
        }
        else {
            console.log('we have a promblem: ', error); // Should dump errors here
        }
    });
}

exports.getUpdatedTransactions = function (blocknum) {
    var lastblock = web3.eth.getBlockNumber(async function (error, number) {
        console.log("lastblock= ", number);

        if (!error) {

            try {
                var blocks = [];
                for (let i = blocknum; i <= number; i++) {
                    var blockdata = await web3.eth.getBlock(i, true);
                    blocks = blocks.concat(blockdata.transactions);
                }

                console.log("transactions: ", blocks);
            }
            catch (e) {
                console.log('we have a promblem: ', e); // Should dump errors here
            }
        }
        else {
            console.log('we have a promblem: ', error); // Should dump errors here
        }
    });

}

exports.loadAccounts = function () {
    console.log("loadAccounts with password ", config.mainpass);
    web3.eth.personal.importRawKey("0x573d730f73950d35f20662a68c14e6602c0d8a8f639b1cf8b8e50d483046af8b", config.mainpass);
    web3.eth.personal.importRawKey("0xfb96501ccc206cc79a01eef49349b2187a1ccf5726d5dfc716d06e6cf6190ef9", config.mainpass);
    web3.eth.personal.importRawKey("0x199229b78ef01c03c33a725df4656970f8e0d873c8d910b0971e3461987763a1", config.mainpass);
}