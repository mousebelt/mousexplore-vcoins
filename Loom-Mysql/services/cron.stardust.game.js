const { CRON_STARDUST_CACHE_MINUTES } = require('../config');
const schedule = require('node-schedule');
// const models = require('../models');
const { API } = require('../utils/stardust');

async function gameCacheRunner() {
  let games = [];

  try {
    const response = await API.getters.game.getAll();
    games = response.games;
    console.log(games);
  } catch (err) {
    console.log('Failed to get games data ( error: %s )', err.message);
  }

  if (games && games.length) {
    for (let i = 0; i < games.length; i++) {
      // const game = games[i];
    }
  }
}

module.exports = function () {
  schedule.scheduleJob(`*/${CRON_STARDUST_CACHE_MINUTES} * * * *`, () => {
    gameCacheRunner();
  });
};
