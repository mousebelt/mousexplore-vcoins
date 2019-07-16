const schedule = require('node-schedule');
const config = require('../config');
const ServiceinfoModel = require('../model/serviceinfo');

const { client } = config;

function startCron() {
  try {
    return client.call('getblockcount', [], (err, lastblock) => {
      if (!err) {
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
  } catch (error) {
    // eslint-disable-next-line no-console
    return console.log(error);
  }
}

module.exports = function () {
  schedule.scheduleJob(`*/${config.CRON_SYNCING_MINUTES} * * * *`, () => {
    startCron();
  });
};
