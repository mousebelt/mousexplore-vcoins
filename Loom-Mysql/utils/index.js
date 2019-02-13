const moment = require('moment');
const _ = require('lodash');
const bcrypt = require('bcrypt-nodejs');
const config = require('../config');

exports.generateHash = (pwd) => (bcrypt.hashSync(pwd, bcrypt.genSaltSync(8), null));

exports.getMissingFields = (data, fields) => {
  const keys = _.keys(data);
  return _.difference(fields, keys);
};

exports.validateEmail = email => {
  // eslint-disable-next-line max-len
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

exports.getPageParams = (data) => {
  const defaultPage = 1;
  const defaultPerPage = 10;
  let page = Number(data.page);
  let perPage = Number(data.perPage);

  if (isNaN(page)) page = defaultPage;
  if (isNaN(perPage)) perPage = defaultPerPage;

  page = Math.max(page, defaultPage);
  perPage = Math.min(perPage, defaultPerPage);

  return { page, perPage };
};

exports.isOutOfSyncing = (updatedAt) => {
  const expire = moment(updatedAt, 'YYYY-MM-DD HH:mm:ss').add(config.CRON_SYNCING_MINUTES, 'minutes');
  return moment().isAfter(expire);
};

exports.reducedErrorMessage = function (errorDetails) {
  if (errorDetails.errors && errorDetails.errors.length > 0) {
    return _.get(errorDetails, 'errors[0].message', 'We have some technical difficulties. Please try again.');
  }
  return _.get(errorDetails, 'message', 'We have some technical difficulties. Please try again.');
};

exports.getPageParams = (data) => {
  const defaultPage = 1;
  const defaultPerPage = 10;
  let page = Number(data.page);
  let perPage = Number(data.perPage);

  if (isNaN(page)) page = defaultPage;
  if (isNaN(perPage)) perPage = defaultPerPage;

  page = Math.max(page, defaultPage);
  perPage = Math.min(perPage, defaultPerPage);

  return { page, perPage };
};
