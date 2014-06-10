'use strict';

var compiler = require('../lib');

module.exports = function (grunt) {
	grunt.task.registerMultiTask('cancompile', 'Compile CanJS EJS and Mustache views', function () {
		var done = this.async();
		var options = this.options();
    var file = this.files[0];
    var files = file.src;

		options.out = file.dest || 'views.production.js';

		compiler(files, options, function(err, output, outfile) {
			if(err) {
				return done(err);
			}

			grunt.log.ok('Wrote file ' + outfile);
			done();
		}, grunt.log.writeln.bind(grunt.log));
	});
};
