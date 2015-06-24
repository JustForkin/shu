var _       = require('underscore');
var getURLs = require('../../utils/getURLs');

function check(req, res) {

	var segments = req.params.path.split('/');

	if (segments.length !== 1) {
		res.send('nope::1');
	}

	getURLs(function(data) {

		var foundURL = _.findWhere(data.urls, { id : segments[0] });

		if (foundURL) {
			res.redirect(301, 'http://' + foundURL.url);
		} else {
			res.send('nope::2');
		}

	});

}


function setup(app) {

	app.get('/:path([a-zA-Z0-9]{1,10})', check);

}

module.exports = setup;
