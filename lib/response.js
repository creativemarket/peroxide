/**
 * A wrapper for proxy responses.
 *
 * @constructor
 * @param {object} res
 * @return {void}
 */
var Response = module.exports = function(res) {
	this.res = res;
};