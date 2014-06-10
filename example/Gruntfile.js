module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    cancompile: {
      options: {
        version: '2.1.1'
      },
      dist: {
        src: ['**/*.ejs', '**/*.mustache', '**/*.stache'],
        dest: 'dist/views.production.js'
      }
    },
    concat: {
      dist: {
        src: [
          'bower_components/todomvc-common/base.js',
          'bower_components/jquery/jquery.js',
          'bower_components/canjs/can.jquery.js',
          'bower_components/canjs-localstorage/can.localstorage.js',
          'js/models/todo.js',
          'js/components/todo-app.js',
          'js/app.js',
          '<%= cancompile.dist.dest %>' // The compiled views
        ],
        dest: 'dist/production.js'
      }
    },
    uglify: {
      dist: {
        files: {
          'dist/production.min.js': ['<%= concat.dist.dest %>']
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
