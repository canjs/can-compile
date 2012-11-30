var Zombie = require("zombie");
var fs = require('fs');

module.exports = function (files, normalize, callback) {
	files = Array.isArray(files) ? files : [files];
	var normalizer = function(filename) {
		return filename;
	}
	if(!callback) {
		callback = normalize;
	} else {
		normalizer = normalize;
	}

	Zombie.visit("file://" + __dirname + "/../resources/loader.html", {
		runScripts : true
	}, function (err, browser, status) {
		if (err) return callback(err);

		var window = browser.document.window;
		var can = window.can;
		var getScript = function (filename) {
			var type = filename.substring(filename.lastIndexOf('.') + 1, filename.length);
			var text = fs.readFileSync(filename).toString();
			// Create an id from the normalized filename
			var id = can.view.toId(normalizer(filename));
			// TODO throw error if type is not registered
			var script = can.view.types["." + type].script(id, text);
			return "can.view.preload('" + id + "'," + script + ");";
		}
		var result = files.map(getScript);

		callback(null, result);
	});
}
