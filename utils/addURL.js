#!/usr/bin/env node

// config is coffee....
require('coffee-script/register');

var fs         = require('fs');
var Hashids    = require('hashids');
var argv       = require('yargs').argv;
var getURLs    = require('../app/utils/getURLs');
var uploadToS3 = require('./uploadToS3');
var config     = require('../config/server');

var URLsPath   = "data/urls.json";
var newURLPath = null;

function update(url, cb) {
	getURLs(function(data) {
		if (!data) {
			cb(true)
		}

		data.urls.push(getNewEntry(url, data.urls.length+1));

		fs.writeFileSync(URLsPath, JSON.stringify(data, null, 4))

		cb(null)
	});
}

function getNewEntry(url, index) {
	var h = new Hashids(config.shortlinks.SALT, 3, config.shortlinks.ALPHABET);
    var shortlink = h.encode(index);

    newURLPath = shortlink;

    return {
		id      : shortlink,
		index   : index,
		url     : url,
		created : new Date()
	};
}

function updateAndUpload(url) {
	if (!url) {
		throw new Error('no url given...');
	}

	update(url, function(err) {
		if (err) {
			throw new Error('Issue adding new URL');
		} else {
			uploadToS3.uploadSingleFile(URLsPath, function() {
				console.log("SUCCESS!! New URL at path %s", newURLPath);
			});
		}
	});

}

updateAndUpload(argv.url);
