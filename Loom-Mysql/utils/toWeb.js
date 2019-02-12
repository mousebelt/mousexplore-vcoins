const _ = require('lodash');

const userPublic = (details) => ({
  ..._.pick(details, [
    'id', 'managed', 'username', 'firstname', 'lastname',
  ])
});
const userPrivate = (details) => ({
  ..._.omit(details, [
    'password'
  ])
});
const companyPublic = (details) => ({
  ..._.pick(details, [
    'id', 'name', 'logo', 'url', 'supportUrl', 'createdAt'
  ])
});

module.exports = {
  userPublic,
  userPrivate,
  companyPublic,
};
