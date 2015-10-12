"use strict";

var fs = require('fs');
var SimpleWindow = require('can-simple-window');
var resolveScripts = require('./resolveScripts');

var cache = {};

var visit = function(version, scripts, callback) {
  if (!cache[version]) {
    SimpleWindow.env('<h1>can-compile</h1>',
      scripts,
      function(error, win) {
        if (error) {
          return callback(error);
        }

        cache[version] = win;
        callback(null, cache[version]);
      }
    );
  } else {
    callback(null, cache[version]);
  }
};
var noop = function() {};



module.exports = function(options, callback) {
  var filename = typeof options === 'string' ? options : options.filename;
  var normalizer = options.normalizer || function(filename) {
    return filename;
  };

  if(!options.version) {
    return callback(new Error('A specific CanJS version number must be passed to compile views.'));
  }

  visit(options.version, resolveScripts(options.version, options.paths), function(error, win) {
    if (typeof options.log === 'function') {
      options.log('Compiling ' + filename);
    }

    if (error) {
      return callback(error);
    }

    var can = win.can;

    if (options.viewAttributes && options.viewAttributes.length) {
        for (var i = 0; i < options.viewAttributes.length; i++) {
          can.view.attr(options.viewAttributes[i], noop);
        }
    }

    if (options.tags && options.tags.length) {
      for (var j = 0; j < options.tags.length; j++) {
        can.view.Scanner.tags[options.tags[j]] = noop;
      }
    }

    var type = filename.substring(filename.lastIndexOf('.') + 1, filename.length);
    if (options.extensions)
      type = options.extensions[type] || type;
    var text = fs.readFileSync(filename).toString();
    // Create an id from the normalized filename
    var id = can.view.toId(normalizer(filename));
    // TODO throw error if type is not registered
    var script = can.view.types["." + type] ? can.view.types["." + type].script(id, text) : null;

    callback(null, script, {
      id: id,
      text: text,
      type: type
    });
  });
};
