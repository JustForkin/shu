#!/usr/bin/env node

var cluster = require('cluster');
var app     = require('./server');

var config_general = require('../config/general');
var config_user    = require('../config/user');

var workers = {};
var count   = require('os').cpus().length;

var appURL = config_general.PRODUCTION ? config_user.REMOTE_URL : 'http://'+config_general.express.ip+':'+config_general.express.port;

function spawn() {
  worker = cluster.fork();
  workers[worker.pid] = worker;
  return worker;
}

if (cluster.isMaster && process.env.NODE_ENV === 'production') {

	for (var i = 0; i < count; i++) {
		spawn();
	}

	cluster.on('death', function(worker) {
		console.log('worker ' + worker.pid + ' died. spawning a new process...');
		delete workers[worker.pid];
		spawn();
	});

} else {

	app.listen(config_general.express.port, config_general.express.ip, function(error) {
		if (error) {
			console.error("Unable to listen for connections", error);
			process.exit(10);
		}

		console.info("express is listening on " + appURL);
	});
}
