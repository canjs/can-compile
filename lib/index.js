var compiler = require('./compile');
var fs = require('fs');
var path = require('path');

module.exports = function(files, configuration, callback) {
	// Normalize ids to filenames relative to the output file
	var normalizer = function(filename) {
		return path.relative(path.dirname(configuration.out), filename);
	}

	compiler(files, normalizer, function(err, compiled) {
		if(err) {
			return callback(err);
		}

		if(!callback) {
			callback = configuration;
			configuration = {};
		}

		var outfile = configuration.out;
		var output = '(function(window, undefined) {\nvar can = window.can;\n' +
			compiled.join('\n') +
			'\n})(this);';

		if(!outfile) {
			return callback(null, output);
		}

		fs.writeFile(outfile, output, function (err) {
			callback(err, output, outfile);
		});
	});
}

module.exports.compile = compiler;