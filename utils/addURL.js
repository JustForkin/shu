#!/usr/bin/env node

var _          = require('underscore');
var fs         = require('fs');
var Hashids    = require('hashids');
var argv       = require('yargs').argv;
var getURLs    = require('../app/utils/getURLs');
var uploadToS3 = require('./uploadToS3');
var config     = require('../config/server');

var URLsPath   = "data/urls.json";
var newURLPath = null;

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

		data.urls.push(getNewEntry(url, path, data.urls.length+1));

		fs.writeFileSync(URLsPath, JSON.stringify(data, null, 4))

		cb(null)
	});
}

function getNewEntry(url, path, index) {
	var h = new Hashids(config.shortlinks.SALT, 3, config.shortlinks.ALPHABET);
    var id = path ? path : h.encode(index);

    var protocolRe = new RegExp('^https?:\/\/');
    url = protocolRe.test(url) ? url.split(protocolRe)[1] : url;

    newURLPath = id;

    return {
		id      : id,
		index   : index,
		url     : url,
		created : new Date()
	};
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
				console.log("SUCCESS!! New URL at path %s", newURLPath);
			});
		}
	});

}

updateAndUpload(argv.url, argv.path);
