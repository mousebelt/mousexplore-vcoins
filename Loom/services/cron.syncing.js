const config = require('../config');
const schedule = require('node-schedule');

function startCron() {
}

module.exports = function () {
  console.log('syncing monitor cron is starting ...');
  schedule.scheduleJob(`*/${config.CRON_SYNCING_MINUTES} * * * *`, () => {
    startCron();
  });
};
