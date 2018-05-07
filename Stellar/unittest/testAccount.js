var StellarSdk = require('stellar-sdk');
var runtype = process.env.RUN_TYPE;

if (runtype == "test") {
    StellarSdk.Network.useTestNetwork();
}

var server = new StellarSdk.Server('http://127.0.0.1:11626', {allowHttp: true});

    server.transactions()
    .forLedger(1400)
    .call().then(function(r){ console.log(r); });