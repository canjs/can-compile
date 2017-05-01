/*global describe, it */
/*jshint -W083 */
'use strict';

var expect = require('expect.js');
var assert = require('stream-assert');
var compiler = require('../lib');
var resolveScripts = require('../lib/resolveScripts');
var fs = require('fs');
var path = require('path');
var semver = require('semver');
var gulp = require('gulp');
var gulpCompile = require('../gulp');
var File = require('gulp-util').File;

var expected = {
  '1.1.5': {
    ejs: "can.EJS(function(_CONTEXT,_VIEW) { " +
      "with(_VIEW) { with (_CONTEXT) {var ___v1ew = [];___v1ew.push(\"<h2>\");" +
      "___v1ew.push(can.view.txt(1,'h2',0,this,function(){ " +
      "return  message }));___v1ew.push(\"</h2>\");; return ___v1ew.join('')}} })",
    mustache: 'can.Mustache(function(_CONTEXT,_VIEW) { with(_VIEW) { with (_CONTEXT) {var ___v1ew = [];var ___c0nt3xt = this && this.___st4ck3d ? this : [];___c0nt3xt.___st4ck3d = true;var ___st4ck = function(context, self) {var s;if (arguments.length == 1 && context) {s = !context.___st4ck3d ? [context] : context;} else if (!context.___st4ck3d) {s = [self, context];} else if (context && context === self && context.___st4ck3d) {s = context.slice(0);} else {s = context && context.___st4ck3d ? context.concat([self]) : ___st4ck(context).concat([self]);}return (s.___st4ck3d = true) && s;};___v1ew.push("<h2>");___v1ew.push(can.view.txt(1,\'h2\',0,this,function(){ return can.Mustache.txt({context:___st4ck(___c0nt3xt,this),options:options},null,can.Mustache.get("message",{context:___st4ck(___c0nt3xt,this),options:options},false,false));}));___v1ew.push("</h2>");; return ___v1ew.join(\'\')}} })'
  },

  '1.1.2': {
    ejs: "can.EJS(function(_CONTEXT,_VIEW) { " +
      "with(_VIEW) { with (_CONTEXT) {var ___v1ew = [];___v1ew.push(\"<h2>\");" +
      "___v1ew.push(can.view.txt(1,'h2',0,this,function(){ " +
      "return  message }));___v1ew.push(\"</h2>\");; return ___v1ew.join('')}} })",

    mustache: "can.Mustache(function(_CONTEXT,_VIEW) { " +
      "with(_VIEW) { with (_CONTEXT) {var ___v1ew = [];var ___c0nt3xt = []; ___c0nt3xt.___st4ck = true;" +
      "var ___st4ck = function(context, self) {var s;if (arguments.length == 1 && context) {" +
      "s = !context.___st4ck ? [context] : context;} else {" +
      "s = context && context.___st4ck ? context.concat([self]) : ___st4ck(context).concat([self]);}" +
      "return (s.___st4ck = true) && s;};___v1ew.push(\"<h2>\");" +
      "___v1ew.push(can.view.txt(1,'h2',0,this,function(){ " +
      "return can.Mustache.txt(___st4ck(___c0nt3xt,this),null," +
      "can.Mustache.get(\"message\",___st4ck(___c0nt3xt,this)));}));" +
      "___v1ew.push(\"</h2>\");; return ___v1ew.join('')}} })"
  },

  '2.0.0': {
    ejs: "can.EJS(function(_CONTEXT,_VIEW) { with(_VIEW) { with (_CONTEXT) {var ___v1ew = [];___v1ew.push(\n\"<h2>\");___v1ew.push(\ncan.view.txt(\n1,\n'h2',\n0,\nthis,\nfunction(){ return  message }));\n___v1ew.push(\n\"</h2>\");; return ___v1ew.join('')}} })",

    mustache: "can.Mustache(function(scope,options) { var ___v1ew = [];___v1ew.push(\n\"<h2>\");___v1ew.push(\ncan.view.txt(\n1,\n'h2',\n0,\nthis,\nfunction(){ return can.Mustache.txt(\n{scope:scope,options:options},\nnull,{get:\"message\"})}));\n___v1ew.push(\n\"</h2>\");; return ___v1ew.join('') })"
  },

  '2.1.0': {
    ejs: "can.EJS(function(_CONTEXT,_VIEW) { with(_VIEW) { with (_CONTEXT) {var ___v1ew = [];___v1ew.push(\n\"<h2>\");___v1ew.push(\ncan.view.txt(\n1,\n'h2',\n0,\nthis,\nfunction(){ return  message }));\n___v1ew.push(\n\"</h2>\");; return ___v1ew.join('')}} })",

    mustache: "can.Mustache(function(scope,options) { var ___v1ew = [];___v1ew.push(\n\"<h2>\");___v1ew.push(\ncan.view.txt(\n1,\n'h2',\n0,\nthis,\ncan.Mustache.txt(\n{scope:scope,options:options},\nnull,{get:\"message\"})));___v1ew.push(\n\"</h2>\");; return ___v1ew.join('') })",
    stache: "can.stache(\"<h2>{{message}}</h2>\""
  }

};

var normalizer = function (filename) {
  return path.relative(__dirname, filename).replace(/\\/g,"/");
};

for(var version in expected) {
  (function(version, expectedEJS, expectedMustache, expectedStache) {
    var is21 = semver.satisfies(version, '>=2.1.x');
    var preloadMethod = is21 ? 'preloadStringRenderer' : 'preload';

    describe('CanJS view compiler tests, version ' + version, function () {
      it('compiles EJS, normalizes view ids', function (done) {
        compiler.compile({
          filename: __dirname + '/fixtures/view.ejs',
          normalizer: normalizer,
          version: version
        }, function (error, output, options) {
          expect(output).to.be(expectedEJS);
          expect(options.id).to.be('fixtures_view_ejs');
          done();
        });
      });

      it('compiles Mustache, normalizes view ids', function (done) {
        compiler.compile({
          filename: __dirname + '/fixtures/view.mustache',
          normalizer: normalizer,
          version: version
        }, function (error, output, options) {
          expect(output).to.be(expectedMustache);
          expect(options.id).to.be('fixtures_view_mustache');
          done();
        });
      });

      if(expectedStache) {
        it('compiles Stache', function (done) {
          compiler.compile({
            filename: __dirname + '/fixtures/view.stache',
            normalizer: normalizer,
            version: version
          }, function (error, output) {
            expect(output).to.be(expectedStache);
            done();
          });
        });
      }

      it('compiles Mustache, normalizes view ids and use alternative file extension', function (done) {
        compiler.compile({
          filename: __dirname + '/fixtures/view.mst',
          normalizer: normalizer,
          extensions: { 'mst' : 'mustache' },
          version: version
        }, function (error, output, options) {
          expect(output).to.be(expectedMustache);
          expect(options.id).to.be('fixtures_view_mst');
          done();
        });
      });

      it('generates output text with wrapper', function (done) {
        compiler([__dirname + '/fixtures/view.ejs', __dirname + '/fixtures/view.mustache'], {
            version: version,
            out: "test",
            wrapper: '!function() { {{{content}}} }();'
          }, function (err, result) {
            var expected = '!function() { ' +
              "can.view." + preloadMethod + "('test_fixtures_view_ejs'," + expectedEJS + ");\n" +
              "can.view." + preloadMethod + "('test_fixtures_view_mustache'," + expectedMustache + "); " +
              '}();';

            expect(result).to.be(expected);
            done();
          });
      });

      if(is21) {
        it('Adds plain text for unkown templating engines', function(done) {
          compiler([__dirname + '/fixtures/view.unknown'], {
            version: version,
            out: "test",
            wrapper: '!function() { {{{content}}} }();'
          }, function(err, result) {
            expect(result).to.be("!function() { can.unknown('test_fixtures_view_unknown', \"<h2 class=\\\"something\\\">{{message}}</h2>\"); }();");
            done();
          });
        });
      }
    });
  })(version, expected[version].ejs, expected[version].mustache);
}

describe('resolving scripts', function(){
  describe('with default paths', function(){
    it('uses proper version of jquery', function(){
      expect(resolveScripts('1.1.5')).to.contain('http://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js', '1.1.5 includes jQuery 1.11.2');
      expect(resolveScripts('2.1.3')).to.contain('http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js', '2.1.3 includes jQuery 2.1.3');
    });
    it('includes the right plugins', function(){
      expect(resolveScripts('1.1.5')).to.contain('http://v2.canjs.com/release/1.1.5/can.view.mustache.js', '1.1.5 includes mustache');
     // expect(resolveScripts('2.1.3')).to.contain('http://v2.canjs.com/release/2.1.3/can.view.mustache.system.js', '2.1.3 includes mustache with .system');
      expect(resolveScripts('2.1.3')).to.contain('http://v2.canjs.com/release/2.1.3/can.ejs.js', '2.1.3 includes ejs');
      expect(resolveScripts('2.1.3')).to.contain('http://v2.canjs.com/release/2.1.3/can.stache.js', '2.1.3 includes stache');
    });
  });

  describe('with user defined paths', function(){
    it('uses proper version of jquery', function(){
      var paths = {
        jquery: 'my/path/to/jquery.js'
      };
      var expected = path.resolve(process.cwd(), path.normalize('my/path/to/jquery.js'));

      expect(resolveScripts('1.1.5', paths)).to.contain(expected);
      expect(resolveScripts('2.1.3', paths)).to.contain(expected);
    });
    it('includes the right plugins', function(){
      var paths = {
        mustache: 'my/path/to/mustache.js',
        ejs: 'my/path/to/ejs.js',
        stache: 'my/path/to/stache.js'
      };
      var expected = {
        mustache: path.resolve(process.cwd(), path.normalize('my/path/to/mustache.js')),
        ejs: path.resolve(process.cwd(), path.normalize('my/path/to/ejs.js')),
        stache: path.resolve(process.cwd(), path.normalize('my/path/to/stache.js'))
      };

      expect(resolveScripts('1.1.5', paths)).to.contain(expected.mustache, '1.1.5 includes mustache');
      expect(resolveScripts('2.1.3', paths)).to.contain(expected.ejs, '2.1.3 includes ejs');
      expect(resolveScripts('2.1.3', paths)).to.contain(expected.stache, '2.1.3 includes stache');
    });
  });
});

describe('gulp task', function () {
  it('should throw when no file argument is specified', function () {
    expect(function () {
      gulpCompile();
    }).to.throwError();
  });

  it('should ignore null files', function (done) {
    var stream = gulpCompile('test.js');
    stream
      .pipe(assert.length(0))
      .pipe(assert.end(done));
    stream.write(new File());
    stream.end();
  });

  it('should emit error on streamed file', function (done) {
    gulp.src(__dirname + '/fixtures/*', { buffer: false })
      .pipe(gulpCompile('test.js'))
      .on('error', function (err) {
        expect(err.message).to.be('Streaming not supported for can-compile');
        done();
      });
  });

  it('should compile a single file', function (done) {
    gulp.src(__dirname + '/fixtures/view.ejs')
      .pipe(gulpCompile('test.js', {version: '2.2.7', out: "test.out" }))
      .pipe(assert.length(1))
      .pipe(assert.first(function (file) {
        var result = file.contents.toString();
        expect(result).to.contain('can.EJS');
        expect(result).not.to.contain('can.Mustache');
        expect(result).not.to.contain('can.stache');
      }))
      .pipe(assert.end(done));
  });

  it('should compile multiple different files', function (done) {
    gulp.src(__dirname + '/fixtures/*')
      .pipe(gulpCompile('test.js', {version: '2.2.7', out: "test.out" }))
      .pipe(assert.length(1))
      .pipe(assert.first(function (file) {
        var result = file.contents.toString();
        expect(result).to.contain('can.EJS');
        expect(result).to.contain('can.Mustache');
        expect(result).to.contain('can.stache');
      }))
      .pipe(assert.end(done));
  });

  describe('"task" helper', function () {
    // clean up any generated files
    after(function(done){
      fs.unlink(__dirname + '/views.production.js', done);
    });

    it('should register a gulp task', function () {
      gulpCompile.task('cancompile', { out: "test.out" }, gulp);
      expect(Object.keys(gulp.tasks)).to.contain('cancompile');
    });

    it('should include any dependencies', function () {
      gulpCompile.task('cancompile', { out: "test.out" }, gulp, ['clean']);
      expect(gulp.tasks.cancompile.dep).to.contain('clean');
    });

    it('should extract the file path/name from the "out" option', function (done) {
      gulpCompile.task('cancompile', { 
        src: __dirname + '/fixtures/*',
        out: __dirname + '/views.production.js',
        version: '2.2.7'
      }, gulp);

      gulp.tasks.cancompile.fn()
        .pipe(assert.length(1))
        .pipe(assert.first(function (file) {
          expect(file.base).to.be(__dirname);
          expect(path.basename(file.path)).to.be('views.production.js');
        }))
        .pipe(assert.end(done));
    });
  });
});

