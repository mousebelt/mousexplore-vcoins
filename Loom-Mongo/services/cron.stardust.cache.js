/* eslint-disable no-await-in-loop, no-console, no-plusplus, prefer-destructuring */
const fs = require('fs');
const path = require('path');
const schedule = require('node-schedule');
const Game = require('../models/game');
const Token = require('../models/token');
const Trade = require('../models/trade');
const { CRON_STARDUST_CACHE_MINUTES } = require('../config');
const { API } = require('../modules/stardust');
const { createLogger } = require('../modules/logger');

const logger = createLogger('cron.stardust.cache');

// Read whitelisted games
function getWhitelistedGames() {
  try {
    return JSON.parse(
      fs.readFileSync(path.resolve(__dirname, '../whitelist-games.json'), 'utf8')
    );
  } catch (err) {
    return {};
  }
}

// Sleep for a specified seconds
function delay(secs = 60) {
  return new Promise((resolve) => {
    setTimeout(resolve, secs * 1000);
  });
}

/**
 * Game data caching runner
 */
async function gameCacheRunner() {
  let games = [];
  const whitelistedGames = getWhitelistedGames();

  try {
    const response = await API.getters.game.getAll();
    games = response.data.games;
  } catch (err) {
    console.log('Failed to get games data ( error: %s )', err.message);
  }

  if (games && games.length) {
    for (let i = 0; i < games.length; i++) {
      const game = games[i];
      const query = { gameAddr: game.gameAddr };
      game.isWhitelisted = !!whitelistedGames[game.gameAddr];

      try {
        await Game.findOneAndUpdate(query, game, { upsert: true });
        // console.log('Cached a game data ( gameAddr: %s )', game.gameAddr);
      } catch (err) {
        console.log('Failed to save a game data ( gameAddr: %s, error: %s )', game.gameAddr, err.message);
      }
    }
  }
}

/**
 * Game items (tokens) caching runner
 */
async function tokenCacheRunner() {
  const whitelistedGames = getWhitelistedGames();
  const games = Object.keys(whitelistedGames).map(gameAddr => ({ gameAddr }));

  for (let i = 0; i < games.length; i++) {
    const { gameAddr } = games[i];
    let tokens = [];

    try {
      const response = await API.getters.token.getAll({ gameAddr });
      tokens = response.data.tokens;
    } catch (err) {
      console.log('Failed to get a game data ( gameAddr: %s, error: %s )', gameAddr, err.message);
    }

    if (tokens && tokens.length) {
      for (let j = 0; j < tokens.length; j++) {
        const token = tokens[i];
        const query = { gameAddr, tokenId: token.tokenId };
        try {
          await Token.findOneAndUpdate(query, token, { upsert: true });
          // console.log('Cached a game item ( gameAddr: %s, tokenId: %d )', gameAddr, token.tokenId);
        } catch (err) {
          console.log('Failed to save a game item ( gameAddr: %s, tokenId: %d, error: %s )', gameAddr, token.tokenId, err.message);
        }
      }
    }
    await delay(1); // Delay 1 second after getting items of a game.
  }
}

/**
 * Game trades caching runner
 */
async function tradeCacheRunner() {
  const whitelistedGames = getWhitelistedGames();
  const games = Object.keys(whitelistedGames).map(gameAddr => ({ gameAddr }));

  for (let i = 0; i < games.length; i++) {
    const { gameAddr } = games[i];
    let trades = [];

    try {
      const response = await API.getters.trade.getGameDetails({ gameAddr });
      trades = response.data.trades;
      logger.debug(trades);
    } catch (err) {
      console.log('Failed to get a game trades data ( gameAddr: %s, error: %s )', gameAddr, err.message);
    }

    if (trades && trades.length) {
      for (let j = 0; j < trades.length; j++) {
        const trade = trades[i];
        const query = { gameAddr, index: j };
        try {
          await Trade.findOneAndUpdate(query, { ...trade, index: j }, { upsert: true });
          logger.info('Cached a game trade ( gameAddr: %s, index: %d )', gameAddr, j);
        } catch (err) {
          logger.error('Failed to save a game trade ( gameAddr: %s, index: %d, error: %s )', gameAddr, j, err.message);
        }
      }
    }
    await delay(1); // Delay 1 second after getting items of a game.
  }
}

module.exports = function () {
  schedule.scheduleJob(`*/${CRON_STARDUST_CACHE_MINUTES} * * * *`, () => {
    gameCacheRunner();
    tokenCacheRunner();
    tradeCacheRunner();
  });
};
