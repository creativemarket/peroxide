/**
 * Colorizes a string with ANSI escape codes.
 *
 * @param {string} str
 * @param {string} color
 * @return {string}
 */
module.exports = function(str, color) {
	var options = {
		none      : '',
		red       : '\033[31m',
		green     : '\033[32m',
		yellow    : '\033[33m',
		blue      : '\033[34m',
		magenta   : '\033[35m',
		cyan      : '\033[36m',
		gray      : '\033[1;30m',
		white     : '\033[1;39m',
		underline : '\033[4m'
	};
	return options.hasOwnProperty(color) ? (options[color] + str + (color !== 'none' ? '\033[0;39m' : '')) : str;
};