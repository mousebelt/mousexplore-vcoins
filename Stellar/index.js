// Setup basic express server
var express = require('express');
// Retrieve
var mongoose = require("mongoose");

var app = express();
var server = require('http').createServer(app);
var bodyParser = require('body-parser');


// var io = require('socket.io')(server);
var port = process.env.PORT || 2000;

// Connect to the db
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/ethertransactions", function(err, db) {
	if(err) throw err;

	// listen the server port
	server.listen(port, function () {
	  console.log('Server listening at port %d', port);
	});

});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
require('./route/route')(app);

