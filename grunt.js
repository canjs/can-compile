/*global module:false*/
module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg : '<json:package.json>',
		meta : {
			resources : 'resources/js'
		},
		concat : {
			resources : {
				src : [ '<%= meta.resources %>/jquery.1.8.3.js', '<%= meta.resources %>/can.jquery.1.1.2.js',
					'<%= meta.resources %>/can.view.mustache.1.1.2.js' ],
				dest : '<%= meta.resources %>/resources.js'
			}
		},
		min : {
			resources : {
				src : '<%= meta.resources %>/resources.js',
				dest : '<%= meta.resources %>/resources.min.js'
			}
		},
		cancompile : {
			all : {
				src : ['**/*.ejs', '**/*.mustache'],
				// Change into the example folder
				out : 'example/views.production.js'
			}
		}
	});

	grunt.loadTasks("./tasks");
	// Default task.
	grunt.registerTask('resources', 'concat:resources min:resources');
	grunt.registerTask('default', 'resources');

};