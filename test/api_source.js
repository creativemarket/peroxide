var assert   = require('assert');
var source   = require('../lib/source.js');

describe('API', function() {

	describe('Source', function() {
		describe('.define()', function() {

			it('should return function', function() {
				var Source = source.define({
					initialize: function() {},
					stream: function() {}
				});
				assert.equal(typeof Source, 'function');
			});

			it('should return function that sets options property', function() {
				var Source = source.define({
					initialize: function() {},
					stream: function() {}
				});
				var options = {test: 'option'};
				var src = new Source(options);
				assert.equal(typeof src.options, 'object');
				assert.equal(src.options.test, 'option');
			});

			it('should throw if initialize method not provided', function() {
				assert.throws(function() {
					source.define({
						stream: function() {}
					});
				}, Error);
			});

			it('should throw if stream method not provided', function() {
				assert.throws(function() {
					source.define({
						initialize: function() {}
					});
				}, Error);
			});

			it('should setup prototype methods', function() {
				var fn_initialize = function() { };
				var fn_stream = function() { };

				var Source = source.define({
					initialize: fn_initialize,
					stream: fn_stream
				});

				assert.equal(Source.prototype.initialize, fn_initialize);
				assert.equal(Source.prototype.stream, fn_stream);
			});

		});
	});

});