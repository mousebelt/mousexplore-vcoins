var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8555"));

exports.web3 = web3;

exports.info = {
	db: "mongodb://localhost:27017/ethertransactions",
    mainpass: "vCoinEthpass2018", 
    provider: "http://127.0.0.1:8555",
    CRON_TIME_INTERVAL: 5000,	//if we decrease this to 100ms, cronservice has trouble after some time.
    CRON_TREAT_MAX_BLOCKS: 100
}
