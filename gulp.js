'use strict';

var compile = require('./lib/index.js');
var glob = require('glob');

/**
 * Create a new gulp task to compile CanJS templates.
 * @param  {string} taskName
 * @param  {object} options  same as for can-compile's options.
 * @param  {gulp} pass in your gulp instance, so it registers the task correctly.
 */
exports.task = function(taskName, options, gulp){

  gulp.task(taskName, function() {

    // Glob needs a string, but compiler needs an array.
    options.glob = options.src.join();

    glob(options.glob, function (er, files) {
      compile(files, options, function(error, output, outfile) {
        console.log('Finished compiling', outfile);
      });
    });

  });
};

/**
 * Optionally, watch for template changes and rerun the gulp task.  Pass the same options
 * for the task. Each task will need its own watch.
 * @param  {string} taskName
 * @param  {object} options  same as for can-compile's options.
 * @param  {gulp} pass in your gulp instance, so it registers the task correctly.
 */
exports.watch = function(taskName, options, gulp){
  gulp.task(taskName + '-watch', function() {
    // Rerun the task when a file changes
    gulp.watch(options.src, [taskName]);
  });
};