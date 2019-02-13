const cronSyncing = require('./cron.syncing');
const cronTxScan = require('./cron.parallel.tx.scan');

function startCron() {
  cronSyncing();
  cronTxScan();
}
module.exports = function () {
  setTimeout(startCron, 5 * 1000); // Wait 5 seconds while creating models
};
