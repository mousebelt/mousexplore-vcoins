// define local node object
const config = require('../config');

exports.isOutOfSyncing = (curMillis) => {
  const limit = config.CRON_SYNCING_MINUTES * 60 * 1000;
  const diff = Date.now - curMillis;
  return diff > limit;
};
