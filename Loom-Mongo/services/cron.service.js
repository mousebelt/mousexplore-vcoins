const cronSyncing = require('./cron.syncing');
const cronTxScan = require('./cron.parallel.tx.scan');
const cronStardustGame = require('./cron.stardust.cache');

function startCron() {
  cronSyncing();
  cronTxScan();
  cronStardustGame();
}
module.exports = function () {
  startCron();
};
