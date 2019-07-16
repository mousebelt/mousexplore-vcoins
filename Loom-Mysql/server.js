const app = require('express')();
const cors = require('cors');
const http = require('http');
const config = require('./config');
const logger = require('./utils/logger');
const dbInitialize = require('./services/dbInitialize');
const routeInitialize = require('./routes');
const cronService = require('./services/cron.service');

const server = http.createServer(app);
app.logger = logger;
app.options('*', cors());
app.use(cors());
// Wide-open CORS configuration (change before this is considered production-ready)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  next();
});

app.use(require('morgan')('dev'));
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('body-parser').json());
app.use(require('express-session')({ secret: config.app.secret, resave: true, saveUninitialized: true }));
app.use(require('cookie-parser')());

dbInitialize(app);
routeInitialize(app);
cronService();

if (process.env.NODE_ENV === 'development') {
  server.listen(config.app.port, () => {
    // eslint-disable-next-line no-console
    console.log('Server listening at port %d', config.app.port);
  });
} else {
  server.listen(config.app.port, () => {
    // eslint-disable-next-line no-console
    console.log('SSL server is running at ', config.app.port);
  });
}
