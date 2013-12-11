/**
 * A wrapper for proxy requests.
 *
 * @constructor
 * @param {object} req
 * @return {void}
 */
var Request = module.exports = function(req) {
	this.req = req;
};

/**
 * Gets the name of the appropriate
 * zone handler for the request.
 *
 * @param {object} server
 * @return {object|null}
 */
Request.prototype.getZone = function() {
	var match = this.req.url.match(/[^\?]+/);
	return (match && match[0]) || '';
};

/**
 * Returns the URL that needs to be proxied.
 *
 * @return {string}
 */
Request.prototype.getProxyURL = function() {
	var match = this.req.url.match(/[\?&]url=([^&]+)/);
	return decodeURIComponent((match && match[1]) || '');
};