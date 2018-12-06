// Setup basic express server
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const server = require('http').createServer(app);
const bodyParser = require('body-parser');
const config = require('./config');

mongoose.Promise = global.Promise;
mongoose.connect(config.db, (err, db) => { // eslint-disable-line
  if (err) throw err;

  // listen the server port
  const port = config.port || 80;

  server.listen(port, () => {
    console.log('Server listening at port %d', port);
  });
});

app.use(require('cors')());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
require('./route/route')(app);

// start crone service
require('./services/cron.service').start_cronService();
require('./services/cron.service.addr').start();
