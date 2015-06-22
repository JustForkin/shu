var express  = require('express');
var path     = require('path');
var app      = express();

[
	'./site/routes'
].forEach(function(routePath) {
	require(routePath)(app);
});

app.use(require('./middleware').notFound);

module.exports = app;
