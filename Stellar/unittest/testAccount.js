var StellarSdk = require('stellar-sdk');
var runtype = process.env.RUN_TYPE;

if (runtype == "test") {
    StellarSdk.Network.useTestNetwork();
}
else {
	StellarSdk.Network.usePublicNetwork();
}

var server = new StellarSdk.Server('http://127.0.0.1:8000', {allowHttp: true});

    server.ledgers()
    .limit(10)
    .order("desc")
    .call().then(function(r){ console.log(r); });