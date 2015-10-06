'use strict';

var compile = require('./lib/index.js');
var path = require('path');
var through = require("through2");
var gutil = require('gulp-util');
var File = gutil.File;
var PluginError = gutil.PluginError;

// file can be a vinyl file object or a string
// when a string it will construct a new one
function runCompile(file, options) {
  if (!file) {
    throw new PluginError('can-compile', 'Missing file option for can-compile');
  }

  var templatePaths = [],
      fileName,
      latestFile;

  options = options || {};
  
  function bufferStream (file, enc, cb) {
    // ignore empty files
    if (file.isNull()) {
      cb();
      return;
    }

    // can't do streams yet
    if (file.isStream()) {
      this.emit('error', new PluginError('can-compile',  'Streaming not supported for can-compile'));
      cb();
      return;
    }

    // set latest file if not already set,
    // or if the current file was modified more recently.
    if (!latestFile || file.stat && file.stat.mtime > latestFile.stat.mtime) {
      latestFile = file;
    }

    templatePaths.push(file.path);
    cb();
  }

  function endStream(cb) {
    var self = this;

    // no files passed in, no file goes out
    if (!latestFile || !templatePaths.length) {
      cb();
      return;
    }

    compile(templatePaths, options, function (err, result) {
      if (err) {
        self.emit('error', new PluginError('can-compile',  err));
        return cb(err);
      }

      var joinedFile;

      // if file opt was a file path
      // clone everything from the latest file
      if (typeof file === 'string') {
        joinedFile = latestFile.clone({ contents: false });
        joinedFile.path = path.join(latestFile.base, file);
      } else {
        joinedFile = new File(file);
      }

      joinedFile.contents = new Buffer(result);

      self.push(joinedFile);

      cb();
    });
  }

  return through.obj(bufferStream, endStream);
}

module.exports = runCompile;

/**
 * Create a new gulp task to compile CanJS templates.
 * @param  {string} taskName
 * @param  {object} options  same as for can-compile's options.
 * @param  {gulp} pass in your gulp instance, so it registers the task correctly.
 */
module.exports.task = function(taskName, options, gulp, deps){
  var destName = path.basename(options.out, '.js') + '.js';
  var destPath = path.dirname(options.out);

  deps = deps || [];

  gulp.task(taskName, deps, function() {
    return gulp.src( options.src )
      .pipe( runCompile(destName, options) )
      .pipe( gulp.dest(destPath) );
  });
};

/**
 * Optionally, watch for template changes and rerun the gulp task.  Pass the same options
 * for the task. Each task will need its own watch.
 * @param  {string} taskName
 * @param  {object} options  same as for can-compile's options.
 * @param  {gulp} pass in your gulp instance, so it registers the task correctly.
 */
module.exports.watch = function(taskName, options, gulp){
  gulp.task(taskName + '-watch', function() {
    // Rerun the task when a file changes
    gulp.watch(options.src, [taskName]);
  });
};
