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

// Available Accounts
// ==================
// (0) 0x9e493e8e464e111943b24906edf542651ffb805a
// (1) 0xf60e5b498908952cd044b7afce2b1cb74739abc7
// (2) 0x5e6916a081a9c830aabf6c5994f6d0daf3d23c9f
// (3) 0x0fff489861c0bc08319f42bb0cd26c5e86ce90d9
// (4) 0xb6ed6541fa6861a9fb4e93ff337d6dd1cb541704
// (5) 0x0c0167eee81a213ca9b34f01fcf7fbfe8d334209
// (6) 0x09257484bc13c6c9d2c9023d5f93aff7ce39791d
// (7) 0xca6c141f994c0ea69b3d9612edb3ac8425a80e08
// (8) 0x15758dd417cf3791b475e194d2e68c4b3b9c38d1
// (9) 0x777cce716cee6f6052d6f52e98f006a5fa88a27b

// Private Keys
// ==================
// (0) 573d730f73950d35f20662a68c14e6602c0d8a8f639b1cf8b8e50d483046af8b
// (1) fb96501ccc206cc79a01eef49349b2187a1ccf5726d5dfc716d06e6cf6190ef9
// (2) 8c3f10b450fb15745fe02e249d275a0be5f90a4c9baa3fef6748f44dab225c7e
// (3) 887a8d6e527fa3abd563e7916f3d23e77698034e6de86b90a9f62c051c85f844
// (4) ae5e07ebd720fb812f65e602535f6706c5cb8a69698a6fa2f9461c48a15d278a
// (5) f2480b4b02935ef9c2e766ae007cad4664d0e981a65f480818512011c18aeda3
// (6) 5e8af28df6ed52cda0527f80a5a36d85cb009ed39c22e2fbe9d3101c85bfcc5c
// (7) 800de2b4b4514a1e4ebd61d5eb6baa10884d17b9f79036086fdfc898b8350b9a
// (8) f28849a71a00aed671985ef2a86e4fe9335bfa825860bd321fc6dbca1f39c385
// (9) 199229b78ef01c03c33a725df4656970f8e0d873c8d910b0971e3461987763a1

exports.loadAccounts = function () {
    console.log("loadAccounts with password ", config.mainpass);
    web3.eth.personal.importRawKey("0x573d730f73950d35f20662a68c14e6602c0d8a8f639b1cf8b8e50d483046af8b", config.mainpass);
    web3.eth.personal.importRawKey("0xfb96501ccc206cc79a01eef49349b2187a1ccf5726d5dfc716d06e6cf6190ef9", config.mainpass);
    web3.eth.personal.importRawKey("0x199229b78ef01c03c33a725df4656970f8e0d873c8d910b0971e3461987763a1", config.mainpass);
}