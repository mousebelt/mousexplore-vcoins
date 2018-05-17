const  _ = require("lodash");
const rpc = require("json-rpc2");

const config = {
  development: {
    PORT: 8001,

    BTC_RPC_HOST: "127.0.0.1",
    BTC_RPC_PORT: 18332,
    BTC_RPC_USER: "rpcuser",
    BTC_RPC_PASS: "pwd",

    db: "mongodb://localhost:27017/bitcoindb"
    // // CRON_SLEEP_TIME: 500,	//if we decrease this to 100ms, cronservice has trouble after some time.
    // TX_CRON_TIME: 5000,	//if we decrease this to 100ms, cronservice has trouble after some time.
    // TX_CRON_BLOCK_COUNT: 100, // block count per one running
    // ADDR_CRON_TIME: 1000,	//if we decrease this to 100ms, cronservice has trouble after some time.
    // ADDR_CRON_TX_COUNT: 100 // tx count per one running
  },
  production: {
    PORT: 80,

    BTC_RPC_HOST: "127.0.0.1",
    BTC_RPC_PORT: 18332,
    BTC_RPC_USER: "rpcuser",
    BTC_RPC_PASS: "pwd",

    db: "mongodb://localhost:27017/bitcoindb"
    // // CRON_SLEEP_TIME: 500,	//if we decrease this to 100ms, cronservice has trouble after some time.
    // TX_CRON_TIME: 5000,	//if we decrease this to 100ms, cronservice has trouble after some time.
    // TX_CRON_BLOCK_COUNT: 100, // block count per one running
    // ADDR_CRON_TIME: 1000,	//if we decrease this to 100ms, cronservice has trouble after some time.
    // ADDR_CRON_TX_COUNT: 100 // tx count per one running
  }
};

exports.get = function get(env) {
  const defaults = config[env] || config.development;
  const client = rpc.Client.$create(
    defaults.BTC_RPC_PORT,
    defaults.BTC_RPC_HOST,
    defaults.BTC_RPC_USER,
    defaults.BTC_RPC_PASS
  );

  return _.merge({}, defaults, { client });
};
