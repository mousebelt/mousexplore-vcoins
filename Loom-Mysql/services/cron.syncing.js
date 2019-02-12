const config = require('../config');
const schedule = require('node-schedule');
const models = require('../models');
const { web3 } = require('../utils/loom');
const { SYNCING_MONITOR_INFO_KEY } = require('../utils/constants');

function startCron() {
  web3.eth.getBlockNumber((error, lastblock) => {
    if (!error) {
      const key = SYNCING_MONITOR_INFO_KEY;
      models.service_info.upsert(
        { key, data: lastblock },
        { key }
      );
    }
  });
}

module.exports = function () {
  schedule.scheduleJob(`*/${config.CRON_SYNCING_MINUTES} * * * *`, () => {
    startCron();
  });
};
