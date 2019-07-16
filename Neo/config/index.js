const rpc = require('json-rpc2');
const neo = require('neo-api');

const client = rpc.Client.$create(
  '10332', // RPC_PORT
  '127.0.0.1', // RPC_HOST
);
const localNode = neo.node('http://localhost:10332');

module.exports = {
  localNode,
  client,
  port: 8080,
  db: 'mongodb://localhost:27017/neo-db',
  ADDR_CRON_TIME_INTERVAL: 100, // if we decrease this to 100ms, cronservice has trouble after some time.
  CRON_TIME_INTERVAL: 1000, // if we decrease this to 100ms, cronservice has trouble after some time.
  CHECK_PARELLEL_BLOCKS: 10, // thread count for parellel block processing
  TICKER_BLOCK: 50,
  CRON_SYNCING_MINUTES: 30, // minutes
};
