const { stardustApiUrl } = require('../config');
const stardust = require('../stardust-api');
const API = stardust.stardustAPI(stardustApiUrl);
module.exports = {
  stardust, API
};
