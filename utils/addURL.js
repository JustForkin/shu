#!/usr/bin/env node

// config is coffee....
require('coffee-script/register');

var fs                   = require('fs');
var Hashids              = require('hashids');
var getURLs = require('../app/utils/getURLs');
var uploadToS3           = require('./uploadToS3');
var config               = require('../config/server');

var URLsPath = "data/urls.json";

function update(url, cb) {

	getURLs(function(data) {
		if (!data) {
			return cb(true);
		}

		data.urls.push(getNewEntry(url, data.urls.length+1));

		fs.writeFileSync(URLsPath, JSON.stringify(data, null, 4));

		cb(null);
	});
}

function getNewEntry(url, index) {
	var h = new Hashids(config.shortlinks.SALT, 3, config.shortlinks.ALPHABET);
    var shortlink = h.encode(index);

    return {
		id      : shortlink,
		index   : index,
		url     : url,
		created : new Date()
	};
}

function updateAndUpload(url, cb) {

	update(url, function(err) {
		if (err) {
			throw new Error('Issue adding new URL');
		} else {
			uploadToS3.uploadSingleFile(URLsPath, cb);
		}
	});

}

module.exports = {
	update          : update,
	updateAndUpload : updateAndUpload
}
