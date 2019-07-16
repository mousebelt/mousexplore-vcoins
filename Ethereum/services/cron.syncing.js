const Web3 = require('web3');
const schedule = require('node-schedule');
const config = require('../config');

const web3 = new Web3(new Web3.providers.HttpProvider(config.provider));
const ServiceinfoModel = require('../model/serviceinfo');

function startCron() {
  web3.eth.getBlockNumber((error, lastblock) => {
    if (!error) {
      ServiceinfoModel.findOne()
        .then((row) => {
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
