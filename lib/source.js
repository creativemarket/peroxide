var _ = require('lodash');

/**
 * Declares a content data source that can be instantiated
 * and used to stream data to a responder.
 *
 * @param {object} methods
 * @return {function}
 */
module.exports.define = function(methods) {
	var Source = function(options) {
		this.options = options;
	};

	if (typeof methods.initialize !== 'function') {
		throw new Error('No initialize method defined for source');
	}
	if (typeof methods.stream !== 'function') {
		throw new Error('No stream method defined for source');
	}

	_.extend(Source.prototype, methods);
	return Source;
};