var rpc = require("json-rpc2");
var client = rpc.Client.$create(
  "10332", // RPC_PORT
  "127.0.0.1", // RPC_HOST
);

var neo = require('neo-api');
const localNode = neo.node('http://localhost:10332');

module.exports = {
  localNode,
  client,

  port: 8080,

  db: "mongodb://localhost:27017/neo-db",

  CRON_TIME_INTERVAL: 100,	//if we decrease this to 100ms, cronservice has trouble after some time.
  CHECK_PARELLEL_BLOCKS: 10, //thread count for parellel block processing
  TICKER_BLOCK: 50
}
