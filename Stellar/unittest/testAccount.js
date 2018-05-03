// Setup basic express server
var stellarController = require('../controllers/stellar');

//stellarController.getTransactions();
//stellarController.createAccount();
// var req = {params: {address: "3f53908cc5306ec31469f89b22da22a41feee5d439b93e652613fc667989bd17"}};
// stellarController.getBalance(req);

var StellarSdk = require('stellar-sdk')
var server = new StellarSdk.Server('http://127.0.0.1:11626', {allowHttp: true});
var accountId = '3f53908cc5306ec31469f89b22da22a41feee5d439b93e652613fc667989bd17';

    server.transactions()
    .forAccount('3f53908cc5306ec31469f89b22da22a41feee5d439b93e652613fc667989bd17')
    .call().then(function(r){ console.log(r); });
    server.transactions()
    .call().then(function(r){ console.log(r); });


