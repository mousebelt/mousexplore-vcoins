const config = require('../config');
const schedule = require('node-schedule');
const ServiceinfoModel = require('../model/serviceinfo');
const { web3 } = require('../modules/utils');

function startCron() {
  web3.eth.getBlockNumber((error, lastblock) => {
    if (!error) {
      ServiceinfoModel.findOne()
        .then(row => {
          if (!row) new ServiceinfoModel({ lastblock }).save();
          else {
            row.lastblock = lastblock;
            row.save();
          }
        }).catch(err => console.log); // eslint-disable-line
    }
  });
}

module.exports = function () {
  schedule.scheduleJob(`*/${config.CRON_SYNCING_MINUTES} * * * *`, () => {
    startCron();
  });
};
