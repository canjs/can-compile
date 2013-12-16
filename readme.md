# can-compile

[![Build Status](https://travis-ci.org/daffl/can-compile.png?branch=master)](https://travis-ci.org/daffl/can-compile)

NodeJS module that compiles [CanJS](http://canjs.us/) EJS and Mustache views into a single JavaScript file for lightning fast
production apps.

With NodeJS installed, just run NPM:

> npm install can-compile -g

## Command line

The `can-compile` command line tool takes a list of files (by default all `*.ejs` and `*.mustache` files in the current folder)
or a list of [filename patterns](https://github.com/isaacs/minimatch) and writes the compiled views into an `out` file
(default: `views.production.js`).

__Examples:__

Compile all EJS and Mustache files in the current folder and write them to `views.combined.js`:

> can-compile --out views.combined.js

Compile `todo.ejs` using CanJS version 1.1.2, write it to `views.production.js`:

> can-compile todo.ejs --can 1.1.2

Compile all EJS files in the current directory and all subdirectories and `mustache/test.mustache`.
Write the result to `views.combined.js`:

> can-compile **/*.ejs mustache/test.mustache --out views.combined.js

## Grunt task

can-compile also comes with a [Grunt](http://gruntjs.com) task so you can easily make it part of your production build.
Just `npm install can-compile` in you project folder (or add it as a development dependency).
The following example shows a Gruntfile that compiles all Mustache views and then builds a concatenated and minified `production.js`
of a CanJS application:

```javascript
module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    cancompile: {
      dist: {
        src: ['**/*.ejs', '**/*.mustache'],
        out: 'production/views.production.js',
        wrapper: '!function() { {{{content}}} }();',
        tags: ['editor', 'my-component']
      },
      legacy: {
        src: ['**/*.ejs', '**/*.mustache'],
        out: 'production/views.production.js',
        version: '1.1.2'
      }
    },
    concat: {
      dist: {
        src: [
          '../resources/js/can.jquery.js',
          '../resources/js/can.view.mustache.js',
          'js/app.js', // You app
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

  grunt.loadNpmTasks('can-compile');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
};
```

## Programmatically

You can compie files directly like this:

```javascript
var compiler = require('can-compile');

compiler.compile('file.ejs', function(error, output) {
  output // -> compiled `file.ejs`
});
```

Passing an object as the first parameter allows you the following configuration options:

- `filename` {String}: The name of the file to be compiled
- `version` {String} (default: `latest`): The CanJS version to be used
- `log` {Function}: A logger function (e..g `console.log.bind(console)`)
- `normalizer` {Function}: A Function that returns the normalized path name
- `tags` {Array}: A list of all your can.Component tags. They need to be registered in order to pre-compile views properly.

```javascript
compiler.compile({
  filename: 'file.ejs',
  log: console.log.bind(console),
  normalizer: function(filename) {
    return path.relative(__dirname, filename);
  },
  version: '1.1.6'
}, function(error, output) {
  output // -> compiled `file.ejs`
});
```

## Loading with RequireJS

To use your pre-compile views with [RequireJS](http://requirejs.org/) just add a custom `wrapper` in the options
that uses the AMD definition to load `can/view/mustache` and/or `can/view/ejs` (depending on what you are using).
In a Grunt task:

```js
module.exports = function (grunt) {
  // Project configuration.
  grunt.initConfig({
    cancompile: {
      dist: {
        src: ['**/*.mustache'],
        out: 'production/views.production.js',
        wrapper: 'define(["can/view/mustache"], function(can) { {{{content}}} });'
      }
    }
  });
}
```

To load the generated files only when running the [RequireJS optimizer r.js](http://requirejs.org/docs/optimization.html)
define an empty module in development like:

```js
define('views', function() {});
```

And `require('views');` in your main application file.

When running the optimizer map this module to the production build file:

```js
paths: {
  views: 'views.production'
}
```

## Note

Always make sure that the output file is in the same folder as the root level for the views that are being loaded.
So if your CanJS applications HTML file is in the `app` folder within the current directory use a filename within
that folder as the output file:

> can-compile --out app/views.production.js

## Changelog

__0.5.0:__

- Merged [#11](https://github.com/daffl/can-compile/pull/11): Implement can.Component/tag-support

__0.4.1:__

- Merged [#10](https://github.com/daffl/can-compile/pull/10): Allow for setting a custom normalizer

__0.4.0:__

- Verify CanJS 2.0.0 compatbility, load can.EJS which isn't in the core anymore

__0.3.2:__

- Custom `wrapper` option uses [Handlebars](http://handlebarsjs.com/) because Underscore templates are useless in Grunt files

__0.3.1:__

- Adds a custom `wrapper` option (uses [_.template](http://underscorejs.org/#template)).

__0.3.0:__

- Allows compilation for different CanJS versions

__0.2.1:__

- Switched to plain JSDom
- Update to CanJS 1.1.5
- Verified Node 0.10 compatibility

__0.2.0:__

- Grunt 0.4.0 compatibility
- Added Travis CI

__0.1.0:__

- Initial release
