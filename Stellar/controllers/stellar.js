var StellarSdk = require('stellar-sdk');
var runtype = process.env.RUN_TYPE;

if (runtype == "test") {
    StellarSdk.Network.useTestNetwork();
}

// var server = new StellarSdk.Server('http://127.0.0.1:11626', {allowHttp: true});
var server = new StellarSdk.Server('http://127.0.0.1:8000', {allowHttp: true});
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


/*
* Get latest ledger list.
* @param start_height number of block from where to get block list.
* @param count count of list to get.
* @return list of ledger information same as the https://steexp.com/ledgers
*/
exports.getLatestLedgers = function(req, res) {
    server.transactions()
    .forLedger(1400)
    .call().then(function(r){ console.log(r); });

    // server.ledgers()
    // .call()
    // .then(function (ledgerResult) {
    //     // page 1
    //     console.log(ledgerResult)
    //     // console.log(ledgerResult.records)
    //     // return ledgerResult.next()
    // })
    // .then(function (ledgerResult) {
    //     // page 2
    //     // console.log(ledgerResult.records)
    // })
    // .catch(function(err) {
    //     console.log(err)
    // })
}