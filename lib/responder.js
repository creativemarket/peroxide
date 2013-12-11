var _ = require('lodash');

module.exports.define = function(methods) {
	var Responder = function(options) {
		this.options = options;
	};

	_.extend(Responder.prototype, methods);
	return Responder;
};