const config = {
  port: 8080,
  db: 'mongodb://localhost:27017/ethereum-db',
  mainpass: 'vCoinEthpass2018',
  CRON_TIME_INTERVAL: 200,	// if we decrease this to 100ms, cronservice has trouble after some time.
  CHECK_PARELLEL_BLOCKS: 10, // thread count for parellel block processing
  TICKER_BLOCK: 50,
  CRON_SYNCING_MINUTES: 30, // minutes
};
module.exports = config;
