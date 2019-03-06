const { RateLimiterMemory } = require('rate-limiter-flexible');
const monitorRouter = require('./monitor');
const loomRouter = require('./loom');
const gameRouter = require('./game');
const { getIp } = require('../modules/utils');

// We can change this later. 300 calls per 5 mins.
const rateLimiter = new RateLimiterMemory({
  points: 60 * 5,
  duration: 60 * 5,
});

const limiterMiddleware = (req, res, next) => {
  const ip = getIp(req);
  rateLimiter.consume(ip)
    .then(() => {
      next();
    })
    .catch(() => {
      console.log(ip);
      res.status(429).send('Too many requests');
    });
};

module.exports = function (app) {
  app.use('/api/v1/monitor', monitorRouter);
  app.use('/api/v1/loom', limiterMiddleware, loomRouter);
  app.use('/api/v1/games', gameRouter);
};
