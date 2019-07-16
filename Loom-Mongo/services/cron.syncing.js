const schedule = require('node-schedule');
const config = require('../config');
const ServiceinfoModel = require('../models/serviceInfo');
const { web3 } = require('../modules/loom');
const { SYNCING_MONITOR_INFO_KEY } = require('../modules/constants');

function startCron() {
  web3.eth.getBlockNumber((error, lastblock) => {
    const key = SYNCING_MONITOR_INFO_KEY;
    if (!error) {
      ServiceinfoModel.findOneAndUpdate({ key }, { key, data: lastblock, updated: Date.now() }, { upsert: true }, (err, doc) => { // eslint-disable-line
        // eslint-disable-next-line no-console
        if (err) console.log(err);
      });
    }
  });
}

module.exports = function () {
  schedule.scheduleJob(`*/${config.CRON_SYNCING_MINUTES} * * * *`, () => {
    startCron();
  });
};
