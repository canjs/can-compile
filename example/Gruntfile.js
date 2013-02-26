module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		cancompile: {
			dist: {
				src: ['**/*.ejs', '**/*.mustache'],
				// Change into the example folder
				out: 'production/views.production.js'
			}
		},
		concat: {
			dist: {
				src: [
					'js/base.js',
					'../resources/js/can.jquery.1.1.2.js',
					'../resources/js/can.view.mustache.1.1.2.js',
					'js/can.localstorage.js',
					'js/app.js',
					'<%= cancompile.dist.out %>' // The compiled views
				],
				dest: 'production/production.js'
			}
		},
		uglify: {
			dist: {
				files: {
					'production/production.min.js': ['<%= concat.dist.dest %>']
				}
			}
		}
	});

	// Default task.
	grunt.registerTask('default', ['cancompile', 'concat', 'uglify']);

	grunt.loadTasks('../tasks');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
};