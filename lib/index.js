var compiler = require('./compile');
var fs = require('fs');

module.exports = function(files, configuration, callback) {
	compiler(files, function(err, compiled) {
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
			callback(err, output);
		});
	});
}
