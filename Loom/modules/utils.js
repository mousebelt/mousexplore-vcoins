const _ = require('lodash');
const config = require('../config');

exports.isOutOfSyncing = (curMillis) => {
  const limit = config.CRON_SYNCING_MINUTES * 60 * 1000;
  const diff = Date.now - curMillis;
  return diff > limit;
};

exports.reducedErrorMessage = function (errorDetails) {
  if (errorDetails.errors && errorDetails.errors.length > 0) {
    return _.get(errorDetails, 'errors[0].message', 'We have some technical difficulties. Please try again.');
  }
  return _.get(errorDetails, 'message', 'We have some technical difficulties. Please try again.');
};
