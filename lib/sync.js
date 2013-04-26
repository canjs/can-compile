var fs = require('fs');
var can = require('../resources/can.custom.js');

module.exports = function (filename, normalize, log) {
	var normalizer = function (filename) {
		return filename;
	};

	if (typeof normalize === 'function') {
		normalizer = normalize;
	}

	if (log) {
		log('Compiling ' + filename);
	}

	var id = normalizer(filename).replace(/[\.\/]/g, '_');
	var type = filename.substring(filename.lastIndexOf('.'), filename.length);
	var text = fs.readFileSync(filename).toString();

	return can.view.types[type].script(id, text);
};