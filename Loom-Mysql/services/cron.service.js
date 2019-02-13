const cronSyncing = require('./cron.syncing');
const cronTxScan = require('./cron.parallel.tx.scan');
const cronStardustGame = require('./cron.stardust.game');

function startCron() {
  cronSyncing();
  cronTxScan();
  cronStardustGame();
}
module.exports = function () {
  setTimeout(startCron, 5 * 1000); // Wait 5 seconds while creating models
};
