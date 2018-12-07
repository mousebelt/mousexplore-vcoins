// Setup basic express server
const express = require('express');
// Retrieve
const config = require('./config');

const app = express();
const server = require('http').createServer(app);
const bodyParser = require('body-parser');

// var io = require('socket.io')(server);
const port = config.port || 80;

// listen the server port
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
