var colorize = require('./colorize.js');

/**
 * Logging Utility
 *
 * Options:
 *   - enabled (bool)
 *
 * @constructor
 * @param {object} options
 * @return {void}
 */
var Logger = module.exports = function(options) {
	this.enabled = options.enabled !== false;
};

/**
 * Writes a message to standard out (if the
 * logger is currently enabled).
 *
 * @param {string} message
 * @return {void}
 */
Logger.prototype.write = function(message) {
	if (this.enabled) {
		console.log(message);
	}
};

/**
 * Logs the result of a proxied request.
 *
 * @param {int} code
 * @param {object} request
 * @param {string} message
 * @return {void}
 */
Logger.prototype.status = function(code, request, message) {
	var mapping = {
		'100': 'none',
		'200': 'green',
		'300': 'green',
		'400': 'red',
		'500': 'red',
	};

	var color = mapping[parseInt((code + '')[0], 10) * 100];
	this.write('[' + colorize(code, color) + '] ' + colorize(request.req.url, 'white') + ' - ' + message);
};