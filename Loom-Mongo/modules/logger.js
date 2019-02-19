const winston = require('winston');

const LOGLEVEL = (process.env.LOGLEVEL || 'debug').toLowerCase();
const logTransports = [
  new (winston.transports.Console)({
    timestamp: () => new Date().toISOString(),
    formatter: (options) => (
      `${options.timestamp()}  ${options.level.toUpperCase()}: ${options.message ? options.message : ''} ${(options.meta && Object.keys(options.meta).length ? `\n\t${JSON.stringify(options.meta)}` : '')}` // eslint-disable-line
    ),
  }),
];
exports.logger = winston.createLogger({
  transports: logTransports,
  level: LOGLEVEL,
});


exports.createLogger = (name) => winston.createLogger({
  transports: [
    new winston.transports.File({ filename: '../logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: `../logs/${name}.log` })
  ],
  level: 'info',
  // format: winston.format.json(),
});
