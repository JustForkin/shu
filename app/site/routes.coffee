_            = require 'underscore'
getURLs      = require '../utils/getURLs'
config       = require '../../config/server'

check = (req, res) ->

	segments = req.params.path.split('/')

	if segments.length isnt 1 then res.send 'nope::1'

	urls = getURLs (data) ->

		foundURL = _.findWhere data.urls, { id : segments[0] }

		if foundURL
			res.redirect 301, 'http://' + foundURL.url
		else
			res.send 'nope::2'


setup = (app) ->

	app.get '/:path([a-zA-Z]{3})', check

module.exports = setup
