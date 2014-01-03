var _          = require('lodash');
var responders = require('./responders/index.js');
var sources    = require('./sources/index.js');

/**
 * A zone is a named collection of content sources.
 *
 * https://[host]/[zone]?url=[url]
 *
 * @constructor
 * @param {string} route
 * @return {void}
 */
var Zone = module.exports = function(route) {
	this.route      = route;
	this.stack      = [];
	this._responder = null;
};

/**
 * Adds a new content source for the zone.
 *
 * Example Usage:
 *
 *    zone.add('http', {baseurl: '...'})
 *    zone.add('filesystem', {path: '...'})
 *
 * @throws {object}
 * @param {string} type
 * @param {object} options
 * @return {self}
 */
Zone.prototype.add = function(type, options) {
	var Source = sources[type];
	if (!Source) {
		throw new Error('Unrecogized source type "' + type + '"');
	}

	var source = new Source(options);
	source.initialize(options);
	this.stack.push(source);
	return this;
};

/**
 * Gets or sets the responder used for this zone.
 *
 *    zone.responder()
 *    zone.responder('pipe')
 *
 * @throws
 * @param {string} name
 * @param {object} options
 * @return {object}
 */
Zone.prototype.responder = function(name, options) {
	if (typeof name === 'undefined') {
		return this._responder;
	} else if (!responders.hasOwnProperty(name)) {
		throw new Error('Unrecogized responder "' + name + '"');
	}

	var Responder = responders[name];
	var responder = new Responder(name);
	responder.initialize(options);
	this._responder = responder;

	return this;
};

/**
 * Resolves the request url.
 *
 * @param {url} url
 * @param {function} callback(err, stream, paths)
 * @return {void}
 */
Zone.prototype.resolve = function(url, callback) {
	var stream, process, next, done, self = this, i = 0, paths = [];

	// invoked when the source is resolved, or
	// is unable to be resolved
	done = function(err, stream, meta) {
		meta = _.extend({}, meta, {paths: paths});
		callback(err, stream, meta);
	};

	// moves on to the next available source
	next = function() {
		if (++i < self.stack.length) {
			process();
		} else {
			done('Unable to resolve URL');
		}
	};

	// attempts to resolve the url with the current source
	process = function() {
		var source = self.stack[i];
		source.stream(url, function(err, stream, path, meta) {
			if (path) paths.push(path);
			if (err || !stream) return next();
			done(null, stream, meta);
		});
	};

	process();
};