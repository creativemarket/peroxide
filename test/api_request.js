var assert   = require('assert');
var peroxide = require('../lib/server.js');
var Request  = require('../lib/request.js');

describe('API', function() {

	describe('Request', function() {

		describe('#getZone()', function() {
			it('should return correct zone', function() {
				assert.equal((new Request({url: '/abc'})).getZone(), '/abc');
				assert.equal((new Request({url: '/abc#hello'})).getZone(), '/abc');
				assert.equal((new Request({url: '/abc/def'})).getZone(), '/abc/def');
				assert.equal((new Request({url: '/123'})).getZone(), '/123');
				assert.equal((new Request({url: '/123?url=1'})).getZone(), '/123');
			});
		});

		describe('#getProxyURL()', function() {
			it('should return correct url', function() {
				assert.equal((new Request({url: '/zone?url=' + encodeURIComponent('images/test.png')})).getProxyURL(), 'images/test.png');
				assert.equal((new Request({url: '/zone?url=' + encodeURIComponent('images/test.png?123')})).getProxyURL(), 'images/test.png?123');
				assert.equal((new Request({url: '/zone?url=' + encodeURIComponent('images/test.png') + '&test=1'})).getProxyURL(), 'images/test.png');
			});
		});

	});

});