var responder = require('../responder.js');
var util = require('../util.js');

module.exports = responder.define({
	initialize: function(options) { /* ... */ },
	respond: function(stream, request, response, meta) {
		var res     = response.res;
		var buffer  = new Buffer(0);
		var headers = util.lowercaseKeys(meta.headers);

		if (meta.headers && meta.headers['content-type']) {
			res.setHeader('Content-Type', meta.headers['content-type']);
		}

		stream.on('data', function(chunk) {
			buffer = Buffer.concat([buffer, chunk]);
		});

		stream.on('end', function() {
			res.setHeader('Content-Length', buffer.length);
			res.write(buffer);
			res.end();
		});

		stream.resume();
	}
});