'use strict';

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		jshint: {
			all: {
				src: ['grunt.js', 'tasks/**/*.js', 'lib/**/*.js', 'test/**/*.js'],
				options: {
					curly: true,
					eqeqeq: true,
					immed: true,
					latedef: true,
					newcap: true,
					noarg: true,
					sub: true,
					undef: true,
					boss: true,
					eqnull: true,
					node: true
				},
				globals: {
					exports: true
				}
			}
		}
	});

	// Default task.
	grunt.registerTask('default', 'jshint');

	grunt.loadNpmTasks('grunt-contrib-jshint');
};