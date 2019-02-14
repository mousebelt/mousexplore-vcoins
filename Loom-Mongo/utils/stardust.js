const { stardustApiUrl } = require('../config');
const stardust = require('../stardust-api/libraries/stardust');
const API = stardust.stardustAPI(stardustApiUrl);
module.exports = {
  stardust, API
};
