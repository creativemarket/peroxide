var responder = require('../responder.js');

module.exports = responder.define({
	initialize: function(options) { /* ... */ },
	respond: function(stream, request, response, meta) {
		stream.on('error', function(err) { /* ... */ });
		stream.pipe(response.res, {end: true});
		stream.resume();
	}
});