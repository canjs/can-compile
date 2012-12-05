'use strict';

var compiler = require('../lib');

module.exports = function (grunt) {
	grunt.registerMultiTask('cancompile', 'Compile CanJS EJS and Mustache views', function () {
		var done = this.async();
		var options = grunt.config.process(['cancompile', this.target]);
		var files = grunt.file.expandFiles(this.file.src);

		options.out = options.out || 'views.production.js';

		compiler(files, options, function(err, output, outfile) {
			if(err) {
				return grunt.fail.fatal(err);
			}

			grunt.log.ok('Wrote file ' + outfile);
			done();
		}, grunt.log.writeln.bind(grunt.log));
	});
};