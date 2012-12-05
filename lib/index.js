'use strict';

var compiler = require('./compile');
var fs = require('fs');
var path = require('path');
var async = require('async');

module.exports = function (files, configuration, callback, log) {
	files = Array.isArray(files) ? files : [files];
	// Normalize ids to filenames relative to the output file
	var normalizer = function (filename) {
		return path.relative(path.dirname(configuration.out), filename);
	};
	var callbacks = files.map(function (file) {
		return function (callback) {
			compiler(file, normalizer, function (error, compiled, id) {
				if (error) {
					return callback(error);
				}
				callback(null, compiled, id);
			}, log);
		};
	});

	async.series(callbacks, function (errors, results) {
		if (errors) {
			return callback(errors);
		}
		var list = results.map(function (compiled) {
			return "can.view.preload('" + compiled[1] + "'," + compiled[0] + ");";
		});
		var output = '(function(window) {\n' + list.join('\n') + '\n})(this);';

		if (configuration.out) {
			fs.writeFile(configuration.out, output, function (err) {
				callback(err, output, configuration.out);
			});
		} else {
			callback(null, output);
		}
	});
};

module.exports.compile = compiler;