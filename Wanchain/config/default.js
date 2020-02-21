var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));

const config = {
  web3,
  port: 8080,

  db: "mongodb://localhost:27017/wanchain-db",
  mainpass: "vCoinEthpass2018",
  provider: "http://127.0.0.1:8545",
  CRON_TIME_INTERVAL: 100,	//if we decrease this to 100ms, cronservice has trouble after some time.
  CHECK_PARELLEL_BLOCKS: 10, //thread count for parellel block processing
  TICKER_BLOCK: 50
}
module.exports = config;
