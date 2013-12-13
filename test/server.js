var assert   = require('assert');
var peroxide = require('../lib/server.js');
var Zone     = require('../lib/zone.js');

describe('API', function() {

	describe('Server', function() {
		describe('.create()', function() {
			it('should return a peroxide instance', function() {
				var server = peroxide.create();
				assert.equal(server instanceof peroxide, true);
			});
			it('should set provided options', function() {
				var options = {log: false};
				var server = peroxide.create(options);
				assert.equal(typeof server.options === 'object', true);
				assert.equal(server.options.log === false, true);
			});
		});

		describe('#zone()', function() {
			it('should create a new Zone instance if route doesn\'t exist', function() {
				var server = peroxide.create();
				var zone = server.zone('/zone');
				assert.equal(zone instanceof Zone, true);
			});
			it('should return existing instance if route does exist', function() {
				var server = peroxide.create();
				var zone1 = server.zone('/zone');
				var zone2 = server.zone('/zone');
				assert.equal(zone1 === zone2, true);
			});
		});
	});

});