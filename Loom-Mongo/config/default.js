const config = {
  CRON_TX_SCAN_INTERVAL: 500,	// if we decrease this to 100ms, cron.service has trouble after some time.
  PARALLEL_BLOCK_COUNT: 10, // thread count for parallel block processing
  TICKER_BLOCK_COUNT: 10,
  CRON_SYNCING_MINUTES: 30,
  CRON_STARDUST_CACHE_MINUTES: 1,
};
module.exports = config;
