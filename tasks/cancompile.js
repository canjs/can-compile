var compiler = require('../lib');

module.exports = function (grunt) {
	grunt.registerMultiTask('cancompile', 'Compile CanJS EJS and Mustache views', function () {
		var done = this.async();
		var options = grunt.config.process(['cancompile', this.target]);
		var files = grunt.file.expandFiles(this.file.src);

		files.forEach(function(file) {
			grunt.log.writeln('Adding ' + file);
		});

		compiler(files, options, function(err, output) {
			if(err) return grunt.fail.fatal(err);
			done();
		});
	});
}