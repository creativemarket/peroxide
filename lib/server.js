var http         = require('http');
var responders   = require('./responders/index.js');
var colorize     = require('./colorize.js');
var Zone         = require('./zone.js');
var Request      = require('./request.js');
var Response     = require('./response.js');
var Logger       = require('./logger.js');

/**
 * Peroxide Server
 *
 * Options:
 *   - log
 *
 * @constructor
 * @return {void}
 */
var Server = module.exports = function(options) {
	var self = this;

	this.zones   = {};
	this.options = options || {};
	this.log     = new Logger({enabled: !!this.options.log});
	this.server  = http.createServer(function() {
		self.handleRequest.apply(self, arguments);
	});
};

/**
 * Gets a zone with the given route. It will
 * be created if it doesn't exist.
 *
 * @param {string} route
 * @return {object}
 */
Server.prototype.zone = function(route) {
	if (!this.zones.hasOwnProperty(route)) {
		this.zones[route] = new Zone(route);
	}
	return this.zones[route];
};

/**
 * Handles an incoming request.
 *
 * @param {object} req
 * @param {object} res
 * @return {void}
 */
Server.prototype.handleRequest = function(req, res) {
	var self, request, response, zone, responder;

	console.log(colorize(req.url, 'gray'));

	self     = this;
	request  = new Request(req);
	response = new Response(res);

	// determine request zone
	zone = this.zones[request.getZone()];
	if (!zone) {
		this.log.status(400, request, 'no matching zone found');
		res.writeHead(400, {'Content-Type': 'text/plain'});
		res.write('ERROR: Invalid zone');
		res.end();
		return;
	}

	// determine request responder
	responder = zone.responder();
	if (!responder) {
		this.log.status(400, request, 'no responder configured for this zone');
		res.writeHead(400, {'Content-Type': 'text/plain'});
		res.write('ERROR: No responder configured for this zone');
		res.end();
		return;
	}

	// respond to request
	zone.resolve(request.getProxyURL(), function(err, stream, meta) {
		if (!stream) {
			self.log.status(404, request, 'no candidate asset found');
			res.writeHead(404, {'Content-Type': 'text/plain'});
			res.write('ERROR: No candidate asset found\n\nSources:\n  - ' + meta.paths.join('\n  - ') + '\n');
			res.end();
			return;
		}

		res.setHeader('X-Content-Source', meta.paths[meta.paths.length - 1] || 'Unknown');
		self.log.status(200, request, 'success');
		responder.respond(stream, request, response, meta);
	});
};

/**
 * Starts listening on the provided port.
 *
 * @param {int} port
 * @return {void}
 */
Server.prototype.listen = function(port) {
	this.server.listen(port);
};

/**
 * Creates a new proxy server.
 *
 * @return {object}
 */
Server.create = function(options) {
	return new Server(options);
};