var StellarSdk = require('stellar-sdk');
var runtype = process.env.RUN_TYPE;

if (runtype == "test") {
    StellarSdk.Network.useTestNetwork();
}
else {
	StellarSdk.Network.usePublicNetwork();
}

var server = new StellarSdk.Server('http://127.0.0.1:11626', {allowHttp: true});

    server.transactions()
    .call().then(function(r){ console.log(r); });