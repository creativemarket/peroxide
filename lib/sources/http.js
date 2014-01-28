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
			uri: path_http,
			timeout: this.options.timeout || 5000,
		}, function(err, res, body) {
			var stream;

			if (res.statusCode === 200) {
				stream = request.get(path_http);
				stream.pause();
				callback(null, stream, path_http, {headers: res.headers});
			} else {
				callback(null, null, path_http);
			}
		});
	}
});