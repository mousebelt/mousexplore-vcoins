var StellarSdk = require('stellar-sdk');
var runtype = process.env.RUN_TYPE;

if (runtype == "test") {
    StellarSdk.Network.useTestNetwork();
}

var server = new StellarSdk.Server('http://127.0.0.1:11626', {allowHttp: true});
// var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

exports.getBalance = function(req, res) {
    var addr = req.params.address;

    // the JS SDK uses promises for most actions, such as retrieving an account
    server.loadAccount(addr).then(function(account) {
      console.log('Balances for account: ' + addr);
      account.balances.forEach(function(balance) {
        console.log('Type:', balance.asset_type, ', Balance:', balance.balance);
      });
    });
}

/*
* create account.
*
* For main net, in order to prevent people from making a huge number of unnecessary accounts, 
* each account must have a minimum balance of 1 lumen (lumens are the built-in currency of the Stellar network).
* This can be done through any exchange.
*
* for testnet, can get this from Friendbot
*
* Can get keypair from public key or secret
* Keypair.fromPublicKey
* Keypair.fromSecret
* Keypair.fromRawEd25519Seed
*/
exports.createAccount = function(req, res) {
    console.log("createAccount");

    var pair = StellarSdk.Keypair.random();

    console.log("Secret is ", pair.secret());
    console.log("PublicKey is ", pair.publicKey());

    if (runtype == "test") {
        var request = require('request');
        request.get({
            url: 'https://friendbot.stellar.org',
            qs: { addr: pair.publicKey() },
            json: true
        }, function(error, response, body) {
            if (error || response.statusCode !== 200) {
                console.error('ERROR!', error || body);
            }
            else {
                console.log('SUCCESS! You have a new account :)\n', body);
            }
        });
    }
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

exports.getTransactions = function(req, res) {
    server.transactions()
    .forAccount('3f53908cc5306ec31469f89b22da22a41feee5d439b93e652613fc667989bd17')
    .call().then(function(r){ console.log(r); });
    server.transactions()
    .call().then(function(r){ console.log(r); });
}