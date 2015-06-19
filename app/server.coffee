express  = require "express"
path     = require "path"
app      = express()

[
	"./site/routes"
].forEach (routePath) ->
	require(routePath)(app)

app.use require("./middleware").notFound

module.exports = app
