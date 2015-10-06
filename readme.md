# can-compile

[![Build Status](https://travis-ci.org/daffl/can-compile.png?branch=master)](https://travis-ci.org/daffl/can-compile)

NodeJS module that compiles [CanJS](http://canjs.us/) EJS and Mustache views into a single JavaScript file for lightning fast
production apps.

With NodeJS installed, just run NPM:

> npm install can-compile -g

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
      options: {
        version: '2.1.1'
      },
      dist: {
        options: {
          wrapper: '!function() { {{{content}}} }();',
          tags: ['editor', 'my-component']
        },
        src: ['**/*.ejs', '**/*.mustache'],
        dest: 'production/views.production.js'
      },
      legacy: {
        src: ['**/*.ejs', '**/*.mustache'],
        dest: 'production/views.production.js',
        options: {
          version: '1.1.2'
        }
      }
    },
    concat: {
      dist: {
        src: [
          '../resources/js/can.jquery.js',
          '../resources/js/can.view.mustache.js',
          'js/app.js', // You app
          '<%= cancompile.dist.dest %>' // The compiled views
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

## Gulp task

It is also quite easy to get this up and running with your production build using Gulp.  By placing the following example in your gulpfile.js, all mustache templates in the client/app directory will be compiled into a file at `public/assets/views.production.js`.

```javascript
var gulp = require('gulp');
var compilerGulp = require('can-compile/gulp.js');

var options = {
	version: '2.2.7'
};
    
gulp.task("app-views", function () {
	return gulp.src('client/app/**/*.mustache')
		.pipe( compilerGulp('views.production.js', options) )
		.pipe( gulp.dest('public/assets') );
});
```
**Or you can use available helpers to create your task and watch your files:**

```javascript
var gulp = require('gulp');
var compilerGulp = require('can-compile/gulp.js');
    
var options = {
  version: '2.2.7',
  src: ['client/app/**/*.mustache'],
  out: 'public/assets/views.production.js',
  tags: ['editor', 'my-component']
};

// Creates a task called 'app-views'.
// You must pass in the same gulp instance.
// You may also pass optional task dependencies (ex. 'clean')
compilerGulp.task('app-views', options, gulp, ['clean']);

// Creates a task called 'app-views-watch'. Optional, but convenient.
compilerGulp.watch('app-views', options, gulp);

// The default task (called when you run `gulp` from cli)
gulp.task('default', [
    'app-views',
    'app-views-watch'
]);
```

You'll need gulp installed globally and locally:

    sudo npm install gulp -g
    npm install gulp

And a local copy of can-compile

    npm install can-compile

Run `gulp` in the command line to build.

## Programmatically

You can compile individual files directly like this:

```javascript
var compiler = require('can-compile');
var options = {
  filename: 'file.ejs',
  version: '2.0.1'
};

compiler.compile(options, function(error, output) {
  output // -> compiled `file.ejs`
});
```

The options object allows the following configuration options:

- `filename` {String}: The name of the file to be compiled
- `version` {String}: The CanJS version to be used
- `log` {Function}: A logger function (e..g `console.log.bind(console)`)
- `normalizer` {Function}: A Function that returns the normalized path name
- `tags` {Array}: A list of all your can.Component tags. They need to be registered in order to pre-compile views properly.
- `extensions` {Object}: An object to map custom file extensions to the standard extension (e.g. `{ 'mst' : 'mustache' }`)
- `viewAttributes` {Array}: A list of attribute names (RegExp or String), used for additional behavior for an attribute in a view (can.view.attr)
- `paths` an object with `ejs`, `mustache` or `stache` and a `jquery` property pointing to files of existing versions or CanJS and jQuery instead of the CDN links.

```javascript
compiler.compile({
  filename: 'file.ejs',
  log: console.log.bind(console),
  normalizer: function(filename) {
    return path.relative(__dirname, filename);
  },
  version: '2.0.7'
}, function(error, output) {
  output // -> compiled `file.ejs`
});
```

## Command line

The `can-compile` command line tool takes a list of files (by default all `*.ejs` and `*.mustache` files in the current folder)
or a list of [filename patterns](https://github.com/isaacs/minimatch) and writes the compiled views into an `out` file
(default: `views.production.js`).

__Examples:__

Compile all EJS and Mustache files in the current folder and write them to `views.combined.js` using version 2.1.0:

> can-compile --out views.combined.js --can 2.1.0

Compile `todo.ejs` using CanJS version 1.1.2, write it to `views.production.js`:

> can-compile todo.ejs --can 1.1.2

Compile all EJS files in the current directory and all subdirectories and `mustache/test.mustache`.
Write the result to `views.combined.js`:

> can-compile **/*.ejs mustache/test.mustache --out views.combined.js --can 2.0.0

## Loading with RequireJS

To use your pre-compile views with [RequireJS](http://requirejs.org/) just add a custom `wrapper` in the options
that uses the AMD definition to load `can/view/mustache` and/or `can/view/ejs` (depending on what you are using).
In a Grunt task:

Mustache:

```javascript
module.exports = function (grunt) {
  // Project configuration.
  grunt.initConfig({
    options: {
      wrapper: 'define(["can/view/mustache"], function(can) { {{{content}}} });'
    },
    cancompile: {
      dist: {
        src: ['**/*.mustache', '!node_modules/**/*.mustache'],
        dest: 'production/views.production.js',
      }
    }
  });
}
```

Stache:

```javascript
module.exports = function (grunt) {
  // Project configuration.
  grunt.initConfig({
    options: {
      wrapper: 'define(["can", "can/view/stache"], function(can) { {{{content}}} });'
    },
    cancompile: {
      dist: {
        src: ['**/*.stache', '!node_modules/**/*.stache'],
        dest: 'production/views.production.js',
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

> can-compile --out app/views.production.js --can 2.0.0

## Changelog

__0.9.0:__

- Allowing user to supply paths for jquery and can ([#36](https://github.com/daffl/can-compile/pull/36), [#30](https://github.com/daffl/can-compile/issues/30))

__0.8.0:__

- Fixed path normalize on Windows, Alternative file extension, can.view.attr ([#32](https://github.com/daffl/can-compile/pull/32))

__0.7.1:__

- Gulp task - Error: Cannot find module 'glob' ([#27](https://github.com/daffl/can-compile/issues/27))
- Also use [glob](https://github.com/isaacs/node-glob) module in CLI

__0.7.0:__

- Added up to date TodoMVC based [example](https://github.com/daffl/can-compile/tree/master/example)
- Made `version` flag mandatory (caused unexpected behaviour after CanJS updates)
- Added CanJS 2.1 compatibility ([#20](https://github.com/daffl/can-compile/issues/20), [#21](https://github.com/daffl/can-compile/issues/21), [#22](https://github.com/daffl/can-compile/issues/22))
- Fixed Grunt options ([#8](https://github.com/daffl/can-compile/pull/8))

__0.6.0:__

- Added Gulp task ([#16](https://github.com/daffl/can-compile/pull/16), [#17](https://github.com/daffl/can-compile/pull/17), [#18](https://github.com/daffl/can-compile/pull/18))

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

## License

Copyright (C) 2014 David Luecke daff@neyeon.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
