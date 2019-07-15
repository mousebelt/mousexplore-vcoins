module.exports = {
  app: {
    secret: process.env.APP_SECRET,
    port: Number(process.env.APP_PORT),
  },
  db: process.env.DATABASE_URI,
  client: {
    chainId: process.env.CLIENT_CHAIN_ID,
    writeUrl: process.env.CLIENT_WRITE_URL,
    readUrl: process.env.CLIENT_READ_URL,
  },
  stardustApiUrl: process.env.STARDUST_API_URL,

  CRON_TX_SCAN_INTERVAL: 500, // if we decrease this to 100ms, cron.service has trouble after some time.
  PARALLEL_BLOCK_COUNT: 10, // thread count for parallel block processing
  TICKER_BLOCK_COUNT: 10,
  CRON_SYNCING_MINUTES: 30,
  CRON_STARDUST_CACHE_MINUTES: 1,
};
