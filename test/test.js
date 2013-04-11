/*global describe, it */
'use strict';

var expect = require('expect.js');
var compiler = require('../lib');
var path = require('path');

describe('CanJS view compiler tests', function() {
	var expectedEJS = "can.EJS(function(_CONTEXT,_VIEW) { " +
		"with(_VIEW) { with (_CONTEXT) {var ___v1ew = [];___v1ew.push(\"<h2>\");" +
		"___v1ew.push(can.view.txt(1,'h2',0,this,function(){ " +
		"return  message }));___v1ew.push(\"</h2>\");; return ___v1ew.join('')}} })";

	var expectedMustache = 'can.Mustache(function(_CONTEXT,_VIEW) { with(_VIEW) { with (_CONTEXT) {var ___v1ew = [];var ___c0nt3xt = this && this.___st4ck3d ? this : [];___c0nt3xt.___st4ck3d = true;var ___st4ck = function(context, self) {var s;if (arguments.length == 1 && context) {s = !context.___st4ck3d ? [context] : context;} else if (!context.___st4ck3d) {s = [self, context];} else if (context && context === self && context.___st4ck3d) {s = context.slice(0);} else {s = context && context.___st4ck3d ? context.concat([self]) : ___st4ck(context).concat([self]);}return (s.___st4ck3d = true) && s;};___v1ew.push("<h2>");___v1ew.push(can.view.txt(1,\'h2\',0,this,function(){ return can.Mustache.txt({context:___st4ck(___c0nt3xt,this),options:options},null,can.Mustache.get("message",{context:___st4ck(___c0nt3xt,this),options:options},false,false));}));___v1ew.push("</h2>");; return ___v1ew.join(\'\')}} })';

	var normalizer = function(filename) {
		return path.relative(__dirname, filename);
	};

	it('compiles EJS, normalizes view ids', function(done) {
		compiler.compile(__dirname + '/fixtures/view.ejs', normalizer,
			function(error, output, id) {
				expect(output).to.be(expectedEJS);
				expect(id).to.be('fixtures_view_ejs');
				done();
			});
	});

	it('compiles Mustache, normalizes view ids', function(done) {
		compiler.compile(__dirname + '/fixtures/view.mustache', normalizer,
			function(error, output, id) {
				expect(output).to.be(expectedMustache);
				expect(id).to.be('fixtures_view_mustache');
				done();
			});
	});

	it('generates output text', function(done) {
		compiler([__dirname + '/fixtures/view.ejs', __dirname + '/fixtures/view.mustache'], {},
			function(err, result) {
				var expected = '(function(window) {\n' +
					"can.view.preload('test_fixtures_view_ejs'," + expectedEJS + ");\n" +
					"can.view.preload('test_fixtures_view_mustache'," + expectedMustache + ");\n" +
					'})(this);';

				expect(result).to.be(expected);
				done();
			});
	});
});
