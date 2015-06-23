#!/usr/bin/env node

var cluster = require('cluster');
var app     = require('./server');
var config  = require('../config/server');

var workers = {};
var count   = require('os').cpus().length;

var log = require("winston").loggers.get("app:server");

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

	app.listen(config.express.port, config.express.ip, function(error) {
		if (error) {
			log.error("Unable to listen for connections", error);
			process.exit(10);
		}

		log.info("express is listening on " + config.BASE_URL);
	});
}
