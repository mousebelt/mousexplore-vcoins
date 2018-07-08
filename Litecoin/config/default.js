var rpc = require("json-rpc2");
var localNode = rpc.Client.$create(
  "18332", // RPC_PORT
  "127.0.0.1", // RPC_HOST
  "rpcuser", // RPC_USER
  "pwd" // RPC_PASS
);

config = {
  port: 80,
  localNode,
  db: "mongodb://localhost:27017/litecoin-db",

  TX_CRON_TIME: 200, //if we decrease this to 100ms, cronservice has trouble after some time.
};
module.exports = config;
