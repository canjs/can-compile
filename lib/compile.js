var Zombie = require("zombie");
var fs = require('fs');

module.exports = function (files, callback) {
	Zombie.visit("file://" + __dirname + "/../empty.html", {
		runScripts : true
	}, function (err, browser, status) {
		if (err) return callback(err);

		var window = browser.document.window;
		var can = window.can;
		var getScript = function (id, type, text) {
			if (!text && !type) {
				type = id.substring(id.lastIndexOf('.') + 1, id.length);
				text = fs.readFileSync(id).toString();
			}
			id = can.view.toId(id);
			var script = can.view.types["." + type].script(id, text);
			return "can.view.preload('" + id + "'," + script + ");";
		}
		var result = files.map(function(filename) {
			return getScript(filename);
		});

		callback(null, result);
	});
}
