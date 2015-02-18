'use strict';

var compiler = require('./compile');
var fs = require('fs');
var path = require('path');
var async = require('async');
var Handlebars = require('handlebars');

module.exports = function(files, configuration, callback, log) {
  files = Array.isArray(files) ? files : [files];
  // Normalize ids to filenames relative to the output file
  var normalizer = configuration.normalizer || function(filename) {
    return path.relative(path.dirname(configuration.out), filename).replace(/\\/g,"/");
  };
  var callbacks = files.map(function(file) {
    return function(callback) {
      compiler({
        filename: file,
        normalizer: normalizer,
        log: log,
        tags: configuration.tags,
        extensions: configuration.extensions,
        viewAttributes: configuration.viewAttributes,
        version: configuration.version
      }, function(error, compiled, id) {
        if (error) {
          return callback(error);
        }
        callback(null, compiled, id);
      });
    };
  });
  var renderer = Handlebars.compile(configuration.wrapper || '(function(window) {\n {{{content}}} \n})(this);');

  async.series(callbacks, function(errors, results) {
    if (errors) {
      return callback(errors);
    }
    var list = results.map(function(compiled) {
      var options = compiled[1];
      var method = configuration.version.indexOf('2.1') === 0 ? 'preloadStringRenderer' : 'preload';
      var output = compiled[0];

      if(output === null) {
        return "can." + options.type + "('" + options.id + "', " + JSON.stringify(options.text) + ");";
      }

      return "can.view." + method + "('" + options.id + "'," + output + ");";
    });
    var output = renderer({
      content: list.join('\n'),
      list: list
    });

    if (configuration.out) {
      fs.writeFile(configuration.out, output, function(err) {
        callback(err, output, configuration.out);
      });
    } else {
      callback(null, output);
    }
  });
};

module.exports.compile = compiler;
