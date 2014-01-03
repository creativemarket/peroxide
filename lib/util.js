/**
 * Tranforms the keys of an object to lowercase.
 *
 * @param {object} headers
 * @return {object}
 */
module.exports.lowercaseKeys = function(object) {
	if (!object) return;

	var lowercased = {};
	for (var key in object) {
		if (object.hasOwnProperty(key)) {
			lowercased[key.toLowerCase()] = object[key];
		}
	}

	return lowercased;
};