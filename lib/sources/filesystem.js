var fs      = require('fs');
var path    = require('path');
var source  = require('../source.js');

module.exports = source.define({
	initialize: function(options) {
		if (!options.path) {
			throw new Error('No source "path" set');
		}
	},
	stream: function(url, callback) {
		var path_fs = path.resolve(this.options.path, url);
		fs.exists(path_fs, function(exists) {
			if (exists) return callback(null, fs.createReadStream(path_fs), path_fs);
			callback(null, null, path_fs);
		});
	}
});