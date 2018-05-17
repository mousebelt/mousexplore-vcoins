var rpc = require("json-rpc2");
var localNode = rpc.Client.$create(
  "18332", // RPC_PORT
  "127.0.0.1", // RPC_HOST
  "rpcuser", // RPC_USER
  "pwd" // RPC_PASS
);

module.exports = {
  port: 2001,
  localNode,
  db: "mongodb://localhost:27017/litecoindb",

  // CRON_SLEEP_TIME: 500,	//if we decrease this to 100ms, cronservice has trouble after some time.
  TX_CRON_TIME: 5000, //if we decrease this to 100ms, cronservice has trouble after some time.
  TX_CRON_BLOCK_COUNT: 100, // block count per one running

  ADDR_CRON_TIME: 1000, //if we decrease this to 100ms, cronservice has trouble after some time.
  ADDR_CRON_TX_COUNT: 100 // tx count per one running
};
