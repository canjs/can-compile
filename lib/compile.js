'use strict';

var fs = require('fs');
var jsdom = require("jsdom");
var window = {};
var visit = function (version, callback) {
  if(!callback) {
    callback = version;
    version = 'latest';
  }

	if(window[version] === undefined) {
    // TODO jQuery version mapping
		jsdom.env('<h1>can-compile</h1>',
			[ 'http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js',
        'http://canjs.com/release/' + version + '/can.jquery.js',
        'http://canjs.com/release/' + version + '/can.view.mustache.js' ],
			function (error, win) {
				if(error) {
					return callback(error);
				}

				window = win;
				callback(null, window);
			}
		);
	} else {
		callback(null, window);
	}
};

module.exports = function (filename, normalize, callback, log) {
	var normalizer = function (filename) {
		return filename;
	};
	if (!callback) {
		callback = normalize;
	} else {
		normalizer = normalize;
	}

	visit(function (error, win) {
		if (log) {
			log('Compiling ' + filename);
		}

		if (error) {
			return callback(error);
		}

		var can = win.can;
		var type = filename.substring(filename.lastIndexOf('.') + 1, filename.length);
		var text = fs.readFileSync(filename).toString();
		// Create an id from the normalized filename
		var id = can.view.toId(normalizer(filename));
		// TODO throw error if type is not registered
		var script = can.view.types["." + type].script(id, text);

		callback(null, script, id);
	});
};
