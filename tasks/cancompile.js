'use strict';

var compiler = require('../lib');

module.exports = function (grunt) {
	grunt.task.registerMultiTask('cancompile', 'Compile CanJS EJS and Mustache views', function () {
		var done = this.async();
		var options = this.data;
		var files = grunt.file.expand(this.data.src);

		options.out = options.out || 'views.production.js';
		if (options.options) {
			options.wrapper = options.options.wrapper;
			options.version = options.options.version;
		}
		compiler(files, options, function(err, output, outfile) {
			if(err) {
				return done(err);
			}

			grunt.log.ok('Wrote file ' + outfile);
			done();
		}, grunt.log.writeln.bind(grunt.log));
	});
};
