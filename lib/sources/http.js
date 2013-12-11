var request = require('request');
var source  = require('../source.js');

module.exports = source.define({
	initialize: function(options) {
		if (!options.path) {
			throw new Error('No base URL "path" set');
		}
	},
	stream: function(url, callback) {
		var path_http = this.options.path.replace(/\/$/, '') + '/' + url.replace(/^\//, '');

		request({
			method: 'HEAD',
			followRedirect: true,
			uri: path_http
		}, function(err, res, body) {
			if (res.statusCode === 200) {
				callback(null, request.get(path_http), path_http);
			} else {
				callback(null, null, path_http);
			}
		});
	}
});