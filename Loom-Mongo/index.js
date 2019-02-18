// Setup basic express server
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const server = require('http').createServer(app);
const bodyParser = require('body-parser');
const config = require('./config');
const logger = require('./modules/logger');
const routeInitialize = require('./routes');
const cronService = require('./services/cron.service');

mongoose.Promise = global.Promise;
mongoose.connect(config.db, { useNewUrlParser: true }, (err, db) => { // eslint-disable-line
  if (err) throw err;

  // listen the server port
  const port = config.app.port || 80;
  server.listen(port, () => {
    console.log('Server listening at port %d', port);
  });
});
app.logger = logger;
app.use(require('cors')());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
routeInitialize(app);
cronService();
