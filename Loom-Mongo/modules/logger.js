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

exports.createLogger = (name = 'default') =>
  // winston.createLogger({
  //   transports: [
  //     new winston.transports.File({ filename: '../logs/error.log', level: 'error' }),
  //     new winston.transports.File({ filename: `../logs/${name}.log` })
  //   ],
  //   level: 'info',
  //   // format: winston.format.json(),
  // });
  winston.createLogger({
    level: 'debug',
    exitOnError: false,
    transports: [
      new winston.transports.File({
        filename: `./logs/${name}/error.log`,
        level: 'error'
      }),
      new winston.transports.File({
        filename: `./logs/${name}/warning.log`,
        level: 'warning'
      }),
      new winston.transports.File({
        filename: `./logs/${name}/debug.log`,
        level: 'debug'
      }),
      new winston.transports.File({
        filename: `./logs/${name}/info.log`,
        level: 'info'
      })
    ],
    exceptionHandlers: [
      new winston.transports.File({
        filename: `./logs/${name}/exceptions.log`
      })
    ]
  });
