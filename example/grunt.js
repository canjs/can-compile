module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		cancompile : {
			dist : {
				src : ['**/*.ejs', '**/*.mustache'],
				// Change into the example folder
				out : 'production/views.production.js'
			}
		},
		concat : {
			dist : {
				src : [
					'js/base.js',
					'../resources/js/can.jquery.1.1.2.js',
					'../resources/js/can.view.mustache.1.1.2.js',
					'js/can.localstorage.js',
					'js/app.js',
					'<config:cancompile.dist.out>' // The compiled views
				],
				dest : 'production/production.js'
			}
		},
		min : {
			dist : {
				src : '<config:concat.dist.dest>',
				dest : 'production/production.min.js'
			}
		}
	});

	grunt.loadTasks('../tasks');

	// Default task.
	grunt.registerTask('default', 'cancompile concat min');

};