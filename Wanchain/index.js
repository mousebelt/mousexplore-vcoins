// Setup basic express server
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var server = require('http').createServer(app);
var bodyParser = require('body-parser');
var config = require("./config");


mongoose.Promise = global.Promise;
mongoose.connect(config.db, function(err, db) {
	if(err) throw err;

	// listen the server port
	var port = config.port || 80;
	
	server.listen(port, function () {
	  console.log('Server listening at port %d', port);
	});
});

app.use(require('cors')());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
require('./route/route')(app);

//start crone service
require("./services/cronservice").start_cronService();