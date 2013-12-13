var assert = require('assert');
var peroxide = require('../lib/server.js');

describe('Peroxide', function() {
	it('should exist', function() {
		assert.equal(typeof peroxide !== 'undefined', true);
		assert.equal(!!peroxide, true);
	});
});