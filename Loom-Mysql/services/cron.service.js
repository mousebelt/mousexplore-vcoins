const cronSyncing = require('./cron.syncing');
const cronTxScan = require('./cron.parallel.tx.scan');
module.exports = function () {
  cronSyncing();
  cronTxScan();
};
