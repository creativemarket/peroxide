#!/usr/bin/env node
var fs            = require('fs');
var npid          = require('npid');
var child_process = require('child_process');
var optimist      = require('optimist');
var peroxide      = require('../lib/server.js');

var options, config, server, zone_name, create_zone, daemon, server_options;

options = optimist
	.usage('Usage: $0 [options]')
	.describe('config', 'Configuration file path (*.json)')
	.describe('port', 'Server port')
	.describe('silent', 'Disables all console output')
	.describe('daemon', 'Run in daemon mode')
	.describe('pidfile', 'PID file')
	.describe('ssl', 'Use HTTPS protocol')
	.describe('cert', 'SSL certificate required when ssl enabled')
	.describe('key', 'Private key required when ssl enabled')
	.default('port', 8000)
	.demand(['config','port'])
	.check(function(options) {
		if (!fs.existsSync(options.config)) {
			throw new Error('Unable to open configuration file. Does not exist.');
		}
	})
	.argv;

// read configuration file
try {
	config = JSON.parse(fs.readFileSync(options.config, 'utf8'));
} catch (e) {
	console.error('Unable to parse configuration file');
	process.exit(1);
}

// create the zones
create_zone = function(name, settings, server) {
	var i, n, zone;
	zone = server.zone(zone_name);
	zone.responder(settings.responder || 'pipe');
	for (i = 0, n = settings.sources.length; i < n; i++) {
		zone.add(settings.sources[i].type, settings.sources[i].options);
	}
};

server_options = {
	log: options.silent !== true,
}
if (options.ssl) {
	server_options.ssl 	= true;
	server_options.cert = options.cert;
	server_options.key	= options.key;
}
server = peroxide.create(server_options);
for (zone_name in config) {
	if (config.hasOwnProperty(zone_name)) {
		create_zone(zone_name, config[zone_name], server);
	}
}

// start up the server
if (options.daemon) {
	var daemon_options = process.argv;
	daemon_options.splice(0, 2);
	daemon_options.splice(daemon_options.indexOf('--daemon'), 1);
	child_process.spawn(__filename, daemon_options, {detached: true, stdio: 'ignore'});
	setTimeout(function() { process.exit(0); }, 1000);
} else {
	if (options.pidfile && typeof options.pidfile === 'string') {
		npid.create(options.pidfile);
	}
	try {
		server.listen(options.port);
		console.log('Peroxide listening on port ' + options.port + '...');
	} catch (e) {
		console.err('Unable to bind to port ' + options.port);
		process.exit(1);
	}
}