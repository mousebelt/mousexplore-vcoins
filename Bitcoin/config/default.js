const rpc = require('json-rpc2');

const localNode = rpc.Client.$create(
  '18332', // RPC_PORT
  '127.0.0.1', // RPC_HOST
  'rpcuser', // RPC_USER
  'pwd' // RPC_PASS
);

const config = {
  port: 8080,
  localNode,

  CRON_TIME_INTERVAL: 100, // if we decrease this to 100ms, cronservice has trouble after some time.
  CHECK_PARELLEL_BLOCKS: 10, // thread count for parellel block processing
  TICKER_BLOCK: 50,
  CRON_SYNCING_MINUTES: 30, // minutes
};
module.exports = config;
