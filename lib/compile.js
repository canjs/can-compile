'use strict';

var fs = require('fs');
var jsdom = require("jsdom");
var window = {};
var visit = function(version, callback) {
  if (!window[version]) {
    // TODO jQuery version mapping
    jsdom.env('<h1>can-compile</h1>',
      [ 'http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js',
        'http://canjs.com/release/' + version + '/can.jquery.js',
        'http://canjs.com/release/' + version + '/can.ejs.js',
        'http://canjs.com/release/' + version + '/can.view.mustache.js' ],
      function(error, win) {
        if (error) {
          return callback(error);
        }

        window[version] = win;
        callback(null, window[version]);
      }
    );
  } else {
    callback(null, window[version]);
  }
};

module.exports = function(options, callback) {
  var filename = typeof options === 'string' ? options : options.filename;
  var normalizer = options.normalizer || function(filename) {
    return filename;
  };

  visit(options.version || 'latest', function(error, win) {
    if (typeof options.log === 'function') {
      options.log('Compiling ' + filename);
    }

    if (error) {
      return callback(error);
    }

    var can = win.can;

    if (options.tags && options.tags.length) {
      for (var i = 0; i < options.tags.length; i++) {
        can.view.Scanner.tags[options.tags[i]] = function() {
        };
      }
    }

    var type = filename.substring(filename.lastIndexOf('.') + 1, filename.length);
    var text = fs.readFileSync(filename).toString();
    // Create an id from the normalized filename
    var id = can.view.toId(normalizer(filename));
    // TODO throw error if type is not registered
    var script = can.view.types["." + type].script(id, text);

    callback(null, script, id);
  });
};
