'use strict';

var Zombie = require("zombie");
var fs = require('fs');
var browser = null;
var visit = function (callback) {
	if (browser === null) {
		Zombie.visit("file://" + __dirname + "/../resources/loader.html", {
			runScripts : true
		}, function (err, b) {
			browser = b;
			callback(err, b);
		});
	} else {
		callback(null, browser);
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

	visit(function (error, browser) {
		if (log) {
			log('Compiling ' + filename);
		}

		if (error) {
			return callback(error);
		}

		var window = browser.document.window;
		var can = window.can;
		var type = filename.substring(filename.lastIndexOf('.') + 1, filename.length);
		var text = fs.readFileSync(filename).toString();
		// Create an id from the normalized filename
		var id = can.view.toId(normalizer(filename));
		// TODO throw error if type is not registered
		var script = can.view.types["." + type].script(id, text);

		callback(null, script, id);
	});
};
