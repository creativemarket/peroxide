var responder = require('../responder.js');

module.exports = responder.define({
	initialize: function(options) { /* ... */ },
	respond: function(stream, request, response) {
		stream.pipe(response.res);
	}
});