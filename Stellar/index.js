require('dotenv').config();

const express = require('express');
const config = require('./config');

const app = express();
const server = require('http').createServer(app);
const bodyParser = require('body-parser');

const port = config.port || 80;

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

app.use(require('cors')());

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
require('./route/route')(app);
