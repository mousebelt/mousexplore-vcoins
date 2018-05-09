// Setup basic express server
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var server = require('http').createServer(app);
var bodyParser = require('body-parser');
var config = require("./config/common.js").info;


mongoose.Promise = global.Promise;
mongoose.connect(config.db, function(err, db) {
	if(err) throw err;

	// listen the server port
	var port = process.env.PORT || 2000;
	
	server.listen(port, function () {
	  console.log('Server listening at port %d', port);
	});
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
require('./route/route')(app);

//start crone service
require("./cron/cronservice").start_cronService();