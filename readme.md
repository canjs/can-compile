# can-compile

NodeJS module that compiles CanJS EJS and Mustache views into a single JavaScript file for lightning fast
production apps.

## Command line

The `can-compile` command line tool takes a list of files or a list of [filename patterns](https://github.com/isaacs/minimatch) and writes the compiled views into `out` (default: `views.js`).

__Examples:__

Compile `todo.ejs`, write it to `views.js`:

> can-compile todo.ejs

Compile all EJS files in the current directory and all subdirectories and write the result to `views.production.js`:

> can-compile **/*.ejs --out views.production.js

Compile all EJS and Mustache files in the current directory and all subdirectories and write the result to
`views.production.js`:

> can-compile **/*.ejs **/*.mustache --out views.production.js

## Grunt task

can-compile also comes with a [Grunt](http://gruntjs.com) task so you can easily make it part of your production build.

module.exports = function (grunt) {

```javascript
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
				out : 'views.production.js'
			}
		}
	});

	grunt.loadTasks("./tasks");
	// Default task.
	grunt.registerTask('resources', 'concat:resources min:resources');
	grunt.registerTask('default', 'resources');

};
```

## Programmatically

```javascript
var compiler = require('can-compile');

compiler.compile('file.ejs', function(error, output) {
  output // -> compiled `file.ejs`
});
```