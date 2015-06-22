
module.exports = function getCredentials() {
    var creds = {};

    try {
        creds = require('../credentials');
    } catch (e) {
        throw new Error('Wat... No credentials.coffee file... No access')
    }

    return creds;
}
