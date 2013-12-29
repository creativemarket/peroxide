var assert = require('assert');
var Source = require('../lib/sources/http.js');

describe('Source', function() {
	describe('"http"', function() {

		describe('constructor', function() {
			it('should execute without error', function() {
				var source = new Source({});
			});
		});

		describe('#initialize()', function() {
			it('should throw Error if no "path" set', function() {
				assert.throws(function() {
					var source = new Source({});
					source.initialize(source.options);
				}, Error);
			});
			it('should not throw with proper options', function() {
				var source = new Source({path: __dirname + '/fixtures'});
				source.initialize(source.options);
			});
		});

		describe('#stream()', function() {
			var source = new Source({path: 'https://creativemarket.com/'});
			source.initialize(source.options);

			describe('if file not found', function() {
				var res_err, res_stream, res_path;

				before(function(done) {
					source.stream('does_not_exist.txt', function(err, stream, path) {
						res_err    = err;
						res_stream = stream;
						res_path   = path;
						done();
					});
				});
				it('should return null stream', function() {
					assert.equal(res_stream, null);
				});
				it('should return search path', function() {
					assert.equal(typeof res_path, 'string');
					assert.equal(res_path.length > 0, true);
				});
			});

			describe('if file found', function() {
				var res_err, res_stream, res_path;

				before(function(done) {
					source.stream('favicon.ico', function(err, stream, path) {
						res_err    = err;
						res_stream = stream;
						res_path   = path;
						done();
					});
				});
				it('should return no error', function() {
					assert.equal(!res_err, true);
				});
				it('should return readable stream', function() {
					assert.equal(typeof res_stream, 'object');
					assert.equal(typeof res_stream.pipe, 'function');
				});
				it('should return correct search path', function() {
					assert.equal(res_path, 'https://creativemarket.com/favicon.ico');
				});
			});

		});

	});
});