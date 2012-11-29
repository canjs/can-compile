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

## Programmatically