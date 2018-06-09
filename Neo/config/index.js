var rpc = require("json-rpc2");
var client = rpc.Client.$create(
  "10332", // RPC_PORT
  "127.0.0.1", // RPC_HOST
//   "rpcuser", // RPC_USER
//   "pwd" // RPC_PASS
);

var neo = require('neo-api');
const localNode = neo.node('http://localhost:10332');

module.exports = {
    localNode,
    client,

    db: "mongodb://localhost:27017/neo-db",

    // CRON_SLEEP_TIME: 500,	//if we decrease this to 100ms, cronservice has trouble after some time.
    TX_CRON_TIME: 1000,	//if we decrease this to 100ms, cronservice has trouble after some time.
    TX_CRON_BLOCK_COUNT: 100, // block count per one running

    ADDR_CRON_TIME: 1000,	//if we decrease this to 100ms, cronservice has trouble after some time.
    ADDR_CRON_TX_COUNT: 100 // tx count per one running
}
