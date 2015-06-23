var request = require('request');
var config  = require('../../config/server');

function getURLs(cb) {

    var dataURL = config.BUCKET_URL + '/' + config.URLS_DATA_PATH;
    var urls;

    request(dataURL, function(err, res, body) {

        if (!err && res.statusCode == 200) {
            urls = JSON.parse(body);
            cb(urls);
        } else {
            console.error('Error getting remote URL data...');
            cb(false);
        }
	
	});

}

module.exports = getURLs;
