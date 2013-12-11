var _ = require('lodash');

module.exports.define = function(methods) {
	var Source = function(options) {
		this.options = options;
	};

	_.extend(Source.prototype, methods);
	return Source;
};