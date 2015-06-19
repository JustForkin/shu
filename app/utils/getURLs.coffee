request = require "request"
config  = require "../../config/server"

getURLs = (cb) ->

    dataURL = config.BUCKET_URL + config.URLS_DATA_PATH

    request dataURL, (err, res, body) ->

        if !err && res.statusCode == 200
            urls = JSON.parse body
            cb urls
        else
            console.error 'Error getting remote master manifest from SOURCE'
            cb false

module.exports = getURLs
