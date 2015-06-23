#!/usr/bin/env node

var _          = require('underscore');
var fs         = require('fs');
var path       = require('path');
var Hashids    = require('hashids');
var clipboard  = require('copy-paste');
var uploadToS3 = require('./uploadToS3');
var getURLs    = require('../app/utils/getURLs');

var config_general = require('../config/general');
var config_user    = require('../config/user');

var argv = require('yargs')
	.alias('u', 'url')
	.alias('p', 'path')
	.argv;

var protocolRe = new RegExp('^https?:\/\/');
var URLsPath   = path.join(__dirname, "..", "urls.json");
var newURL     = null;

function update(url, path, cb) {
	getURLs(function(data) {
		if (!data) {
			cb(true)
		}

		if (path) {
			if (_.findWhere(data.urls, { id : path })) {
				throw new Error('Sorry, that path is already in use...');
			}
		}

		url = protocolRe.test(url) ? url.split(protocolRe)[1] : url;

		var existingEntry = _.findWhere(data.urls, { url : url });
		if (existingEntry && (!path || path === existingEntry.id)) {
			newURL = config_user.REMOTE_URL + '/' + existingEntry.id;
			return clipboard.copy(newURL, function() {
				console.log("URL %s already shortened to %s (now copied to clipboard)", url, newURL);
			});
		}

		data.urls.push(getNewEntry(url, path, data.urls.length+1));

		fs.writeFileSync(URLsPath, JSON.stringify(data, null, 4))

		cb(null)
	});
}

function getNewEntry(url, path, index) {
	var h = new Hashids(config_general.shortlinks.SALT, 3, config_general.shortlinks.ALPHABET);
    var id = path ? path : h.encode(index);

    newURL = config_user.REMOTE_URL + '/' + id;

    return {
		id      : id,
		index   : index,
		url     : url,
		created : new Date()
	};
}

function removeTemporaryUrlsFile() {
	fs.unlinkSync(URLsPath);
}

function updateAndUpload(url, path) {
	if (!url) {
		throw new Error('no url given...');
	}

	update(url, path, function(err) {
		if (err) {
			throw new Error('Issue adding new URL');
		} else {
			uploadToS3.uploadSingleFile(URLsPath, function() {
				clipboard.copy(newURL, function() {
					removeTemporaryUrlsFile();
					console.log("SUCCESS!! New URL at path %s (now copied to clipboard)", newURL);
				});
			});
		}
	});

}

updateAndUpload(argv.url, argv.path);
