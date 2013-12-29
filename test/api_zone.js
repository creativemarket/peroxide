var assert   = require('assert');
var peroxide = require('../lib/server.js');
var Zone     = require('../lib/zone.js');

describe('API', function() {

	describe('Zone', function() {
		describe('constructor', function() {
			it('should set route property', function() {
				var zone = new Zone('/route');
				assert.equal(zone.route, '/route');
			});
			it('should create empty source stack', function() {
				var zone = new Zone('/route');
				assert.equal(Array.isArray(zone.stack), true);
				assert.equal(zone.stack.length, 0);
			});
		});

		describe('#responder()', function() {
			it('should return existing responder if no arguments given', function() {
				var zone = new Zone('/route');
				assert.equal(zone.responder(), null);

				zone.responder('pipe');
				assert.equal(zone.responder() !== null, true);
			});
			it('should return self when setting a responder (for chaining)', function() {
				var zone = new Zone('/route');
				assert.equal(zone.responder('pipe') === zone, true);
			});
			it('should throw exception if setting an invalid responder', function() {
				var zone = new Zone('/route');
				assert.throws(function() {
					zone.responder('awfwfwfwf');
				}, Error);
			});
		});
	});

});