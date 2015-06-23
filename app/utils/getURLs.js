var request = require('request');

var config_general = require('../../config/general');
var config_user    = require('../../config/user');

function getURLs(cb) {

    var dataURL = config_user.BUCKET_URL + '/' + config_general.URLS_DATA_PATH;
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
