(function () {
	'use strict';

	// Underscore's Template Module
	// Courtesy of underscorejs.org
	var _ = (function (_) {
		_.defaults = function (object) {
			if (!object) {
				return object;
			}
			for (var argsIndex = 1, argsLength = arguments.length; argsIndex < argsLength; argsIndex++) {
				var iterable = arguments[argsIndex];
				if (iterable) {
					for (var key in iterable) {
						if (object[key] == null) {
							object[key] = iterable[key];
						}
					}
				}
			}
			return object;
		}

		// By default, Underscore uses ERB-style template delimiters, change the
		// following template settings to use alternative delimiters.
		_.templateSettings = {
			evaluate    : /<%([\s\S]+?)%>/g,
			interpolate : /<%=([\s\S]+?)%>/g,
			escape      : /<%-([\s\S]+?)%>/g
		};

		// When customizing `templateSettings`, if you don't want to define an
		// interpolation, evaluation or escaping regex, we need one that is
		// guaranteed not to match.
		var noMatch = /(.)^/;

		// Certain characters need to be escaped so that they can be put into a
		// string literal.
		var escapes = {
			"'":      "'",
			'\\':     '\\',
			'\r':     'r',
			'\n':     'n',
			'\t':     't',
			'\u2028': 'u2028',
			'\u2029': 'u2029'
		};

		var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

		// JavaScript micro-templating, similar to John Resig's implementation.
		// Underscore templating handles arbitrary delimiters, preserves whitespace,
		// and correctly escapes quotes within interpolated code.
		_.template = function(text, data, settings) {
			var render;
			settings = _.defaults({}, settings, _.templateSettings);

			// Combine delimiters into one regular expression via alternation.
			var matcher = new RegExp([
				(settings.escape || noMatch).source,
				(settings.interpolate || noMatch).source,
				(settings.evaluate || noMatch).source
			].join('|') + '|$', 'g');

			// Compile the template source, escaping string literals appropriately.
			var index = 0;
			var source = "__p+='";
			text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
				source += text.slice(index, offset)
					.replace(escaper, function(match) { return '\\' + escapes[match]; });

				if (escape) {
					source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
				}
				if (interpolate) {
					source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
				}
				if (evaluate) {
					source += "';\n" + evaluate + "\n__p+='";
				}
				index = offset + match.length;
				return match;
			});
			source += "';\n";

			// If a variable is not specified, place data values in local scope.
			if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

			source = "var __t,__p='',__j=Array.prototype.join," +
				"print=function(){__p+=__j.call(arguments,'');};\n" +
				source + "return __p;\n";

			try {
				render = new Function(settings.variable || 'obj', '_', source);
			} catch (e) {
				e.source = source;
				throw e;
			}

			if (data) return render(data, _);
			var template = function(data) {
				return render.call(this, data, _);
			};

			// Provide the compiled function source as a convenience for precompilation.
			template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

			return template;
		};

		return _;
	})({});

	if (location.hostname === 'todomvc.com') {
		window._gaq = [['_setAccount','UA-31081062-1'],['_trackPageview']];(function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];g.src='//www.google-analytics.com/ga.js';s.parentNode.insertBefore(g,s)}(document,'script'));
	}

	function redirect() {
		if (location.hostname === 'tastejs.github.io') {
			location.href = location.href.replace('tastejs.github.io/todomvc', 'todomvc.com');
		}
	}

	function findRoot() {
		var base;

		[/labs/, /\w*-examples/].forEach(function (href) {
			var match = location.href.match(href);

			if (!base && match) {
				base = location.href.indexOf(match);
			}
		});

		return location.href.substr(0, base);
	}

	function getFile(file, callback) {
		if (!location.host) {
			return console.info('Miss the info bar? Run TodoMVC from a server to avoid a cross-origin error.');
		}

		var xhr = new XMLHttpRequest();

		xhr.open('GET', findRoot() + file, true);
		xhr.send();

		xhr.onload = function () {
			if (xhr.status === 200 && callback) {
				callback(xhr.responseText);
			}
		};
	}

	function Learn(learnJSON, config) {
		if (!(this instanceof Learn)) {
			return new Learn(learnJSON, config);
		}

		var template, framework;

		if (typeof learnJSON !== 'object') {
			try {
				learnJSON = JSON.parse(learnJSON);
			} catch (e) {
				return;
			}
		}

		if (config) {
			template = config.template;
			framework = config.framework;
		}

		if (!template && learnJSON.templates) {
			template = learnJSON.templates.todomvc;
		}

		if (!framework && document.querySelector('[data-framework]')) {
			framework = document.querySelector('[data-framework]').getAttribute('data-framework');
		}


		if (template && learnJSON[framework]) {
			this.frameworkJSON = learnJSON[framework];
			this.template = template;

			this.append();
		}
	}

	Learn.prototype.append = function () {
		var aside = document.createElement('aside');
		aside.innerHTML = _.template(this.template, this.frameworkJSON);
		aside.className = 'learn';

		// Localize demo links
		var demoLinks = aside.querySelectorAll('.demo-link');
		Array.prototype.forEach.call(demoLinks, function (demoLink) {
			demoLink.setAttribute('href', findRoot() + demoLink.getAttribute('href'));
		});

		document.body.className = (document.body.className + ' learn-bar').trim();
		document.body.insertAdjacentHTML('afterBegin', aside.outerHTML);
	};

	redirect();
	getFile('learn.json', Learn);
})();

/*!
 * jQuery JavaScript Library v2.0.3
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03T13:30Z
 */
(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
	// A central reference to the root jQuery(document)
	rootjQuery,

	// The deferred used on DOM ready
	readyList,

	// Support: IE9
	// For `typeof xmlNode.method` instead of `xmlNode.method !== undefined`
	core_strundefined = typeof undefined,

	// Use the correct document accordingly with window argument (sandbox)
	location = window.location,
	document = window.document,
	docElem = document.documentElement,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// [[Class]] -> type pairs
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "2.0.3",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	core_rnotwhite = /\S+/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// The ready event handler and self cleanup method
	completed = function() {
		document.removeEventListener( "DOMContentLoaded", completed, false );
		window.removeEventListener( "load", completed, false );
		jQuery.ready();
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,

	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray,

	isWindow: function( obj ) {
		return obj != null && obj === obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		// Support: Safari <= 5.1 (functionish RegExp)
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

	isPlainObject: function( obj ) {
		// Not plain objects:
		// - Any object or value whose internal [[Class]] property is not "[object Object]"
		// - DOM nodes
		// - window
		if ( jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		// Support: Firefox <20
		// The try/catch suppresses exceptions thrown when attempting to access
		// the "constructor" property of certain host objects, ie. |window.location|
		// https://bugzilla.mozilla.org/show_bug.cgi?id=814622
		try {
			if ( obj.constructor &&
					!core_hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
				return false;
			}
		} catch ( e ) {
			return false;
		}

		// If the function hasn't returned already, we're confident that
		// |obj| is a plain object, created by {} or constructed with new Object
		return true;
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );

		if ( scripts ) {
			jQuery( scripts ).remove();
		}

		return jQuery.merge( [], parsed.childNodes );
	},

	parseJSON: JSON.parse,

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}

		// Support: IE9
		try {
			tmp = new DOMParser();
			xml = tmp.parseFromString( data , "text/xml" );
		} catch ( e ) {
			xml = undefined;
		}

		if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	globalEval: function( code ) {
		var script,
				indirect = eval;

		code = jQuery.trim( code );

		if ( code ) {
			// If the code includes a valid, prologue position
			// strict mode pragma, execute code by injecting a
			// script tag into the document.
			if ( code.indexOf("use strict") === 1 ) {
				script = document.createElement("script");
				script.text = code;
				document.head.appendChild( script ).parentNode.removeChild( script );
			} else {
			// Otherwise, avoid the DOM node creation, insertion
			// and removal by using an indirect global eval
				indirect( code );
			}
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	trim: function( text ) {
		return text == null ? "" : core_trim.call( text );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : core_indexOf.call( arr, elem, i );
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var tmp, args, proxy;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: Date.now,

	// A method for quickly swapping in/out CSS properties to get correct calculations.
	// Note: this method belongs to the css module but it's needed here for the support module.
	// If support gets modularized, this method should be moved back to the css module.
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		} else {

			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
/*!
 * Sizzle CSS Selector Engine v1.9.4-pre
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-06-03
 */
(function( window, undefined ) {

var i,
	support,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	outermostContext,
	sortInput,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	hasDuplicate = false,
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}
		return 0;
	},

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rsibling = new RegExp( whitespace + "*[+~]" ),
	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( documentIsHTML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc,
		parent = doc.defaultView;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsHTML = !isXML( doc );

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent.attachEvent && parent !== parent.top ) {
		parent.attachEvent( "onbeforeunload", function() {
			setDocument();
		});
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if getElementsByClassName can be trusted
	support.getElementsByClassName = assert(function( div ) {
		div.innerHTML = "<div class='a'></div><div class='a i'></div>";

		// Support: Safari<4
		// Catch class over-caching
		div.firstChild.className = "i";
		// Support: Opera<10
		// Catch gEBCN failure to find non-leading classes
		return div.getElementsByClassName("i").length === 2;
	});

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Support: Opera 10-12/IE8
			// ^= $= *= and empty values
			// Should not select anything
			// Support: Windows 8 Native Apps
			// The type attribute is restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "t", "" );

			if ( div.querySelectorAll("[t^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = rnative.test( docElem.contains ) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b );

		if ( compare ) {
			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

				// Choose the first element that is related to our preferred document
				if ( a === doc || contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === doc || contains(preferredDoc, b) ) {
					return 1;
				}

				// Maintain original order
				return sortInput ?
					( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
					0;
			}

			return compare & 4 ? -1 : 1;
		}

		// Not directly comparable, sort on existence of method
		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val === undefined ?
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null :
		val;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] && match[4] !== undefined ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {

				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;
				}
				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector )
	);
	return results;
}

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome<14
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return (val = elem.getAttributeNode( name )) && val.specified ?
				val.value :
				elem[ name ] === true ? name.toLowerCase() : null;
		}
	});
}

jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// Flag to know if list is currently firing
		firing,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( list && ( !fired || stack ) ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function( support ) {
	var input = document.createElement("input"),
		fragment = document.createDocumentFragment(),
		div = document.createElement("div"),
		select = document.createElement("select"),
		opt = select.appendChild( document.createElement("option") );

	// Finish early in limited environments
	if ( !input.type ) {
		return support;
	}

	input.type = "checkbox";

	// Support: Safari 5.1, iOS 5.1, Android 4.x, Android 2.3
	// Check the default checkbox/radio value ("" on old WebKit; "on" elsewhere)
	support.checkOn = input.value !== "";

	// Must access the parent to make an option select properly
	// Support: IE9, IE10
	support.optSelected = opt.selected;

	// Will be defined later
	support.reliableMarginRight = true;
	support.boxSizingReliable = true;
	support.pixelPosition = false;

	// Make sure checked status is properly cloned
	// Support: IE9, IE10
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Check if an input maintains its value after becoming a radio
	// Support: IE9, IE10
	input = document.createElement("input");
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment.appendChild( input );

	// Support: Safari 5.1, Android 4.x, Android 2.3
	// old WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: Firefox, Chrome, Safari
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
	support.focusinBubbles = "onfocusin" in window;

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv,
			// Support: Firefox, Android 2.3 (Prefixed box-sizing versions).
			divReset = "padding:0;margin:0;border:0;display:block;-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box",
			body = document.getElementsByTagName("body")[ 0 ];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		// Check box-sizing and margin behavior.
		body.appendChild( container ).appendChild( div );
		div.innerHTML = "";
		// Support: Firefox, Android 2.3 (Prefixed box-sizing versions).
		div.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%";

		// Workaround failing boxSizing test due to offsetWidth returning wrong value
		// with some non-1 values of body zoom, ticket #13543
		jQuery.swap( body, body.style.zoom != null ? { zoom: 1 } : {}, function() {
			support.boxSizing = div.offsetWidth === 4;
		});

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Support: Android 2.3
			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		body.removeChild( container );
	});

	return support;
})( {} );

/*
	Implementation Summary

	1. Enforce API surface and semantic compatibility with 1.9.x branch
	2. Improve the module's maintainability by reducing the storage
		paths to a single mechanism.
	3. Use the same single mechanism to support "private" and "user" data.
	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
	5. Avoid exposing implementation details on user objects (eg. expando properties)
	6. Provide a clear path for implementation upgrade to WeakMap in 2014
*/
var data_user, data_priv,
	rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

function Data() {
	// Support: Android < 4,
	// Old WebKit does not have Object.preventExtensions/freeze method,
	// return new empty object instead with no [[set]] accessor
	Object.defineProperty( this.cache = {}, 0, {
		get: function() {
			return {};
		}
	});

	this.expando = jQuery.expando + Math.random();
}

Data.uid = 1;

Data.accepts = function( owner ) {
	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	return owner.nodeType ?
		owner.nodeType === 1 || owner.nodeType === 9 : true;
};

Data.prototype = {
	key: function( owner ) {
		// We can accept data for non-element nodes in modern browsers,
		// but we should not, see #8335.
		// Always return the key for a frozen object.
		if ( !Data.accepts( owner ) ) {
			return 0;
		}

		var descriptor = {},
			// Check if the owner object already has a cache key
			unlock = owner[ this.expando ];

		// If not, create one
		if ( !unlock ) {
			unlock = Data.uid++;

			// Secure it in a non-enumerable, non-writable property
			try {
				descriptor[ this.expando ] = { value: unlock };
				Object.defineProperties( owner, descriptor );

			// Support: Android < 4
			// Fallback to a less secure definition
			} catch ( e ) {
				descriptor[ this.expando ] = unlock;
				jQuery.extend( owner, descriptor );
			}
		}

		// Ensure the cache object
		if ( !this.cache[ unlock ] ) {
			this.cache[ unlock ] = {};
		}

		return unlock;
	},
	set: function( owner, data, value ) {
		var prop,
			// There may be an unlock assigned to this node,
			// if there is no entry for this "owner", create one inline
			// and set the unlock as though an owner entry had always existed
			unlock = this.key( owner ),
			cache = this.cache[ unlock ];

		// Handle: [ owner, key, value ] args
		if ( typeof data === "string" ) {
			cache[ data ] = value;

		// Handle: [ owner, { properties } ] args
		} else {
			// Fresh assignments by object are shallow copied
			if ( jQuery.isEmptyObject( cache ) ) {
				jQuery.extend( this.cache[ unlock ], data );
			// Otherwise, copy the properties one-by-one to the cache object
			} else {
				for ( prop in data ) {
					cache[ prop ] = data[ prop ];
				}
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		// Either a valid cache is found, or will be created.
		// New caches will be created and the unlock returned,
		// allowing direct access to the newly created
		// empty data object. A valid owner object must be provided.
		var cache = this.cache[ this.key( owner ) ];

		return key === undefined ?
			cache : cache[ key ];
	},
	access: function( owner, key, value ) {
		var stored;
		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				((key && typeof key === "string") && value === undefined) ) {

			stored = this.get( owner, key );

			return stored !== undefined ?
				stored : this.get( owner, jQuery.camelCase(key) );
		}

		// [*]When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i, name, camel,
			unlock = this.key( owner ),
			cache = this.cache[ unlock ];

		if ( key === undefined ) {
			this.cache[ unlock ] = {};

		} else {
			// Support array or space separated string of keys
			if ( jQuery.isArray( key ) ) {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = key.concat( key.map( jQuery.camelCase ) );
			} else {
				camel = jQuery.camelCase( key );
				// Try the string as a key before any manipulation
				if ( key in cache ) {
					name = [ key, camel ];
				} else {
					// If a key with the spaces exists, use it.
					// Otherwise, create an array by matching non-whitespace
					name = camel;
					name = name in cache ?
						[ name ] : ( name.match( core_rnotwhite ) || [] );
				}
			}

			i = name.length;
			while ( i-- ) {
				delete cache[ name[ i ] ];
			}
		}
	},
	hasData: function( owner ) {
		return !jQuery.isEmptyObject(
			this.cache[ owner[ this.expando ] ] || {}
		);
	},
	discard: function( owner ) {
		if ( owner[ this.expando ] ) {
			delete this.cache[ owner[ this.expando ] ];
		}
	}
};

// These may be used throughout the jQuery core codebase
data_user = new Data();
data_priv = new Data();


jQuery.extend({
	acceptData: Data.accepts,

	hasData: function( elem ) {
		return data_user.hasData( elem ) || data_priv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return data_user.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		data_user.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to data_priv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return data_priv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		data_priv.remove( elem, name );
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			elem = this[ 0 ],
			i = 0,
			data = null;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = data_user.get( elem );

				if ( elem.nodeType === 1 && !data_priv.get( elem, "hasDataAttrs" ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						name = attrs[ i ].name;

						if ( name.indexOf( "data-" ) === 0 ) {
							name = jQuery.camelCase( name.slice(5) );
							dataAttr( elem, name, data[ name ] );
						}
					}
					data_priv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				data_user.set( this, key );
			});
		}

		return jQuery.access( this, function( value ) {
			var data,
				camelKey = jQuery.camelCase( key );

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {
				// Attempt to get data from the cache
				// with the key as-is
				data = data_user.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to get data from the cache
				// with the key camelized
				data = data_user.get( elem, camelKey );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, camelKey, undefined );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each(function() {
				// First, attempt to store a copy or reference of any
				// data that might've been store with a camelCased key.
				var data = data_user.get( this, camelKey );

				// For HTML5 data-* attribute interop, we have to
				// store property names with dashes in a camelCase form.
				// This might not apply to all properties...*
				data_user.set( this, camelKey, value );

				// *... In the case of properties that might _actually_
				// have dashes, we need to also store a copy of that
				// unchanged property.
				if ( key.indexOf("-") !== -1 && data !== undefined ) {
					data_user.set( this, key, value );
				}
			});
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each(function() {
			data_user.remove( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? JSON.parse( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			data_user.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = data_priv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray( data ) ) {
					queue = data_priv.access( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return data_priv.get( elem, key ) || data_priv.access( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				data_priv.remove( elem, [ type + "queue", key ] );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = data_priv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook,
	rclass = /[\t\r\n\f]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button)$/i;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each(function() {
			delete this[ jQuery.propFix[ name ] || name ];
		});
	},

	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					elem.className = jQuery.trim( cur );

				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					elem.className = value ? jQuery.trim( cur ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					classNames = value.match( core_rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( type === core_strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					data_priv.set( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : data_priv.get( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// IE6-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					if ( (option.selected = jQuery.inArray( jQuery(option).val(), values ) >= 0) ) {
						optionSet = true;
					}
				}

				// force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === core_strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( core_rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					elem[ propName ] = false;
				}

				elem.removeAttribute( name );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );

		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				return elem.hasAttribute( "tabindex" ) || rfocusable.test( elem.nodeName ) || elem.href ?
					elem.tabIndex :
					-1;
			}
		}
	}
});

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = jQuery.expr.attrHandle[ name ] || jQuery.find.attr;

	jQuery.expr.attrHandle[ name ] = function( elem, name, isXML ) {
		var fn = jQuery.expr.attrHandle[ name ],
			ret = isXML ?
				undefined :
				/* jshint eqeqeq: false */
				// Temporarily disable this handler to check existence
				(jQuery.expr.attrHandle[ name ] = undefined) !=
					getter( elem, name, isXML ) ?

					name.toLowerCase() :
					null;

		// Restore handler
		jQuery.expr.attrHandle[ name ] = fn;

		return ret;
	};
});

// Support: IE9+
// Selectedness for an option in an optgroup can be inaccurate
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		}
	};
}

jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
});

// Radios and checkboxes getter/setter
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	if ( !jQuery.support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			// Support: Webkit
			// "" is returned instead of "on" if a value isn't specified
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});
var rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = data_priv.get( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = data_priv.hasData( elem ) && data_priv.get( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;
			data_priv.remove( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special,
			eventPath = [ elem || document ],
			type = core_hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( data_priv.get( cur, "events" ) || {} )[ event.type ] && data_priv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, j, ret, matched, handleObj,
			handlerQueue = [],
			args = core_slice.call( arguments ),
			handlers = ( data_priv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, matches, sel, handleObj,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.disabled !== true || event.type !== "click" ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: Cordova 2.5 (WebKit) (#13255)
		// All events should have a target; Cordova deviceready doesn't
		if ( !event.target ) {
			event.target = document;
		}

		// Support: Safari 6.0+, Chrome < 28
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		return fixHook.filter? fixHook.filter( event, originalEvent ) : event;
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					this.focus();
					return false;
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( this.type === "checkbox" && this.click && jQuery.nodeName( this, "input" ) ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = function( elem, type, handle ) {
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle, false );
	}
};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && e.preventDefault ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && e.stopPropagation ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
// Support: Chrome 15+
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// Create "bubbling" focus and blur events
// Support: Firefox, Chrome, Safari
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});
var isSimple = /^.[^:#\[\.,]*$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i,
			ret = [],
			self = this,
			len = self.length;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},

	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter(function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector || [], true) );
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	},

	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			pos = ( rneedsContext.test( selectors ) || typeof selectors !== "string" ) ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// Always skip document fragments
				if ( cur.nodeType < 11 && (pos ?
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {

					cur = matched.push( cur );
					break;
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.unique( matched ) : matched );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return core_indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return core_indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( jQuery.unique(all) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling( cur, dir ) {
	while ( (cur = cur[dir]) && cur.nodeType !== 1 ) {}

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return elem.contentDocument || jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {
			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.unique( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		var elem = elems[ 0 ];

		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 && elem.nodeType === 1 ?
			jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
			jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
				return elem.nodeType === 1;
			}));
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			truncate = until !== undefined;

		while ( (elem = elem[ dir ]) && elem.nodeType !== 9 ) {
			if ( elem.nodeType === 1 ) {
				if ( truncate && jQuery( elem ).is( until ) ) {
					break;
				}
				matched.push( elem );
			}
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var matched = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				matched.push( n );
			}
		}

		return matched;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		});

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});

	}

	if ( typeof qualifier === "string" ) {
		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( core_indexOf.call( qualifier, elem ) >= 0 ) !== not;
	});
}
var rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {

		// Support: IE 9
		option: [ 1, "<select multiple='multiple'>", "</select>" ],

		thead: [ 1, "<table>", "</table>" ],
		col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		_default: [ 0, "", "" ]
	};

// Support: IE 9
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[ 0 ] && this[ 0 ].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	append: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;

		for ( ; (elem = elems[i]) != null; i++ ) {
			if ( !keepData && elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem ) );
			}

			if ( elem.parentNode ) {
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					setGlobalEval( getAll( elem, "script" ) );
				}
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var
			// Snapshot the DOM in case .domManip sweeps something relevant into its fragment
			args = jQuery.map( this, function( elem ) {
				return [ elem.nextSibling, elem.parentNode ];
			}),
			i = 0;

		// Make the changes, replacing each context element with the new content
		this.domManip( arguments, function( elem ) {
			var next = args[ i++ ],
				parent = args[ i++ ];

			if ( parent ) {
				// Don't use the snapshot next if it has moved (#13810)
				if ( next && next.parentNode !== parent ) {
					next = this.nextSibling;
				}
				jQuery( this ).remove();
				parent.insertBefore( elem, next );
			}
		// Allow new content to include elements from the context set
		}, true );

		// Force removal if there was no new content (e.g., from empty arguments)
		return i ? this : this.remove();
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, callback, allowIntersection ) {

		// Flatten any nested arrays
		args = core_concat.apply( [], args );

		var fragment, first, scripts, hasScripts, node, doc,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[ 0 ],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[ 0 ] = value.call( this, index, self.html() );
				}
				self.domManip( args, callback, allowIntersection );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, !allowIntersection && this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							// Support: QtWebKit
							// jQuery.merge because core_push.apply(_, arraylike) throws
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( this[ i ], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!data_priv.access( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Hope ajax is available...
								jQuery._evalUrl( node.src );
							} else {
								jQuery.globalEval( node.textContent.replace( rcleanScript, "" ) );
							}
						}
					}
				}
			}
		}

		return this;
	}
});

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: QtWebKit
			// .get() because core_push.apply(_, arraylike) throws
			core_push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = jQuery.contains( elem.ownerDocument, elem );

		// Support: IE >= 9
		// Fix Cloning issues
		if ( !jQuery.support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) && !jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var elem, tmp, tag, wrap, contains, j,
			i = 0,
			l = elems.length,
			fragment = context.createDocumentFragment(),
			nodes = [];

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					// Support: QtWebKit
					// jQuery.merge because core_push.apply(_, arraylike) throws
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || fragment.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || ["", ""] )[ 1 ].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;
					tmp.innerHTML = wrap[ 1 ] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[ 2 ];

					// Descend through wrappers to the right content
					j = wrap[ 0 ];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Support: QtWebKit
					// jQuery.merge because core_push.apply(_, arraylike) throws
					jQuery.merge( nodes, tmp.childNodes );

					// Remember the top-level container
					tmp = fragment.firstChild;

					// Fixes #12346
					// Support: Webkit, IE
					tmp.textContent = "";
				}
			}
		}

		// Remove wrapper from fragment
		fragment.textContent = "";

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( fragment.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		return fragment;
	},

	cleanData: function( elems ) {
		var data, elem, events, type, key, j,
			special = jQuery.event.special,
			i = 0;

		for ( ; (elem = elems[ i ]) !== undefined; i++ ) {
			if ( Data.accepts( elem ) ) {
				key = elem[ data_priv.expando ];

				if ( key && (data = data_priv.cache[ key ]) ) {
					events = Object.keys( data.events || {} );
					if ( events.length ) {
						for ( j = 0; (type = events[j]) !== undefined; j++ ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}
					if ( data_priv.cache[ key ] ) {
						// Discard any remaining `private` data
						delete data_priv.cache[ key ];
					}
				}
			}
			// Discard any remaining `user` data
			delete data_user.cache[ elem[ data_user.expando ] ];
		}
	},

	_evalUrl: function( url ) {
		return jQuery.ajax({
			url: url,
			type: "GET",
			dataType: "script",
			async: false,
			global: false,
			"throws": true
		});
	}
});

// Support: 1.x compatibility
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType === 1 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );

	if ( match ) {
		elem.type = match[ 1 ];
	} else {
		elem.removeAttribute("type");
	}

	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var l = elems.length,
		i = 0;

	for ( ; i < l; i++ ) {
		data_priv.set(
			elems[ i ], "globalEval", !refElements || data_priv.get( refElements[ i ], "globalEval" )
		);
	}
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( data_priv.hasData( src ) ) {
		pdataOld = data_priv.access( src );
		pdataCur = data_priv.set( dest, pdataOld );
		events = pdataOld.events;

		if ( events ) {
			delete pdataCur.handle;
			pdataCur.events = {};

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( data_user.hasData( src ) ) {
		udataOld = data_user.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		data_user.set( dest, udataCur );
	}
}


function getAll( context, tag ) {
	var ret = context.getElementsByTagName ? context.getElementsByTagName( tag || "*" ) :
			context.querySelectorAll ? context.querySelectorAll( tag || "*" ) :
			[];

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], ret ) :
		ret;
}

// Support: IE >= 9
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}
jQuery.fn.extend({
	wrapAll: function( html ) {
		var wrap;

		if ( jQuery.isFunction( html ) ) {
			return this.each(function( i ) {
				jQuery( this ).wrapAll( html.call(this, i) );
			});
		}

		if ( this[ 0 ] ) {

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function( i ) {
				jQuery( this ).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function( i ) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});
var curCSS, iframe,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	// isHidden might be called from jQuery#filter function;
	// in that case, element will be second argument
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
function getStyles( elem ) {
	return window.getComputedStyle( elem, null );
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = data_priv.get( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = data_priv.access( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {

			if ( !values[ index ] ) {
				hidden = isHidden( elem );

				if ( display && display !== "none" || !hidden ) {
					data_priv.set( elem, "olddisplay", hidden ? display : jQuery.css(elem, "display") );
				}
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each(function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": "cssFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifying setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {
				style[ name ] = value;
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});

curCSS = function( elem, name, _computed ) {
	var width, minWidth, maxWidth,
		computed = _computed || getStyles( elem ),

		// Support: IE9
		// getPropertyValue is only needed for .css('filter') in IE9, see #12537
		ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
		style = elem.style;

	if ( computed ) {

		if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// Support: Safari 5.1
		// A tribute to the "awesome hack by Dean Edwards"
		// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
		// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
		if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret;
};


function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {
			// Use the already-created iframe if possible
			iframe = ( iframe ||
				jQuery("<iframe frameborder='0' width='0' height='0'/>")
				.css( "cssText", "display:block !important" )
			).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
			doc.write("<!doctype html><html><body>");
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}

// Called ONLY from within css_defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
		display = jQuery.css( elem[0], "display" );
	elem.remove();
	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	// Support: Android 2.3
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				if ( computed ) {
					// Support: Android 2.3
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					return jQuery.swap( elem, { "display": "inline-block" },
						curCSS, [ elem, "marginRight" ] );
				}
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						computed = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( computed ) ?
							jQuery( elem ).position()[ prop ] + "px" :
							computed;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0;
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function(){
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !manipulation_rcheckableType.test( type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});
var
	// Document location
	ajaxLocParts,
	ajaxLocation,

	ajax_nonce = jQuery.now(),

	ajax_rquery = /\?/,
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, type, response,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
	jQuery.fn[ type ] = function( fn ){
		return this.on( type, fn );
	};
});

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,
			// URL without anti-cache param
			cacheURL,
			// Response headers
			responseHeadersString,
			responseHeaders,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			parts,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" )
			.replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

		// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {
	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery("<script>").prop({
					async: true,
					charset: s.scriptCharset,
					src: s.url
				}).on(
					"load error",
					callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					}
				);
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
});
var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
jQuery.ajaxSettings.xhr = function() {
	try {
		return new XMLHttpRequest();
	} catch( e ) {}
};

var xhrSupported = jQuery.ajaxSettings.xhr(),
	xhrSuccessStatus = {
		// file protocol always yields status code 0, assume 200
		0: 200,
		// Support: IE9
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	// Support: IE9
	// We need to keep track of outbound xhr and abort them manually
	// because IE is not smart enough to do it all by itself
	xhrId = 0,
	xhrCallbacks = {};

if ( window.ActiveXObject ) {
	jQuery( window ).on( "unload", function() {
		for( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]();
		}
		xhrCallbacks = undefined;
	});
}

jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
jQuery.support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport(function( options ) {
	var callback;
	// Cross domain only allowed if supported through XMLHttpRequest
	if ( jQuery.support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i, id,
					xhr = options.xhr();
				xhr.open( options.type, options.url, options.async, options.username, options.password );
				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}
				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}
				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers["X-Requested-With"] ) {
					headers["X-Requested-With"] = "XMLHttpRequest";
				}
				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}
				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							delete xhrCallbacks[ id ];
							callback = xhr.onload = xhr.onerror = null;
							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {
								complete(
									// file protocol always yields status 0, assume 404
									xhr.status || 404,
									xhr.statusText
								);
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,
									// Support: IE9
									// #11426: When requesting binary data, IE9 will throw an exception
									// on any attempt to access responseText
									typeof xhr.responseText === "string" ? {
										text: xhr.responseText
									} : undefined,
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};
				// Listen to events
				xhr.onload = callback();
				xhr.onerror = callback("error");
				// Create the abort callback
				callback = xhrCallbacks[( id = xhrId++ )] = callback("abort");
				// Do send the request
				// This may raise an exception which is actually
				// handled in jQuery.ajax (so no try/catch here)
				xhr.send( options.hasContent && options.data || null );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
});
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var tween = this.createTween( prop, value ),
				target = tween.cur(),
				parts = rfxnum.exec( value ),
				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

				// Starting value computation is required for potential unit mismatches
				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
				scale = 1,
				maxIterations = 20;

			if ( start && start[ 3 ] !== unit ) {
				// Trust units reported by jQuery.css
				unit = unit || start[ 3 ];

				// Make sure we update the tween properties later on
				parts = parts || [];

				// Iteratively approximate from a nonzero starting point
				start = +target || 1;

				do {
					// If previous iteration zeroed out, double until we get *something*
					// Use a string for doubling factor so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					start = start / scale;
					jQuery.style( tween.elem, prop, start + unit );

				// Update scale, tolerating zero or NaN from tween.cur()
				// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
			}

			// Update tween properties
			if ( parts ) {
				start = tween.start = +start || +target || 0;
				tween.unit = unit;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[ 1 ] ?
					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
					+parts[ 2 ];
			}

			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( (tween = collection[ index ].call( animation, prop, value )) ) {

			// we're done with this property
			return tween;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = data_priv.get( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE9-10 do not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			style.display = "inline-block";
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always(function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		});
	}


	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// If there is dataShow left over from a stopped hide or show and we are going to proceed with show, we should pretend to be hidden
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = data_priv.access( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;

			data_priv.remove( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || data_priv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = data_priv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = data_priv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) ) {
		jQuery.fx.start();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, win,
		elem = this[ 0 ],
		box = { top: 0, left: 0 },
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	return {
		top: box.top + win.pageYOffset - docElem.clientTop,
		left: box.left + win.pageXOffset - docElem.clientLeft
	};
};

jQuery.offset = {

	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) && ( curCSSTop + curCSSLeft ).indexOf("auto") > -1;

		// Need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// Fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// We assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();

		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;

			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || docElem;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : window.pageXOffset,
					top ? val : window.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ? elem : elem.nodeType === 9 && elem.defaultView;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Limit scope pollution from any deprecated API
// (function() {

// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;

// })();
if ( typeof module === "object" && module && typeof module.exports === "object" ) {
	// Expose jQuery as module.exports in loaders that implement the Node
	// module pattern (including browserify). Do not create the global, since
	// the user will be storing it themselves locally, and globals are frowned
	// upon in the Node module world.
	module.exports = jQuery;
} else {
	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.
	if ( typeof define === "function" && define.amd ) {
		define( "jquery", [], function () { return jQuery; } );
	}
}

// If there is a window object, that at least has a document property,
// define jQuery and $ identifiers
if ( typeof window === "object" && typeof window.document === "object" ) {
	window.jQuery = window.$ = jQuery;
}

})( window );

/*!
 * CanJS - 2.1.1
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Thu, 22 May 2014 03:38:02 GMT
 * Licensed MIT
 * Includes: can/component,can/construct,can/map,can/list,can/observe,can/compute,can/model,can/view,can/control,can/route,can/control/route,can/view/mustache,can/view/bindings,can/view/live,can/view/scope,can/util/string,can/util/attr
 * Download from: http://canjs.com
 */
(function(undefined) {

    // ## util/can.js
    var __m4 = (function() {

        var can = window.can || {};
        if (typeof GLOBALCAN === 'undefined' || GLOBALCAN !== false) {
            window.can = can;
        }

        // An empty function useful for where you need a dummy callback.
        can.k = function() {};

        can.isDeferred = function(obj) {
            var isFunction = this.isFunction;
            // Returns `true` if something looks like a deferred.
            return obj && isFunction(obj.then) && isFunction(obj.pipe);
        };

        var cid = 0;
        can.cid = function(object, name) {
            if (!object._cid) {
                cid++;
                object._cid = (name || '') + cid;
            }
            return object._cid;
        };
        can.VERSION = '2.1.1';

        can.simpleExtend = function(d, s) {
            for (var prop in s) {
                d[prop] = s[prop];
            }
            return d;
        };

        can.frag = function(item) {
            var frag;
            if (!item || typeof item === "string") {
                frag = can.buildFragment(item == null ? "" : "" + item, document.body);
                // If we have an empty frag...
                if (!frag.childNodes.length) {
                    frag.appendChild(document.createTextNode(''));
                }
                return frag;
            } else if (item.nodeType === 11) {
                return item;
            } else if (typeof item.nodeType === "number") {
                frag = document.createDocumentFragment();
                frag.appendChild(item);
                return frag;
            } else if (typeof item.length === "number") {
                frag = document.createDocumentFragment();
                can.each(item, function(item) {
                    frag.appendChild(can.frag(item));
                });
                return frag;
            } else {
                frag = can.buildFragment("" + item, document.body);
                // If we have an empty frag...
                if (!frag.childNodes.length) {
                    frag.appendChild(document.createTextNode(''));
                }
                return frag;
            }
        };

        // this is here in case can.compute hasn't loaded
        can.__reading = function() {};

        return can;
    })();

    // ## util/attr/attr.js
    var __m5 = (function(can) {

        // Acts as a polyfill for setImmediate which only works in IE 10+. Needed to make
        // the triggering of `attributes` event async.
        var setImmediate = window.setImmediate || function(cb) {
                return setTimeout(cb, 0);
            },
            attr = {
                // This property lets us know if the browser supports mutation observers.
                // If they are supported then that will be setup in can/util/jquery and those native events will be used to inform observers of attribute changes.
                // Otherwise this module handles triggering an `attributes` event on the element.
                MutationObserver: window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver,


                map: {
                    "class": "className",
                    "value": "value",
                    "innerText": "innerText",
                    "textContent": "textContent",
                    "checked": true,
                    "disabled": true,
                    "readonly": true,
                    "required": true,
                    // For the `src` attribute we are using a setter function to prevent values such as an empty string or null from being set.
                    // An `img` tag attempts to fetch the `src` when it is set, so we need to prevent that from happening by removing the attribute instead.
                    src: function(el, val) {
                        if (val == null || val === "") {
                            el.removeAttribute("src");
                            return null;
                        } else {
                            el.setAttribute("src", val);
                            return val;
                        }
                    },
                    style: function(el, val) {
                        return el.style.cssText = val || "";
                    }
                },
                // These are elements whos default value we should set.
                defaultValue: ["input", "textarea"],
                // ## attr.set
                // Set the value an attribute on an element.
                set: function(el, attrName, val) {
                    var oldValue;
                    // In order to later trigger an event we need to compare the new value to the old value, so here we go ahead and retrieve the old value for browsers that don't have native MutationObservers.
                    if (!attr.MutationObserver) {
                        oldValue = attr.get(el, attrName);
                    }

                    var tagName = el.nodeName.toString()
                        .toLowerCase(),
                        prop = attr.map[attrName],
                        newValue;

                    // Using the property of `attr.map`, go through and check if the property is a function, and if so call it. Then check if the property is `true`, and if so set the value to `true`, also making sure to set `defaultChecked` to `true` for elements of `attr.defaultValue`. We always set the value to true because for these boolean properties, setting them to false would be the same as removing the attribute.
                    // For all other attributes use `setAttribute` to set the new value.
                    if (typeof prop === "function") {
                        newValue = prop(el, val);
                    } else if (prop === true) {
                        newValue = el[attrName] = true;

                        if (attrName === "checked" && el.type === "radio") {
                            if (can.inArray(tagName, attr.defaultValue) >= 0) {
                                el.defaultChecked = true;
                            }
                        }

                    } else if (prop) {
                        newValue = el[prop] = val;
                        if (prop === "value" && can.inArray(tagName, attr.defaultValue) >= 0) {
                            el.defaultValue = val;
                        }
                    } else {
                        el.setAttribute(attrName, val);
                        newValue = val;
                    }

                    // Now that the value has been set, for browsers without MutationObservers, check to see that value has changed and if so trigger the "attributes" event on the element.
                    if (!attr.MutationObserver && newValue !== oldValue) {
                        attr.trigger(el, attrName, oldValue);
                    }
                },
                // ## attr.trigger
                // Used to trigger an "attributes" event on an element. Checks to make sure that someone is listening for the event and then queues a function to be called asynchronously using `setImmediate.
                trigger: function(el, attrName, oldValue) {
                    if (can.data(can.$(el), "canHasAttributesBindings")) {
                        return setImmediate(function() {
                            can.trigger(el, {
                                    type: "attributes",
                                    attributeName: attrName,
                                    target: el,
                                    oldValue: oldValue,
                                    bubbles: false
                                }, []);
                        });
                    }
                },
                // ## attr.get
                // Gets the value of an attribute. First checks to see if the property is a string on `attr.map` and if so returns the value from the element's property. Otherwise uses `getAttribute` to retrieve the value.
                get: function(el, attrName) {
                    var prop = attr.map[attrName];
                    if (typeof prop === "string" && el[prop]) {
                        return el[prop];
                    }

                    return el.getAttribute(attrName);
                },
                // ## attr.remove
                // Removes an attribute from an element. Works by using the `attr.map` to see if the attribute is a special type of property. If the property is a function then the fuction is called with `undefined` as the value. If the property is `true` then the attribute is set to false. If the property is a string then the attribute is set to an empty string. Otherwise `removeAttribute` is used.
                // If the attribute previously had a value and the browser doesn't support MutationObservers we then trigger an "attributes" event.
                remove: function(el, attrName) {
                    var oldValue;
                    if (!attr.MutationObserver) {
                        oldValue = attr.get(el, attrName);
                    }

                    var setter = attr.map[attrName];
                    if (typeof setter === "function") {
                        setter(el, undefined);
                    }
                    if (setter === true) {
                        el[attrName] = false;
                    } else if (typeof setter === "string") {
                        el[setter] = "";
                    } else {
                        el.removeAttribute(attrName);
                    }
                    if (!attr.MutationObserver && oldValue != null) {
                        attr.trigger(el, attrName, oldValue);
                    }

                },
                // ## attr.has
                // Checks if an element contains an attribute.
                // For browsers that support `hasAttribute`, creates a function that calls hasAttribute, otherwise creates a function that uses `getAttribute` to check that the attribute is not null.
                has: (function() {
                    var el = document.createElement('div');
                    if (el.hasAttribute) {
                        return function(el, name) {
                            return el.hasAttribute(name);
                        };
                    } else {
                        return function(el, name) {
                            return el.getAttribute(name) !== null;
                        };
                    }
                })()
            };

        return attr;

    })(__m4);

    // ## event/event.js
    var __m6 = (function(can) {
        // ## can.event.addEvent
        // Adds a basic event listener to an object.
        // This consists of storing a cache of event listeners on each object,
        // that are iterated through later when events are dispatched.

        can.addEvent = function(event, handler) {
            // Initialize event cache.
            var allEvents = this.__bindEvents || (this.__bindEvents = {}),
                eventList = allEvents[event] || (allEvents[event] = []);

            // Add the event
            eventList.push({
                    handler: handler,
                    name: event
                });
            return this;
        };

        // ## can.event.listenTo
        // Listens to an event without know how bind is implemented.
        // The primary use for this is to listen to another's objects event while 
        // tracking events on the local object (similar to namespacing).
        // The API was heavily influenced by BackboneJS: http://backbonejs.org/

        can.listenTo = function(other, event, handler) {
            // Initialize event cache
            var idedEvents = this.__listenToEvents;
            if (!idedEvents) {
                idedEvents = this.__listenToEvents = {};
            }

            // Identify the other object
            var otherId = can.cid(other);
            var othersEvents = idedEvents[otherId];

            // Create a local event cache
            if (!othersEvents) {
                othersEvents = idedEvents[otherId] = {
                    obj: other,
                    events: {}
                };
            }
            var eventsEvents = othersEvents.events[event];
            if (!eventsEvents) {
                eventsEvents = othersEvents.events[event] = [];
            }

            // Add the event, both locally and to the other object
            eventsEvents.push(handler);
            can.bind.call(other, event, handler);
        };

        // ## can.event.stopListening
        // Stops listening for events on other objects

        can.stopListening = function(other, event, handler) {
            var idedEvents = this.__listenToEvents,
                iterIdedEvents = idedEvents,
                i = 0;
            if (!idedEvents) {
                return this;
            }
            if (other) {
                var othercid = can.cid(other);
                (iterIdedEvents = {})[othercid] = idedEvents[othercid];
                // you might be trying to listen to something that is not there
                if (!idedEvents[othercid]) {
                    return this;
                }
            }

            // Clean up events on the other object
            for (var cid in iterIdedEvents) {
                var othersEvents = iterIdedEvents[cid],
                    eventsEvents;
                other = idedEvents[cid].obj;

                // Find the cache of events
                if (!event) {
                    eventsEvents = othersEvents.events;
                } else {
                    (eventsEvents = {})[event] = othersEvents.events[event];
                }

                // Unbind event handlers, both locally and on the other object
                for (var eventName in eventsEvents) {
                    var handlers = eventsEvents[eventName] || [];
                    i = 0;
                    while (i < handlers.length) {
                        if (handler && handler === handlers[i] || !handler) {
                            can.unbind.call(other, eventName, handlers[i]);
                            handlers.splice(i, 1);
                        } else {
                            i++;
                        }
                    }
                    // no more handlers?
                    if (!handlers.length) {
                        delete othersEvents.events[eventName];
                    }
                }
                if (can.isEmptyObject(othersEvents.events)) {
                    delete idedEvents[cid];
                }
            }
            return this;
        };

        // ## can.event.removeEvent
        // Removes a basic event listener from an object.
        // This removes event handlers from the cache of listened events.

        can.removeEvent = function(event, fn, __validate) {
            if (!this.__bindEvents) {
                return this;
            }
            var events = this.__bindEvents[event] || [],
                i = 0,
                ev, isFunction = typeof fn === 'function';
            while (i < events.length) {
                ev = events[i];
                // Determine whether this event handler is "equivalent" to the one requested
                // Generally this requires the same event/function, but a validation function 
                // can be included for extra conditions. This is used in some plugins like `can/event/namespace`.
                if (__validate ? __validate(ev, event, fn) : isFunction && ev.handler === fn || !isFunction && (ev.cid === fn || !fn)) {
                    events.splice(i, 1);
                } else {
                    i++;
                }
            }
            return this;
        };

        // ## can.event.dispatch
        // Dispatches/triggers a basic event on an object.

        can.dispatch = function(event, args) {
            var events = this.__bindEvents;
            if (!events) {
                return;
            }

            // Initialize the event object
            if (typeof event === 'string') {
                event = {
                    type: event
                };
            }

            // Grab event listeners
            var eventName = event.type,
                handlers = (events[eventName] || []).slice(0);

            // Execute handlers listening for this event.
            args = [event].concat(args || []);
            for (var i = 0, len = handlers.length; i < len; i++) {
                handlers[i].handler.apply(this, args);
            }

            return event;
        };

        // ## can.event.one
        // Adds a basic event listener that listens to an event once and only once.

        can.one = function(event, handler) {
            // Unbind the listener after it has been executed
            var one = function() {
                can.unbind.call(this, event, one);
                return handler.apply(this, arguments);
            };

            // Bind the altered listener
            can.bind.call(this, event, one);
            return this;
        };

        // ## can.event
        // Create and export the `can.event` mixin
        can.event = {
            // Event method aliases

            on: function() {
                if (arguments.length === 0 && can.Control && this instanceof can.Control) {
                    return can.Control.prototype.on.call(this);
                } else {
                    return can.addEvent.apply(this, arguments);
                }
            },


            off: function() {
                if (arguments.length === 0 && can.Control && this instanceof can.Control) {
                    return can.Control.prototype.off.call(this);
                } else {
                    return can.removeEvent.apply(this, arguments);
                }
            },


            bind: can.addEvent,

            unbind: can.removeEvent,

            delegate: function(selector, event, handler) {
                return can.addEvent.call(event, handler);
            },

            undelegate: function(selector, event, handler) {
                return can.removeEvent.call(event, handler);
            },

            trigger: can.dispatch,

            // Normal can/event methods
            one: can.one,
            addEvent: can.addEvent,
            removeEvent: can.removeEvent,
            listenTo: can.listenTo,
            stopListening: can.stopListening,
            dispatch: can.dispatch
        };

        return can.event;
    })(__m4);

    // ## util/array/each.js
    var __m7 = (function(can) {

        // The following is from jQuery
        var isArrayLike = function(obj) {
            var length = obj.length;
            return typeof arr !== "function" &&
            (length === 0 || typeof length === "number" && length > 0 && (length - 1) in obj);
        };

        can.each = function(elements, callback, context) {
            var i = 0,
                key,
                len,
                item;
            if (elements) {
                if (isArrayLike(elements)) {
                    if (can.List && elements instanceof can.List) {
                        for (len = elements.attr("length"); i < len; i++) {
                            item = elements.attr(i);
                            if (callback.call(context || item, item, i, elements) === false) {
                                break;
                            }
                        }
                    } else {
                        for (len = elements.length; i < len; i++) {
                            item = elements[i];
                            if (callback.call(context || item, item, i, elements) === false) {
                                break;
                            }
                        }
                    }

                } else if (typeof elements === "object") {

                    if (can.Map && elements instanceof can.Map || elements === can.route) {
                        var keys = can.Map.keys(elements);
                        for (i = 0, len = keys.length; i < len; i++) {
                            key = keys[i];
                            item = elements.attr(key);
                            if (callback.call(context || item, item, key, elements) === false) {
                                break;
                            }
                        }
                    } else {
                        for (key in elements) {
                            if (elements.hasOwnProperty(key) && callback.call(context || elements[key], elements[key], key, elements) === false) {
                                break;
                            }
                        }
                    }

                }
            }
            return elements;
        };
        return can;
    })(__m4);

    // ## util/inserted/inserted.js
    var __m8 = (function(can) {
        can.inserted = function(elems) {
            // Turn the `elems` property into an array to prevent mutations from changing the looping.
            elems = can.makeArray(elems);
            var inDocument = false,
                // Gets the `doc` to use as a reference for finding out whether the element is in the document.
                doc = can.$(document.contains ? document : document.body),
                children;
            // Go through `elems` and trigger the `inserted` event.
            // If the first element is not in the document (a Document Fragment) it will exit the function. If it is in the document it sets the `inDocument` flag to true. This means that we only check for the first element and either exit the function or start triggering "inserted" for child elements.
            for (var i = 0, elem;
                (elem = elems[i]) !== undefined; i++) {
                if (!inDocument) {
                    if (elem.getElementsByTagName) {
                        if (can.has(doc, elem)
                            .length) {
                            inDocument = true;
                        } else {
                            return;
                        }
                    } else {
                        continue;
                    }
                }

                // If we've found an element in the document then we can now trigger **"inserted"** for `elem` and all of its children. We are using `getElementsByTagName("*")` so that we grab all of the descendant nodes.
                if (inDocument && elem.getElementsByTagName) {
                    children = can.makeArray(elem.getElementsByTagName("*"));
                    can.trigger(elem, "inserted", [], false);
                    for (var j = 0, child;
                        (child = children[j]) !== undefined; j++) {
                        can.trigger(child, "inserted", [], false);
                    }
                }
            }
        };

        // ## can.appendChild
        // Used to append a node to an element and trigger the "inserted" event on all of the newly inserted children. Since `can.inserted` takes an array we convert the child to an array, or in the case of a DocumentFragment we first convert the childNodes to an array and call inserted on those.
        can.appendChild = function(el, child) {
            var children;
            if (child.nodeType === 11) {
                children = can.makeArray(child.childNodes);
            } else {
                children = [child];
            }
            el.appendChild(child);
            can.inserted(children);
        };

        // ## can.insertBefore
        // Like can.appendChild, used to insert a node to an element before a reference node and then trigger the "inserted" event.
        can.insertBefore = function(el, child, ref) {
            var children;
            if (child.nodeType === 11) {
                children = can.makeArray(child.childNodes);
            } else {
                children = [child];
            }
            el.insertBefore(child, ref);
            can.inserted(children);
        };
    })(__m4);

    // ## util/jquery/jquery.js
    var __m2 = (function($, can, attr, event) {
        var isBindableElement = function(node) {
            // In IE8 window.window !== window.window, so we allow == here.

            return (node.nodeName && (node.nodeType === 1 || node.nodeType === 9)) || node == window;
        };
        // _jQuery node list._
        $.extend(can, $, {
                trigger: function(obj, event, args, bubbles) {
                    if (isBindableElement(obj)) {
                        $.event.trigger(event, args, obj, !bubbles);
                    } else if (obj.trigger) {
                        obj.trigger(event, args);
                    } else {
                        if (typeof event === 'string') {
                            event = {
                                type: event
                            };
                        }
                        event.target = event.target || obj;
                        can.dispatch.call(obj, event, args);
                    }
                },
                event: can.event,
                addEvent: can.addEvent,
                removeEvent: can.removeEvent,
                buildFragment: function(elems, context) {
                    // Check if this has any html nodes on our own.
                    var ret;
                    elems = [elems];
                    // Set context per 1.8 logic
                    context = context || document;
                    context = !context.nodeType && context[0] || context;
                    context = context.ownerDocument || context;
                    ret = $.buildFragment(elems, context);
                    return ret.cacheable ? $.clone(ret.fragment) : ret.fragment || ret;
                },
                $: $,
                each: can.each,
                bind: function(ev, cb) {
                    // If we can bind to it...
                    if (this.bind && this.bind !== can.bind) {
                        this.bind(ev, cb);
                    } else if (isBindableElement(this)) {
                        $.event.add(this, ev, cb);
                    } else {
                        // Make it bind-able...
                        can.addEvent.call(this, ev, cb);
                    }
                    return this;
                },
                unbind: function(ev, cb) {
                    // If we can bind to it...
                    if (this.unbind && this.unbind !== can.unbind) {
                        this.unbind(ev, cb);
                    } else if (isBindableElement(this)) {
                        $.event.remove(this, ev, cb);
                    } else {
                        // Make it bind-able...
                        can.removeEvent.call(this, ev, cb);
                    }
                    return this;
                },
                delegate: function(selector, ev, cb) {
                    if (this.delegate) {
                        this.delegate(selector, ev, cb);
                    } else if (isBindableElement(this)) {
                        $(this)
                            .delegate(selector, ev, cb);
                    } else {
                        // make it bind-able ...
                        can.bind.call(this, ev, cb);
                    }
                    return this;
                },
                undelegate: function(selector, ev, cb) {
                    if (this.undelegate) {
                        this.undelegate(selector, ev, cb);
                    } else if (isBindableElement(this)) {
                        $(this)
                            .undelegate(selector, ev, cb);
                    } else {
                        can.unbind.call(this, ev, cb);
                    }
                    return this;
                },
                proxy: function(fn, context) {
                    return function() {
                        return fn.apply(context, arguments);
                    };
                },
                attr: attr
            });
        // Wrap binding functions.

        // Aliases
        can.on = can.bind;
        can.off = can.unbind;
        // Wrap modifier functions.
        $.each([
                'append',
                'filter',
                'addClass',
                'remove',
                'data',
                'get',
                'has'
            ], function(i, name) {
                can[name] = function(wrapped) {
                    return wrapped[name].apply(wrapped, can.makeArray(arguments)
                        .slice(1));
                };
            });
        // Memory safe destruction.
        var oldClean = $.cleanData;
        $.cleanData = function(elems) {
            $.each(elems, function(i, elem) {
                if (elem) {
                    can.trigger(elem, 'removed', [], false);
                }
            });
            oldClean(elems);
        };
        var oldDomManip = $.fn.domManip,
            cbIndex;
        // feature detect which domManip we are using
        $.fn.domManip = function(args, cb1, cb2) {
            for (var i = 1; i < arguments.length; i++) {
                if (typeof arguments[i] === 'function') {
                    cbIndex = i;
                    break;
                }
            }
            return oldDomManip.apply(this, arguments);
        };
        $(document.createElement("div"))
            .append(document.createElement("div"));

        $.fn.domManip = (cbIndex === 2 ? function(args, table, callback) {
            return oldDomManip.call(this, args, table, function(elem) {
                var elems;
                if (elem.nodeType === 11) {
                    elems = can.makeArray(elem.childNodes);
                }
                var ret = callback.apply(this, arguments);
                can.inserted(elems ? elems : [elem]);
                return ret;
            });
        } : function(args, callback) {
            return oldDomManip.call(this, args, function(elem) {
                var elems;
                if (elem.nodeType === 11) {
                    elems = can.makeArray(elem.childNodes);
                }
                var ret = callback.apply(this, arguments);
                can.inserted(elems ? elems : [elem]);
                return ret;
            });
        });

        if (!can.attr.MutationObserver) {
            // handle via calls to attr
            var oldAttr = $.attr;
            $.attr = function(el, attrName) {
                var oldValue, newValue;
                if (arguments.length >= 3) {
                    oldValue = oldAttr.call(this, el, attrName);
                }
                var res = oldAttr.apply(this, arguments);
                if (arguments.length >= 3) {
                    newValue = oldAttr.call(this, el, attrName);
                }
                if (newValue !== oldValue) {
                    can.attr.trigger(el, attrName, oldValue);
                }
                return res;
            };
            var oldRemove = $.removeAttr;
            $.removeAttr = function(el, attrName) {
                var oldValue = oldAttr.call(this, el, attrName),
                    res = oldRemove.apply(this, arguments);

                if (oldValue != null) {
                    can.attr.trigger(el, attrName, oldValue);
                }
                return res;
            };
            $.event.special.attributes = {
                setup: function() {
                    can.data(can.$(this), "canHasAttributesBindings", true);
                },
                teardown: function() {
                    $.removeData(this, "canHasAttributesBindings");
                }
            };
        } else {
            // setup a special events
            $.event.special.attributes = {
                setup: function() {
                    var self = this;
                    var observer = new can.attr.MutationObserver(function(mutations) {
                        mutations.forEach(function(mutation) {
                            var copy = can.simpleExtend({}, mutation);
                            can.trigger(self, copy, []);
                        });

                    });
                    observer.observe(this, {
                            attributes: true,
                            attributeOldValue: true
                        });
                    can.data(can.$(this), "canAttributesObserver", observer);
                },
                teardown: function() {
                    can.data(can.$(this), "canAttributesObserver")
                        .disconnect();
                    $.removeData(this, "canAttributesObserver");

                }
            };
        }

        // ## Fix build fragment.
        // In IE8, we can pass jQuery a fragment and it removes newlines.
        // This checks for that and replaces can.buildFragment with something
        // that if only a single text node is returned, returns a fragment with
        // a text node that is set to the content.
        (function() {

            var text = "<-\n>",
                frag = can.buildFragment(text, document);
            if (text !== frag.childNodes[0].nodeValue) {

                var oldBuildFragment = can.buildFragment;
                can.buildFragment = function(content, context) {
                    var res = oldBuildFragment(content, context);
                    if (res.childNodes.length === 1 && res.childNodes[0].nodeType === 3) {
                        res.childNodes[0].nodeValue = content;
                    }
                    return res;
                };

            }



        })();

        $.event.special.inserted = {};
        $.event.special.removed = {};
        return can;
    })(jQuery, __m4, __m5, __m6, __m7, __m8);

    // ## view/view.js
    var __m10 = (function(can) {

        var isFunction = can.isFunction,
            makeArray = can.makeArray,
            // Used for hookup `id`s.
            hookupId = 1;

        // internal utility methods
        // ------------------------

        // ##### makeRenderer

        var makeRenderer = function(textRenderer) {
            var renderer = function() {
                return $view.frag(textRenderer.apply(this, arguments));
            };
            renderer.render = function() {
                return textRenderer.apply(textRenderer, arguments);
            };
            return renderer;
        };

        // ##### checkText
        // Makes sure there's a template, if not, have `steal` provide a warning.
        var checkText = function(text, url) {
            if (!text.length) {

                // _removed if not used as a steal module_



                throw "can.view: No template or empty template:" + url;
            }
        };

        // ##### get
        // get a deferred renderer for provided url

        var get = function(obj, async) {
            var url = typeof obj === 'string' ? obj : obj.url,
                suffix = (obj.engine && '.' + obj.engine) || url.match(/\.[\w\d]+$/),
                type,
                // If we are reading a script element for the content of the template,
                // `el` will be set to that script element.
                el,
                // A unique identifier for the view (used for caching).
                // This is typically derived from the element id or
                // the url for the template.
                id;

            //If the url has a #, we assume we want to use an inline template
            //from a script element and not current page's HTML
            if (url.match(/^#/)) {
                url = url.substr(1);
            }
            // If we have an inline template, derive the suffix from the `text/???` part.
            // This only supports `<script>` tags.
            if (el = document.getElementById(url)) {
                suffix = '.' + el.type.match(/\/(x\-)?(.+)/)[2];
            }

            // If there is no suffix, add one.
            if (!suffix && !$view.cached[url]) {
                url += suffix = $view.ext;
            }

            // if the suffix was derived from the .match() operation, pluck out the first value
            if (can.isArray(suffix)) {
                suffix = suffix[0];
            }

            // Convert to a unique and valid id.
            id = $view.toId(url);

            // If an absolute path, use `steal`/`require` to get it.
            // You should only be using `//` if you are using an AMD loader like `steal` or `require` (not almond).
            if (url.match(/^\/\//)) {
                url = url.substr(2);
                url = !window.steal ?
                    url :
                    steal.config()
                    .root.mapJoin("" + steal.id(url));
            }

            // Localize for `require` (not almond)
            if (window.require) {
                if (require.toUrl) {
                    url = require.toUrl(url);
                }
            }

            // Set the template engine type.
            type = $view.types[suffix];

            // If it is cached,
            if ($view.cached[id]) {
                // Return the cached deferred renderer.
                return $view.cached[id];

                // Otherwise if we are getting this from a `<script>` element.
            } else if (el) {
                // Resolve immediately with the element's `innerHTML`.
                return $view.registerView(id, el.innerHTML, type);
            } else {
                // Make an ajax request for text.
                var d = new can.Deferred();
                can.ajax({
                        async: async,
                        url: url,
                        dataType: 'text',
                        error: function(jqXHR) {
                            checkText('', url);
                            d.reject(jqXHR);
                        },
                        success: function(text) {
                            // Make sure we got some text back.
                            checkText(text, url);
                            $view.registerView(id, text, type, d);
                        }
                    });
                return d;
            }
        };
        // ##### getDeferreds
        // Gets an `array` of deferreds from an `object`.
        // This only goes one level deep.

        var getDeferreds = function(data) {
            var deferreds = [];

            // pull out deferreds
            if (can.isDeferred(data)) {
                return [data];
            } else {
                for (var prop in data) {
                    if (can.isDeferred(data[prop])) {
                        deferreds.push(data[prop]);
                    }
                }
            }
            return deferreds;
        };

        // ##### usefulPart
        // Gets the useful part of a resolved deferred.
        // When a jQuery.when is resolved, it returns an array to each argument.
        // Reference ($.when)[https://api.jquery.com/jQuery.when/]
        // This is for `model`s and `can.ajax` that resolve to an `array`.

        var usefulPart = function(resolved) {
            return can.isArray(resolved) && resolved[1] === 'success' ? resolved[0] : resolved;
        };

        // #### can.view
        //defines $view for internal use, can.template for backwards compatibility

        var $view = can.view = can.template = function(view, data, helpers, callback) {
            // If helpers is a `function`, it is actually a callback.
            if (isFunction(helpers)) {
                callback = helpers;
                helpers = undefined;
            }
            var result;
            // Get the result, if a renderer function is passed in, then we just use that to render the data
            if (isFunction(view)) {
                result = view(data, helpers, callback);
            } else {
                result = $view.renderAs("fragment", view, data, helpers, callback);
            }

            return result;
        };

        // can.view methods
        // --------------------------
        can.extend($view, {
                // ##### frag
                // creates a fragment and hooks it up all at once

                frag: function(result, parentNode) {
                    return $view.hookup($view.fragment(result), parentNode);
                },

                // #### fragment
                // this is used internally to create a document fragment, insert it,then hook it up
                fragment: function(result) {
                    if (typeof result !== "string" && result.nodeType === 11) {
                        return result;
                    }
                    var frag = can.buildFragment(result, document.body);
                    // If we have an empty frag...
                    if (!frag.childNodes.length) {
                        frag.appendChild(document.createTextNode(''));
                    }
                    return frag;
                },

                // ##### toId
                // Convert a path like string into something that's ok for an `element` ID.
                toId: function(src) {
                    return can.map(src.toString()
                        .split(/\/|\./g), function(part) {
                            // Dont include empty strings in toId functions
                            if (part) {
                                return part;
                            }
                        })
                        .join('_');
                },
                // ##### toStr
                // convert argument to a string
                toStr: function(txt) {
                    return txt == null ? "" : "" + txt;
                },

                // ##### hookup
                // attach the provided `fragment` to `parentNode`

                hookup: function(fragment, parentNode) {
                    var hookupEls = [],
                        id,
                        func;

                    // Get all `childNodes`.
                    can.each(fragment.childNodes ? can.makeArray(fragment.childNodes) : fragment, function(node) {
                        if (node.nodeType === 1) {
                            hookupEls.push(node);
                            hookupEls.push.apply(hookupEls, can.makeArray(node.getElementsByTagName('*')));
                        }
                    });

                    // Filter by `data-view-id` attribute.
                    can.each(hookupEls, function(el) {
                        if (el.getAttribute && (id = el.getAttribute('data-view-id')) && (func = $view.hookups[id])) {
                            func(el, parentNode, id);
                            delete $view.hookups[id];
                            el.removeAttribute('data-view-id');
                        }
                    });

                    return fragment;
                },

                // `hookups` keeps list of pending hookups, ie fragments to attach to a parent node

                hookups: {},

                // `hook` factory method for hookup function inserted into templates
                // hookup functions are called after the html is rendered to the page
                // only implemented by EJS templates.

                hook: function(cb) {
                    $view.hookups[++hookupId] = cb;
                    return ' data-view-id=\'' + hookupId + '\'';
                },


                cached: {},
                cachedRenderers: {},

                // cache view templates resolved via XHR on the client

                cache: true,

                // ##### register
                // given an info object, register a template type
                // different templating solutions produce strings or document fragments via their renderer function

                register: function(info) {
                    this.types['.' + info.suffix] = info;

                    // _removed if not used as a steal module_



                    can[info.suffix] = $view[info.suffix] = function(id, text) {
                        // If there is no text, assume id is the template text, so return a nameless renderer.
                        if (!text) {
                            // if the template has a fragRenderer already, just return that.
                            if (info.fragRenderer) {
                                return info.fragRenderer(null, id);
                            } else {
                                return makeRenderer(info.renderer(null, id));
                            }

                        }
                        if (info.fragRenderer) {
                            return $view.preload(id, info.fragRenderer(id, text));
                        } else {
                            return $view.preloadStringRenderer(id, info.renderer(id, text));
                        }

                    };

                },

                //registered view types
                types: {},


                ext: ".ejs",


                registerScript: function(type, id, src) {
                    return 'can.view.preloadStringRenderer(\'' + id + '\',' + $view.types['.' + type].script(id, src) + ');';
                },


                preload: function(id, renderer) {
                    var def = $view.cached[id] = new can.Deferred()
                        .resolve(function(data, helpers) {
                            return renderer.call(data, data, helpers);
                        });

                    // set cache references (otherwise preloaded recursive views won't recurse properly)
                    def.__view_id = id;
                    $view.cachedRenderers[id] = renderer;

                    return renderer;
                },


                preloadStringRenderer: function(id, stringRenderer) {
                    return this.preload(id, makeRenderer(stringRenderer));
                },

                // #### renderers
                // ---------------
                // can.view's primary purpose is to load templates (from strings or filesystem) and render them
                // can.view supports two different forms of rendering systems
                // mustache templates return a string based rendering function

                // stache (or other fragment based templating systems) return a document fragment, so 'hookup' steps are not required
                // ##### render
                //call `renderAs` with a hardcoded string, as view.render
                // always operates against resolved template files or hardcoded strings
                render: function(view, data, helpers, callback) {
                    return can.view.renderAs("string", view, data, helpers, callback);
                },

                // ##### renderTo
                renderTo: function(format, renderer, data, helpers) {
                    return (format === "string" && renderer.render ? renderer.render : renderer)(data, helpers);
                },


                renderAs: function(format, view, data, helpers, callback) {
                    // If helpers is a `function`, it is actually a callback.
                    if (isFunction(helpers)) {
                        callback = helpers;
                        helpers = undefined;
                    }

                    // See if we got passed any deferreds.
                    var deferreds = getDeferreds(data);
                    var reading, deferred, dataCopy, async, response;
                    if (deferreds.length) {
                        // Does data contain any deferreds?
                        // The deferred that resolves into the rendered content...
                        deferred = new can.Deferred();
                        dataCopy = can.extend({}, data);

                        // Add the view request to the list of deferreds.
                        deferreds.push(get(view, true));
                        // Wait for the view and all deferreds to finish...
                        can.when.apply(can, deferreds)
                            .then(function(resolved) {
                                // Get all the resolved deferreds.
                                var objs = makeArray(arguments),
                                    // Renderer is the last index of the data.
                                    renderer = objs.pop(),
                                    // The result of the template rendering with data.
                                    result;

                                // Make data look like the resolved deferreds.
                                if (can.isDeferred(data)) {
                                    dataCopy = usefulPart(resolved);
                                } else {
                                    // Go through each prop in data again and
                                    // replace the defferreds with what they resolved to.
                                    for (var prop in data) {
                                        if (can.isDeferred(data[prop])) {
                                            dataCopy[prop] = usefulPart(objs.shift());
                                        }
                                    }
                                }

                                // Get the rendered result.
                                result = can.view.renderTo(format, renderer, dataCopy, helpers);

                                // Resolve with the rendered view.
                                deferred.resolve(result, dataCopy);

                                // If there's a `callback`, call it back with the result.
                                if (callback) {
                                    callback(result, dataCopy);
                                }
                            }, function() {
                                deferred.reject.apply(deferred, arguments);
                            });
                        // Return the deferred...
                        return deferred;
                    } else {
                        // get is called async but in 
                        // ff will be async so we need to temporarily reset
                        reading = can.__clearReading();

                        // If there's a `callback` function
                        async = isFunction(callback);
                        // Get the `view` type
                        deferred = get(view, async);

                        if (reading) {
                            can.__setReading(reading);
                        }

                        // If we are `async`...
                        if (async) {
                            // Return the deferred
                            response = deferred;
                            // And fire callback with the rendered result.
                            deferred.then(function(renderer) {
                                callback(data ? can.view.renderTo(format, renderer, data, helpers) : renderer);
                            });
                        } else {
                            // if the deferred is resolved, call the cached renderer instead
                            // this is because it's possible, with recursive deferreds to
                            // need to render a view while its deferred is _resolving_.  A _resolving_ deferred
                            // is a deferred that was just resolved and is calling back it's success callbacks.
                            // If a new success handler is called while resoliving, it does not get fired by
                            // jQuery's deferred system.  So instead of adding a new callback
                            // we use the cached renderer.
                            // We also add __view_id on the deferred so we can look up it's cached renderer.
                            // In the future, we might simply store either a deferred or the cached result.
                            if (deferred.state() === 'resolved' && deferred.__view_id) {
                                var currentRenderer = $view.cachedRenderers[deferred.__view_id];
                                return data ? can.view.renderTo(format, currentRenderer, data, helpers) : currentRenderer;
                            } else {
                                // Otherwise, the deferred is complete, so
                                // set response to the result of the rendering.
                                deferred.then(function(renderer) {
                                    response = data ? can.view.renderTo(format, renderer, data, helpers) : renderer;
                                });
                            }
                        }

                        return response;
                    }
                },


                registerView: function(id, text, type, def) {
                    // Get the renderer function.
                    var info = (typeof type === "object" ? type : $view.types[type || $view.ext]),
                        renderer;
                    if (info.fragRenderer) {
                        renderer = info.fragRenderer(id, text);
                    } else {
                        renderer = makeRenderer(info.renderer(id, text));
                    }

                    def = def || new can.Deferred();

                    // Cache if we are caching.
                    if ($view.cache) {
                        $view.cached[id] = def;
                        def.__view_id = id;
                        $view.cachedRenderers[id] = renderer;
                    }

                    // Return the objects for the response's `dataTypes`
                    // (in this case view).
                    return def.resolve(renderer);
                }
            });

        // _removed if not used as a steal module_

        return can;
    })(__m2);

    // ## view/callbacks/callbacks.js
    var __m9 = (function(can) {

        var attr = can.view.attr = function(attributeName, attrHandler) {
            if (attrHandler) {
                if (typeof attributeName === "string") {
                    attributes[attributeName] = attrHandler;
                } else {
                    regExpAttributes.push({
                            match: attributeName,
                            handler: attrHandler
                        });
                }
            } else {
                var cb = attributes[attributeName];
                if (!cb) {

                    for (var i = 0, len = regExpAttributes.length; i < len; i++) {
                        var attrMatcher = regExpAttributes[i];
                        if (attrMatcher.match.test(attributeName)) {
                            cb = attrMatcher.handler;
                            break;
                        }
                    }
                }
                return cb;
            }
        };

        var attributes = {},
            regExpAttributes = [],
            automaticCustomElementCharacters = /[-\:]/;

        var tag = can.view.tag = function(tagName, tagHandler) {
            if (tagHandler) {
                // if we have html5shive ... re-generate
                if (window.html5) {
                    window.html5.elements += " " + tagName;
                    window.html5.shivDocument();
                }

                tags[tagName.toLowerCase()] = tagHandler;
            } else {
                var cb = tags[tagName.toLowerCase()];
                if (!cb && automaticCustomElementCharacters.test(tagName)) {
                    // empty callback for things that look like special tags
                    cb = function() {};
                }
                return cb;
            }

        };
        var tags = {};

        can.view.callbacks = {
            _tags: tags,
            _attributes: attributes,
            _regExpAttributes: regExpAttributes,
            tag: tag,
            attr: attr,
            // handles calling back a tag callback
            tagHandler: function(el, tagName, tagData) {
                var helperTagCallback = tagData.options.read('tags.' + tagName, {
                        isArgument: true,
                        proxyMethods: false
                    })
                    .value,
                    tagCallback = helperTagCallback || tags[tagName];

                // If this was an element like <foo-bar> that doesn't have a component, just render its content
                var scope = tagData.scope,
                    res;

                if (tagCallback) {
                    var reads = can.__clearReading();
                    res = tagCallback(el, tagData);
                    can.__setReading(reads);
                } else {
                    res = scope;
                }



                // If the tagCallback gave us something to render with, and there is content within that element
                // render it!
                if (res && tagData.subtemplate) {

                    if (scope !== res) {
                        scope = scope.add(res);
                    }
                    var result = tagData.subtemplate(scope, tagData.options);
                    var frag = typeof result === "string" ? can.view.frag(result) : result;
                    can.appendChild(el, frag);
                }
            }
        };
        return can.view.callbacks;
    })(__m2, __m10);

    // ## util/string/string.js
    var __m13 = (function(can) {
        // ##string.js
        // _Miscellaneous string utility functions._  
        // Several of the methods in this plugin use code adapated from Prototype
        // Prototype JavaScript framework, version 1.6.0.1.
        // © 2005-2007 Sam Stephenson
        var strUndHash = /_|-/,
            strColons = /\=\=/,
            strWords = /([A-Z]+)([A-Z][a-z])/g,
            strLowUp = /([a-z\d])([A-Z])/g,
            strDash = /([a-z\d])([A-Z])/g,
            strReplacer = /\{([^\}]+)\}/g,
            strQuote = /"/g,
            strSingleQuote = /'/g,
            strHyphenMatch = /-+(.)?/g,
            strCamelMatch = /[a-z][A-Z]/g,
            // Returns the `prop` property from `obj`.
            // If `add` is true and `prop` doesn't exist in `obj`, create it as an
            // empty object.
            getNext = function(obj, prop, add) {
                var result = obj[prop];
                if (result === undefined && add === true) {
                    result = obj[prop] = {};
                }
                return result;
            },
            // Returns `true` if the object can have properties (no `null`s).
            isContainer = function(current) {
                return /^f|^o/.test(typeof current);
            }, convertBadValues = function(content) {
                // Convert bad values into empty strings
                var isInvalid = content === null || content === undefined || isNaN(content) && '' + content === 'NaN';
                return '' + (isInvalid ? '' : content);
            };
        can.extend(can, {
                esc: function(content) {
                    return convertBadValues(content)
                        .replace(/&/g, '&amp;')
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;')
                        .replace(strQuote, '&#34;')
                        .replace(strSingleQuote, '&#39;');
                },
                getObject: function(name, roots, add) {
                    // The parts of the name we are looking up
                    // `['App','Models','Recipe']`
                    var parts = name ? name.split('.') : [],
                        length = parts.length,
                        current, r = 0,
                        i, container, rootsLength;
                    // Make sure roots is an `array`.
                    roots = can.isArray(roots) ? roots : [roots || window];
                    rootsLength = roots.length;
                    if (!length) {
                        return roots[0];
                    }
                    // For each root, mark it as current.
                    for (r; r < rootsLength; r++) {
                        current = roots[r];
                        container = undefined;
                        // Walk current to the 2nd to last object or until there
                        // is not a container.
                        for (i = 0; i < length && isContainer(current); i++) {
                            container = current;
                            current = getNext(container, parts[i]);
                        }
                        // If we found property break cycle
                        if (container !== undefined && current !== undefined) {
                            break;
                        }
                    }
                    // Remove property from found container
                    if (add === false && current !== undefined) {
                        delete container[parts[i - 1]];
                    }
                    // When adding property add it to the first root
                    if (add === true && current === undefined) {
                        current = roots[0];
                        for (i = 0; i < length && isContainer(current); i++) {
                            current = getNext(current, parts[i], true);
                        }
                    }
                    return current;
                },
                capitalize: function(s, cache) {
                    // Used to make newId.
                    return s.charAt(0)
                        .toUpperCase() + s.slice(1);
                },
                camelize: function(str) {
                    return convertBadValues(str)
                        .replace(strHyphenMatch, function(match, chr) {
                            return chr ? chr.toUpperCase() : '';
                        });
                },
                hyphenate: function(str) {
                    return convertBadValues(str)
                        .replace(strCamelMatch, function(str, offset) {
                            return str.charAt(0) + '-' + str.charAt(1)
                                .toLowerCase();
                        });
                },
                underscore: function(s) {
                    return s.replace(strColons, '/')
                        .replace(strWords, '$1_$2')
                        .replace(strLowUp, '$1_$2')
                        .replace(strDash, '_')
                        .toLowerCase();
                },
                sub: function(str, data, remove) {
                    var obs = [];
                    str = str || '';
                    obs.push(str.replace(strReplacer, function(whole, inside) {
                                // Convert inside to type.
                                var ob = can.getObject(inside, data, remove === true ? false : undefined);
                                if (ob === undefined || ob === null) {
                                    obs = null;
                                    return '';
                                }
                                // If a container, push into objs (which will return objects found).
                                if (isContainer(ob) && obs) {
                                    obs.push(ob);
                                    return '';
                                }
                                return '' + ob;
                            }));
                    return obs === null ? obs : obs.length <= 1 ? obs[0] : obs;
                },
                replacer: strReplacer,
                undHash: strUndHash
            });
        return can;
    })(__m2);

    // ## construct/construct.js
    var __m12 = (function(can) {
        // ## construct.js
        // `can.Construct`  
        // _This is a modified version of
        // [John Resig's class](http://ejohn.org/blog/simple-javascript-inheritance/).  
        // It provides class level inheritance and callbacks._
        // A private flag used to initialize a new class instance without
        // initializing it's bindings.
        var initializing = 0;

        can.Construct = function() {
            if (arguments.length) {
                return can.Construct.extend.apply(can.Construct, arguments);
            }
        };

        can.extend(can.Construct, {

                constructorExtends: true,

                newInstance: function() {
                    // Get a raw instance object (`init` is not called).
                    var inst = this.instance(),
                        args;
                    // Call `setup` if there is a `setup`
                    if (inst.setup) {
                        args = inst.setup.apply(inst, arguments);
                    }
                    // Call `init` if there is an `init`  
                    // If `setup` returned `args`, use those as the arguments
                    if (inst.init) {
                        inst.init.apply(inst, args || arguments);
                    }
                    return inst;
                },
                // Overwrites an object with methods. Used in the `super` plugin.
                // `newProps` - New properties to add.
                // `oldProps` - Where the old properties might be (used with `super`).
                // `addTo` - What we are adding to.
                _inherit: function(newProps, oldProps, addTo) {
                    can.extend(addTo || newProps, newProps || {});
                },
                // used for overwriting a single property.
                // this should be used for patching other objects
                // the super plugin overwrites this
                _overwrite: function(what, oldProps, propName, val) {
                    what[propName] = val;
                },
                // Set `defaults` as the merger of the parent `defaults` and this
                // object's `defaults`. If you overwrite this method, make sure to
                // include option merging logic.

                setup: function(base, fullName) {
                    this.defaults = can.extend(true, {}, base.defaults, this.defaults);
                },
                // Create's a new `class` instance without initializing by setting the
                // `initializing` flag.
                instance: function() {
                    // Prevents running `init`.
                    initializing = 1;
                    var inst = new this();
                    // Allow running `init`.
                    initializing = 0;
                    return inst;
                },
                // Extends classes.

                extend: function(fullName, klass, proto) {
                    // Figure out what was passed and normalize it.
                    if (typeof fullName !== 'string') {
                        proto = klass;
                        klass = fullName;
                        fullName = null;
                    }
                    if (!proto) {
                        proto = klass;
                        klass = null;
                    }
                    proto = proto || {};
                    var _super_class = this,
                        _super = this.prototype,
                        parts, current, _fullName, _shortName, name, shortName, namespace, prototype;
                    // Instantiate a base class (but only create the instance,
                    // don't run the init constructor).
                    prototype = this.instance();
                    // Copy the properties over onto the new prototype.
                    can.Construct._inherit(proto, _super, prototype);
                    // The dummy class constructor.

                    function Constructor() {
                        // All construction is actually done in the init method.
                        if (!initializing) {


                            return this.constructor !== Constructor &&
                            // We are being called without `new` or we are extending.
                            arguments.length && Constructor.constructorExtends ? Constructor.extend.apply(Constructor, arguments) :
                            // We are being called with `new`.
                            Constructor.newInstance.apply(Constructor, arguments);
                        }
                    }
                    // Copy old stuff onto class (can probably be merged w/ inherit)
                    for (name in _super_class) {
                        if (_super_class.hasOwnProperty(name)) {
                            Constructor[name] = _super_class[name];
                        }
                    }
                    // Copy new static properties on class.
                    can.Construct._inherit(klass, _super_class, Constructor);
                    // Setup namespaces.
                    if (fullName) {

                        parts = fullName.split('.');
                        shortName = parts.pop();
                        current = can.getObject(parts.join('.'), window, true);
                        namespace = current;
                        _fullName = can.underscore(fullName.replace(/\./g, "_"));
                        _shortName = can.underscore(shortName);



                        current[shortName] = Constructor;
                    }
                    // Set things that shouldn't be overwritten.
                    can.extend(Constructor, {
                            constructor: Constructor,
                            prototype: prototype,

                            namespace: namespace,

                            _shortName: _shortName,

                            fullName: fullName,
                            _fullName: _fullName
                        });
                    // Dojo and YUI extend undefined
                    if (shortName !== undefined) {
                        Constructor.shortName = shortName;
                    }
                    // Make sure our prototype looks nice.
                    Constructor.prototype.constructor = Constructor;
                    // Call the class `setup` and `init`
                    var t = [_super_class].concat(can.makeArray(arguments)),
                        args = Constructor.setup.apply(Constructor, t);
                    if (Constructor.init) {
                        Constructor.init.apply(Constructor, args || t);
                    }

                    return Constructor;
                }
            });

        can.Construct.prototype.setup = function() {};

        can.Construct.prototype.init = function() {};
        return can.Construct;
    })(__m13);

    // ## control/control.js
    var __m11 = (function(can) {
        // ### bind
        // this helper binds to one element and returns a function that unbinds from that element.
        var bind = function(el, ev, callback) {

            can.bind.call(el, ev, callback);

            return function() {
                can.unbind.call(el, ev, callback);
            };
        },
            isFunction = can.isFunction,
            extend = can.extend,
            each = can.each,
            slice = [].slice,
            paramReplacer = /\{([^\}]+)\}/g,
            special = can.getObject("$.event.special", [can]) || {},

            // ### delegate
            // this helper binds to elements based on a selector and returns a 
            // function that unbinds.
            delegate = function(el, selector, ev, callback) {
                can.delegate.call(el, selector, ev, callback);
                return function() {
                    can.undelegate.call(el, selector, ev, callback);
                };
            },

            // ### binder
            // Calls bind or unbind depending if there is a selector.
            binder = function(el, ev, callback, selector) {
                return selector ?
                    delegate(el, can.trim(selector), ev, callback) :
                    bind(el, ev, callback);
            },

            basicProcessor;

        var Control = can.Control = can.Construct(

            // ## *static functions*

            {
                // ## can.Control.setup
                // This function pre-processes which methods are event listeners and which are methods of
                // the control. It has a mechanism to allow controllers to inherit default values from super
                // classes, like `can.Construct`, and will cache functions that are action functions (see `_isAction`)
                // or functions with an underscored name.
                setup: function() {
                    can.Construct.setup.apply(this, arguments);

                    if (can.Control) {
                        var control = this,
                            funcName;

                        control.actions = {};
                        for (funcName in control.prototype) {
                            if (control._isAction(funcName)) {
                                control.actions[funcName] = control._action(funcName);
                            }
                        }
                    }
                },
                // ## can.Control._shifter
                // Moves `this` to the first argument, wraps it with `jQuery` if it's 
                // an element.
                _shifter: function(context, name) {

                    var method = typeof name === "string" ? context[name] : name;

                    if (!isFunction(method)) {
                        method = context[method];
                    }

                    return function() {
                        context.called = name;
                        return method.apply(context, [this.nodeName ? can.$(this) : this].concat(slice.call(arguments, 0)));
                    };
                },

                // ## can.Control._isAction
                // Return `true` if `methodName` refers to an action. An action is a `methodName` value that
                // is not the constructor, and is either a function or string that refers to a function, or is
                // defined in `special`, `processors`. Detects whether `methodName` is also a valid method name.
                _isAction: function(methodName) {
                    var val = this.prototype[methodName],
                        type = typeof val;

                    return (methodName !== 'constructor') &&
                    (type === "function" || (type === "string" && isFunction(this.prototype[val]))) && !! (special[methodName] || processors[methodName] || /[^\w]/.test(methodName));
                },
                // ## can.Control._action
                // Takes a method name and the options passed to a control and tries to return the data 
                // necessary to pass to a processor (something that binds things).
                // For performance reasons, `_action` is called twice: 
                // * It's called when the Control class is created. for templated method names (e.g., `{window} foo`), it returns null. For non-templated method names it returns the event binding data. That data is added to `this.actions`.
                // * It is called wehn a control instance is created, but only for templated actions.
                _action: function(methodName, options) {

                    // If we don't have options (a `control` instance), we'll run this later. If we have
                    // options, run `can.sub` to replace the action template `{}` with values from the `options`
                    // or `window`. If a `{}` template resolves to an object, `convertedName` will be an array.
                    // In that case, the event name we want will be the last item in that array.
                    paramReplacer.lastIndex = 0;
                    if (options || !paramReplacer.test(methodName)) {
                        var convertedName = options ? can.sub(methodName, this._lookup(options)) : methodName;
                        if (!convertedName) {

                            return null;
                        }
                        var arr = can.isArray(convertedName),
                            name = arr ? convertedName[1] : convertedName,
                            parts = name.split(/\s+/g),
                            event = parts.pop();

                        return {
                            processor: processors[event] || basicProcessor,
                            parts: [name, parts.join(" "), event],
                            delegate: arr ? convertedName[0] : undefined
                        };
                    }
                },
                _lookup: function(options) {
                    return [options, window];
                },
                // ## can.Control.processors
                // An object of `{eventName : function}` pairs that Control uses to 
                // hook up events automatically.
                processors: {},
                // ## can.Control.defaults
                // A object of name-value pairs that act as default values for a control instance
                defaults: {}
            }, {
                // ## *prototype functions*

                // ## setup
                // Setup is where most of the Control's magic happens. It performs several pre-initialization steps:
                // - Sets `this.element`
                // - Adds the Control's name to the element's className
                // - Saves the Control in `$.data`
                // - Merges Options
                // - Binds event handlers using `delegate`
                // The final step is to return pass the element and prepareed options, to be used in `init`.
                setup: function(element, options) {

                    var cls = this.constructor,
                        pluginname = cls.pluginName || cls._fullName,
                        arr;

                    // Retrieve the raw element, then set the plugin name as a class there.
                    this.element = can.$(element);

                    if (pluginname && pluginname !== 'can_control') {
                        this.element.addClass(pluginname);
                    }

                    // Set up the 'controls' data on the element. If it does not exist, initialize
                    // it to an empty array.
                    arr = can.data(this.element, 'controls');
                    if (!arr) {
                        arr = [];
                        can.data(this.element, 'controls', arr);
                    }
                    arr.push(this);

                    // The `this.options` property is an Object that contains configuration data
                    // passed to a control when it is created (`new can.Control(element, options)`)
                    // The `options` argument passed when creating the control is merged with `can.Control.defaults` 
                    // in [can.Control.prototype.setup setup].
                    // If no `options` value is used during creation, the value in `defaults` is used instead
                    this.options = extend({}, cls.defaults, options);

                    this.on();

                    return [this.element, this.options];
                },
                // ## on
                // This binds an event handler for an event to a selector under the scope of `this.element`
                // If no options are specified, all events are rebound to their respective elements. The actions,
                // which were cached in `setup`, are used and all elements are bound using `delegate` from `this.element`.
                on: function(el, selector, eventName, func) {
                    if (!el) {
                        this.off();

                        var cls = this.constructor,
                            bindings = this._bindings,
                            actions = cls.actions,
                            element = this.element,
                            destroyCB = can.Control._shifter(this, "destroy"),
                            funcName, ready;

                        for (funcName in actions) {
                            // Only push if we have the action and no option is `undefined`
                            if (actions.hasOwnProperty(funcName)) {
                                ready = actions[funcName] || cls._action(funcName, this.options, this);
                                if (ready) {
                                    bindings.control[funcName] = ready.processor(ready.delegate || element,
                                        ready.parts[2], ready.parts[1], funcName, this);
                                }
                            }
                        }

                        // Set up the ability to `destroy` the control later.
                        can.bind.call(element, "removed", destroyCB);
                        bindings.user.push(function(el) {
                            can.unbind.call(el, "removed", destroyCB);
                        });
                        return bindings.user.length;
                    }

                    // if `el` is a string, use that as `selector` and re-set it to this control's element...
                    if (typeof el === 'string') {
                        func = eventName;
                        eventName = selector;
                        selector = el;
                        el = this.element;
                    }

                    // ...otherwise, set `selector` to null
                    if (func === undefined) {
                        func = eventName;
                        eventName = selector;
                        selector = null;
                    }

                    if (typeof func === 'string') {
                        func = can.Control._shifter(this, func);
                    }

                    this._bindings.user.push(binder(el, eventName, func, selector));

                    return this._bindings.user.length;
                },
                // ## off
                // Unbinds all event handlers on the controller.
                // This should _only_ be called in combination with .on()
                off: function() {
                    var el = this.element[0],
                        bindings = this._bindings;
                    if (bindings) {
                        each(bindings.user || [], function(value) {
                            value(el);
                        });
                        each(bindings.control || {}, function(value) {
                            value(el);
                        });
                    }
                    // Adds bindings.
                    this._bindings = {
                        user: [],
                        control: {}
                    };
                },
                // ## destroy
                // Prepares a `control` for garbage collection.
                // First checks if it has already been removed. Then, removes all the bindings, data, and 
                // the element from the Control instance.
                destroy: function() {
                    if (this.element === null) {

                        return;
                    }
                    var Class = this.constructor,
                        pluginName = Class.pluginName || Class._fullName,
                        controls;

                    this.off();

                    if (pluginName && pluginName !== 'can_control') {
                        this.element.removeClass(pluginName);
                    }

                    controls = can.data(this.element, "controls");
                    controls.splice(can.inArray(this, controls), 1);

                    can.trigger(this, "destroyed");

                    this.element = null;
                }
            });

        // ## Processors
        // Processors do the binding. This basic processor binds events. Each returns a function that unbinds 
        // when called.
        var processors = can.Control.processors;
        basicProcessor = function(el, event, selector, methodName, control) {
            return binder(el, event, can.Control._shifter(control, methodName), selector);
        };

        // Set common events to be processed as a `basicProcessor`
        each(["change", "click", "contextmenu", "dblclick", "keydown", "keyup",
                "keypress", "mousedown", "mousemove", "mouseout", "mouseover",
                "mouseup", "reset", "resize", "scroll", "select", "submit", "focusin",
                "focusout", "mouseenter", "mouseleave",
                "touchstart", "touchmove", "touchcancel", "touchend", "touchleave",
                "inserted", "removed"
            ], function(v) {
                processors[v] = basicProcessor;
            });

        return Control;
    })(__m2, __m12);

    // ## util/bind/bind.js
    var __m16 = (function(can) {

        // ## Bind helpers
        can.bindAndSetup = function() {
            // Add the event to this object
            can.addEvent.apply(this, arguments);
            // If not initializing, and the first binding
            // call bindsetup if the function exists.
            if (!this._init) {
                if (!this._bindings) {
                    this._bindings = 1;
                    // setup live-binding
                    if (this._bindsetup) {
                        this._bindsetup();
                    }
                } else {
                    this._bindings++;
                }
            }
            return this;
        };
        can.unbindAndTeardown = function(ev, handler) {
            // Remove the event handler
            can.removeEvent.apply(this, arguments);
            if (this._bindings === null) {
                this._bindings = 0;
            } else {
                this._bindings--;
            }
            // If there are no longer any bindings and
            // there is a bindteardown method, call it.
            if (!this._bindings && this._bindteardown) {
                this._bindteardown();
            }
            return this;
        };
        return can;
    })(__m2);

    // ## map/bubble.js
    var __m17 = (function(can) {



        var bubble = can.bubble = {
            // Given a binding, returns a string event name used to set up bubbline.
            // If no binding should be done, undefined or null should be returned
            event: function(map, eventName) {
                return map.constructor._bubbleRule(eventName, map);
            },
            childrenOf: function(parentMap, eventName) {

                parentMap._each(function(child, prop) {
                    if (child && child.bind) {
                        bubble.toParent(child, parentMap, prop, eventName);
                    }
                });

            },
            teardownChildrenFrom: function(parentMap, eventName) {
                parentMap._each(function(child) {

                    bubble.teardownFromParent(parentMap, child, eventName);

                });
            },
            toParent: function(child, parent, prop, eventName) {
                can.listenTo.call(parent, child, eventName, function() {
                    // `batchTrigger` the type on this...
                    var args = can.makeArray(arguments),
                        ev = args.shift();

                    args[0] =
                    (can.List && parent instanceof can.List ?
                        parent.indexOf(child) :
                        prop) + (args[0] ? "." + args[0] : "");

                    // track objects dispatched on this map		
                    ev.triggeredNS = ev.triggeredNS || {};

                    // if it has already been dispatched exit
                    if (ev.triggeredNS[parent._cid]) {
                        return;
                    }

                    ev.triggeredNS[parent._cid] = true;
                    // send change event with modified attr to parent	
                    can.trigger(parent, ev, args);
                });
            },
            teardownFromParent: function(parent, child, eventName) {
                if (child && child.unbind) {
                    can.stopListening.call(parent, child, eventName);
                }
            },
            bind: function(parent, eventName) {
                if (!parent._init) {
                    var bubbleEvent = bubble.event(parent, eventName);
                    if (bubbleEvent) {
                        if (!parent._bubbleBindings) {
                            parent._bubbleBindings = {};
                        }
                        if (!parent._bubbleBindings[bubbleEvent]) {
                            parent._bubbleBindings[bubbleEvent] = 1;
                            // setup live-binding
                            bubble.childrenOf(parent, bubbleEvent);
                        } else {
                            parent._bubbleBindings[bubbleEvent]++;
                        }

                    }
                }
            },
            unbind: function(parent, eventName) {
                var bubbleEvent = bubble.event(parent, eventName);
                if (bubbleEvent) {
                    if (parent._bubbleBindings) {
                        parent._bubbleBindings[bubbleEvent]--;
                    }

                    if (!parent._bubbleBindings[bubbleEvent]) {
                        delete parent._bubbleBindings[bubbleEvent];
                        bubble.teardownChildrenFrom(parent, bubbleEvent);
                        if (can.isEmptyObject(parent._bubbleBindings)) {
                            delete parent._bubbleBindings;
                        }
                    }
                }
            },
            add: function(parent, child, prop) {
                if (child instanceof can.Map && parent._bubbleBindings) {
                    for (var eventName in parent._bubbleBindings) {
                        if (parent._bubbleBindings[eventName]) {
                            bubble.teardownFromParent(parent, child, eventName);
                            bubble.toParent(child, parent, prop, eventName);
                        }
                    }
                }
            },
            removeMany: function(parent, children) {
                for (var i = 0, len = children.length; i < len; i++) {
                    bubble.remove(parent, children[i]);
                }
            },
            remove: function(parent, child) {
                if (child instanceof can.Map && parent._bubbleBindings) {
                    for (var eventName in parent._bubbleBindings) {
                        if (parent._bubbleBindings[eventName]) {
                            bubble.teardownFromParent(parent, child, eventName);
                        }
                    }
                }
            },
            set: function(parent, prop, value, current) {

                //var res = parent.__type(value, prop);
                if (can.Map.helpers.isObservable(value)) {
                    bubble.add(parent, value, prop);
                }
                // bubble.add will remove, so only remove if we are replacing another object
                if (can.Map.helpers.isObservable(current)) {
                    bubble.remove(parent, current);
                }
                return value;
            }
        };

        return bubble;

    })(__m2);

    // ## util/batch/batch.js
    var __m18 = (function(can) {
        // Which batch of events this is for -- might not want to send multiple
        // messages on the same batch.  This is mostly for event delegation.
        var batchNum = 1,
            // how many times has start been called without a stop
            transactions = 0,
            // an array of events within a transaction
            batchEvents = [],
            stopCallbacks = [];
        can.batch = {

            start: function(batchStopHandler) {
                transactions++;
                if (batchStopHandler) {
                    stopCallbacks.push(batchStopHandler);
                }
            },

            stop: function(force, callStart) {
                if (force) {
                    transactions = 0;
                } else {
                    transactions--;
                }
                if (transactions === 0) {
                    var items = batchEvents.slice(0),
                        callbacks = stopCallbacks.slice(0),
                        i, len;
                    batchEvents = [];
                    stopCallbacks = [];
                    batchNum++;
                    if (callStart) {
                        can.batch.start();
                    }
                    for (i = 0, len = items.length; i < len; i++) {
                        can.trigger.apply(can, items[i]);
                    }
                    for (i = 0, len = callbacks.length; i < callbacks.length; i++) {
                        callbacks[i]();
                    }
                }
            },

            trigger: function(item, event, args) {
                // Don't send events if initalizing.
                if (!item._init) {
                    if (transactions === 0) {
                        return can.trigger(item, event, args);
                    } else {
                        event = typeof event === 'string' ? {
                            type: event
                        } : event;
                        event.batchNum = batchNum;
                        batchEvents.push([
                                item,
                                event,
                                args
                            ]);
                    }
                }
            }
        };
    })(__m4);

    // ## map/map.js
    var __m15 = (function(can, bind, bubble) {
        // ## Helpers

        // A temporary map of Maps that have been made from plain JS objects.
        var madeMap = null;
        // Clears out map of converted objects.
        var teardownMap = function() {
            for (var cid in madeMap) {
                if (madeMap[cid].added) {
                    delete madeMap[cid].obj._cid;
                }
            }
            madeMap = null;
        };
        // Retrieves a Map instance from an Object.
        var getMapFromObject = function(obj) {
            return madeMap && madeMap[obj._cid] && madeMap[obj._cid].instance;
        };
        // A temporary map of Maps
        var serializeMap = null;


        var Map = can.Map = can.Construct.extend({

                setup: function() {

                    can.Construct.setup.apply(this, arguments);

                    // Do not run if we are defining can.Map.
                    if (can.Map) {
                        if (!this.defaults) {
                            this.defaults = {};
                        }
                        // Builds a list of compute and non-compute properties in this Object's prototype.
                        this._computes = [];

                        for (var prop in this.prototype) {
                            // Non-functions are regular defaults.
                            if (prop !== "define" && typeof this.prototype[prop] !== "function") {
                                this.defaults[prop] = this.prototype[prop];
                                // Functions with an `isComputed` property are computes.
                            } else if (this.prototype[prop].isComputed) {
                                this._computes.push(prop);
                            }
                        }
                        this.helpers.define(this);
                    }
                    // If we inherit from can.Map, but not can.List, make sure any lists are the correct type.
                    if (can.List && !(this.prototype instanceof can.List)) {
                        this.List = Map.List.extend({
                                Map: this
                            }, {});
                    }

                },
                // Reference to bubbling helpers.
                _bubble: bubble,
                // Given an eventName, determine if bubbling should be setup.
                _bubbleRule: function(eventName) {
                    return (eventName === "change" || eventName.indexOf(".") >= 0) && "change";
                },
                // List of computes on the Map's prototype.
                _computes: [],
                // Adds an event to this Map.
                bind: can.bindAndSetup,
                on: can.bindAndSetup,
                // Removes an event from this Map.
                unbind: can.unbindAndTeardown,
                off: can.unbindAndTeardown,
                // Name of the id field. Used in can.Model.
                id: "id",
                // ## Internal helpers
                helpers: {
                    // ### can.Map.helpers.define
                    // Stub function for the define plugin.
                    define: function() {},

                    // ### can.Map.helpers.attrParts
                    // Parses attribute name into its parts.
                    attrParts: function(attr, keepKey) {
                        //Keep key intact
                        if (keepKey) {
                            return [attr];
                        }
                        // Split key on '.'
                        return can.isArray(attr) ? attr : ("" + attr)
                            .split(".");
                    },

                    // ### can.Map.helpers.addToMap
                    // Tracks Map instances created from JS Objects
                    addToMap: function(obj, instance) {
                        var teardown;
                        // Setup a fresh mapping if `madeMap` is missing.
                        if (!madeMap) {
                            teardown = teardownMap;
                            madeMap = {};
                        }
                        // Record if Object has a `_cid` before adding one.
                        var hasCid = obj._cid;
                        var cid = can.cid(obj);

                        // Only update if there already isn't one already.
                        if (!madeMap[cid]) {

                            madeMap[cid] = {
                                obj: obj,
                                instance: instance,
                                added: !hasCid
                            };
                        }
                        return teardown;
                    },

                    // ### can.Map.helpers.isObservable
                    // Determines if `obj` is observable.
                    isObservable: function(obj) {
                        return obj instanceof can.Map || (obj && obj === can.route);
                    },

                    // ### can.Map.helpers.canMakeObserve
                    // Determines if an object can be made into an observable.
                    canMakeObserve: function(obj) {
                        return obj && !can.isDeferred(obj) && (can.isArray(obj) || can.isPlainObject(obj));
                    },

                    // ### can.Map.helpers.serialize
                    // Serializes a Map or Map.List
                    serialize: function(map, how, where) {
                        var cid = can.cid(map),
                            firstSerialize = false;
                        if (!serializeMap) {
                            firstSerialize = true;
                            // Serialize might call .attr() so we need to keep different map 
                            serializeMap = {
                                attr: {},
                                serialize: {}
                            };
                        }
                        serializeMap[how][cid] = where;
                        // Go through each property.
                        map.each(function(val, name) {
                            // If the value is an `object`, and has an `attrs` or `serialize` function.
                            var result,
                                isObservable = Map.helpers.isObservable(val),
                                serialized = isObservable && serializeMap[how][can.cid(val)];
                            if (serialized) {
                                result = serialized;
                            } else {
                                if (how === "serialize") {
                                    result = Map.helpers._serialize(map, name, val);
                                } else {
                                    result = Map.helpers._getValue(map, name, val, how);
                                }
                            }
                            // this is probably removable
                            if (result !== undefined) {
                                where[name] = result;
                            }
                        });

                        can.__reading(map, '__keys');
                        if (firstSerialize) {
                            serializeMap = null;
                        }
                        return where;
                    },
                    _serialize: function(map, name, val) {
                        return Map.helpers._getValue(map, name, val, "serialize");
                    },
                    _getValue: function(map, name, val, how) {
                        if (Map.helpers.isObservable(val)) {
                            return val[how]();
                        } else {
                            return val;
                        }
                    }
                },

                keys: function(map) {
                    var keys = [];
                    can.__reading(map, '__keys');
                    for (var keyName in map._data) {
                        keys.push(keyName);
                    }
                    return keys;
                }
            },

            {
                setup: function(obj) {
                    // `_data` is where we keep the properties.
                    this._data = {};

                    // The namespace this `object` uses to listen to events.
                    can.cid(this, ".map");
                    // Sets all `attrs`.
                    this._init = 1;
                    // It's handy if we pass this to comptues, because computes can have a default value.
                    var defaultValues = this._setupDefaults();
                    this._setupComputes(defaultValues);
                    var teardownMapping = obj && can.Map.helpers.addToMap(obj, this);

                    var data = can.extend(can.extend(true, {}, defaultValues), obj);

                    this.attr(data);

                    if (teardownMapping) {
                        teardownMapping();
                    }

                    // `batchTrigger` change events.
                    this.bind('change', can.proxy(this._changes, this));

                    delete this._init;
                },
                // Sets up computed properties on a Map.
                _setupComputes: function() {
                    var computes = this.constructor._computes;
                    this._computedBindings = {};

                    for (var i = 0, len = computes.length, prop; i < len; i++) {
                        prop = computes[i];
                        // Make the context of the compute the current Map
                        this[prop] = this[prop].clone(this);
                        // Keep track of computed properties
                        this._computedBindings[prop] = {
                            count: 0
                        };
                    }
                },
                _setupDefaults: function() {
                    return this.constructor.defaults || {};
                },
                // Setup child bindings.
                _bindsetup: function() {},
                // Teardown child bindings.
                _bindteardown: function() {},
                // `change`event handler.
                _changes: function(ev, attr, how, newVal, oldVal) {
                    // when a change happens, create the named event.
                    can.batch.trigger(this, {
                            type: attr,
                            batchNum: ev.batchNum
                        }, [newVal, oldVal]);

                    if (how === "remove" || how === "add") {
                        can.batch.trigger(this, {
                                type: "__keys",
                                batchNum: ev.batchNum
                            });
                    }
                },
                // Trigger a change event.
                _triggerChange: function(attr, how, newVal, oldVal) {
                    can.batch.trigger(this, "change", can.makeArray(arguments));
                },
                // Iterator that does not trigger live binding.
                _each: function(callback) {
                    var data = this.__get();
                    for (var prop in data) {
                        if (data.hasOwnProperty(prop)) {
                            callback(data[prop], prop);
                        }
                    }
                },

                attr: function(attr, val) {
                    // This is super obfuscated for space -- basically, we're checking
                    // if the type of the attribute is not a `number` or a `string`.
                    var type = typeof attr;
                    if (type !== "string" && type !== "number") {
                        return this._attrs(attr, val);
                        // If we are getting a value.
                    } else if (arguments.length === 1) {
                        // Let people know we are reading.
                        can.__reading(this, attr);
                        return this._get(attr);
                    } else {
                        // Otherwise we are setting.
                        this._set(attr, val);
                        return this;
                    }
                },

                each: function() {
                    return can.each.apply(undefined, [this].concat(can.makeArray(arguments)));
                },

                removeAttr: function(attr) {
                    // If this is List.
                    var isList = can.List && this instanceof can.List,
                        // Convert the `attr` into parts (if nested).
                        parts = can.Map.helpers.attrParts(attr),
                        // The actual property to remove.
                        prop = parts.shift(),
                        // The current value.
                        current = isList ? this[prop] : this._data[prop];

                    // If we have more parts, call `removeAttr` on that part.
                    if (parts.length && current) {
                        return current.removeAttr(parts);
                    } else {

                        // If attr does not have a `.`
                        if (typeof attr === 'string' && !! ~attr.indexOf('.')) {
                            prop = attr;
                        }

                        this._remove(prop, current);
                        return current;
                    }
                },
                // Remove a property.
                _remove: function(prop, current) {
                    if (prop in this._data) {
                        // Delete the property from `_data` and the Map
                        // as long as it isn't part of the Map's prototype.
                        delete this._data[prop];
                        if (!(prop in this.constructor.prototype)) {
                            delete this[prop];
                        }
                        // Let others now this property has been removed.
                        this._triggerChange(prop, "remove", undefined, current);

                    }
                },
                // Reads a property from the `object`.
                _get: function(attr) {
                    var value;
                    // Handles the case of a key having a `.` in its name
                    if (typeof attr === 'string' && !! ~attr.indexOf('.')) {
                        // Attempt to get the value
                        value = this.__get(attr);
                        // For keys with a `.` in them, value will be defined
                        if (value !== undefined) {
                            return value;
                        }
                    }

                    // Otherwise we have to dig deeper into the Map to get the value.
                    // First, break up the attr (`"foo.bar"`) into parts like `["foo","bar"]`.
                    var parts = can.Map.helpers.attrParts(attr),
                        // Then get the value of the first attr name (`"foo"`).
                        current = this.__get(parts.shift());
                    // If there are other attributes to read...
                    return parts.length ?
                    // and current has a value...
                    current ?
                    // then lookup the remaining attrs on current
                    current._get(parts) :
                    // or if there's no current, return undefined.
                    undefined :
                    // If there are no more parts, return current.
                    current;
                },
                // Reads a property directly if an `attr` is provided, otherwise
                // returns the "real" data object itself.
                __get: function(attr) {
                    if (attr) {
                        // If property is a compute return the result, otherwise get the value directly
                        if (this._computedBindings[attr]) {
                            return this[attr]();
                        } else {
                            return this._data[attr];
                        }
                        // If not property is provided, return entire `_data` object
                    } else {
                        return this._data;
                    }
                },
                // converts the value into an observable if needed
                __type: function(value, prop) {
                    // If we are getting an object.
                    if (!(value instanceof can.Map) && can.Map.helpers.canMakeObserve(value)) {

                        var cached = getMapFromObject(value);
                        if (cached) {
                            return cached;
                        }
                        if (can.isArray(value)) {
                            var List = can.List;
                            return new List(value);
                        } else {
                            var Map = this.constructor.Map || can.Map;
                            return new Map(value);
                        }
                    }
                    return value;
                },
                // Sets `attr` prop as value on this object where.
                // `attr` - Is a string of properties or an array  of property values.
                // `value` - The raw value to set.
                _set: function(attr, value, keepKey) {
                    // Convert `attr` to attr parts (if it isn't already).
                    var parts = can.Map.helpers.attrParts(attr, keepKey),
                        // The immediate prop we are setting.
                        prop = parts.shift(),
                        // We only need to get the current value if we are not in init.
                        current = this._init ? undefined : this.__get(prop);

                    if (parts.length && Map.helpers.isObservable(current)) {
                        // If we have an `object` and remaining parts that `object` should set it.
                        current._set(parts, value);
                    } else if (!parts.length) {
                        // We're in "real" set territory.
                        if (this.__convert) {
                            //Convert if there is a converter
                            value = this.__convert(prop, value);
                        }
                        this.__set(prop, this.__type(value, prop), current);
                    } else {
                        throw "can.Map: Object does not exist";
                    }
                },
                __set: function(prop, value, current) {
                    // TODO: Check if value is object and transform.
                    // Don't do anything if the value isn't changing.
                    if (value !== current) {
                        // Check if we are adding this for the first time --
                        // if we are, we need to create an `add` event.
                        var changeType = this.__get()
                            .hasOwnProperty(prop) ? "set" : "add";

                        // Set the value on `_data` and hook it up to send event.
                        this.___set(prop, this.constructor._bubble.set(this, prop, value, current));

                        // `batchTrigger` the change event.
                        this._triggerChange(prop, changeType, value, current);

                        // If we can stop listening to our old value, do it.
                        if (current) {
                            this.constructor._bubble.teardownFromParent(this, current);
                        }
                    }

                },
                // Directly sets a property on this `object`.
                ___set: function(prop, val) {
                    if (this._computedBindings[prop]) {
                        this[prop](val);
                    } else {
                        this._data[prop] = val;
                    }
                    // Add property directly for easy writing.
                    // Check if its on the `prototype` so we don't overwrite methods like `attrs`.
                    if (!can.isFunction(this.constructor.prototype[prop]) && !this._computedBindings[prop]) {
                        this[prop] = val;
                    }
                },

                bind: function(eventName, handler) {
                    var computedBinding = this._computedBindings && this._computedBindings[eventName];
                    if (computedBinding) {
                        // The first time we bind to this computed property we
                        // initialize `count` and `batchTrigger` the change event.
                        if (!computedBinding.count) {
                            computedBinding.count = 1;
                            var self = this;
                            computedBinding.handler = function(ev, newVal, oldVal) {
                                can.batch.trigger(self, {
                                        type: eventName,
                                        batchNum: ev.batchNum
                                    }, [newVal, oldVal]);
                            };
                            this[eventName].bind("change", computedBinding.handler);
                        } else {
                            // Increment number of things listening to this computed property.
                            computedBinding.count++;
                        }

                    }
                    // The first time we bind to this Map, `_bindsetup` will
                    // be called to setup child event bubbling.
                    this.constructor._bubble.bind(this, eventName);
                    return can.bindAndSetup.apply(this, arguments);

                },

                unbind: function(eventName, handler) {
                    var computedBinding = this._computedBindings && this._computedBindings[eventName];
                    if (computedBinding) {
                        // If there is only one listener, we unbind the change event handler
                        // and clean it up since no one is listening to this property any more.
                        if (computedBinding.count === 1) {
                            computedBinding.count = 0;
                            this[eventName].unbind("change", computedBinding.handler);
                            delete computedBinding.handler;
                        } else {
                            // Decrement number of things listening to this computed property
                            computedBinding.count--;
                        }

                    }
                    this.constructor._bubble.unbind(this, eventName);
                    return can.unbindAndTeardown.apply(this, arguments);

                },

                serialize: function() {
                    return can.Map.helpers.serialize(this, 'serialize', {});
                },

                _attrs: function(props, remove) {
                    if (props === undefined) {
                        return Map.helpers.serialize(this, 'attr', {});
                    }

                    props = can.simpleExtend({}, props);
                    var prop,
                        self = this,
                        newVal;

                    // Batch all of the change events until we are done.
                    can.batch.start();
                    // Merge current properties with the new ones.
                    this.each(function(curVal, prop) {
                        // You can not have a _cid property; abort.
                        if (prop === "_cid") {
                            return;
                        }
                        newVal = props[prop];

                        // If we are merging, remove the property if it has no value.
                        if (newVal === undefined) {
                            if (remove) {
                                self.removeAttr(prop);
                            }
                            return;
                        }

                        // Run converter if there is one
                        if (self.__convert) {
                            newVal = self.__convert(prop, newVal);
                        }

                        // If we're dealing with models, we want to call _set to let converters run.
                        if (Map.helpers.isObservable(newVal)) {

                            self.__set(prop, self.__type(newVal, prop), curVal);
                            // If its an object, let attr merge.
                        } else if (Map.helpers.isObservable(curVal) && Map.helpers.canMakeObserve(newVal)) {
                            curVal.attr(newVal, remove);
                            // Otherwise just set.
                        } else if (curVal !== newVal) {
                            self.__set(prop, self.__type(newVal, prop), curVal);
                        }

                        delete props[prop];
                    });
                    // Add remaining props.
                    for (prop in props) {
                        // Ignore _cid.
                        if (prop !== "_cid") {
                            newVal = props[prop];
                            this._set(prop, newVal, true);
                        }

                    }
                    can.batch.stop();
                    return this;
                },

                compute: function(prop) {
                    // If the property is a function, use it as the getter/setter
                    // otherwise, create a new compute that returns the value of a property on `this`
                    if (can.isFunction(this.constructor.prototype[prop])) {
                        return can.compute(this[prop], this);
                    } else {
                        var reads = prop.split("."),
                            last = reads.length - 1,
                            options = {
                                args: []
                            };
                        return can.compute(function(newVal) {
                            if (arguments.length) {
                                can.compute.read(this, reads.slice(0, last))
                                    .value.attr(reads[last], newVal);
                            } else {
                                return can.compute.read(this, reads, options)
                                    .value;
                            }
                        }, this);
                    }

                }
            });

        // Setup on/off aliases
        Map.prototype.on = Map.prototype.bind;
        Map.prototype.off = Map.prototype.unbind;

        return Map;
    })(__m2, __m16, __m17, __m12, __m18);

    // ## list/list.js
    var __m19 = (function(can, Map, bubble) {

        // Helpers for `observable` lists.
        var splice = [].splice,
            // test if splice works correctly
            spliceRemovesProps = (function() {
                // IE's splice doesn't remove properties
                var obj = {
                    0: "a",
                    length: 1
                };
                splice.call(obj, 0, 1);
                return !obj[0];
            })();


        var list = Map.extend(

            {

                Map: Map

            },

            {
                setup: function(instances, options) {
                    this.length = 0;
                    can.cid(this, ".map");
                    this._init = 1;
                    this._setupComputes();
                    instances = instances || [];
                    var teardownMapping;

                    if (can.isDeferred(instances)) {
                        this.replace(instances);
                    } else {
                        teardownMapping = instances.length && can.Map.helpers.addToMap(instances, this);
                        this.push.apply(this, can.makeArray(instances || []));
                    }

                    if (teardownMapping) {
                        teardownMapping();
                    }

                    // this change needs to be ignored
                    this.bind('change', can.proxy(this._changes, this));
                    can.simpleExtend(this, options);
                    delete this._init;
                },
                _triggerChange: function(attr, how, newVal, oldVal) {

                    Map.prototype._triggerChange.apply(this, arguments);
                    // `batchTrigger` direct add and remove events...
                    var index = +attr;
                    // Make sure this is not nested and not an expando
                    if (!~attr.indexOf('.') && !isNaN(index)) {

                        if (how === 'add') {
                            can.batch.trigger(this, how, [newVal, index]);
                            can.batch.trigger(this, 'length', [this.length]);
                        } else if (how === 'remove') {
                            can.batch.trigger(this, how, [oldVal, index]);
                            can.batch.trigger(this, 'length', [this.length]);
                        } else {
                            can.batch.trigger(this, how, [newVal, index]);
                        }

                    }

                },
                __get: function(attr) {
                    if (attr) {
                        if (this[attr] && this[attr].isComputed && can.isFunction(this.constructor.prototype[attr])) {
                            return this[attr]();
                        } else {
                            return this[attr];
                        }
                    } else {
                        return this;
                    }
                },
                ___set: function(attr, val) {
                    this[attr] = val;
                    if (+attr >= this.length) {
                        this.length = (+attr + 1);
                    }
                },
                _remove: function(prop, current) {
                    // if removing an expando property
                    if (isNaN(+prop)) {
                        delete this[prop];
                        this._triggerChange(prop, "remove", undefined, current);
                    } else {
                        this.splice(prop, 1);
                    }
                },
                _each: function(callback) {
                    var data = this.__get();
                    for (var i = 0; i < data.length; i++) {
                        callback(data[i], i);
                    }
                },
                // Returns the serialized form of this list.

                serialize: function() {
                    return Map.helpers.serialize(this, 'serialize', []);
                },

                splice: function(index, howMany) {
                    var args = can.makeArray(arguments),
                        i;

                    for (i = 2; i < args.length; i++) {
                        args[i] = bubble.set(this, i, this.__type(args[i], i));

                    }
                    if (howMany === undefined) {
                        howMany = args[1] = this.length - index;
                    }
                    var removed = splice.apply(this, args);

                    if (!spliceRemovesProps) {
                        for (i = this.length; i < removed.length + this.length; i++) {
                            delete this[i];
                        }
                    }

                    can.batch.start();
                    if (howMany > 0) {
                        this._triggerChange("" + index, "remove", undefined, removed);
                        bubble.removeMany(this, removed);
                    }
                    if (args.length > 2) {
                        this._triggerChange("" + index, "add", args.slice(2), removed);
                    }
                    can.batch.stop();
                    return removed;
                },

                _attrs: function(items, remove) {
                    if (items === undefined) {
                        return Map.helpers.serialize(this, 'attr', []);
                    }

                    // Create a copy.
                    items = can.makeArray(items);

                    can.batch.start();
                    this._updateAttrs(items, remove);
                    can.batch.stop();
                },

                _updateAttrs: function(items, remove) {
                    var len = Math.min(items.length, this.length);

                    for (var prop = 0; prop < len; prop++) {
                        var curVal = this[prop],
                            newVal = items[prop];

                        if (Map.helpers.isObservable(curVal) && Map.helpers.canMakeObserve(newVal)) {
                            curVal.attr(newVal, remove);
                            //changed from a coercion to an explicit
                        } else if (curVal !== newVal) {
                            this._set(prop, newVal);
                        } else {

                        }
                    }
                    if (items.length > this.length) {
                        // Add in the remaining props.
                        this.push.apply(this, items.slice(this.length));
                    } else if (items.length < this.length && remove) {
                        this.splice(items.length);
                    }
                }
            }),

            // Converts to an `array` of arguments.
            getArgs = function(args) {
                return args[0] && can.isArray(args[0]) ?
                    args[0] :
                    can.makeArray(args);
            };
        // Create `push`, `pop`, `shift`, and `unshift`
        can.each({

                push: "length",

                unshift: 0
            },
            // Adds a method
            // `name` - The method name.
            // `where` - Where items in the `array` should be added.

            function(where, name) {
                var orig = [][name];
                list.prototype[name] = function() {
                    // Get the items being added.
                    var args = [],
                        // Where we are going to add items.
                        len = where ? this.length : 0,
                        i = arguments.length,
                        res, val;

                    // Go through and convert anything to an `map` that needs to be converted.
                    while (i--) {
                        val = arguments[i];
                        args[i] = bubble.set(this, i, this.__type(val, i));
                    }

                    // Call the original method.
                    res = orig.apply(this, args);

                    if (!this.comparator || args.length) {

                        this._triggerChange("" + len, "add", args, undefined);
                    }

                    return res;
                };
            });

        can.each({

                pop: "length",

                shift: 0
            },
            // Creates a `remove` type method

            function(where, name) {
                list.prototype[name] = function() {

                    var args = getArgs(arguments),
                        len = where && this.length ? this.length - 1 : 0;

                    var res = [][name].apply(this, args);

                    // Create a change where the args are
                    // `len` - Where these items were removed.
                    // `remove` - Items removed.
                    // `undefined` - The new values (there are none).
                    // `res` - The old, removed values (should these be unbound).
                    this._triggerChange("" + len, "remove", undefined, [res]);

                    if (res && res.unbind) {
                        bubble.remove(this, res);
                    }

                    return res;
                };
            });

        can.extend(list.prototype, {

                indexOf: function(item, fromIndex) {
                    this.attr('length');
                    return can.inArray(item, this, fromIndex);
                },


                join: function() {
                    return [].join.apply(this.attr(), arguments);
                },


                reverse: function() {
                    var list = can.makeArray([].reverse.call(this));
                    this.replace(list);
                },


                slice: function() {
                    var temp = Array.prototype.slice.apply(this, arguments);
                    return new this.constructor(temp);
                },


                concat: function() {
                    var args = [];
                    can.each(can.makeArray(arguments), function(arg, i) {
                        args[i] = arg instanceof can.List ? arg.serialize() : arg;
                    });
                    return new this.constructor(Array.prototype.concat.apply(this.serialize(), args));
                },


                forEach: function(cb, thisarg) {
                    return can.each(this, cb, thisarg || this);
                },


                replace: function(newList) {
                    if (can.isDeferred(newList)) {
                        newList.then(can.proxy(this.replace, this));
                    } else {
                        this.splice.apply(this, [0, this.length].concat(can.makeArray(newList || [])));
                    }

                    return this;
                },
                filter: function(callback, thisArg) {
                    var filteredList = new can.List(),
                        self = this,
                        filtered;
                    this.each(function(item, index, list) {
                        filtered = callback.call(thisArg | self, item, index, self);
                        if (filtered) {
                            filteredList.push(item);
                        }
                    });
                    return filteredList;
                }
            });
        can.List = Map.List = list;
        return can.List;
    })(__m2, __m15, __m17);

    // ## compute/compute.js
    var __m20 = (function(can, bind) {

        // ## Reading Helpers
        // The following methods are used to call a function that relies on
        // observable data and to track the observable events which should 
        // be listened to when changes occur.
        // To do this, [`can.__reading(observable, event)`](#can-__reading) is called to
        // "broadcast" the corresponding event on each read.
        // ### Observed
        // An "Observed" is an object of observable objects and events that
        // a function relies on. These objects and events must be listened to
        // in order to determine when to check a function for updates.
        // This looks like the following:
        //     { 
        //       "map1|first": {obj: map, event: "first"},
        //       "map1|last" : {obj: map, event: "last"}
        //     }
        // Each object-event pair is mapped so no duplicates will be listed.

        // ### State
        // `can.__read` may call a function that calls `can.__read` again. For
        // example, a compute can read another compute. To track each compute's
        // `Observed` object (containing observable objects and events), we maintain
        // a stack of Observed values for each call to `__read`.
        var stack = [];

        // ### can.__read
        // With a given function and context, calls the function
        // and returns the resulting value of the function as well
        // as the observable properties and events that were read.
        can.__read = function(func, self) {

            // Add an object that `can.__read` will write to.
            stack.push({});

            var value = func.call(self);

            // Example return value:
            // `{value: 100, observed: Observed}`
            return {
                value: value,
                observed: stack.pop()
            };
        };

        // ### can.__reading
        // When an observable value is read, it must call `can.__reading` to 
        // broadcast which object and event should be listened to.
        can.__reading = function(obj, event) {
            // Add the observable object and the event
            // that was read to the `Observed` object on
            // the stack.
            if (stack.length) {
                stack[stack.length - 1][obj._cid + '|' + event] = {
                    obj: obj,
                    event: event + ""
                };
            }

        };

        // ### can.__clearReading
        // Clears and returns the current observables.
        // This can be used to access a value without 
        // it being handled as a regular `read`.
        can.__clearReading = function() {
            if (stack.length) {
                var ret = stack[stack.length - 1];
                stack[stack.length - 1] = {};
                return ret;
            }
        };
        // Specifies current observables.
        can.__setReading = function(o) {
            if (stack.length) {
                stack[stack.length - 1] = o;
            }
        };
        can.__addReading = function(o) {
            if (stack.length) {
                can.simpleExtend(stack[stack.length - 1], o);
            }
        };

        // ## Section Name

        // ### getValueAndBind
        // Calls a function and sets up bindings to call `onchanged`
        // when events from its "Observed" object are triggered.
        // Removes bindings from `oldObserved` that are no longer needed.
        // - func - the function to call.
        // - context - the `this` of the function.
        // - oldObserved - an object that contains what has already been bound to
        // - onchanged - the function to call when any change occurs
        var getValueAndBind = function(func, context, oldObserved, onchanged) {
            // Call the function, get the value as well as the observed objects and events
            var info = can.__read(func, context),
                // The objects-event pairs that must be bound to
                newObserveSet = info.observed,
                // A flag that is used to determine if an event is already being observed.
                obEv,
                name;
            // Go through what needs to be observed.
            for (name in newObserveSet) {

                if (oldObserved[name]) {
                    // After binding is set up, values
                    // in `oldObserved` will be unbound. So if a name
                    // has already be observed, remove from `oldObserved`
                    // to prevent this.
                    delete oldObserved[name];
                } else {
                    // If current name has not been observed, listen to it.
                    obEv = newObserveSet[name];
                    obEv.obj.bind(obEv.event, onchanged);
                }
            }

            // Iterate through oldObserved, looking for observe/attributes
            // that are no longer being bound and unbind them.
            for (name in oldObserved) {
                obEv = oldObserved[name];
                obEv.obj.unbind(obEv.event, onchanged);
            }

            return info;
        };

        // ### updateOnChange
        // Fires a change event when a compute's value changes
        var updateOnChange = function(compute, newValue, oldValue, batchNum) {
            // Only trigger event when value has changed
            if (newValue !== oldValue) {
                can.batch.trigger(compute, batchNum ? {
                        type: "change",
                        batchNum: batchNum
                    } : 'change', [
                        newValue,
                        oldValue
                    ]);
            }
        };

        // ###setupComputeHandlers
        // Sets up handlers for a compute.
        // - compute - the compute to set up handlers for
        // - func - the getter/setter function for the compute
        // - context - the `this` for the compute
        // - setCachedValue - function for setting cached value
        // Returns an object with `on` and `off` functions.
        var setupComputeHandlers = function(compute, func, context, setCachedValue) {
            var readInfo,
                onchanged,
                batchNum;

            return {
                // Set up handler for when the compute changes
                on: function(updater) {
                    if (!onchanged) {
                        onchanged = function(ev) {
                            if (compute.bound && (ev.batchNum === undefined || ev.batchNum !== batchNum)) {
                                // Keep the old value
                                var oldValue = readInfo.value;

                                // Get the new value
                                readInfo = getValueAndBind(func, context, readInfo.observed, onchanged);

                                // Call the updater with old and new values
                                updater(readInfo.value, oldValue, ev.batchNum);

                                batchNum = batchNum = ev.batchNum;
                            }
                        };
                    }

                    readInfo = getValueAndBind(func, context, {}, onchanged);

                    setCachedValue(readInfo.value);

                    compute.hasDependencies = !can.isEmptyObject(readInfo.observed);
                },
                // Remove handler for the compute
                off: function(updater) {
                    for (var name in readInfo.observed) {
                        var ob = readInfo.observed[name];
                        ob.obj.unbind(ob.event, onchanged);
                    }
                }
            };
        };

        // ###isObserve
        // Checks if an object is observable
        var isObserve = function(obj) {
            return obj instanceof can.Map || obj && obj.__get;
        },
            // Instead of calculating whether anything is listening every time,
            // use a function to do nothing (which may be overwritten)
            k = function() {};

        // ## Creating a can.compute
        // A `can.compute` can be created by
        // - [Specifying the getterSeter function](#specifying-gettersetter-function)
        // - [Observing a property of an object](#observing-a-property-of-an-object)
        // - [Specifying an initial value and a setter function](#specifying-an-initial-value-and-a-setter)
        // - [Specifying an initial value and how to read, update, and listen to changes](#specifying-an-initial-value-and-a-settings-object)
        // - [Simply specifying an initial value](#specifying-only-a-value)
        can.compute = function(getterSetter, context, eventName) {
            // ### Setting up
            // Do nothing if getterSetter is already a compute
            if (getterSetter && getterSetter.isComputed) {
                return getterSetter;
            }
            // The computed object
            var computed,
                // The following functions are overwritten depending on how compute() is called
                // A method to set up listening
                on = k,
                // A method to teardown listening
                off = k,
                // Current cached value (valid only when bound is true)
                value,
                // How the value is read by default
                get = function() {
                    return value;
                },
                // How the value is set by default
                set = function(newVal) {
                    value = newVal;
                },
                setCached = set,
                // Save arguments for cloning
                args = can.makeArray(arguments),
                // updater for when value is changed
                updater = function(newValue, oldValue, batchNum) {
                    setCached(newValue);
                    updateOnChange(computed, newValue, oldValue, batchNum);
                },
                // the form of the arguments
                form;
            computed = function(newVal) {
                // If the computed function is called with arguments,
                // a value should be set
                if (arguments.length) {
                    // Save a reference to the old value
                    var old = value;
                    // Setter may return the value if setter
                    // is for a value maintained exclusively by this compute.
                    var setVal = set.call(context, newVal, old);
                    // If the computed function has dependencies,
                    // return the current value
                    if (computed.hasDependencies) {
                        return get.call(context);
                    }
                    // Setting may not fire a change event, in which case
                    // the value must be read
                    if (setVal === undefined) {
                        value = get.call(context);
                    } else {
                        value = setVal;
                    }
                    // Fire the change
                    updateOnChange(computed, value, old);
                    return value;
                } else {
                    // Another compute may bind to this `computed`
                    if (stack.length && computed.canReadForChangeEvent !== false) {

                        // Tell the compute to listen to change on this computed
                        // Use `can.__reading` to allow other compute to listen
                        // for a change on this `computed`
                        can.__reading(computed, 'change');
                        // We are going to bind on this compute.
                        // If we are not bound, we should bind so that
                        // we don't have to re-read to get the value of this compute.
                        if (!computed.bound) {
                            can.compute.temporarilyBind(computed);
                        }
                    }
                    // If computed is bound, use the cached value
                    if (computed.bound) {
                        return value;
                    } else {
                        return get.call(context);
                    }
                }
            };
            // ###Specifying getterSetter function
            // If `can.compute` is [called with a getterSetter function](http://canjs.com/docs/can.compute.html#sig_can_compute_getterSetter__context__),
            // override set and get
            if (typeof getterSetter === 'function') {
                // `can.compute(getterSetter, [context])`
                set = getterSetter;
                get = getterSetter;
                computed.canReadForChangeEvent = eventName === false ? false : true;

                var handlers = setupComputeHandlers(computed, getterSetter, context || this, setCached);
                on = handlers.on;
                off = handlers.off;

                // ###Observing a property of an object
                // If `can.compute` is called with an 
                // [object, property name, and optional event name](http://canjs.com/docs/can.compute.html#sig_can_compute_object_propertyName__eventName__),
                // create a compute from a property of an object. This allows the
                // creation of a compute on objects that can be listened to with [`can.bind`](http://canjs.com/docs/can.bind.html)
            } else if (context) {
                if (typeof context === 'string') {
                    // `can.compute(obj, "propertyName", [eventName])`
                    var propertyName = context,
                        isObserve = getterSetter instanceof can.Map;
                    if (isObserve) {
                        computed.hasDependencies = true;
                    }
                    // If object is observable, `attr` will be used
                    // for getting and setting.
                    get = function() {
                        if (isObserve) {
                            return getterSetter.attr(propertyName);
                        } else {
                            return getterSetter[propertyName];
                        }
                    };
                    set = function(newValue) {
                        if (isObserve) {
                            getterSetter.attr(propertyName, newValue);
                        } else {
                            getterSetter[propertyName] = newValue;
                        }
                    };
                    var handler;
                    on = function(update) {
                        handler = function() {
                            update(get(), value);
                        };
                        can.bind.call(getterSetter, eventName || propertyName, handler);
                        // use can.__read because
                        // we should not be indicating that some parent
                        // reads this property if it happens to be binding on it
                        value = can.__read(get)
                            .value;
                    };
                    off = function() {
                        can.unbind.call(getterSetter, eventName || propertyName, handler);
                    };
                    // ###Specifying an initial value and a setter
                    // If `can.compute` is called with an [initial value and a setter function](http://canjs.com/docs/can.compute.html#sig_can_compute_initialValue_setter_newVal_oldVal__),
                    // a compute that can adjust incoming values is set up.
                } else {
                    // `can.compute(initialValue, setter)`
                    if (typeof context === 'function') {

                        value = getterSetter;
                        set = context;
                        context = eventName;
                        form = 'setter';
                        // ###Specifying an initial value and a settings object
                        // If `can.compute` is called with an [initial value and optionally a settings object](http://canjs.com/docs/can.compute.html#sig_can_compute_initialValue__settings__),
                        // a can.compute is created that can optionally specify how to read,
                        // update, and listen to changes in dependent values. This form of
                        // can.compute can be used to derive a compute that derives its
                        // value from any source
                    } else {
                        // `can.compute(initialValue,{get:, set:, on:, off:})`


                        value = getterSetter;
                        var options = context,
                            oldUpdater = updater;

                        context = options.context || options;
                        get = options.get || get;
                        set = options.set || function() {
                            return value;
                        };
                        // This is a "hack" to allow async computes.
                        if (options.fn) {
                            var fn = options.fn,
                                data;
                            // make sure get is called with the newVal, but not setter
                            get = function() {
                                return fn.call(context, value);
                            };
                            // Check the number of arguments the 
                            // async function takes.
                            if (fn.length === 0) {

                                data = setupComputeHandlers(computed, fn, context, setCached);

                            } else if (fn.length === 1) {
                                data = setupComputeHandlers(computed, function() {
                                    return fn.call(context, value);
                                }, context, setCached);
                            } else {
                                updater = function(newVal) {
                                    if (newVal !== undefined) {
                                        oldUpdater(newVal, value);
                                    }
                                };
                                data = setupComputeHandlers(computed, function() {
                                    var res = fn.call(context, value, function(newVal) {
                                        oldUpdater(newVal, value);
                                    });
                                    // If undefined is returned, don't update the value.
                                    return res !== undefined ? res : value;
                                }, context, setCached);
                            }


                            on = data.on;
                            off = data.off;
                        } else {
                            updater = function() {
                                var newVal = get.call(context);
                                oldUpdater(newVal, value);
                            };
                        }

                        on = options.on || on;
                        off = options.off || off;
                    }
                }
                // ###Specifying only a value
                // If can.compute is called with an initialValue only,
                // reads to this value can be observed.
            } else {
                // `can.compute(initialValue)`
                value = getterSetter;
            }
            can.cid(computed, 'compute');
            return can.simpleExtend(computed, {

                    isComputed: true,
                    _bindsetup: function() {
                        this.bound = true;
                        // Set up live-binding
                        // While binding, this should not count as a read
                        var oldReading = can.__clearReading();
                        on.call(this, updater);
                        // Restore "Observed" for reading
                        can.__setReading(oldReading);
                    },
                    _bindteardown: function() {
                        off.call(this, updater);
                        this.bound = false;
                    },

                    bind: can.bindAndSetup,

                    unbind: can.unbindAndTeardown,
                    clone: function(context) {
                        if (context) {
                            if (form === 'setter') {
                                args[2] = context;
                            } else {
                                args[1] = context;
                            }
                        }
                        return can.compute.apply(can, args);
                    }
                });
        };
        // A list of temporarily bound computes
        var computes, unbindComputes = function() {
                for (var i = 0, len = computes.length; i < len; i++) {
                    computes[i].unbind('change', k);
                }
                computes = null;
            };
        // Binds computes for a moment to retain their value and prevent caching
        can.compute.temporarilyBind = function(compute) {
            compute.bind('change', k);
            if (!computes) {
                computes = [];
                setTimeout(unbindComputes, 10);
            }
            computes.push(compute);
        };

        // Whether a compute is truthy
        can.compute.truthy = function(compute) {
            return can.compute(function() {
                var res = compute();
                if (typeof res === 'function') {
                    res = res();
                }
                return !!res;
            });
        };
        can.compute.async = function(initialValue, asyncComputer, context) {
            return can.compute(initialValue, {
                    fn: asyncComputer,
                    context: context
                });
        };
        // {map: new can.Map({first: "Justin"})}, ["map","first"]
        can.compute.read = function(parent, reads, options) {
            options = options || {};
            // `cur` is the current value.
            var cur = parent,
                type,
                // `prev` is the object we are reading from.
                prev,
                // `foundObs` did we find an observable.
                foundObs;
            for (var i = 0, readLength = reads.length; i < readLength; i++) {
                // Update what we are reading from.
                prev = cur;
                // Read from the compute. We can't read a property yet.
                if (prev && prev.isComputed) {
                    if (options.foundObservable) {
                        options.foundObservable(prev, i);
                    }
                    prev = prev();
                }
                // Look to read a property from something.
                if (isObserve(prev)) {
                    if (!foundObs && options.foundObservable) {
                        options.foundObservable(prev, i);
                    }
                    foundObs = 1;
                    // is it a method on the prototype?
                    if (typeof prev[reads[i]] === 'function' && prev.constructor.prototype[reads[i]] === prev[reads[i]]) {
                        // call that method
                        if (options.returnObserveMethods) {
                            cur = cur[reads[i]];
                        } else if (reads[i] === 'constructor' && prev instanceof can.Construct) {
                            cur = prev[reads[i]];
                        } else {
                            cur = prev[reads[i]].apply(prev, options.args || []);
                        }
                    } else {
                        // use attr to get that value
                        cur = cur.attr(reads[i]);
                    }
                } else {
                    // just do the dot operator
                    cur = prev[reads[i]];
                }
                type = typeof cur;
                // If it's a compute, get the compute's value
                // unless we are at the end of the 
                if (cur && cur.isComputed && (!options.isArgument && i < readLength - 1)) {
                    if (!foundObs && options.foundObservable) {
                        options.foundObservable(prev, i + 1);
                    }
                    cur = cur();
                }
                // If it's an anonymous function, execute as requested
                else if (i < reads.length - 1 && type === 'function' && options.executeAnonymousFunctions && !(can.Construct && cur.prototype instanceof can.Construct)) {
                    cur = cur();
                }
                // if there are properties left to read, and we don't have an object, early exit
                if (i < reads.length - 1 && (cur === null || type !== 'function' && type !== 'object')) {
                    if (options.earlyExit) {
                        options.earlyExit(prev, i, cur);
                    }
                    // return undefined so we know this isn't the right value
                    return {
                        value: undefined,
                        parent: prev
                    };
                }
            }
            // handle an ending function
            // unless it is a can.Construct-derived constructor
            if (typeof cur === 'function' && !(can.Construct && cur.prototype instanceof can.Construct)) {
                if (options.isArgument) {
                    if (!cur.isComputed && options.proxyMethods !== false) {
                        cur = can.proxy(cur, prev);
                    }
                } else {
                    if (cur.isComputed && !foundObs && options.foundObservable) {
                        options.foundObservable(cur, i);
                    }
                    cur = cur.call(prev);
                }
            }
            // if we don't have a value, exit early.
            if (cur === undefined) {
                if (options.earlyExit) {
                    options.earlyExit(prev, i - 1);
                }
            }
            return {
                value: cur,
                parent: prev
            };
        };

        return can.compute;
    })(__m2, __m16, __m18);

    // ## observe/observe.js
    var __m14 = (function(can) {
        can.Observe = can.Map;
        can.Observe.startBatch = can.batch.start;
        can.Observe.stopBatch = can.batch.stop;
        can.Observe.triggerBatch = can.batch.trigger;
        return can;
    })(__m2, __m15, __m19, __m20);

    // ## view/scope/scope.js
    var __m22 = (function(can) {

        // ## Helpers

        // Regex for escaped periods
        var escapeReg = /(\\)?\./g,
            // Regex for double escaped periods
            escapeDotReg = /\\\./g,
            // **getNames**
            // Returns array of names by splitting provided string by periods and single escaped periods.
            // ```getNames("a.b\.c.d\\.e") //-> ['a', 'b', 'c', 'd.e']```
            getNames = function(attr) {
                var names = [],
                    last = 0;
                // Goes through attr string and places the characters found between the periods and single escaped periods into the
                // `names` array.  Double escaped periods are ignored.
                attr.replace(escapeReg, function(first, second, index) {

                    if (!second) {
                        names.push(
                            attr
                            .slice(last, index)

                            .replace(escapeDotReg, '.'));
                        last = index + first.length;
                    }
                });

                names.push(
                    attr
                    .slice(last)

                    .replace(escapeDotReg, '.'));
                return names;
            };


        var Scope = can.Construct.extend(


            {
                // ## Scope.read
                // Scope.read was moved to can.compute.read
                // can.compute.read reads properties from a parent.  A much more complex version of getObject.
                read: can.compute.read
            },

            {
                init: function(context, parent) {
                    this._context = context;
                    this._parent = parent;
                    this.__cache = {};
                },

                // ## Scope.prototype.attr
                // Reads a value from the current context or parent contexts.
                attr: function(key) {
                    // Reads for whatever called before attr.  It's possible
                    // that this.read clears them.  We want to restore them.
                    var previousReads = can.__clearReading(),
                        res = this.read(key, {
                                isArgument: true,
                                returnObserveMethods: true,
                                proxyMethods: false
                            }).value;
                    can.__setReading(previousReads);
                    return res;
                },

                // ## Scope.prototype.add
                // Creates a new scope and sets the current scope to be the parent.
                // ```
                // var scope = new can.view.Scope([{name:"Chris"}, {name: "Justin"}]).add({name: "Brian"});
                // scope.attr("name") //-> "Brian"
                // ```
                add: function(context) {
                    if (context !== this._context) {
                        return new this.constructor(context, this);
                    } else {
                        return this;
                    }
                },

                // ## Scope.prototype.computeData
                // Finds the first location of the key in the scope and then provides a get-set compute that represents the key's value
                // and other information about where the value was found.
                computeData: function(key, options) {
                    options = options || {
                        args: []
                    };
                    var self = this,
                        rootObserve,
                        rootReads,
                        computeData = {
                            // computeData.compute returns a get-set compute that is tied to the first location of the provided
                            // key in the context of the scope.
                            compute: can.compute(function(newVal) {
                                // **Compute setter**
                                if (arguments.length) {
                                    if (rootObserve.isComputed && !rootReads.length) {
                                        rootObserve(newVal);
                                    } else {
                                        var last = rootReads.length - 1;
                                        can.compute.read(rootObserve, rootReads.slice(0, last))
                                            .value.attr(rootReads[last], newVal);
                                    }
                                    // **Compute getter**
                                } else {
                                    // If computeData has found the value for the key in the past in an observable then go directly to
                                    // the observable (rootObserve) that the value was found in the last time and return the new value.  This
                                    // is a huge performance gain for the fact that we aren't having to check the entire scope each time.
                                    if (rootObserve) {
                                        return can.compute.read(rootObserve, rootReads, options)
                                            .value;
                                    }
                                    // If the key has not already been located in a observable then we need to search the scope for the
                                    // key.  Once we find the key then we need to return it's value and if it is found in an observable
                                    // then we need to store the observable so the next time this compute is called it can grab the value
                                    // directly from the observable.
                                    var data = self.read(key, options);
                                    rootObserve = data.rootObserve;
                                    rootReads = data.reads;
                                    computeData.scope = data.scope;
                                    computeData.initialValue = data.value;
                                    return data.value;
                                }
                            })
                        };
                    return computeData;
                },

                // ## Scope.prototype.compute
                // Provides a get-set compute that represents a key's value.
                compute: function(key, options) {
                    return this.computeData(key, options)
                        .compute;
                },

                // ## Scope.prototype.read
                // Finds the first isntance of a key in the available scopes and returns the keys value along with the the observable the key
                // was found in, readsData and the current scope.

                read: function(attr, options) {
                    // check if we should only look within current scope
                    var stopLookup;
                    if (attr.substr(0, 2) === './') {
                        // set flag to halt lookup from walking up scope
                        stopLookup = true;
                        // stop lookup from checking parent scopes
                        attr = attr.substr(2);
                    }
                    // check if we should be running this on a parent.
                    else if (attr.substr(0, 3) === "../") {
                        return this._parent.read(attr.substr(3), options);
                    } else if (attr === "..") {
                        return {
                            value: this._parent._context
                        };
                    } else if (attr === "." || attr === "this") {
                        return {
                            value: this._context
                        };
                    }

                    // Array of names from splitting attr string into names.  ```"a.b\.c.d\\.e" //-> ['a', 'b', 'c', 'd.e']```
                    var names = attr.indexOf('\\.') === -1 ?
                    // Reference doesn't contain escaped periods
                    attr.split('.')
                    // Reference contains escaped periods ```(`a.b\.c.foo` == `a["b.c"].foo)```
                    : getNames(attr),
                        // The current context (a scope is just data and a parent scope).
                        context,
                        // The current scope.
                        scope = this,
                        // While we are looking for a value, we track the most likely place this value will be found.
                        // This is so if there is no me.name.first, we setup a listener on me.name.
                        // The most likely candidate is the one with the most "read matches" "lowest" in the
                        // context chain.
                        // By "read matches", we mean the most number of values along the key.
                        // By "lowest" in the context chain, we mean the closest to the current context.
                        // We track the starting position of the likely place with `defaultObserve`.
                        defaultObserve,
                        // Tracks how to read from the defaultObserve.
                        defaultReads = [],
                        // Tracks the highest found number of "read matches".
                        defaultPropertyDepth = -1,
                        // `scope.read` is designed to be called within a compute, but
                        // for performance reasons only listens to observables within one context.
                        // This is to say, if you have me.name in the current context, but me.name.first and
                        // we are looking for me.name.first, we don't setup bindings on me.name and me.name.first.
                        // To make this happen, we clear readings if they do not find a value.  But,
                        // if that path turns out to be the default read, we need to restore them.  This
                        // variable remembers those reads so they can be restored.
                        defaultComputeReadings,
                        // Tracks the default's scope.
                        defaultScope,
                        // Tracks the first found observe.
                        currentObserve,
                        // Tracks the reads to get the value for a scope.
                        currentReads;

                    // Goes through each scope context provided until it finds the key (attr).  Once the key is found
                    // then it's value is returned along with an observe, the current scope and reads.
                    // While going through each scope context searching for the key, each observable found is returned and
                    // saved so that either the observable the key is found in can be returned, or in the case the key is not
                    // found in an observable the closest observable can be returned.

                    while (scope) {
                        context = scope._context;
                        if (context !== null) {
                            var data = can.compute.read(context, names, can.simpleExtend({

                                        foundObservable: function(observe, nameIndex) {
                                            currentObserve = observe;
                                            currentReads = names.slice(nameIndex);
                                        },
                                        // Called when we were unable to find a value.
                                        earlyExit: function(parentValue, nameIndex) {

                                            if (nameIndex > defaultPropertyDepth) {
                                                defaultObserve = currentObserve;
                                                defaultReads = currentReads;
                                                defaultPropertyDepth = nameIndex;
                                                defaultScope = scope;

                                                defaultComputeReadings = can.__clearReading();
                                            }
                                        },
                                        // Execute anonymous functions found along the way
                                        executeAnonymousFunctions: true
                                    }, options));
                            // **Key was found**, return value and location data
                            if (data.value !== undefined) {
                                return {
                                    scope: scope,
                                    rootObserve: currentObserve,
                                    value: data.value,
                                    reads: currentReads
                                };
                            }
                        }
                        // Prevent prior readings and then move up to the next scope.
                        can.__clearReading();
                        if (!stopLookup) {
                            // Move up to the next scope.
                            scope = scope._parent;
                        } else {
                            scope = null;
                        }
                    }

                    // **Key was not found**, return undefined for the value.  Unless an observable was
                    // found in the process of searching for the key, then return the most likely observable along with it's
                    // scope and reads.

                    if (defaultObserve) {
                        can.__setReading(defaultComputeReadings);
                        return {
                            scope: defaultScope,
                            rootObserve: defaultObserve,
                            reads: defaultReads,
                            value: undefined
                        };
                    } else {
                        return {
                            names: names,
                            value: undefined
                        };
                    }
                }
            });

        can.view.Scope = Scope;
        return Scope;
    })(__m2, __m12, __m15, __m19, __m10, __m20);

    // ## view/elements.js
    var __m24 = (function(can) {

        var selectsCommentNodes = (function() {
            return can.$(document.createComment('~')).length === 1;
        })();


        var elements = {
            tagToContentPropMap: {
                option: 'textContent' in document.createElement('option') ? 'textContent' : 'innerText',
                textarea: 'value'
            },

            // 3.0 TODO: remove
            attrMap: can.attr.map,
            // matches the attrName of a regexp
            attrReg: /([^\s=]+)[\s]*=[\s]*/,
            // 3.0 TODO: remove
            defaultValue: can.attr.defaultValue,
            // a map of parent element to child elements

            tagMap: {
                '': 'span',
                table: 'tbody',
                tr: 'td',
                ol: 'li',
                ul: 'li',
                tbody: 'tr',
                thead: 'tr',
                tfoot: 'tr',
                select: 'option',
                optgroup: 'option'
            },
            // a tag's parent element
            reverseTagMap: {
                tr: 'tbody',
                option: 'select',
                td: 'tr',
                th: 'tr',
                li: 'ul'
            },
            // Used to determine the parentNode if el is directly within a documentFragment
            getParentNode: function(el, defaultParentNode) {
                return defaultParentNode && el.parentNode.nodeType === 11 ? defaultParentNode : el.parentNode;
            },
            // 3.0 TODO: remove
            setAttr: can.attr.set,
            // 3.0 TODO: remove
            getAttr: can.attr.get,
            // 3.0 TODO: remove
            removeAttr: can.attr.remove,
            // Gets a "pretty" value for something
            contentText: function(text) {
                if (typeof text === 'string') {
                    return text;
                }
                // If has no value, return an empty string.
                if (!text && text !== 0) {
                    return '';
                }
                return '' + text;
            },

            after: function(oldElements, newFrag) {
                var last = oldElements[oldElements.length - 1];
                // Insert it in the `document` or `documentFragment`
                if (last.nextSibling) {
                    can.insertBefore(last.parentNode, newFrag, last.nextSibling);
                } else {
                    can.appendChild(last.parentNode, newFrag);
                }
            },

            replace: function(oldElements, newFrag) {
                elements.after(oldElements, newFrag);
                if (can.remove(can.$(oldElements)).length < oldElements.length && !selectsCommentNodes) {
                    can.each(oldElements, function(el) {
                        if (el.nodeType === 8) {
                            el.parentNode.removeChild(el);
                        }
                    });
                }
            }
        };

        can.view.elements = elements;

        return elements;
    })(__m2, __m10);

    // ## view/scanner.js
    var __m23 = (function(can, elements, viewCallbacks) {


        var newLine = /(\r|\n)+/g,
            notEndTag = /\//,
            // Escapes characters starting with `\`.
            clean = function(content) {
                return content
                    .split('\\')
                    .join("\\\\")
                    .split("\n")
                    .join("\\n")
                    .split('"')
                    .join('\\"')
                    .split("\t")
                    .join("\\t");
            },
            // Returns a tagName to use as a temporary placeholder for live content
            // looks forward ... could be slow, but we only do it when necessary
            getTag = function(tagName, tokens, i) {
                // if a tagName is provided, use that
                if (tagName) {
                    return tagName;
                } else {
                    // otherwise go searching for the next two tokens like "<",TAG
                    while (i < tokens.length) {
                        if (tokens[i] === "<" && !notEndTag.test(tokens[i + 1])) {
                            return elements.reverseTagMap[tokens[i + 1]] || 'span';
                        }
                        i++;
                    }
                }
                return '';
            },
            bracketNum = function(content) {
                return (--content.split("{")
                    .length) - (--content.split("}")
                    .length);
            },
            myEval = function(script) {
                eval(script);
            },
            attrReg = /([^\s]+)[\s]*=[\s]*$/,
            // Commands for caching.
            startTxt = 'var ___v1ew = [];',
            finishTxt = "return ___v1ew.join('')",
            put_cmd = "___v1ew.push(\n",
            insert_cmd = put_cmd,
            // Global controls (used by other functions to know where we are).
            // Are we inside a tag?
            htmlTag = null,
            // Are we within a quote within a tag?
            quote = null,
            // What was the text before the current quote? (used to get the `attr` name)
            beforeQuote = null,
            // Whether a rescan is in progress
            rescan = null,
            getAttrName = function() {
                var matches = beforeQuote.match(attrReg);
                return matches && matches[1];
            },
            // Used to mark where the element is.
            status = function() {
                // `t` - `1`.
                // `h` - `0`.
                // `q` - String `beforeQuote`.
                return quote ? "'" + getAttrName() + "'" : (htmlTag ? 1 : 0);
            },
            // returns the top of a stack
            top = function(stack) {
                return stack[stack.length - 1];
            },
            Scanner;


        can.view.Scanner = Scanner = function(options) {
            // Set options on self
            can.extend(this, {

                    text: {},
                    tokens: []
                }, options);
            // make sure it's an empty string if it's not
            this.text.options = this.text.options || "";

            // Cache a token lookup
            this.tokenReg = [];
            this.tokenSimple = {
                "<": "<",
                ">": ">",
                '"': '"',
                "'": "'"
            };
            this.tokenComplex = [];
            this.tokenMap = {};
            for (var i = 0, token; token = this.tokens[i]; i++) {


                // Save complex mappings (custom regexp)
                if (token[2]) {
                    this.tokenReg.push(token[2]);
                    this.tokenComplex.push({
                            abbr: token[1],
                            re: new RegExp(token[2]),
                            rescan: token[3]
                        });
                }
                // Save simple mappings (string only, no regexp)
                else {
                    this.tokenReg.push(token[1]);
                    this.tokenSimple[token[1]] = token[0];
                }
                this.tokenMap[token[0]] = token[1];
            }

            // Cache the token registry.
            this.tokenReg = new RegExp("(" + this.tokenReg.slice(0)
                .concat(["<", ">", '"', "'"])
                .join("|") + ")", "g");
        };


        Scanner.prototype = {
            // a default that can be overwritten
            helpers: [],

            scan: function(source, name) {
                var tokens = [],
                    last = 0,
                    simple = this.tokenSimple,
                    complex = this.tokenComplex;

                source = source.replace(newLine, "\n");
                if (this.transform) {
                    source = this.transform(source);
                }
                source.replace(this.tokenReg, function(whole, part) {
                    // offset is the second to last argument
                    var offset = arguments[arguments.length - 2];

                    // if the next token starts after the last token ends
                    // push what's in between
                    if (offset > last) {
                        tokens.push(source.substring(last, offset));
                    }

                    // push the simple token (if there is one)
                    if (simple[whole]) {
                        tokens.push(whole);
                    }
                    // otherwise lookup complex tokens
                    else {
                        for (var i = 0, token; token = complex[i]; i++) {
                            if (token.re.test(whole)) {
                                tokens.push(token.abbr);
                                // Push a rescan function if one exists
                                if (token.rescan) {
                                    tokens.push(token.rescan(part));
                                }
                                break;
                            }
                        }
                    }

                    // update the position of the last part of the last token
                    last = offset + part.length;
                });

                // if there's something at the end, add it
                if (last < source.length) {
                    tokens.push(source.substr(last));
                }

                var content = '',
                    buff = [startTxt + (this.text.start || '')],
                    // Helper `function` for putting stuff in the view concat.
                    put = function(content, bonus) {
                        buff.push(put_cmd, '"', clean(content), '"' + (bonus || '') + ');');
                    },
                    // A stack used to keep track of how we should end a bracket
                    // `}`.
                    // Once we have a `<%= %>` with a `leftBracket`,
                    // we store how the file should end here (either `))` or `;`).
                    endStack = [],
                    // The last token, used to remember which tag we are in.
                    lastToken,
                    // The corresponding magic tag.
                    startTag = null,
                    // Was there a magic tag inside an html tag?
                    magicInTag = false,
                    // was there a special state
                    specialStates = {
                        attributeHookups: [],
                        // a stack of tagHookups
                        tagHookups: [],
                        //last tag hooked up
                        lastTagHookup: ''
                    },
                    // Helper `function` for removing tagHookups from the hookup stack
                    popTagHookup = function() {
                        // The length of tagHookups is the nested depth which can be used to uniquely identify custom tags of the same type
                        specialStates.lastTagHookup = specialStates.tagHookups.pop() + specialStates.tagHookups.length;
                    },
                    // The current tag name.
                    tagName = '',
                    // stack of tagNames
                    tagNames = [],
                    // Pop from tagNames?
                    popTagName = false,
                    // Declared here.
                    bracketCount,
                    // in a special attr like src= or style=
                    specialAttribute = false,

                    i = 0,
                    token,
                    tmap = this.tokenMap,
                    attrName;

                // Reinitialize the tag state goodness.
                htmlTag = quote = beforeQuote = null;
                for (;
                    (token = tokens[i++]) !== undefined;) {
                    if (startTag === null) {
                        switch (token) {
                            case tmap.left:
                            case tmap.escapeLeft:
                            case tmap.returnLeft:
                                magicInTag = htmlTag && 1;

                            case tmap.commentLeft:
                                // A new line -- just add whatever content within a clean.
                                // Reset everything.
                                startTag = token;
                                if (content.length) {
                                    put(content);
                                }
                                content = '';
                                break;
                            case tmap.escapeFull:
                                // This is a full line escape (a line that contains only whitespace and escaped logic)
                                // Break it up into escape left and right
                                magicInTag = htmlTag && 1;
                                rescan = 1;
                                startTag = tmap.escapeLeft;
                                if (content.length) {
                                    put(content);
                                }
                                rescan = tokens[i++];
                                content = rescan.content || rescan;
                                if (rescan.before) {
                                    put(rescan.before);
                                }
                                tokens.splice(i, 0, tmap.right);
                                break;
                            case tmap.commentFull:
                                // Ignore full line comments.
                                break;
                            case tmap.templateLeft:
                                content += tmap.left;
                                break;
                            case '<':
                                // Make sure we are not in a comment.
                                if (tokens[i].indexOf("!--") !== 0) {
                                    htmlTag = 1;
                                    magicInTag = 0;
                                }

                                content += token;

                                break;
                            case '>':
                                htmlTag = 0;
                                // content.substr(-1) doesn't work in IE7/8
                                var emptyElement = (content.substr(content.length - 1) === "/" || content.substr(content.length - 2) === "--"),
                                    attrs = "";
                                // if there was a magic tag
                                // or it's an element that has text content between its tags,
                                // but content is not other tags add a hookup
                                // TODO: we should only add `can.EJS.pending()` if there's a magic tag
                                // within the html tags.
                                if (specialStates.attributeHookups.length) {
                                    attrs = "attrs: ['" + specialStates.attributeHookups.join("','") + "'], ";
                                    specialStates.attributeHookups = [];
                                }
                                // this is the > of a special tag
                                // comparison to lastTagHookup makes sure the same custom tags can be nested
                                if ((tagName + specialStates.tagHookups.length) !== specialStates.lastTagHookup && tagName === top(specialStates.tagHookups)) {
                                    // If it's a self closing tag (like <content/>) make sure we put the / at the end.
                                    if (emptyElement) {
                                        content = content.substr(0, content.length - 1);
                                    }
                                    // Put the start of the end
                                    buff.push(put_cmd,
                                        '"', clean(content), '"',
                                        ",can.view.pending({tagName:'" + tagName + "'," + (attrs) + "scope: " + (this.text.scope || "this") + this.text.options);

                                    // if it's a self closing tag (like <content/>) close and end the tag
                                    if (emptyElement) {
                                        buff.push("}));");
                                        content = "/>";
                                        popTagHookup();
                                    }
                                    // if it's an empty tag	 
                                    else if (tokens[i] === "<" && tokens[i + 1] === "/" + tagName) {
                                        buff.push("}));");
                                        content = token;
                                        popTagHookup();
                                    } else {
                                        // it has content
                                        buff.push(",subtemplate: function(" + this.text.argNames + "){\n" + startTxt + (this.text.start || ''));
                                        content = '';
                                    }

                                } else if (magicInTag || (!popTagName && elements.tagToContentPropMap[tagNames[tagNames.length - 1]]) || attrs) {
                                    // make sure / of /> is on the right of pending
                                    var pendingPart = ",can.view.pending({" + attrs + "scope: " + (this.text.scope || "this") + this.text.options + "}),\"";
                                    if (emptyElement) {
                                        put(content.substr(0, content.length - 1), pendingPart + "/>\"");
                                    } else {
                                        put(content, pendingPart + ">\"");
                                    }
                                    content = '';
                                    magicInTag = 0;
                                } else {
                                    content += token;
                                }

                                // if it's a tag like <input/>
                                if (emptyElement || popTagName) {
                                    // remove the current tag in the stack
                                    tagNames.pop();
                                    // set the current tag to the previous parent
                                    tagName = tagNames[tagNames.length - 1];
                                    // Don't pop next time
                                    popTagName = false;
                                }
                                specialStates.attributeHookups = [];
                                break;
                            case "'":
                            case '"':
                                // If we are in an html tag, finding matching quotes.
                                if (htmlTag) {
                                    // We have a quote and it matches.
                                    if (quote && quote === token) {
                                        // We are exiting the quote.
                                        quote = null;
                                        // Otherwise we are creating a quote.
                                        // TODO: does this handle `\`?
                                        var attr = getAttrName();
                                        if (viewCallbacks.attr(attr)) {
                                            specialStates.attributeHookups.push(attr);
                                        }

                                        if (specialAttribute) {

                                            content += token;
                                            put(content);
                                            buff.push(finishTxt, "}));\n");
                                            content = "";
                                            specialAttribute = false;

                                            break;
                                        }

                                    } else if (quote === null) {
                                        quote = token;
                                        beforeQuote = lastToken;
                                        attrName = getAttrName();
                                        // TODO: check if there's magic!!!!
                                        if ((tagName === "img" && attrName === "src") || attrName === "style") {
                                            // put content that was before the attr name, but don't include the src=
                                            put(content.replace(attrReg, ""));
                                            content = "";

                                            specialAttribute = true;

                                            buff.push(insert_cmd, "can.view.txt(2,'" + getTag(tagName, tokens, i) + "'," + status() + ",this,function(){", startTxt);
                                            put(attrName + "=" + token);
                                            break;
                                        }

                                    }
                                }

                            default:
                                // Track the current tag
                                if (lastToken === '<') {

                                    tagName = token.substr(0, 3) === "!--" ?
                                        "!--" : token.split(/\s/)[0];

                                    var isClosingTag = false,
                                        cleanedTagName;

                                    if (tagName.indexOf("/") === 0) {
                                        isClosingTag = true;
                                        cleanedTagName = tagName.substr(1);
                                    }

                                    if (isClosingTag) { // </tag>

                                        // when we enter a new tag, pop the tag name stack
                                        if (top(tagNames) === cleanedTagName) {
                                            // set tagName to the last tagName
                                            // if there are no more tagNames, we'll rely on getTag.
                                            tagName = cleanedTagName;
                                            popTagName = true;
                                        }
                                        // if we are in a closing tag of a custom tag
                                        if (top(specialStates.tagHookups) === cleanedTagName) {

                                            // remove the last < from the content
                                            put(content.substr(0, content.length - 1));

                                            // finish the "section"
                                            buff.push(finishTxt + "}}) );");
                                            // the < belongs to the outside
                                            content = "><";
                                            popTagHookup();
                                        }

                                    } else {
                                        if (tagName.lastIndexOf("/") === tagName.length - 1) {
                                            tagName = tagName.substr(0, tagName.length - 1);

                                        }

                                        if (tagName !== "!--" && (viewCallbacks.tag(tagName))) {
                                            // if the content tag is inside something it doesn't belong ...
                                            if (tagName === "content" && elements.tagMap[top(tagNames)]) {
                                                // convert it to an element that will work
                                                token = token.replace("content", elements.tagMap[top(tagNames)]);
                                            }
                                            // we will hookup at the ending tag>
                                            specialStates.tagHookups.push(tagName);
                                        }

                                        tagNames.push(tagName);

                                    }

                                }
                                content += token;
                                break;
                        }
                    } else {
                        // We have a start tag.
                        switch (token) {
                            case tmap.right:
                            case tmap.returnRight:
                                switch (startTag) {
                                    case tmap.left:
                                        // Get the number of `{ minus }`
                                        bracketCount = bracketNum(content);

                                        // We are ending a block.
                                        if (bracketCount === 1) {
                                            // We are starting on. 
                                            buff.push(insert_cmd, 'can.view.txt(0,\'' + getTag(tagName, tokens, i) + '\',' + status() + ',this,function(){', startTxt, content);
                                            endStack.push({
                                                    before: "",
                                                    after: finishTxt + "}));\n"
                                                });
                                        } else {

                                            // How are we ending this statement?
                                            last = // If the stack has value and we are ending a block...
                                            endStack.length && bracketCount === -1 ? // Use the last item in the block stack.
                                            endStack.pop() : // Or use the default ending.
                                            {
                                                after: ";"
                                            };

                                            // If we are ending a returning block,
                                            // add the finish text which returns the result of the
                                            // block.
                                            if (last.before) {
                                                buff.push(last.before);
                                            }
                                            // Add the remaining content.
                                            buff.push(content, ";", last.after);
                                        }
                                        break;
                                    case tmap.escapeLeft:
                                    case tmap.returnLeft:
                                        // We have an extra `{` -> `block`.
                                        // Get the number of `{ minus }`.
                                        bracketCount = bracketNum(content);
                                        // If we have more `{`, it means there is a block.
                                        if (bracketCount) {
                                            // When we return to the same # of `{` vs `}` end with a `doubleParent`.
                                            endStack.push({
                                                    before: finishTxt,
                                                    after: "}));\n"
                                                });
                                        }

                                        var escaped = startTag === tmap.escapeLeft ? 1 : 0,
                                            commands = {
                                                insert: insert_cmd,
                                                tagName: getTag(tagName, tokens, i),
                                                status: status(),
                                                specialAttribute: specialAttribute
                                            };

                                        for (var ii = 0; ii < this.helpers.length; ii++) {
                                            // Match the helper based on helper
                                            // regex name value
                                            var helper = this.helpers[ii];
                                            if (helper.name.test(content)) {
                                                content = helper.fn(content, commands);

                                                // dont escape partials
                                                if (helper.name.source === /^>[\s]*\w*/.source) {
                                                    escaped = 0;
                                                }
                                                break;
                                            }
                                        }

                                        // Handle special cases
                                        if (typeof content === 'object') {

                                            if (content.startTxt && content.end && specialAttribute) {
                                                buff.push(insert_cmd, "can.view.toStr( ", content.content, '() ) );');

                                            } else {

                                                if (content.startTxt) {
                                                    buff.push(insert_cmd, "can.view.txt(\n" +
                                                        (typeof status() === "string" || (content.escaped != null ? content.escaped : escaped)) + ",\n'" + tagName + "',\n" + status() + ",\nthis,\n");
                                                } else if (content.startOnlyTxt) {
                                                    buff.push(insert_cmd, 'can.view.onlytxt(this,\n');
                                                }
                                                buff.push(content.content);
                                                if (content.end) {
                                                    buff.push('));');
                                                }

                                            }

                                        } else if (specialAttribute) {

                                            buff.push(insert_cmd, content, ');');

                                        } else {
                                            // If we have `<%== a(function(){ %>` then we want
                                            // `can.EJS.text(0,this, function(){ return a(function(){ var _v1ew = [];`.

                                            buff.push(insert_cmd, "can.view.txt(\n" + (typeof status() === "string" || escaped) +
                                                ",\n'" + tagName + "',\n" + status() + ",\nthis,\nfunction(){ " +
                                                (this.text.escape || '') +
                                                "return ", content,
                                                // If we have a block.
                                                bracketCount ?
                                                // Start with startTxt `"var _v1ew = [];"`.
                                                startTxt :
                                                // If not, add `doubleParent` to close push and text.
                                                "}));\n");



                                        }

                                        if (rescan && rescan.after && rescan.after.length) {
                                            put(rescan.after.length);
                                            rescan = null;
                                        }
                                        break;
                                }
                                startTag = null;
                                content = '';
                                break;
                            case tmap.templateLeft:
                                content += tmap.left;
                                break;
                            default:
                                content += token;
                                break;
                        }
                    }
                    lastToken = token;
                }

                // Put it together...
                if (content.length) {
                    // Should be `content.dump` in Ruby.
                    put(content);
                }
                buff.push(";");
                var template = buff.join(''),
                    out = {
                        out: (this.text.outStart || "") + template + " " + finishTxt + (this.text.outEnd || "")
                    };

                // Use `eval` instead of creating a function, because it is easier to debug.
                myEval.call(out, 'this.fn = (function(' + this.text.argNames + '){' + out.out + '});\r\n//# sourceURL=' + name + '.js');
                return out;
            }
        };

        // can.view.attr

        // This is called when there is a special tag
        can.view.pending = function(viewData) {
            // we need to call any live hookups
            // so get that and return the hook
            // a better system will always be called with the same stuff
            var hooks = can.view.getHooks();
            return can.view.hook(function(el) {
                can.each(hooks, function(fn) {
                    fn(el);
                });
                viewData.templateType = "legacy";
                if (viewData.tagName) {
                    viewCallbacks.tagHandler(el, viewData.tagName, viewData);
                }

                can.each(viewData && viewData.attrs || [], function(attributeName) {
                    viewData.attributeName = attributeName;
                    var callback = viewCallbacks.attr(attributeName);
                    if (callback) {
                        callback(el, viewData);
                    }
                });

            });

        };

        can.view.tag("content", function(el, tagData) {
            return tagData.scope;
        });

        can.view.Scanner = Scanner;

        return Scanner;
    })(__m10, __m24, __m9);

    // ## view/node_lists/node_lists.js
    var __m27 = (function(can) {
        // ## Helpers
        // Some browsers don't allow expando properties on HTMLTextNodes
        // so let's try to assign a custom property, an 'expando' property.
        // We use this boolean to determine how we are going to hold on
        // to HTMLTextNode within a nodeList.  More about this in the 'id'
        // function.
        var canExpando = true;
        try {
            document.createTextNode('')._ = 0;
        } catch (ex) {
            canExpando = false;
        }

        // A mapping of element ids to nodeList id allowing us to quickly find an element
        // that needs to be replaced when updated.
        var nodeMap = {},
            // A mapping of ids to text nodes, this map will be used in the 
            // case of the browser not supporting expando properties.
            textNodeMap = {},
            // The name of the expando property; the value returned 
            // given a nodeMap key.
            expando = 'ejs_' + Math.random(),
            // The id used as the key in our nodeMap, this integer
            // will be preceded by 'element_' or 'obj_' depending on whether
            // the element has a nodeName.
            _id = 0,

            // ## nodeLists.id
            // Given a template node, create an id on the node as a expando
            // property, or if the node is an HTMLTextNode and the browser
            // doesn't support expando properties store the id with a
            // reference to the text node in an internal collection then return
            // the lookup id.
            id = function(node) {
                // If the browser supports expando properties or the node
                // provided is not an HTMLTextNode, we don't need to work
                // with the internal textNodeMap and we can place the property
                // on the node.
                if (canExpando || node.nodeType !== 3) {
                    // If the node already has an (internal) id, then just 
                    // return the key of the nodeMap. This would be the case
                    // in updating and unregistering a nodeList.
                    if (node[expando]) {
                        return node[expando];
                    } else {
                        // If the node isn't already referenced in the map we need
                        // to generate a lookup id and place it on the node itself.
                        ++_id;
                        return node[expando] = (node.nodeName ? 'element_' : 'obj_') + _id;
                    }
                } else {
                    // The nodeList has a specific collection for HTMLTextNodes for 
                    // (older) browsers that do not support expando properties.
                    for (var textNodeID in textNodeMap) {
                        if (textNodeMap[textNodeID] === node) {
                            return textNodeID;
                        }
                    }
                    // If we didn't find the node, we need to register it and return
                    // the id used.
                    ++_id;

                    // If we didn't find the node, we need to register it and return
                    // the id used.
                    // We have to store the node itself because of the browser's lack
                    // of support for expando properties (i.e. we can't use a look-up
                    // table and store the id on the node as a custom property).
                    textNodeMap['text_' + _id] = node;
                    return 'text_' + _id;
                }
            },
            splice = [].splice,
            push = [].push,

            // ## nodeLists.itemsInChildListTree
            // Given a nodeList return the number of child items in the provided
            // list and any child lists.
            itemsInChildListTree = function(list) {
                var count = 0;
                for (var i = 0, len = list.length; i < len; i++) {
                    var item = list[i];
                    // If the item is an HTMLElement then increment the count by 1.
                    if (item.nodeType) {
                        count++;
                    } else {
                        // If the item is not an HTMLElement it is a list, so
                        // increment the count by the number of items in the child
                        // list.
                        count += itemsInChildListTree(item);
                    }
                }
                return count;
            };

        // ## Registering & Updating
        // To keep all live-bound sections knowing which elements they are managing,
        // all live-bound elments are registered and updated when they change.
        // For example, the above template, when rendered with data like:
        //     data = new can.Map({
        //         items: ["first","second"]
        //     })
        // This will first render the following content:
        //     <div>
        //         <span data-view-id='5'/>
        //     </div>
        // When the `5` callback is called, this will register the `<span>` like:
        //     var ifsNodes = [<span 5>]
        //     nodeLists.register(ifsNodes);
        // And then render `{{if}}`'s contents and update `ifsNodes` with it:
        //     nodeLists.update( ifsNodes, [<"\nItems:\n">, <span data-view-id="6">] );
        // Next, hookup `6` is called which will regsiter the `<span>` like:
        //     var eachsNodes = [<span 6>];
        //     nodeLists.register(eachsNodes);
        // And then it will render `{{#each}}`'s content and update `eachsNodes` with it:
        //     nodeLists.update(eachsNodes, [<label>,<label>]);
        // As `nodeLists` knows that `eachsNodes` is inside `ifsNodes`, it also updates
        // `ifsNodes`'s nodes to look like:
        //     [<"\nItems:\n">,<label>,<label>]
        // Now, if all items were removed, `{{#if}}` would be able to remove
        // all the `<label>` elements.
        // When you regsiter a nodeList, you can also provide a callback to know when
        // that nodeList has been replaced by a parent nodeList.  This is
        // useful for tearing down live-binding.
        var nodeLists = {
            id: id,

            // ## nodeLists.update
            // Updates a nodeList with new items, i.e. when values for the template have changed.
            update: function(nodeList, newNodes) {
                // Unregister all childNodeLists.
                var oldNodes = nodeLists.unregisterChildren(nodeList);

                newNodes = can.makeArray(newNodes);

                var oldListLength = nodeList.length;

                // Replace oldNodeLists's contents.
                splice.apply(nodeList, [
                        0,
                        oldListLength
                    ].concat(newNodes));

                nodeLists.nestList(nodeList);

                return oldNodes;
            },

            // ## nodeLists.nestList
            // If a given list does not exist in the nodeMap then create an lookup
            // id for it in the nodeMap and assign the list to it.
            // If the the provided does happen to exist in the nodeMap update the
            // elements in the list.
            // @param {Array.<HTMLElement>} nodeList The nodeList being nested.
            nestList: function(list) {
                var index = 0;
                while (index < list.length) {
                    var node = list[index],
                        childNodeList = nodeMap[id(node)];
                    if (childNodeList) {
                        if (childNodeList !== list) {
                            list.splice(index, itemsInChildListTree(childNodeList), childNodeList);
                        }
                    } else {
                        // Indicate the new nodes belong to this list.
                        nodeMap[id(node)] = list;
                    }
                    index++;
                }
            },

            // ## nodeLists.last
            // Return the last HTMLElement in a nodeList, if the last
            // element is a nodeList, returns the last HTMLElement of
            // the child list, etc.
            last: function(nodeList) {
                var last = nodeList[nodeList.length - 1];
                // If the last node in the list is not an HTMLElement
                // it is a nodeList so call `last` again.
                if (last.nodeType) {
                    return last;
                } else {
                    return nodeLists.last(last);
                }
            },

            // ## nodeLists.first
            // Return the first HTMLElement in a nodeList, if the first
            // element is a nodeList, returns the first HTMLElement of
            // the child list, etc.
            first: function(nodeList) {
                var first = nodeList[0];
                // If the first node in the list is not an HTMLElement
                // it is a nodeList so call `first` again. 
                if (first.nodeType) {
                    return first;
                } else {
                    return nodeLists.first(first);
                }
            },

            // ## nodeLists.register
            // Registers a nodeList and returns the nodeList passed to register
            register: function(nodeList, unregistered, parent) {
                // If a unregistered callback has been provided assign it to the nodeList
                // as a property to be called when the nodeList is unregistred.
                nodeList.unregistered = unregistered;

                nodeLists.nestList(nodeList);

                return nodeList;
            },

            // ## nodeLists.unregisterChildren
            // Unregister all childen within the provided list and return the 
            // unregistred nodes.
            // @param {Array.<HTMLElement>} nodeList The child list to unregister.
            unregisterChildren: function(nodeList) {
                var nodes = [];
                // For each node in the nodeList we want to compute it's id
                // and delete it from the nodeList's internal map.
                can.each(nodeList, function(node) {
                    // If the node does not have a nodeType it is an array of
                    // nodes.
                    if (node.nodeType) {
                        delete nodeMap[id(node)];
                        nodes.push(node);
                    } else {
                        // Recursively unregister each of the child lists in 
                        // the nodeList.
                        push.apply(nodes, nodeLists.unregister(node));
                    }
                });
                return nodes;
            },

            // ## nodeLists.unregister
            // Unregister's a nodeList and returns the unregistered nodes.  
            // Call if the nodeList is no longer being updated. This will 
            // also unregister all child nodeLists.
            unregister: function(nodeList) {
                var nodes = nodeLists.unregisterChildren(nodeList);
                // If an 'unregisted' function was provided during registration, remove
                // it from the list, and call the function provided.
                if (nodeList.unregistered) {
                    var unregisteredCallback = nodeList.unregistered;
                    delete nodeList.unregistered;

                    unregisteredCallback();
                }
                return nodes;
            },

            nodeMap: nodeMap
        };
        can.view.nodeLists = nodeLists;
        return nodeLists;
    })(__m2, __m24);

    // ## view/parser/parser.js
    var __m28 = (function(can) {


        function makeMap(str) {
            var obj = {}, items = str.split(",");
            for (var i = 0; i < items.length; i++) {
                obj[items[i]] = true;
            }

            return obj;
        }

        var alphaNumericHU = "-A-Za-z0-9_",
            attributeNames = "[a-zA-Z_:][" + alphaNumericHU + ":.]+",
            spaceEQspace = "\\s*=\\s*",
            dblQuote2dblQuote = "\"((?:\\\\.|[^\"])*)\"",
            quote2quote = "'((?:\\\\.|[^'])*)'",
            attributeEqAndValue = "(?:" + spaceEQspace + "(?:" +
                "(?:\"[^\"]*\")|(?:'[^']*')|[^>\\s]+))?",
            matchStash = "\\{\\{[^\\}]*\\}\\}\\}?",
            stash = "\\{\\{([^\\}]*)\\}\\}\\}?",
            startTag = new RegExp("^<([" + alphaNumericHU + "]+)" +
                "(" +
                "(?:\\s*" +
                "(?:(?:" +
                "(?:" + attributeNames + ")?" +
                attributeEqAndValue + ")|" +
                "(?:" + matchStash + ")+)" +
                ")*" +
                ")\\s*(\\/?)>"),
            endTag = new RegExp("^<\\/([" + alphaNumericHU + "]+)[^>]*>"),
            attr = new RegExp("(?:" +
                "(?:(" + attributeNames + ")|" + stash + ")" +
                "(?:" + spaceEQspace +
                "(?:" +
                "(?:" + dblQuote2dblQuote + ")|(?:" + quote2quote + ")|([^>\\s]+)" +
                ")" +
                ")?)", "g"),
            mustache = new RegExp(stash, "g"),
            txtBreak = /<|\{\{/;

        // Empty Elements - HTML 5
        var empty = makeMap("area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed");

        // Block Elements - HTML 5
        var block = makeMap("address,article,applet,aside,audio,blockquote,button,canvas,center,dd,del,dir,div,dl,dt,fieldset,figcaption,figure,footer,form,frameset,h1,h2,h3,h4,h5,h6,header,hgroup,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,output,p,pre,section,script,table,tbody,td,tfoot,th,thead,tr,ul,video");

        // Inline Elements - HTML 5
        var inline = makeMap("a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var");

        // Elements that you can, intentionally, leave open
        // (and which close themselves)
        var closeSelf = makeMap("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr");

        // Attributes that have their values filled in disabled="disabled"
        var fillAttrs = makeMap("checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected");

        // Special Elements (can contain anything)
        var special = makeMap("script,style");

        var HTMLParser = function(html, handler) {

            function parseStartTag(tag, tagName, rest, unary) {
                tagName = tagName.toLowerCase();

                if (block[tagName]) {
                    while (stack.last() && inline[stack.last()]) {
                        parseEndTag("", stack.last());
                    }
                }

                if (closeSelf[tagName] && stack.last() === tagName) {
                    parseEndTag("", tagName);
                }

                unary = empty[tagName] || !! unary;

                handler.start(tagName, unary);

                if (!unary) {
                    stack.push(tagName);
                }
                // find attribute or special
                HTMLParser.parseAttrs(rest, handler);

                handler.end(tagName, unary);

            }

            function parseEndTag(tag, tagName) {
                // If no tag name is provided, clean shop
                var pos;
                if (!tagName) {
                    pos = 0;
                }


                // Find the closest opened tag of the same type
                else {
                    for (pos = stack.length - 1; pos >= 0; pos--) {
                        if (stack[pos] === tagName) {
                            break;
                        }
                    }

                }


                if (pos >= 0) {
                    // Close all the open elements, up the stack
                    for (var i = stack.length - 1; i >= pos; i--) {
                        if (handler.close) {
                            handler.close(stack[i]);
                        }
                    }

                    // Remove the open elements from the stack
                    stack.length = pos;
                }
            }

            function parseMustache(mustache, inside) {
                if (handler.special) {
                    handler.special(inside);
                }
            }


            var index, chars, match, stack = [],
                last = html;
            stack.last = function() {
                return this[this.length - 1];
            };

            while (html) {
                chars = true;

                // Make sure we're not in a script or style element
                if (!stack.last() || !special[stack.last()]) {

                    // Comment
                    if (html.indexOf("<!--") === 0) {
                        index = html.indexOf("-->");

                        if (index >= 0) {
                            if (handler.comment) {
                                handler.comment(html.substring(4, index));
                            }
                            html = html.substring(index + 3);
                            chars = false;
                        }

                        // end tag
                    } else if (html.indexOf("</") === 0) {
                        match = html.match(endTag);

                        if (match) {
                            html = html.substring(match[0].length);
                            match[0].replace(endTag, parseEndTag);
                            chars = false;
                        }

                        // start tag
                    } else if (html.indexOf("<") === 0) {
                        match = html.match(startTag);

                        if (match) {
                            html = html.substring(match[0].length);
                            match[0].replace(startTag, parseStartTag);
                            chars = false;
                        }
                    } else if (html.indexOf("{{") === 0) {
                        match = html.match(mustache);

                        if (match) {
                            html = html.substring(match[0].length);
                            match[0].replace(mustache, parseMustache);
                        }
                    }

                    if (chars) {
                        index = html.search(txtBreak);

                        var text = index < 0 ? html : html.substring(0, index);
                        html = index < 0 ? "" : html.substring(index);

                        if (handler.chars && text) {
                            handler.chars(text);
                        }
                    }

                } else {
                    html = html.replace(new RegExp("([\\s\\S]*?)<\/" + stack.last() + "[^>]*>"), function(all, text) {
                        text = text.replace(/<!--([\s\S]*?)-->|<!\[CDATA\[([\s\S]*?)]]>/g, "$1$2");
                        if (handler.chars) {
                            handler.chars(text);
                        }
                        return "";
                    });

                    parseEndTag("", stack.last());
                }

                if (html === last) {
                    throw "Parse Error: " + html;
                }

                last = html;
            }

            // Clean up any remaining tags
            parseEndTag();


            handler.done();
        };
        HTMLParser.parseAttrs = function(rest, handler) {


            (rest != null ? rest : "").replace(attr, function(text, name, special, dblQuote, singleQuote, val) {
                if (special) {
                    handler.special(special);

                }
                if (name || dblQuote || singleQuote || val) {
                    var value = arguments[3] ? arguments[3] :
                        arguments[4] ? arguments[4] :
                        arguments[5] ? arguments[5] :
                        fillAttrs[name.toLowerCase()] ? name : "";
                    handler.attrStart(name || "");

                    var last = mustache.lastIndex = 0,
                        res = mustache.exec(value),
                        chars;
                    while (res) {
                        chars = value.substring(
                            last,
                            mustache.lastIndex - res[0].length);
                        if (chars.length) {
                            handler.attrValue(chars);
                        }
                        handler.special(res[1]);
                        last = mustache.lastIndex;
                        res = mustache.exec(value);
                    }
                    chars = value.substr(
                        last,
                        value.length);
                    if (chars) {
                        handler.attrValue(chars);
                    }
                    handler.attrEnd(name || "");
                }


            });


        };

        can.view.parser = HTMLParser;

        return HTMLParser;

    })(__m10);

    // ## view/live/live.js
    var __m26 = (function(can, elements, view, nodeLists, parser) {

        elements = elements || can.view.elements;
        nodeLists = nodeLists || can.view.NodeLists;
        parser = parser || can.view.parser;

        // ## live.js
        // The live module provides live binding for computes
        // and can.List.
        // Currently, it's API is designed for `can/view/render`, but
        // it could easily be used for other purposes.
        // ### Helper methods
        // #### setup
        // `setup(HTMLElement, bind(data), unbind(data)) -> data`
        // Calls bind right away, but will call unbind
        // if the element is "destroyed" (removed from the DOM).
        var setup = function(el, bind, unbind) {
            // Removing an element can call teardown which
            // unregister the nodeList which calls teardown
            var tornDown = false,
                teardown = function() {
                    if (!tornDown) {
                        tornDown = true;
                        unbind(data);
                        can.unbind.call(el, 'removed', teardown);
                    }
                    return true;
                }, data = {
                    teardownCheck: function(parent) {
                        return parent ? false : teardown();
                    }
                };
            can.bind.call(el, 'removed', teardown);
            bind(data);
            return data;
        },
            // #### listen
            // Calls setup, but presets bind and unbind to
            // operate on a compute
            listen = function(el, compute, change) {
                return setup(el, function() {
                    compute.bind('change', change);
                }, function(data) {
                    compute.unbind('change', change);
                    if (data.nodeList) {
                        nodeLists.unregister(data.nodeList);
                    }
                });
            },
            // #### getAttributeParts
            // Breaks up a string like foo='bar' into ["foo","'bar'""]
            getAttributeParts = function(newVal) {
                var attrs = {},
                    attr;
                parser.parseAttrs(newVal, {
                        attrStart: function(name) {
                            attrs[name] = "";
                            attr = name;
                        },
                        attrValue: function(value) {
                            attrs[attr] += value;
                        },
                        attrEnd: function() {}
                    });
                return attrs;
            },
            splice = [].splice,
            isNode = function(obj) {
                return obj && obj.nodeType;
            },
            addTextNodeIfNoChildren = function(frag) {
                if (!frag.childNodes.length) {
                    frag.appendChild(document.createTextNode(""));
                }
            };

        var live = {

            list: function(el, compute, render, context, parentNode) {

                // A nodeList of all elements this live-list manages.
                // This is here so that if this live list is within another section
                // that section is able to remove the items in this list.
                var masterNodeList = [el],
                    // A mapping of items to their indicies'
                    indexMap = [],
                    // Called when items are added to the list.
                    add = function(ev, items, index) {
                        // Collect new html and mappings
                        var frag = document.createDocumentFragment(),
                            newNodeLists = [],
                            newIndicies = [];
                        // For each new item,
                        can.each(items, function(item, key) {
                            var itemIndex = can.compute(key + index),
                                // get its string content
                                itemHTML = render.call(context, item, itemIndex),
                                gotText = typeof itemHTML === "string",
                                // and convert it into elements.
                                itemFrag = can.frag(itemHTML);
                            // Add those elements to the mappings.

                            itemFrag = gotText ? can.view.hookup(itemFrag) : itemFrag;

                            var childNodes = can.makeArray(itemFrag.childNodes);



                            newNodeLists.push(nodeLists.register(childNodes));
                            // Hookup the fragment (which sets up child live-bindings) and
                            // add it to the collection of all added elements.
                            frag.appendChild(itemFrag);
                            // track indicies;
                            newIndicies.push(itemIndex);
                        });
                        // The position of elements is always after the initial text placeholder node
                        var masterListIndex = index + 1;


                        // Check if we are adding items at the end
                        if (!masterNodeList[masterListIndex]) {
                            elements.after(masterListIndex === 1 ? [text] : [nodeLists.last(masterNodeList[masterListIndex - 1])], frag);
                        } else {
                            // Add elements before the next index's first element.
                            var el = nodeLists.first(masterNodeList[masterListIndex]);
                            can.insertBefore(el.parentNode, frag, el);
                        }
                        splice.apply(masterNodeList, [
                                masterListIndex,
                                0
                            ].concat(newNodeLists));

                        // update indices after insert point
                        splice.apply(indexMap, [
                                index,
                                0
                            ].concat(newIndicies));

                        for (var i = index + newIndicies.length, len = indexMap.length; i < len; i++) {
                            indexMap[i](i);
                        }
                    },
                    // Called when items are removed or when the bindings are torn down.
                    remove = function(ev, items, index, duringTeardown, fullTeardown) {
                        // If this is because an element was removed, we should
                        // check to make sure the live elements are still in the page.
                        // If we did this during a teardown, it would cause an infinite loop.
                        if (!duringTeardown && data.teardownCheck(text.parentNode)) {
                            return;
                        }
                        var removedMappings = masterNodeList.splice(index + 1, items.length),
                            itemsToRemove = [];
                        can.each(removedMappings, function(nodeList) {

                            // Unregister to free up event bindings.
                            var nodesToRemove = nodeLists.unregister(nodeList);

                            // add items that we will remove all at once
                            [].push.apply(itemsToRemove, nodesToRemove);
                        });
                        // update indices after remove point
                        indexMap.splice(index, items.length);
                        for (var i = index, len = indexMap.length; i < len; i++) {
                            indexMap[i](i);
                        }
                        // don't remove elements during teardown.  Something else will probably be doing that.
                        if (!fullTeardown) {
                            can.remove(can.$(itemsToRemove));
                        }

                    },
                    // A text node placeholder
                    text = document.createTextNode(''),
                    // The current list.
                    list,
                    // Called when the list is replaced with a new list or the binding is torn-down.
                    teardownList = function(fullTeardown) {
                        // there might be no list right away, and the list might be a plain
                        // array
                        if (list && list.unbind) {
                            list.unbind('add', add)
                                .unbind('remove', remove);
                        }
                        // use remove to clean stuff up for us
                        remove({}, {
                                length: masterNodeList.length - 1
                            }, 0, true, fullTeardown);
                    },
                    // Called when the list is replaced or setup.
                    updateList = function(ev, newList, oldList) {
                        teardownList();
                        // make an empty list if the compute returns null or undefined
                        list = newList || [];
                        // list might be a plain array
                        if (list.bind) {
                            list.bind('add', add)
                                .bind('remove', remove);
                        }
                        add({}, list, 0);
                    };
                parentNode = elements.getParentNode(el, parentNode);
                // Setup binding and teardown to add and remove events
                var data = setup(parentNode, function() {
                    if (can.isFunction(compute)) {
                        compute.bind('change', updateList);
                    }
                }, function() {
                    if (can.isFunction(compute)) {
                        compute.unbind('change', updateList);
                    }
                    teardownList(true);
                });

                live.replace(masterNodeList, text, data.teardownCheck);
                // run the list setup
                updateList({}, can.isFunction(compute) ? compute() : compute);
            },

            html: function(el, compute, parentNode) {
                var data;
                parentNode = elements.getParentNode(el, parentNode);
                data = listen(parentNode, compute, function(ev, newVal, oldVal) {

                    // TODO: remove teardownCheck in 2.1
                    var attached = nodeLists.first(nodes).parentNode;
                    // update the nodes in the DOM with the new rendered value
                    if (attached) {
                        makeAndPut(newVal);
                    }
                    data.teardownCheck(nodeLists.first(nodes).parentNode);
                });

                var nodes = [el],
                    makeAndPut = function(val) {
                        var isString = !isNode(val),
                            frag = can.frag(val),
                            oldNodes = can.makeArray(nodes);

                        // Add a placeholder textNode if necessary.
                        addTextNodeIfNoChildren(frag);

                        if (isString) {
                            frag = can.view.hookup(frag, parentNode);
                        }
                        // We need to mark each node as belonging to the node list.
                        oldNodes = nodeLists.update(nodes, frag.childNodes);
                        elements.replace(oldNodes, frag);
                    };
                data.nodeList = nodes;

                // register the span so nodeLists knows the parentNodeList
                nodeLists.register(nodes, data.teardownCheck);
                makeAndPut(compute());
            },

            replace: function(nodes, val, teardown) {
                var oldNodes = nodes.slice(0),
                    frag = can.frag(val);
                nodeLists.register(nodes, teardown);


                if (typeof val === 'string') {
                    // if it was a string, check for hookups
                    frag = can.view.hookup(frag, nodes[0].parentNode);
                }
                // We need to mark each node as belonging to the node list.
                nodeLists.update(nodes, frag.childNodes);
                elements.replace(oldNodes, frag);
                return nodes;
            },

            text: function(el, compute, parentNode) {
                var parent = elements.getParentNode(el, parentNode);
                // setup listening right away so we don't have to re-calculate value
                var data = listen(parent, compute, function(ev, newVal, oldVal) {
                    // Sometimes this is 'unknown' in IE and will throw an exception if it is

                    if (typeof node.nodeValue !== 'unknown') {
                        node.nodeValue = can.view.toStr(newVal);
                    }

                    // TODO: remove in 2.1
                    data.teardownCheck(node.parentNode);
                }),
                    // The text node that will be updated
                    node = document.createTextNode(can.view.toStr(compute()));
                // Replace the placeholder with the live node and do the nodeLists thing.
                // Add that node to nodeList so we can remove it when the parent element is removed from the page
                data.nodeList = live.replace([el], node, data.teardownCheck);
            },
            setAttributes: function(el, newVal) {
                var attrs = getAttributeParts(newVal);
                for (var name in attrs) {
                    can.attr.set(el, name, attrs[name]);
                }
            },

            attributes: function(el, compute, currentValue) {
                var oldAttrs = {};

                var setAttrs = function(newVal) {
                    var newAttrs = getAttributeParts(newVal),
                        name;
                    for (name in newAttrs) {
                        var newValue = newAttrs[name],
                            oldValue = oldAttrs[name];
                        if (newValue !== oldValue) {
                            can.attr.set(el, name, newValue);
                        }
                        delete oldAttrs[name];
                    }
                    for (name in oldAttrs) {
                        elements.removeAttr(el, name);
                    }
                    oldAttrs = newAttrs;
                };
                listen(el, compute, function(ev, newVal) {
                    setAttrs(newVal);
                });
                // current value has been set
                if (arguments.length >= 3) {
                    oldAttrs = getAttributeParts(currentValue);
                } else {
                    setAttrs(compute());
                }
            },
            attributePlaceholder: '__!!__',
            attributeReplace: /__!!__/g,
            attribute: function(el, attributeName, compute) {
                listen(el, compute, function(ev, newVal) {
                    elements.setAttr(el, attributeName, hook.render());
                });
                var wrapped = can.$(el),
                    hooks;
                // Get the list of hookups or create one for this element.
                // Hooks is a map of attribute names to hookup `data`s.
                // Each hookup data has:
                // `render` - A `function` to render the value of the attribute.
                // `funcs` - A list of hookup `function`s on that attribute.
                // `batchNum` - The last event `batchNum`, used for performance.
                hooks = can.data(wrapped, 'hooks');
                if (!hooks) {
                    can.data(wrapped, 'hooks', hooks = {});
                }
                // Get the attribute value.
                var attr = elements.getAttr(el, attributeName),
                    // Split the attribute value by the template.
                    // Only split out the first __!!__ so if we have multiple hookups in the same attribute,
                    // they will be put in the right spot on first render
                    parts = attr.split(live.attributePlaceholder),
                    goodParts = [],
                    hook;
                goodParts.push(parts.shift(), parts.join(live.attributePlaceholder));
                // If we already had a hookup for this attribute...
                if (hooks[attributeName]) {
                    // Just add to that attribute's list of `function`s.
                    hooks[attributeName].computes.push(compute);
                } else {
                    // Create the hookup data.
                    hooks[attributeName] = {
                        render: function() {
                            var i = 0,
                                // attr doesn't have a value in IE
                                newAttr = attr ? attr.replace(live.attributeReplace, function() {
                                    return elements.contentText(hook.computes[i++]());
                                }) : elements.contentText(hook.computes[i++]());
                            return newAttr;
                        },
                        computes: [compute],
                        batchNum: undefined
                    };
                }
                // Save the hook for slightly faster performance.
                hook = hooks[attributeName];
                // Insert the value in parts.
                goodParts.splice(1, 0, compute());

                // Set the attribute.
                elements.setAttr(el, attributeName, goodParts.join(''));
            },
            specialAttribute: function(el, attributeName, compute) {
                listen(el, compute, function(ev, newVal) {
                    elements.setAttr(el, attributeName, getValue(newVal));
                });
                elements.setAttr(el, attributeName, getValue(compute()));
            },

            simpleAttribute: function(el, attributeName, compute) {
                listen(el, compute, function(ev, newVal) {
                    elements.setAttr(el, attributeName, newVal);
                });
                elements.setAttr(el, attributeName, compute());
            }
        };
        live.attr = live.simpleAttribute;
        live.attrs = live.attributes;
        var newLine = /(\r|\n)+/g;
        var getValue = function(val) {
            var regexp = /^["'].*["']$/;
            val = val.replace(elements.attrReg, '')
                .replace(newLine, '');
            // check if starts and ends with " or '
            return regexp.test(val) ? val.substr(1, val.length - 2) : val;
        };
        can.view.live = live;

        return live;
    })(__m2, __m24, __m10, __m27, __m28);

    // ## view/render.js
    var __m25 = (function(can, elements, live) {


        var pendingHookups = [],
            tagChildren = function(tagName) {
                var newTag = elements.tagMap[tagName] || "span";
                if (newTag === "span") {
                    //innerHTML in IE doesn't honor leading whitespace after empty elements
                    return "@@!!@@";
                }
                return "<" + newTag + ">" + tagChildren(newTag) + "</" + newTag + ">";
            },
            contentText = function(input, tag) {

                // If it's a string, return.
                if (typeof input === 'string') {
                    return input;
                }
                // If has no value, return an empty string.
                if (!input && input !== 0) {
                    return '';
                }

                // If it's an object, and it has a hookup method.
                var hook = (input.hookup &&

                    // Make a function call the hookup method.

                    function(el, id) {
                        input.hookup.call(input, el, id);
                    }) ||

                // Or if it's a `function`, just use the input.
                (typeof input === 'function' && input);

                // Finally, if there is a `function` to hookup on some dom,
                // add it to pending hookups.
                if (hook) {
                    if (tag) {
                        return "<" + tag + " " + can.view.hook(hook) + "></" + tag + ">";
                    } else {
                        pendingHookups.push(hook);
                    }

                    return '';
                }

                // Finally, if all else is `false`, `toString()` it.
                return "" + input;
            },
            // Returns escaped/sanatized content for anything other than a live-binding
            contentEscape = function(txt, tag) {
                return (typeof txt === 'string' || typeof txt === 'number') ?
                    can.esc(txt) :
                    contentText(txt, tag);
            },
            // A flag to indicate if .txt was called within a live section within an element like the {{name}}
            // within `<div {{#person}}{{name}}{{/person}}/>`.
            withinTemplatedSectionWithinAnElement = false,
            emptyHandler = function() {};

        var lastHookups;

        can.extend(can.view, {
                live: live,
                // called in text to make a temporary 
                // can.view.lists function that can be called with
                // the list to iterate over and the template
                // used to produce the content within the list
                setupLists: function() {

                    var old = can.view.lists,
                        data;

                    can.view.lists = function(list, renderer) {
                        data = {
                            list: list,
                            renderer: renderer
                        };
                        return Math.random();
                    };
                    // sets back to the old data
                    return function() {
                        can.view.lists = old;
                        return data;
                    };
                },
                getHooks: function() {
                    var hooks = pendingHookups.slice(0);
                    lastHookups = hooks;
                    pendingHookups = [];
                    return hooks;
                },
                onlytxt: function(self, func) {
                    return contentEscape(func.call(self));
                },

                txt: function(escape, tagName, status, self, func) {
                    // the temporary tag needed for any live setup
                    var tag = (elements.tagMap[tagName] || "span"),
                        // should live-binding be setup
                        setupLiveBinding = false,
                        // the compute's value
                        value,
                        listData,
                        compute,
                        unbind = emptyHandler,
                        attributeName;

                    // Are we currently within a live section within an element like the {{name}}
                    // within `<div {{#person}}{{name}}{{/person}}/>`.
                    if (withinTemplatedSectionWithinAnElement) {
                        value = func.call(self);
                    } else {

                        // If this magic tag is within an attribute or an html element,
                        // set the flag to true so we avoid trying to live bind
                        // anything that func might be setup.
                        // TODO: the scanner should be able to set this up.
                        if (typeof status === "string" || status === 1) {
                            withinTemplatedSectionWithinAnElement = true;
                        }

                        // Sets up a listener so we know any can.view.lists called 
                        // when func is called
                        var listTeardown = can.view.setupLists();
                        unbind = function() {
                            compute.unbind("change", emptyHandler);
                        };
                        // Create a compute that calls func and looks for dependencies.
                        // By passing `false`, this compute can not be a dependency of other 
                        // computes.  This is because live-bits are nested, but 
                        // handle their own updating. For example:
                        //     {{#if items.length}}{{#items}}{{.}}{{/items}}{{/if}}
                        // We do not want `{{#if items.length}}` changing the DOM if
                        // `{{#items}}` text changes.
                        compute = can.compute(func, self, false);

                        // Bind to get and temporarily cache the value of the compute.
                        compute.bind("change", emptyHandler);

                        // Call the "wrapping" function and get the binding information
                        listData = listTeardown();

                        // Get the value of the compute
                        value = compute();

                        // Let people know we are no longer within an element.
                        withinTemplatedSectionWithinAnElement = false;

                        // If we should setup live-binding.
                        setupLiveBinding = compute.hasDependencies;
                    }

                    if (listData) {
                        unbind();
                        return "<" + tag + can.view.hook(function(el, parentNode) {
                            live.list(el, listData.list, listData.renderer, self, parentNode);
                        }) + "></" + tag + ">";
                    }

                    // If we had no observes just return the value returned by func.
                    if (!setupLiveBinding || typeof value === "function") {
                        unbind();
                        return ((withinTemplatedSectionWithinAnElement || escape === 2 || !escape) ?
                            contentText :
                            contentEscape)(value, status === 0 && tag);
                    }

                    // the property (instead of innerHTML elements) to adjust. For
                    // example options should use textContent
                    var contentProp = elements.tagToContentPropMap[tagName];

                    // The magic tag is outside or between tags.
                    if (status === 0 && !contentProp) {
                        // Return an element tag with a hookup in place of the content
                        return "<" + tag + can.view.hook(
                            // if value is an object, it's likely something returned by .safeString
                            escape && typeof value !== "object" ?
                            // If we are escaping, replace the parentNode with 
                            // a text node who's value is `func`'s return value.

                            function(el, parentNode) {
                                live.text(el, compute, parentNode);
                                unbind();
                            } :
                            // If we are not escaping, replace the parentNode with a
                            // documentFragment created as with `func`'s return value.

                            function(el, parentNode) {
                                live.html(el, compute, parentNode);
                                unbind();
                                //children have to be properly nested HTML for buildFragment to work properly
                            }) + ">" + tagChildren(tag) + "</" + tag + ">";
                        // In a tag, but not in an attribute
                    } else if (status === 1) {
                        // remember the old attr name
                        pendingHookups.push(function(el) {
                            live.attributes(el, compute, compute());
                            unbind();
                        });

                        return compute();
                    } else if (escape === 2) { // In a special attribute like src or style

                        attributeName = status;
                        pendingHookups.push(function(el) {
                            live.specialAttribute(el, attributeName, compute);
                            unbind();
                        });
                        return compute();
                    } else { // In an attribute...
                        attributeName = status === 0 ? contentProp : status;
                        // if the magic tag is inside the element, like `<option><% TAG %></option>`,
                        // we add this hookup to the last element (ex: `option`'s) hookups.
                        // Otherwise, the magic tag is in an attribute, just add to the current element's
                        // hookups.
                        (status === 0 ? lastHookups : pendingHookups)
                            .push(function(el) {
                                live.attribute(el, attributeName, compute);
                                unbind();
                            });
                        return live.attributePlaceholder;
                    }
                }
            });

        return can;
    })(__m10, __m24, __m26, __m13);

    // ## view/mustache/mustache.js
    var __m21 = (function(can) {

        // # mustache.js
        // `can.Mustache`: The Mustache templating engine.
        // See the [Transformation](#section-29) section within *Scanning Helpers* for a detailed explanation 
        // of the runtime render code design. The majority of the Mustache engine implementation 
        // occurs within the *Transformation* scanning helper.

        // ## Initialization
        // Define the view extension.
        can.view.ext = ".mustache";

        // ### Setup internal helper variables and functions.
        // An alias for the context variable used for tracking a stack of contexts.
        // This is also used for passing to helper functions to maintain proper context.
        var SCOPE = 'scope',
            // An alias for the variable used for the hash object that can be passed
            // to helpers via `options.hash`.
            HASH = '___h4sh',
            // An alias for the most used context stacking call.
            CONTEXT_OBJ = '{scope:' + SCOPE + ',options:options}',
            // a context object used to incidate being special
            SPECIAL_CONTEXT_OBJ = '{scope:' + SCOPE + ',options:options, special: true}',
            // argument names used to start the function (used by scanner and steal)
            ARG_NAMES = SCOPE + ",options",

            // matches arguments inside a {{ }}
            argumentsRegExp = /((([^\s]+?=)?('.*?'|".*?"))|.*?)\s/g,

            // matches a literal number, string, null or regexp
            literalNumberStringBooleanRegExp = /^(('.*?'|".*?"|[0-9]+\.?[0-9]*|true|false|null|undefined)|((.+?)=(('.*?'|".*?"|[0-9]+\.?[0-9]*|true|false)|(.+))))$/,

            // returns an object literal that we can use to look up a value in the current scope
            makeLookupLiteral = function(type) {
                return '{get:"' + type.replace(/"/g, '\\"') + '"}';
            },
            // returns if the object is a lookup
            isLookup = function(obj) {
                return obj && typeof obj.get === "string";
            },


            isObserveLike = function(obj) {
                return obj instanceof can.Map || (obj && !! obj._get);
            },


            isArrayLike = function(obj) {
                return obj && obj.splice && typeof obj.length === 'number';
            },
            // used to make sure .fn and .inverse are always called with a Scope like object
            makeConvertToScopes = function(original, scope, options) {
                var originalWithScope = function(ctx, opts) {
                    return original(ctx || scope, opts);
                };
                return function(updatedScope, updatedOptions) {
                    if (updatedScope !== undefined && !(updatedScope instanceof can.view.Scope)) {
                        updatedScope = scope.add(updatedScope);
                    }
                    if (updatedOptions !== undefined && !(updatedOptions instanceof can.view.Options)) {
                        updatedOptions = options.add(updatedOptions);
                    }
                    return originalWithScope(updatedScope, updatedOptions || options);
                };
            };

        // ## Mustache

        var Mustache = function(options, helpers) {
            // Support calling Mustache without the constructor.
            // This returns a function that renders the template.
            if (this.constructor !== Mustache) {
                var mustache = new Mustache(options);
                return function(data, options) {
                    return mustache.render(data, options);
                };
            }

            // If we get a `function` directly, it probably is coming from
            // a `steal`-packaged view.
            if (typeof options === "function") {
                this.template = {
                    fn: options
                };
                return;
            }

            // Set options on self.
            can.extend(this, options);
            this.template = this.scanner.scan(this.text, this.name);
        };


        // Put Mustache on the `can` object.
        can.Mustache = window.Mustache = Mustache;


        Mustache.prototype.

        render = function(data, options) {
            if (!(data instanceof can.view.Scope)) {
                data = new can.view.Scope(data || {});
            }
            if (!(options instanceof can.view.Options)) {
                options = new can.view.Options(options || {});
            }
            options = options || {};

            return this.template.fn.call(data, data, options);
        };

        can.extend(Mustache.prototype, {
                // Share a singleton scanner for parsing templates.
                scanner: new can.view.Scanner({
                        // A hash of strings for the scanner to inject at certain points.
                        text: {
                            // This is the logic to inject at the beginning of a rendered template. 
                            // This includes initializing the `context` stack.
                            start: "", //"var "+SCOPE+"= this instanceof can.view.Scope? this : new can.view.Scope(this);\n",
                            scope: SCOPE,
                            options: ",options: options",
                            argNames: ARG_NAMES
                        },

                        // An ordered token registry for the scanner.
                        // This needs to be ordered by priority to prevent token parsing errors.
                        // Each token follows the following structure:
                        //		[
                        //			// Which key in the token map to match.
                        //			"tokenMapName",
                        //			// A simple token to match, like "{{".
                        //			"token",
                        //			// Optional. A complex (regexp) token to match that 
                        //			// overrides the simple token.
                        //			"[\\s\\t]*{{",
                        //			// Optional. A function that executes advanced 
                        //			// manipulation of the matched content. This is 
                        //			// rarely used.
                        //			function(content){   
                        //				return content;
                        //			}
                        //		]
                        tokens: [

                            // Return unescaped
                            ["returnLeft", "{{{", "{{[{&]"],
                            // Full line comments
                            ["commentFull", "{{!}}", "^[\\s\\t]*{{!.+?}}\\n"],

                            // Inline comments
                            ["commentLeft", "{{!", "(\\n[\\s\\t]*{{!|{{!)"],

                            // Full line escapes
                            // This is used for detecting lines with only whitespace and an escaped tag
                            ["escapeFull", "{{}}", "(^[\\s\\t]*{{[#/^][^}]+?}}\\n|\\n[\\s\\t]*{{[#/^][^}]+?}}\\n|\\n[\\s\\t]*{{[#/^][^}]+?}}$)",
                                function(content) {
                                    return {
                                        before: /^\n.+?\n$/.test(content) ? '\n' : '',
                                        content: content.match(/\{\{(.+?)\}\}/)[1] || ''
                                    };
                                }
                            ],
                            // Return escaped
                            ["escapeLeft", "{{"],
                            // Close return unescaped
                            ["returnRight", "}}}"],
                            // Close tag
                            ["right", "}}"]
                        ],

                        // ## Scanning Helpers
                        // This is an array of helpers that transform content that is within escaped tags like `{{token}}`. These helpers are solely for the scanning phase; they are unrelated to Mustache/Handlebars helpers which execute at render time. Each helper has a definition like the following:
                        //		{
                        //			// The content pattern to match in order to execute.
                        //			// Only the first matching helper is executed.
                        //			name: /pattern to match/,
                        //			// The function to transform the content with.
                        //			// @param {String} content   The content to transform.
                        //			// @param {Object} cmd       Scanner helper data.
                        //			//                           {
                        //			//                             insert: "insert command",
                        //			//                             tagName: "div",
                        //			//                             status: 0
                        //			//                           }
                        //			fn: function(content, cmd) {
                        //				return 'for text injection' || 
                        //					{ raw: 'to bypass text injection' };
                        //			}
                        //		}
                        helpers: [
                            // ### Partials
                            // Partials begin with a greater than sign, like {{> box}}.
                            // Partials are rendered at runtime (as opposed to compile time), 
                            // so recursive partials are possible. Just avoid infinite loops.
                            // For example, this template and partial:
                            // 		base.mustache:
                            // 			<h2>Names</h2>
                            // 			{{#names}}
                            // 				{{> user}}
                            // 			{{/names}}
                            // 		user.mustache:
                            // 			<strong>{{name}}</strong>
                            {
                                name: /^>[\s]*\w*/,
                                fn: function(content, cmd) {
                                    // Get the template name and call back into the render method,
                                    // passing the name and the current context.
                                    var templateName = can.trim(content.replace(/^>\s?/, ''))
                                        .replace(/["|']/g, "");
                                    return "can.Mustache.renderPartial('" + templateName + "'," + ARG_NAMES + ")";
                                }
                            },

                            // ### Data Hookup
                            // This will attach the data property of `this` to the element
                            // its found on using the first argument as the data attribute
                            // key.
                            // For example:
                            //		<li id="nameli" {{ data 'name' }}></li>
                            // then later you can access it like:
                            //		can.$('#nameli').data('name');

                            {
                                name: /^\s*data\s/,
                                fn: function(content, cmd) {
                                    var attr = content.match(/["|'](.*)["|']/)[1];
                                    // return a function which calls `can.data` on the element
                                    // with the attribute name with the current context.
                                    return "can.proxy(function(__){" +
                                    // "var context = this[this.length-1];" +
                                    // "context = context." + STACKED + " ? context[context.length-2] : context; console.warn(this, context);" +
                                    "can.data(can.$(__),'" + attr + "', this.attr('.')); }, " + SCOPE + ")";
                                }
                            }, {
                                name: /\s*\(([\$\w]+)\)\s*->([^\n]*)/,
                                fn: function(content) {
                                    var quickFunc = /\s*\(([\$\w]+)\)\s*->([^\n]*)/,
                                        parts = content.match(quickFunc);

                                    //find 
                                    return "can.proxy(function(__){var " + parts[1] + "=can.$(__);with(" + SCOPE + ".attr('.')){" + parts[2] + "}}, this);";
                                }
                            },
                            // ### Transformation (default)
                            // This transforms all content to its interpolated equivalent,
                            // including calls to the corresponding helpers as applicable. 
                            // This outputs the render code for almost all cases.
                            // #### Definitions
                            // * `context` - This is the object that the current rendering context operates within. 
                            //		Each nested template adds a new `context` to the context stack.
                            // * `stack` - Mustache supports nested sections, 
                            //		each of which add their own context to a stack of contexts.
                            //		Whenever a token gets interpolated, it will check for a match against the 
                            //		last context in the stack, then iterate through the rest of the stack checking for matches.
                            //		The first match is the one that gets returned.
                            // * `Mustache.txt` - This serializes a collection of logic, optionally contained within a section.
                            //		If this is a simple interpolation, only the interpolation lookup will be passed.
                            //		If this is a section, then an `options` object populated by the truthy (`options.fn`) and 
                            //		falsey (`options.inverse`) encapsulated functions will also be passed. This section handling 
                            //		exists to support the runtime context nesting that Mustache supports.
                            // * `Mustache.get` - This resolves an interpolation reference given a stack of contexts.
                            // * `options` - An object containing methods for executing the inner contents of sections or helpers.  
                            //		`options.fn` - Contains the inner template logic for a truthy section.  
                            //		`options.inverse` - Contains the inner template logic for a falsey section.  
                            //		`options.hash` - Contains the merged hash object argument for custom helpers.
                            // #### Design
                            // This covers the design of the render code that the transformation helper generates.
                            // ##### Pseudocode
                            // A detailed explanation is provided in the following sections, but here is some brief pseudocode
                            // that gives a high level overview of what the generated render code does (with a template similar to  
                            // `"{{#a}}{{b.c.d.e.name}}{{/a}}" == "Phil"`).
                            // *Initialize the render code.*
                            // 		view = []
                            // 		context = []
                            // 		stack = fn { context.concat([this]) }
                            // *Render the root section.*
                            // 		view.push( "string" )
                            // 		view.push( can.view.txt(
                            // *Render the nested section with `can.Mustache.txt`.*
                            // 			txt( 
                            // *Add the current context to the stack.*
                            // 				stack(), 
                            // *Flag this for truthy section mode.*
                            // 				"#",
                            // *Interpolate and check the `a` variable for truthyness using the stack with `can.Mustache.get`.*
                            // 				get( "a", stack() ),
                            // *Include the nested section's inner logic.
                            // The stack argument is usually the parent section's copy of the stack, 
                            // but it can be an override context that was passed by a custom helper.
                            // Sections can nest `0..n` times -- **NESTCEPTION**.*
                            // 				{ fn: fn(stack) {
                            // *Render the nested section (everything between the `{{#a}}` and `{{/a}}` tokens).*
                            // 					view = []
                            // 					view.push( "string" )
                            // 					view.push(
                            // *Add the current context to the stack.*
                            // 						stack(),
                            // *Flag this as interpolation-only mode.*
                            // 						null,
                            // *Interpolate the `b.c.d.e.name` variable using the stack.*
                            // 						get( "b.c.d.e.name", stack() ),
                            // 					)
                            // 					view.push( "string" )
                            // *Return the result for the nested section.*
                            // 					return view.join()
                            // 				}}
                            // 			)
                            // 		))
                            // 		view.push( "string" )
                            // *Return the result for the root section, which includes all nested sections.*
                            // 		return view.join()
                            // ##### Initialization
                            // Each rendered template is started with the following initialization code:
                            // 		var ___v1ew = [];
                            // 		var ___c0nt3xt = [];
                            // 		___c0nt3xt.__sc0pe = true;
                            // 		var __sc0pe = function(context, self) {
                            // 			var s;
                            // 			if (arguments.length == 1 && context) {
                            // 				s = !context.__sc0pe ? [context] : context;
                            // 			} else {
                            // 				s = context && context.__sc0pe 
                            //					? context.concat([self]) 
                            //					: __sc0pe(context).concat([self]);
                            // 			}
                            // 			return (s.__sc0pe = true) && s;
                            // 		};
                            // The `___v1ew` is the the array used to serialize the view.
                            // The `___c0nt3xt` is a stacking array of contexts that slices and expands with each nested section.
                            // The `__sc0pe` function is used to more easily update the context stack in certain situations.
                            // Usually, the stack function simply adds a new context (`self`/`this`) to a context stack. 
                            // However, custom helpers will occasionally pass override contexts that need their own context stack.
                            // ##### Sections
                            // Each section, `{{#section}} content {{/section}}`, within a Mustache template generates a section 
                            // context in the resulting render code. The template itself is treated like a root section, with the 
                            // same execution logic as any others. Each section can have `0..n` nested sections within it.
                            // Here's an example of a template without any descendent sections.  
                            // Given the template: `"{{a.b.c.d.e.name}}" == "Phil"`  
                            // Would output the following render code:
                            //		___v1ew.push("\"");
                            //		___v1ew.push(can.view.txt(1, '', 0, this, function() {
                            // 			return can.Mustache.txt(__sc0pe(___c0nt3xt, this), null, 
                            //				can.Mustache.get("a.b.c.d.e.name", 
                            //					__sc0pe(___c0nt3xt, this))
                            //			);
                            //		}));
                            //		___v1ew.push("\" == \"Phil\"");
                            // The simple strings will get appended to the view. Any interpolated references (like `{{a.b.c.d.e.name}}`) 
                            // will be pushed onto the view via `can.view.txt` in order to support live binding.
                            // The function passed to `can.view.txt` will call `can.Mustache.txt`, which serializes the object data by doing 
                            // a context lookup with `can.Mustache.get`.
                            // `can.Mustache.txt`'s first argument is a copy of the context stack with the local context `this` added to it.
                            // This stack will grow larger as sections nest.
                            // The second argument is for the section type. This will be `"#"` for truthy sections, `"^"` for falsey, 
                            // or `null` if it is an interpolation instead of a section.
                            // The third argument is the interpolated value retrieved with `can.Mustache.get`, which will perform the 
                            // context lookup and return the approriate string or object.
                            // Any additional arguments, if they exist, are used for passing arguments to custom helpers.
                            // For nested sections, the last argument is an `options` object that contains the nested section's logic.
                            // Here's an example of a template with a single nested section.  
                            // Given the template: `"{{#a}}{{b.c.d.e.name}}{{/a}}" == "Phil"`  
                            // Would output the following render code:
                            //		___v1ew.push("\"");
                            // 		___v1ew.push(can.view.txt(0, '', 0, this, function() {
                            // 			return can.Mustache.txt(__sc0pe(___c0nt3xt, this), "#", 
                            //				can.Mustache.get("a", __sc0pe(___c0nt3xt, this)), 
                            //					[{
                            // 					_: function() {
                            // 						return ___v1ew.join("");
                            // 					}
                            // 				}, {
                            // 					fn: function(___c0nt3xt) {
                            // 						var ___v1ew = [];
                            // 						___v1ew.push(can.view.txt(1, '', 0, this, 
                            //								function() {
                            //                                  return can.Mustache.txt(
                            // 									__sc0pe(___c0nt3xt, this), 
                            // 									null, 
                            // 									can.Mustache.get("b.c.d.e.name", 
                            // 										__sc0pe(___c0nt3xt, this))
                            // 								);
                            // 							}
                            // 						));
                            // 						return ___v1ew.join("");
                            // 					}
                            // 				}]
                            //			)
                            // 		}));
                            //		___v1ew.push("\" == \"Phil\"");
                            // This is specified as a truthy section via the `"#"` argument. The last argument includes an array of helper methods used with `options`.
                            // These act similarly to custom helpers: `options.fn` will be called for truthy sections, `options.inverse` will be called for falsey sections.
                            // The `options._` function only exists as a dummy function to make generating the section nesting easier (a section may have a `fn`, `inverse`,
                            // or both, but there isn't any way to determine that at compilation time).
                            // Within the `fn` function is the section's render context, which in this case will render anything between the `{{#a}}` and `{{/a}}` tokens.
                            // This function has `___c0nt3xt` as an argument because custom helpers can pass their own override contexts. For any case where custom helpers
                            // aren't used, `___c0nt3xt` will be equivalent to the `__sc0pe(___c0nt3xt, this)` stack created by its parent section. The `inverse` function
                            // works similarly, except that it is added when `{{^a}}` and `{{else}}` are used. `var ___v1ew = []` is specified in `fn` and `inverse` to 
                            // ensure that live binding in nested sections works properly.
                            // All of these nested sections will combine to return a compiled string that functions similar to EJS in its uses of `can.view.txt`.
                            // #### Implementation
                            {
                                name: /^.*$/,
                                fn: function(content, cmd) {
                                    var mode = false,
                                        result = {
                                            content: "",
                                            startTxt: false,
                                            startOnlyTxt: false,
                                            end: false
                                        };

                                    // Trim the content so we don't have any trailing whitespace.
                                    content = can.trim(content);

                                    // Determine what the active mode is.
                                    // * `#` - Truthy section
                                    // * `^` - Falsey section
                                    // * `/` - Close the prior section
                                    // * `else` - Inverted section (only exists within a truthy/falsey section)
                                    if (content.length && (mode = content.match(/^([#^/]|else$)/))) {
                                        mode = mode[0];
                                        switch (mode) {

                                            // Open a new section.
                                            case '#':

                                            case '^':
                                                if (cmd.specialAttribute) {
                                                    result.startOnlyTxt = true;
                                                    //result.push(cmd.insert + 'can.view.onlytxt(this,function(){ return ');
                                                } else {
                                                    result.startTxt = true;
                                                    // sections should never be escaped
                                                    result.escaped = 0;
                                                    //result.push(cmd.insert + 'can.view.txt(0,\'' + cmd.tagName + '\',' + cmd.status + ',this,function(){ return ');
                                                }
                                                break;
                                                // Close the prior section.

                                            case '/':
                                                result.end = true;
                                                result.content += 'return ___v1ew.join("");}}])';
                                                return result;
                                        }

                                        // Trim the mode off of the content.
                                        content = content.substring(1);
                                    }

                                    // `else` helpers are special and should be skipped since they don't 
                                    // have any logic aside from kicking off an `inverse` function.
                                    if (mode !== 'else') {
                                        var args = [],
                                            hashes = [],
                                            i = 0,
                                            m;

                                        // Start the content render block.
                                        result.content += 'can.Mustache.txt(\n' +
                                        (cmd.specialAttribute ? SPECIAL_CONTEXT_OBJ : CONTEXT_OBJ) +
                                            ',\n' + (mode ? '"' + mode + '"' : 'null') + ',';

                                        // Parse the helper arguments.
                                        // This needs uses this method instead of a split(/\s/) so that 
                                        // strings with spaces can be correctly parsed.
                                        (can.trim(content) + ' ')
                                            .replace(argumentsRegExp, function(whole, arg) {

                                                // Check for special helper arguments (string/number/boolean/hashes).
                                                if (i && (m = arg.match(literalNumberStringBooleanRegExp))) {
                                                    // Found a native type like string/number/boolean.
                                                    if (m[2]) {
                                                        args.push(m[0]);
                                                    }
                                                    // Found a hash object.
                                                    else {
                                                        // Addd to the hash object.

                                                        hashes.push(m[4] + ":" + (m[6] ? m[6] : makeLookupLiteral(m[5])));
                                                    }
                                                }
                                                // Otherwise output a normal interpolation reference.
                                                else {
                                                    args.push(makeLookupLiteral(arg));
                                                }
                                                i++;
                                            });

                                        result.content += args.join(",");
                                        if (hashes.length) {
                                            result.content += ",{" + HASH + ":{" + hashes.join(",") + "}}";
                                        }

                                    }

                                    // Create an option object for sections of code.
                                    if (mode && mode !== 'else') {
                                        result.content += ',[\n\n';
                                    }
                                    switch (mode) {
                                        // Truthy section
                                        case '^':
                                        case '#':
                                            result.content += ('{fn:function(' + ARG_NAMES + '){var ___v1ew = [];');
                                            break;
                                            // If/else section
                                            // Falsey section

                                        case 'else':
                                            result.content += 'return ___v1ew.join("");}},\n{inverse:function(' + ARG_NAMES + '){\nvar ___v1ew = [];';
                                            break;

                                            // Not a section, no mode
                                        default:
                                            result.content += (')');
                                            break;
                                    }

                                    if (!mode) {
                                        result.startTxt = true;
                                        result.end = true;
                                    }

                                    return result;
                                }
                            }
                        ]
                    })
            });

        // Add in default scanner helpers first.
        // We could probably do this differently if we didn't 'break' on every match.
        var helpers = can.view.Scanner.prototype.helpers;
        for (var i = 0; i < helpers.length; i++) {
            Mustache.prototype.scanner.helpers.unshift(helpers[i]);
        }


        Mustache.txt = function(scopeAndOptions, mode, name) {

            // here we are going to cache the lookup values so future calls are much faster
            var scope = scopeAndOptions.scope,
                options = scopeAndOptions.options,
                args = [],
                helperOptions = {
                    fn: function() {},
                    inverse: function() {}
                },
                hash,
                context = scope.attr("."),
                getHelper = true,
                helper;

            // convert lookup values to actual values in name, arguments, and hash
            for (var i = 3; i < arguments.length; i++) {
                var arg = arguments[i];
                if (mode && can.isArray(arg)) {
                    // merge into options
                    helperOptions = can.extend.apply(can, [helperOptions].concat(arg));
                } else if (arg && arg[HASH]) {
                    hash = arg[HASH];
                    // get values on hash
                    for (var prop in hash) {
                        if (isLookup(hash[prop])) {
                            hash[prop] = Mustache.get(hash[prop].get, scopeAndOptions, false, true);
                        }
                    }
                } else if (arg && isLookup(arg)) {
                    args.push(Mustache.get(arg.get, scopeAndOptions, false, true));
                } else {
                    args.push(arg);
                }
            }

            if (isLookup(name)) {
                var get = name.get;
                name = Mustache.get(name.get, scopeAndOptions, args.length, false);

                // Base whether or not we will get a helper on whether or not the original
                // name.get and Mustache.get resolve to the same thing. Saves us from running
                // into issues like {{text}} / {text: 'with'}
                getHelper = (get === name);
            }

            // overwrite fn and inverse to always convert to scopes
            helperOptions.fn = makeConvertToScopes(helperOptions.fn, scope, options);
            helperOptions.inverse = makeConvertToScopes(helperOptions.inverse, scope, options);

            // if mode is ^, swap fn and inverse
            if (mode === '^') {
                var tmp = helperOptions.fn;
                helperOptions.fn = helperOptions.inverse;
                helperOptions.inverse = tmp;
            }

            // Check for a registered helper or a helper-like function.
            if (helper = (getHelper && (typeof name === "string" && Mustache.getHelper(name, options)) || (can.isFunction(name) && !name.isComputed && {
                            fn: name
                        }))) {
                // Add additional data to be used by helper functions

                can.extend(helperOptions, {
                        context: context,
                        scope: scope,
                        contexts: scope,
                        hash: hash
                    });

                args.push(helperOptions);
                // Call the helper.
                return function() {
                    return helper.fn.apply(context, args) || '';
                };

            }

            return function() {
                //{{#foo.bar zed ted}}
                var value;
                if (can.isFunction(name) && name.isComputed) {
                    value = name();
                } else {
                    value = name;
                }
                // An array of arguments to check for truthyness when evaluating sections.
                var validArgs = args.length ? args : [value],
                    // Whether the arguments meet the condition of the section.
                    valid = true,
                    result = [],
                    i, argIsObserve, arg;
                // Validate the arguments based on the section mode.
                if (mode) {
                    for (i = 0; i < validArgs.length; i++) {
                        arg = validArgs[i];
                        argIsObserve = typeof arg !== 'undefined' && isObserveLike(arg);
                        // Array-like objects are falsey if their length = 0.
                        if (isArrayLike(arg)) {
                            // Use .attr to trigger binding on empty lists returned from function
                            if (mode === '#') {
                                valid = valid && !! (argIsObserve ? arg.attr('length') : arg.length);
                            } else if (mode === '^') {
                                valid = valid && !(argIsObserve ? arg.attr('length') : arg.length);
                            }
                        }
                        // Otherwise just check if it is truthy or not.
                        else {
                            valid = mode === '#' ? valid && !! arg : mode === '^' ? valid && !arg : valid;
                        }
                    }
                }

                // Otherwise interpolate like normal.
                if (valid) {

                    if (mode === "#") {
                        if (isArrayLike(value)) {
                            var isObserveList = isObserveLike(value);

                            // Add the reference to the list in the contexts.
                            for (i = 0; i < value.length; i++) {
                                result.push(helperOptions.fn(
                                        isObserveList ? value.attr('' + i) : value[i]));
                            }
                            return result.join('');
                        }
                        // Normal case.
                        else {
                            return helperOptions.fn(value || {}) || '';
                        }
                    } else if (mode === "^") {
                        return helperOptions.inverse(value || {}) || '';
                    } else {
                        return '' + (value != null ? value : '');
                    }
                }

                return '';
            };
        };


        Mustache.get = function(key, scopeAndOptions, isHelper, isArgument) {

            // Cache a reference to the current context and options, we will use them a bunch.
            var context = scopeAndOptions.scope.attr('.'),
                options = scopeAndOptions.options || {};

            // If key is called as a helper,
            if (isHelper) {
                // try to find a registered helper.
                if (Mustache.getHelper(key, options)) {
                    return key;
                }
                // Support helper-like functions as anonymous helpers.
                // Check if there is a method directly in the "top" context.
                if (scopeAndOptions.scope && can.isFunction(context[key])) {
                    return context[key];
                }


            }

            // Get a compute (and some helper data) that represents key's value in the current scope
            var computeData = scopeAndOptions.scope.computeData(key, {
                    isArgument: isArgument,
                    args: [context, scopeAndOptions.scope]
                }),
                compute = computeData.compute;

            // Bind on the compute to cache its value. We will unbind in a timeout later.
            can.compute.temporarilyBind(compute);

            // computeData gives us an initial value
            var initialValue = computeData.initialValue;



            // Use helper over the found value if the found value isn't in the current context
            if ((initialValue === undefined || computeData.scope !== scopeAndOptions.scope) && Mustache.getHelper(key, options)) {
                return key;
            }

            // If there are no dependencies, just return the value.
            if (!compute.hasDependencies) {
                return initialValue;
            } else {
                return compute;
            }
        };


        Mustache.resolve = function(value) {
            if (isObserveLike(value) && isArrayLike(value) && value.attr('length')) {
                return value;
            } else if (can.isFunction(value)) {
                return value();
            } else {
                return value;
            }
        };



        can.view.Options = can.view.Scope.extend({
                init: function(data, parent) {
                    if (!data.helpers && !data.partials && !data.tags) {
                        data = {
                            helpers: data
                        };
                    }
                    can.view.Scope.prototype.init.apply(this, arguments);
                }
            });

        // ## Helpers
        // Helpers are functions that can be called from within a template.
        // These helpers differ from the scanner helpers in that they execute
        // at runtime instead of during compilation.
        // Custom helpers can be added via `can.Mustache.registerHelper`,
        // but there are also some built-in helpers included by default.
        // Most of the built-in helpers are little more than aliases to actions 
        // that the base version of Mustache simply implies based on the 
        // passed in object.
        // Built-in helpers:
        // * `data` - `data` is a special helper that is implemented via scanning helpers. 
        //		It hooks up the active element to the active data object: `<div {{data "key"}} />`
        // * `if` - Renders a truthy section: `{{#if var}} render {{/if}}`
        // * `unless` - Renders a falsey section: `{{#unless var}} render {{/unless}}`
        // * `each` - Renders an array: `{{#each array}} render {{this}} {{/each}}`
        // * `with` - Opens a context section: `{{#with var}} render {{/with}}`
        Mustache._helpers = {};

        Mustache.registerHelper = function(name, fn) {
            this._helpers[name] = {
                name: name,
                fn: fn
            };
        };


        Mustache.getHelper = function(name, options) {
            var helper = options.attr("helpers." + name);
            return helper ? {
                fn: helper
            } : this._helpers[name];
        };


        Mustache.render = function(partial, scope, options) {
            // TOOD: clean up the following
            // If there is a "partial" property and there is not
            // an already-cached partial, we use the value of the 
            // property to look up the partial

            // if this partial is not cached ...
            if (!can.view.cached[partial]) {
                // we don't want to bind to changes so clear and restore reading
                var reads = can.__clearReading();
                if (scope.attr('partial')) {
                    partial = scope.attr('partial');
                }
                can.__setReading(reads);
            }

            // Call into `can.view.render` passing the
            // partial and scope.
            return can.view.render(partial, scope, options);
        };


        Mustache.safeString = function(str) {
            return {
                toString: function() {
                    return str;
                }
            };
        };

        Mustache.renderPartial = function(partialName, scope, options) {
            var partial = options.attr("partials." + partialName);
            if (partial) {
                return partial.render ? partial.render(scope, options) :
                    partial(scope, options);
            } else {
                return can.Mustache.render(partialName, scope, options);
            }
        };

        // The built-in Mustache helpers.
        can.each({
                // Implements the `if` built-in helper.

                'if': function(expr, options) {
                    var value;
                    // if it's a function, wrap its value in a compute
                    // that will only change values from true to false
                    if (can.isFunction(expr)) {
                        value = can.compute.truthy(expr)();
                    } else {
                        value = !! Mustache.resolve(expr);
                    }

                    if (value) {
                        return options.fn(options.contexts || this);
                    } else {
                        return options.inverse(options.contexts || this);
                    }
                },
                // Implements the `unless` built-in helper.

                'unless': function(expr, options) {
                    var fn = options.fn;
                    options.fn = options.inverse;
                    options.inverse = fn;
                    return Mustache._helpers['if'].fn.apply(this, arguments);
                },

                // Implements the `each` built-in helper.

                'each': function(expr, options) {
                    // Check if this is a list or a compute that resolves to a list, and setup
                    // the incremental live-binding 

                    // First, see what we are dealing with.  It's ok to read the compute
                    // because can.view.text is only temporarily binding to what is going on here.
                    // Calling can.view.lists prevents anything from listening on that compute.
                    var resolved = Mustache.resolve(expr),
                        result = [],
                        keys,
                        key,
                        i;

                    // When resolved === undefined, the property hasn't been defined yet
                    // Assume it is intended to be a list
                    if (can.view.lists && (resolved instanceof can.List || (expr && expr.isComputed && resolved === undefined))) {
                        return can.view.lists(expr, function(item, index) {
                            return options.fn(options.scope.add({
                                        "@index": index
                                    })
                                .add(item));
                        });
                    }
                    expr = resolved;

                    if ( !! expr && isArrayLike(expr)) {
                        for (i = 0; i < expr.length; i++) {
                            result.push(options.fn(options.scope.add({
                                            "@index": i
                                        })
                                    .add(expr[i])));
                        }
                        return result.join('');
                    } else if (isObserveLike(expr)) {
                        keys = can.Map.keys(expr);
                        // listen to keys changing so we can livebind lists of attributes.

                        for (i = 0; i < keys.length; i++) {
                            key = keys[i];
                            result.push(options.fn(options.scope.add({
                                            "@key": key
                                        })
                                    .add(expr[key])));
                        }
                        return result.join('');
                    } else if (expr instanceof Object) {
                        for (key in expr) {
                            result.push(options.fn(options.scope.add({
                                            "@key": key
                                        })
                                    .add(expr[key])));
                        }
                        return result.join('');

                    }
                },
                // Implements the `with` built-in helper.

                'with': function(expr, options) {
                    var ctx = expr;
                    expr = Mustache.resolve(expr);
                    if ( !! expr) {
                        return options.fn(ctx);
                    }
                },

                'log': function(expr, options) {
                    if (typeof console !== "undefined" && console.log) {
                        if (!options) {
                            console.log(expr.context);
                        } else {
                            console.log(expr, options.context);
                        }
                    }
                }

            }, function(fn, name) {
                Mustache.registerHelper(name, fn);
            });

        // ## Registration
        // Registers Mustache with can.view.
        can.view.register({
                suffix: "mustache",

                contentType: "x-mustache-template",

                // Returns a `function` that renders the view.
                script: function(id, src) {
                    return "can.Mustache(function(" + ARG_NAMES + ") { " + new Mustache({
                            text: src,
                            name: id
                        })
                        .template.out + " })";
                },

                renderer: function(id, text) {
                    return Mustache({
                            text: text,
                            name: id
                        });
                }
            });

        can.mustache.registerHelper = can.proxy(can.Mustache.registerHelper, can.Mustache);
        can.mustache.safeString = can.Mustache.safeString;
        return can;
    })(__m2, __m22, __m10, __m23, __m20, __m25);

    // ## view/bindings/bindings.js
    var __m29 = (function(can) {

        // Function for determining of an element is contenteditable
        var isContentEditable = (function() {
            // A contenteditable element has a value of an empty string or "true"
            var values = {
                "": true,
                "true": true,
                "false": false
            };

            // Tests if an element has the appropriate contenteditable attribute
            var editable = function(el) {
                // DocumentFragments do not have a getAttribute
                if (!el || !el.getAttribute) {
                    return;
                }

                var attr = el.getAttribute("contenteditable");
                return values[attr];
            };

            return function(el) {
                // First check if the element is explicitly true or false
                var val = editable(el);
                if (typeof val === "boolean") {
                    return val;
                } else {
                    // Otherwise, check the parent
                    return !!editable(el.parentNode);
                }
            };
        })(),
            removeCurly = function(value) {
                if (value[0] === "{" && value[value.length - 1] === "}") {
                    return value.substr(1, value.length - 2);
                }
                return value;
            };

        // ## can-value
        // Implement the `can-value` special attribute
        // ### Usage
        // 		<input can-value="name" />
        // When a view engine finds this attribute, it will call this callback. The value of the attribute 
        // should be a string representing some value in the current scope to cross-bind to.
        can.view.attr("can-value", function(el, data) {

            var attr = removeCurly(el.getAttribute("can-value")),
                // Turn the attribute passed in into a compute.  If the user passed in can-value="name" and the current 
                // scope of the template is some object called data, the compute representing this can-value will be the 
                // data.attr('name') property.
                value = data.scope.computeData(attr, {
                        args: []
                    })
                    .compute,
                trueValue,
                falseValue;

            // Depending on the type of element, this attribute has different behavior. can.Controls are defined (further below 
            // in this file) for each type of input. This block of code collects arguments and instantiates each can.Control. There 
            // is one for checkboxes/radios, another for multiselect inputs, and another for everything else.
            if (el.nodeName.toLowerCase() === "input") {
                if (el.type === "checkbox") {
                    // If the element is a checkbox and has an attribute called "can-true-value", 
                    // set up a compute that toggles the value of the checkbox to "true" based on another attribute. 
                    // 		<input type='checkbox' can-value='sex' can-true-value='male' can-false-value='female' />
                    if (can.attr.has(el, "can-true-value")) {
                        trueValue = el.getAttribute("can-true-value");
                    } else {
                        trueValue = true;
                    }
                    if (can.attr.has(el, "can-false-value")) {
                        falseValue = el.getAttribute("can-false-value");
                    } else {
                        falseValue = false;
                    }
                }

                if (el.type === "checkbox" || el.type === "radio") {
                    // For checkboxes and radio buttons, create a Checked can.Control around the input.  Pass in 
                    // the compute representing the can-value and can-true-value and can-false-value properties (if 
                    // they were used).
                    new Checked(el, {
                            value: value,
                            trueValue: trueValue,
                            falseValue: falseValue
                        });
                    return;
                }
            }
            if (el.nodeName.toLowerCase() === "select" && el.multiple) {
                // For multiselect enabled select inputs, we instantiate a special control around that select element 
                // called Multiselect
                new Multiselect(el, {
                        value: value
                    });
                return;
            }
            // For contenteditable elements, we instantiate a Content control.
            if (isContentEditable(el)) {
                new Content(el, {
                        value: value
                    });
                return;
            }
            // The default case. Instantiate the Value control around the element. Pass it the compute representing 
            // the observable attribute property that was set.
            new Value(el, {
                    value: value
                });
        });

        // ## Special Event Types (can-SPECIAL)

        // A special object, similar to [$.event.special](http://benalman.com/news/2010/03/jquery-special-events/), 
        // for adding hooks for special can-SPECIAL types (not native DOM events). Right now, only can-enter is 
        // supported, but this object might be exported so that it can be added to easily.
        // To implement a can-SPECIAL event type, add a property to the special object, whose value is a function 
        // that returns the following: 
        //		// the real event name to bind to
        //		event: "event-name",
        //		handler: function (ev) {
        //			// some logic that figures out if the original handler should be called or not, and if so...
        //			return original.call(this, ev);
        //		}
        var special = {
            enter: function(data, el, original) {
                return {
                    event: "keyup",
                    handler: function(ev) {
                        if (ev.keyCode === 13) {
                            return original.call(this, ev);
                        }
                    }
                };
            }
        };

        // ## can-EVENT
        // The following section contains code for implementing the can-EVENT attribute. 
        // This binds on a wildcard attribute name. Whenever a view is being processed 
        // and can-xxx (anything starting with can-), this callback will be run.  Inside, its setting up an event handler 
        // that calls a method identified by the value of this attribute.
        can.view.attr(/can-[\w\.]+/, function(el, data) {

            // the attribute name is the function to call
            var attributeName = data.attributeName,
                // The event type to bind on is deteremined by whatever is after can-
                // For example, can-submit binds on the submit event.
                event = attributeName.substr("can-".length),
                // This is the method that the event will initially trigger. It will look up the method by the string name 
                // passed in the attribute and call it.
                handler = function(ev) {
                    // The attribute value, representing the name of the method to call (i.e. can-submit="foo" foo is the 
                    // name of the method)
                    var attr = removeCurly(el.getAttribute(attributeName)),
                        scopeData = data.scope.read(attr, {
                                returnObserveMethods: true,
                                isArgument: true
                            });
                    return scopeData.value.call(scopeData.parent, data.scope._context, can.$(this), ev);
                };

            // This code adds support for special event types, like can-enter="foo". special.enter (or any special[event]) is 
            // a function that returns an object containing an event and a handler. These are to be used for binding. For example, 
            // when a user adds a can-enter attribute, we'll bind on the keyup event, and the handler performs special logic to 
            // determine on keyup if the enter key was pressed.
            if (special[event]) {
                var specialData = special[event](data, el, handler);
                handler = specialData.handler;
                event = specialData.event;
            }
            // Bind the handler defined above to the element we're currently processing and the event name provided in this 
            // attribute name (can-click="foo")
            can.bind.call(el, event, handler);
        });

        // ## Two way binding can.Controls
        // Each type of input that is supported by view/bindings is wrapped with a special can.Control.  The control serves 
        // two functions: 
        // 1. Bind on the property changing (the compute we're two-way binding to) and change the input value.
        // 2. Bind on the input changing and change the property (compute) we're two-way binding to.
        // There is one control per input type. There could easily be more for more advanced input types, like the HTML5 type="date" input type.

        // ### Value 
        // A can.Control that manages the two-way bindings on most inputs.  When can-value is found as an attribute 
        // on an input, the callback above instantiates this Value control on the input element.
        var Value = can.Control.extend({
                init: function() {
                    // Handle selects by calling `set` after this thread so the rest of the element can finish rendering.
                    if (this.element[0].nodeName.toUpperCase() === "SELECT") {
                        setTimeout(can.proxy(this.set, this), 1);
                    } else {
                        this.set();
                    }

                },
                // If the live bound data changes, call set to reflect the change in the dom.
                "{value} change": "set",
                set: function() {
                    // This may happen in some edgecases, esp. with selects that are not in DOM after the timeout has fired
                    if (!this.element) {
                        return;
                    }
                    var val = this.options.value();
                    // Set the element's value to match the attribute that was passed in
                    this.element[0].value = (val == null ? '' : val);
                },
                // If the input value changes, this will set the live bound data to reflect the change.
                "change": function() {
                    // This may happen in some edgecases, esp. with selects that are not in DOM after the timeout has fired
                    if (!this.element) {
                        return;
                    }
                    // Set the value of the attribute passed in to reflect what the user typed
                    this.options.value(this.element[0].value);
                }
            }),
            // ### Checked 
            // A can.Control that manages the two-way bindings on a checkbox element.  When can-value is found as an attribute 
            // on a checkbox, the callback above instantiates this Checked control on the checkbox element.
            Checked = can.Control.extend({
                    init: function() {
                        // If its not a checkbox, its a radio input
                        this.isCheckbox = (this.element[0].type.toLowerCase() === "checkbox");
                        this.check();
                    },
                    // `value` is the compute representing the can-value for this element.  For example can-value="foo" and current 
                    // scope is someObj, value is the compute representing someObj.attr('foo')
                    "{value} change": "check",
                    check: function() {
                        // jshint eqeqeq: false
                        if (this.isCheckbox) {
                            var value = this.options.value(),
                                trueValue = this.options.trueValue || true;
                            // If `can-true-value` attribute was set, check if the value is equal to that string value, and set 
                            // the checked property based on their equality.
                            this.element[0].checked = (value === trueValue);
                        }
                        // Its a radio input type
                        else {
                            var setOrRemove = this.options.value() == this.element[0].value ?
                                "set" : "remove";

                            can.attr[setOrRemove](this.element[0], 'checked', true);

                        }

                    },
                    // This event is triggered by the DOM.  If a change event occurs, we must set the value of the compute (options.value).
                    "change": function() {

                        if (this.isCheckbox) {
                            // If the checkbox is checked and can-true-value was used, set value to the string value of can-true-value.  If 
                            // can-false-value was used and checked is false, set value to the string value of can-false-value.
                            this.options.value(this.element[0].checked ? this.options.trueValue : this.options.falseValue);
                        }
                        // Radio input type
                        else {
                            if (this.element[0].checked) {
                                this.options.value(this.element[0].value);
                            }
                        }

                    }
                }),
            // ### Multiselect
            // A can.Control that handles select input with the "multiple" attribute (meaning more than one can be selected at once). 
            Multiselect = Value.extend({
                    init: function() {
                        this.delimiter = ";";
                        this.set();
                    },
                    // Since this control extends Value (above), the set method will be called when the value compute changes (and on init).
                    set: function() {

                        var newVal = this.options.value();

                        // When given a string, try to extract all the options from it (i.e. "a;b;c;d")
                        if (typeof newVal === 'string') {
                            newVal = newVal.split(this.delimiter);
                            this.isString = true;
                        }
                        // When given something else, try to make it an array and deal with it
                        else if (newVal) {
                            newVal = can.makeArray(newVal);
                        }

                        // Make an object containing all the options passed in for convenient lookup
                        var isSelected = {};
                        can.each(newVal, function(val) {
                            isSelected[val] = true;
                        });

                        // Go through each &lt;option/&gt; element, if it has a value property (its a valid option), then 
                        // set its selected property if it was in the list of vals that were just set.
                        can.each(this.element[0].childNodes, function(option) {
                            if (option.value) {
                                option.selected = !! isSelected[option.value];
                            }

                        });

                    },
                    // A helper function used by the 'change' handler below. Its purpose is to return an array of selected 
                    // values, like ["foo", "bar"]
                    get: function() {
                        var values = [],
                            children = this.element[0].childNodes;

                        can.each(children, function(child) {
                            if (child.selected && child.value) {
                                values.push(child.value);
                            }
                        });

                        return values;
                    },
                    // Called when the user changes this input in any way.
                    'change': function() {
                        // Get an array of the currently selected values
                        var value = this.get(),
                            currentValue = this.options.value();

                        // If the compute is a string, set its value to the joined version of the values array (i.e. "foo;bar")
                        if (this.isString || typeof currentValue === "string") {
                            this.isString = true;
                            this.options.value(value.join(this.delimiter));
                        }
                        // If the compute is a can.List, replace its current contents with the new array of values
                        else if (currentValue instanceof can.List) {
                            currentValue.attr(value, true);
                        }
                        // Otherwise set the value to the array of values selected in the input.
                        else {
                            this.options.value(value);
                        }

                    }
                }),
            Content = can.Control.extend({
                    init: function() {
                        this.set();
                        this.on("blur", "setValue");
                    },
                    "{value} change": "set",
                    set: function() {
                        var val = this.options.value();
                        this.element[0].innerHTML = (typeof val === 'undefined' ? '' : val);
                    },
                    setValue: function() {
                        this.options.value(this.element[0].innerHTML);
                    }
                });

    })(__m2, __m21, __m11);

    // ## component/component.js
    var __m1 = (function(can, viewCallbacks) {
        // ## Helpers
        // Attribute names to ignore for setting scope values.
        var ignoreAttributesRegExp = /^(dataViewId|class|id)$/i,
            paramReplacer = /\{([^\}]+)\}/g;


        var Component = can.Component = can.Construct.extend(

            // ## Static


            {
                // ### setup
                // When a component is extended, this sets up the component's internal constructor
                // functions and templates for later fast initialization.
                setup: function() {
                    can.Construct.setup.apply(this, arguments);

                    // When `can.Component.setup` function is ran for the first time, `can.Component` doesn't exist yet 
                    // which ensures that the following code is ran only in constructors that extend `can.Component`. 
                    if (can.Component) {
                        var self = this,
                            scope = this.prototype.scope;

                        // Define a control using the `events` prototype property.
                        this.Control = ComponentControl.extend(this.prototype.events);

                        // Look to convert `scope` to a Map constructor function.
                        if (!scope || (typeof scope === "object" && !(scope instanceof can.Map))) {
                            // If scope is an object, use that object as the prototype of an extended 
                            // Map constructor function.
                            // A new instance of that Map constructor function will be created and
                            // set a the constructor instance's scope.
                            this.Map = can.Map.extend(scope || {});
                        } else if (scope.prototype instanceof can.Map) {
                            // If scope is a can.Map constructor function, just use that.
                            this.Map = scope;
                        }

                        // Look for default `@` values. If a `@` is found, these
                        // attributes string values will be set and 2-way bound on the
                        // component instance's scope.
                        this.attributeScopeMappings = {};
                        can.each(this.Map ? this.Map.defaults : {}, function(val, prop) {
                            if (val === "@") {
                                self.attributeScopeMappings[prop] = prop;
                            }
                        });

                        // Convert the template into a renderer function.
                        if (this.prototype.template) {
                            // If `this.prototype.template` is a function create renderer from it by
                            // wrapping it with the anonymous function that will pass it the arguments,
                            // otherwise create the render from the string
                            if (typeof this.prototype.template === "function") {
                                var temp = this.prototype.template;
                                this.renderer = function() {
                                    return can.view.frag(temp.apply(null, arguments));
                                };
                            } else {
                                this.renderer = can.view.mustache(this.prototype.template);
                            }
                        }

                        // Register this component to be created when its `tag` is found.
                        can.view.tag(this.prototype.tag, function(el, options) {
                            new self(el, options);
                        });
                    }

                }
            }, {
                // ## Prototype

                // ### setup
                // When a new component instance is created, setup bindings, render the template, etc.
                setup: function(el, hookupOptions) {
                    // Setup values passed to component
                    var initalScopeData = {},
                        component = this,
                        twoWayBindings = {},
                        // what scope property is currently updating
                        scopePropertyUpdating,
                        // the object added to the scope
                        componentScope,
                        frag;

                    // ## Scope

                    // Add scope prototype properties marked with an "@" to the `initialScopeData` object
                    can.each(this.constructor.attributeScopeMappings, function(val, prop) {
                        initalScopeData[prop] = el.getAttribute(can.hyphenate(val));
                    });

                    // Get the value in the scope for each attribute
                    // the hookup should probably happen after?
                    can.each(can.makeArray(el.attributes), function(node, index) {
                        var name = can.camelize(node.nodeName.toLowerCase()),
                            value = node.value;



                        // Ignore attributes already present in the ScopeMappings.
                        if (component.constructor.attributeScopeMappings[name] || ignoreAttributesRegExp.test(name) || viewCallbacks.attr(node.nodeName)) {
                            return;
                        }
                        // Only setup bindings if attribute looks like `foo="{bar}"`
                        if (value[0] === "{" && value[value.length - 1] === "}") {
                            value = value.substr(1, value.length - 2);
                        } else {
                            // Legacy template types will crossbind "foo=bar"
                            if (hookupOptions.templateType !== "legacy") {
                                initalScopeData[name] = value;
                                return;
                            }
                        }
                        // Cross-bind the value in the scope to this 
                        // component's scope
                        var computeData = hookupOptions.scope.computeData(value, {
                                args: []
                            }),
                            compute = computeData.compute;

                        // bind on this, check it's value, if it has dependencies
                        var handler = function(ev, newVal) {
                            scopePropertyUpdating = name;
                            componentScope.attr(name, newVal);
                            scopePropertyUpdating = null;
                        };

                        // Compute only returned if bindable
                        compute.bind("change", handler);

                        // Set the value to be added to the scope
                        initalScopeData[name] = compute();

                        // We don't need to listen to the compute `change` if it doesn't have any dependencies
                        if (!compute.hasDependencies) {
                            compute.unbind("change", handler);
                        } else {
                            // Make sure we unbind (there's faster ways of doing this)
                            can.bind.call(el, "removed", function() {
                                compute.unbind("change", handler);
                            });
                            // Setup the two-way binding
                            twoWayBindings[name] = computeData;
                        }

                    });
                    if (this.constructor.Map) {
                        // If `Map` property is set on the constructor use it to wrap the `initialScopeData`
                        componentScope = new this.constructor.Map(initalScopeData);
                    } else if (this.scope instanceof can.Map) {
                        // If `this.scope` is instance of `can.Map` assign it to the `componentScope`
                        componentScope = this.scope;
                    } else if (can.isFunction(this.scope)) {
                        // If `this.scope` is a function, call the function and 
                        var scopeResult = this.scope(initalScopeData, hookupOptions.scope, el);

                        if (scopeResult instanceof can.Map) {
                            // If the function returns a can.Map, use that as the scope
                            componentScope = scopeResult;
                        } else if (scopeResult.prototype instanceof can.Map) {
                            // If `scopeResult` is of a `can.Map` type, use it to wrap the `initialScopeData`
                            componentScope = new scopeResult(initalScopeData);
                        } else {
                            // Otherwise extend `can.Map` with the `scopeResult` and initialize it with the `initialScopeData`
                            componentScope = new(can.Map.extend(scopeResult))(initalScopeData);
                        }

                    }

                    // ## Two way bindings

                    // Object to hold the bind handlers so we can tear them down
                    var handlers = {};
                    // Setup reverse bindings
                    can.each(twoWayBindings, function(computeData, prop) {
                        handlers[prop] = function(ev, newVal) {
                            // Check that this property is not being changed because
                            // it's source value just changed
                            if (scopePropertyUpdating !== prop) {
                                computeData.compute(newVal);
                            }
                        };
                        componentScope.bind(prop, handlers[prop]);
                    });
                    // Teardown reverse bindings when the element is removed
                    can.bind.call(el, "removed", function() {
                        can.each(handlers, function(handler, prop) {
                            componentScope.unbind(prop, handlers[prop]);
                        });
                    });
                    // Setup the attributes bindings
                    if (!can.isEmptyObject(this.constructor.attributeScopeMappings) || hookupOptions.templateType !== "legacy") {
                        // Bind on the `attributes` event and update the scope.
                        can.bind.call(el, "attributes", function(ev) {
                            // Convert attribute name from the `attribute-name` to the `attributeName` format.
                            var camelized = can.camelize(ev.attributeName);
                            if (!twoWayBindings[camelized]) {
                                // If there is a mapping for this attribute, update the `componentScope` attribute
                                componentScope.attr(camelized, el.getAttribute(ev.attributeName));
                            }
                        });

                    }

                    // Set `componentScope` to `this.scope` and set it to the element's `data` object as a `scope` property
                    this.scope = componentScope;
                    can.data(can.$(el), "scope", this.scope);

                    // Create a real Scope object out of the scope property
                    var renderedScope = hookupOptions.scope.add(this.scope),
                        options = {
                            helpers: {}
                        };

                    // ## Helpers

                    // Setup helpers to callback with `this` as the component
                    can.each(this.helpers || {}, function(val, prop) {
                        if (can.isFunction(val)) {
                            options.helpers[prop] = function() {
                                return val.apply(componentScope, arguments);
                            };
                        }
                    });

                    // ## `events` control

                    // Create a control to listen to events
                    this._control = new this.constructor.Control(el, {
                            // Pass the scope to the control so we can listen to it's changes from the controller.
                            scope: this.scope
                        });

                    // ## Rendering

                    // If this component has a template (that we've already converted to a renderer)
                    if (this.constructor.renderer) {
                        // If `options.tags` doesn't exist set it to an empty object.
                        if (!options.tags) {
                            options.tags = {};
                        }

                        // We need be alerted to when a <content> element is rendered so we can put the original contents of the widget in its place
                        options.tags.content = function contentHookup(el, rendererOptions) {
                            // First check if there was content within the custom tag
                            // otherwise, render what was within <content>, the default code
                            var subtemplate = hookupOptions.subtemplate || rendererOptions.subtemplate;

                            if (subtemplate) {

                                // `rendererOptions.options` is a scope of helpers where `<content>` was found, so
                                // the right helpers should already be available.
                                // However, `_tags.content` is going to point to this current content callback.  We need to 
                                // remove that so it will walk up the chain

                                delete options.tags.content;

                                can.view.live.replace([el], subtemplate(
                                        // This is the context of where `<content>` was found
                                        // which will have the the component's context
                                        rendererOptions.scope,

                                        rendererOptions.options));

                                // Restore the content tag so it could potentially be used again (as in lists)
                                options.tags.content = contentHookup;
                            }
                        };
                        // Render the component's template
                        frag = this.constructor.renderer(renderedScope, hookupOptions.options.add(options));
                    } else {
                        // Otherwise render the contents between the 
                        if (hookupOptions.templateType === "legacy") {
                            frag = can.view.frag(hookupOptions.subtemplate ? hookupOptions.subtemplate(renderedScope, hookupOptions.options.add(options)) : "");
                        } else {
                            frag = hookupOptions.subtemplate ? hookupOptions.subtemplate(renderedScope, hookupOptions.options.add(options)) : document.createDocumentFragment();
                        }

                    }
                    // Append the resulting document fragment to the element
                    can.appendChild(el, frag);
                }
            });

        var ComponentControl = can.Control.extend({
                // Change lookup to first look in the scope.
                _lookup: function(options) {
                    return [options.scope, options, window];
                },
                _action: function(methodName, options, controlInstance) {
                    var hasObjectLookup, readyCompute;

                    paramReplacer.lastIndex = 0;

                    hasObjectLookup = paramReplacer.test(methodName);

                    // If we don't have options (a `control` instance), we'll run this 
                    // later.
                    if (!controlInstance && hasObjectLookup) {
                        return;
                    } else if (!hasObjectLookup) {
                        return can.Control._action.apply(this, arguments);
                    } else {
                        // We have `hasObjectLookup` and `controlInstance`.

                        readyCompute = can.compute(function() {
                            var delegate;

                            // Set the delegate target and get the name of the event we're listening to.
                            var name = methodName.replace(paramReplacer, function(matched, key) {
                                var value;

                                // If we are listening directly on the `scope` set it as a delegate target.
                                if (key === "scope") {
                                    delegate = options.scope;
                                    return "";
                                }

                                // Remove `scope.` from the start of the key and read the value from the `scope`.
                                key = key.replace(/^scope\./, "");
                                value = can.compute.read(options.scope, key.split("."), {
                                        isArgument: true
                                    }).value;

                                // If `value` is undefined use `can.getObject` to get the value.
                                if (value === undefined) {
                                    value = can.getObject(key);
                                }

                                // If `value` is a string we just return it, otherwise we set it as a delegate target.
                                if (typeof value === "string") {
                                    return value;
                                } else {
                                    delegate = value;
                                    return "";
                                }

                            });

                            // Get the name of the `event` we're listening to.
                            var parts = name.split(/\s+/g),
                                event = parts.pop();

                            // Return everything needed to handle the event we're listening to.
                            return {
                                processor: this.processors[event] || this.processors.click,
                                parts: [name, parts.join(" "), event],
                                delegate: delegate || undefined
                            };

                        }, this);

                        // Create a handler function that we'll use to handle the `change` event on the `readyCompute`.
                        var handler = function(ev, ready) {
                            controlInstance._bindings.control[methodName](controlInstance.element);
                            controlInstance._bindings.control[methodName] = ready.processor(
                                ready.delegate || controlInstance.element,
                                ready.parts[2], ready.parts[1], methodName, controlInstance);
                        };

                        readyCompute.bind("change", handler);

                        controlInstance._bindings.readyComputes[methodName] = {
                            compute: readyCompute,
                            handler: handler
                        };

                        return readyCompute();
                    }
                }
            },
            // Extend `events` with a setup method that listens to changes in `scope` and
            // rebinds all templated event handlers.
            {
                setup: function(el, options) {
                    this.scope = options.scope;
                    return can.Control.prototype.setup.call(this, el, options);
                },
                off: function() {
                    // If `this._bindings` exists we need to go through it's `readyComputes` and manually
                    // unbind `change` event listeners set by the controller.
                    if (this._bindings) {
                        can.each(this._bindings.readyComputes || {}, function(value) {
                            value.compute.unbind("change", value.handler);
                        });
                    }
                    // Call `can.Control.prototype.off` function on this instance to cleanup the bindings.
                    can.Control.prototype.off.apply(this, arguments);
                    this._bindings.readyComputes = {};
                }
            });

        // If there is a `$` object and it has the `fn` object, create the `scope` plugin that returns
        // the scope object
        if (window.$ && $.fn) {
            $.fn.scope = function(attr) {
                // If `attr` is passed to the `scope` plugin return the value of that 
                // attribute on the `scope` object, otherwise return the whole scope
                if (attr) {
                    return this.data("scope")
                        .attr(attr);
                } else {
                    return this.data("scope");
                }
            };
        }

        // Define the `can.scope` function that can be used to retrieve the `scope` from the element
        can.scope = function(el, attr) {
            el = can.$(el);
            // If `attr` is passed to the `can.scope` function return the value of that
            // attribute on the `scope` object otherwise return the whole scope
            if (attr) {
                return can.data(el, "scope")
                    .attr(attr);
            } else {
                return can.data(el, "scope");
            }
        };

        return Component;
    })(__m2, __m9, __m11, __m14, __m21, __m29);

    // ## model/model.js
    var __m30 = (function(can) {

        // ## model.js
        // (Don't steal this file directly in your code.)

        // ## pipe
        // `pipe` lets you pipe the results of a successful deferred
        // through a function before resolving the deferred.

        var pipe = function(def, thisArg, func) {
            // The piped result will be available through a new Deferred.
            var d = new can.Deferred();
            def.then(function() {
                var args = can.makeArray(arguments),
                    success = true;

                try {
                    // Pipe the results through the function.
                    args[0] = func.apply(thisArg, args);
                } catch (e) {
                    success = false;
                    // The function threw an error, so reject the Deferred.
                    d.rejectWith(d, [e].concat(args));
                }
                if (success) {
                    // Resolve the new Deferred with the piped value.
                    d.resolveWith(d, args);
                }
            }, function() {
                // Pass on the rejection if the original Deferred never resolved.
                d.rejectWith(this, arguments);
            });

            // `can.ajax` returns a Deferred with an abort method to halt the AJAX call.
            if (typeof def.abort === 'function') {
                d.abort = function() {
                    return def.abort();
                };
            }

            // Return the new (piped) Deferred.
            return d;
        },

            // ## modelNum
            // When new model constructors are set up without a full name,
            // `modelNum` lets us name them uniquely (to keep track of them).
            modelNum = 0,

            // ## getId
            getId = function(inst) {
                // `can.__reading` makes a note that `id` was just read.
                can.__reading(inst, inst.constructor.id);
                // Use `__get` instead of `attr` for performance. (But that means we have to remember to call `can.__reading`.)
                return inst.__get(inst.constructor.id);
            },

            // ## ajax
            // This helper method makes it easier to make an AJAX call from the configuration of the Model.
            ajax = function(ajaxOb, data, type, dataType, success, error) {

                var params = {};

                // A string here would be something like `"GET /endpoint"`.
                if (typeof ajaxOb === 'string') {
                    // Split on spaces to separate the HTTP method and the URL.
                    var parts = ajaxOb.split(/\s+/);
                    params.url = parts.pop();
                    if (parts.length) {
                        params.type = parts.pop();
                    }
                } else {
                    // If the first argument is an object, just load it into `params`.
                    can.extend(params, ajaxOb);
                }

                // If the `data` argument is a plain object, copy it into `params`.
                params.data = typeof data === "object" && !can.isArray(data) ?
                    can.extend(params.data || {}, data) : data;

                // Substitute in data for any templated parts of the URL.
                params.url = can.sub(params.url, params.data, true);

                return can.ajax(can.extend({
                            type: type || 'post',
                            dataType: dataType || 'json',
                            success: success,
                            error: error
                        }, params));
            },

            // ## makeRequest
            // This function abstracts making the actual AJAX request away from the Model.
            makeRequest = function(modelObj, type, success, error, method) {
                var args;

                // If `modelObj` is an Array, it it means we are coming from
                // the queued request, and we're passing already-serialized data.
                if (can.isArray(modelObj)) {
                    // In that case, modelObj's signature will be `[modelObj, serializedData]`, so we need to unpack it.
                    args = modelObj[1];
                    modelObj = modelObj[0];
                } else {
                    // If we aren't supplied with serialized data, we'll make our own.
                    args = modelObj.serialize();
                }
                args = [args];

                var deferred,
                    model = modelObj.constructor,
                    jqXHR;

                // When calling `update` and `destroy`, the current ID needs to be the first parameter in the AJAX call.
                if (type === 'update' || type === 'destroy') {
                    args.unshift(getId(modelObj));
                }
                jqXHR = model[type].apply(model, args);

                // Make sure that can.Model can react to the request before anything else does.
                deferred = pipe(jqXHR, modelObj, function(data) {
                    // `method` is here because `"destroyed" !== "destroy" + "d"`.
                    // TODO: Do something smarter/more consistent here?
                    modelObj[method || type + "d"](data, jqXHR);
                    return modelObj;
                });

                // Hook up `abort`
                if (jqXHR.abort) {
                    deferred.abort = function() {
                        jqXHR.abort();
                    };
                }

                deferred.then(success, error);
                return deferred;
            },

            initializers = {
                // ## models
                // Returns a function that, when handed a list of objects, makes them into models and returns a model list of them.
                // `prop` is the property on `instancesRawData` that has the array of objects in it (if it's not `data`).
                models: function(prop) {
                    return function(instancesRawData, oldList) {
                        // Increment reqs counter so new instances will be added to the store.
                        // (This is cleaned up at the end of the method.)
                        can.Model._reqs++;

                        // If there is no data, we can't really do anything with it.
                        if (!instancesRawData) {
                            return;
                        }

                        // If the "raw" data is already a List, it's not raw.
                        if (instancesRawData instanceof this.List) {
                            return instancesRawData;
                        }

                        var self = this,
                            // `tmp` will hold the models before we push them onto `modelList`.
                            tmp = [],
                            // `ML` (see way below) is just `can.Model.List`.
                            ListClass = self.List || ML,
                            modelList = oldList instanceof can.List ? oldList : new ListClass(),

                            // Check if we were handed an Array or a model list.
                            rawDataIsArray = can.isArray(instancesRawData),
                            rawDataIsList = instancesRawData instanceof ML,

                            // Get the "plain" objects from the models from the list/array.
                            raw = rawDataIsArray ? instancesRawData : (
                                rawDataIsList ? instancesRawData.serialize() : can.getObject(prop || "data", instancesRawData));

                        if (typeof raw === 'undefined') {
                            throw new Error('Could not get any raw data while converting using .models');
                        }



                        // If there was anything left in the list we were given, get rid of it.
                        if (modelList.length) {
                            modelList.splice(0);
                        }

                        // If we pushed these directly onto the list, it would cause a change event for each model.
                        // So, we push them onto `tmp` first and then push everything at once, causing one atomic change event that contains all the models at once.
                        can.each(raw, function(rawPart) {
                            tmp.push(self.model(rawPart));
                        });
                        modelList.push.apply(modelList, tmp);

                        // If there was other stuff on `instancesRawData`, let's transfer that onto `modelList` too.
                        if (!rawDataIsArray) {
                            can.each(instancesRawData, function(val, prop) {
                                if (prop !== 'data') {
                                    modelList.attr(prop, val);
                                }
                            });
                        }
                        // Clean up the store on the next turn of the event loop. (`this` is a model constructor.)
                        setTimeout(can.proxy(this._clean, this), 1);
                        return modelList;
                    };
                },
                // ## model
                // Returns a function that, when handed a plain object, turns it into a model.
                // `prop` is the property on `attributes` that has the properties for the model in it.
                model: function(prop) {
                    return function(attributes) {
                        // If there're no properties, there can be no model.
                        if (!attributes) {
                            return;
                        }
                        // If this object knows how to serialize, parse, or access itself, we'll use that instead.
                        if (typeof attributes.serialize === 'function') {
                            attributes = attributes.serialize();
                        }
                        if (this.parseModel) {
                            attributes = this.parseModel.apply(this, arguments);
                        } else if (prop) {
                            attributes = can.getObject(prop || "data", attributes);
                        }

                        var id = attributes[this.id],
                            // 0 is a valid ID.
                            model = (id || id === 0) && this.store[id] ?
                            // If this model is in the store already, just update it.
                            this.store[id].attr(attributes, this.removeAttr || false) :
                            // Otherwise, we need a new model.
                            new this(attributes);

                        return model;
                    };
                }
            },


            parserMaker = function(prop) {
                return function(attributes) {
                    return prop ? can.getObject(prop || "data", attributes) : attributes;
                };
            },

            // ## parsers
            // This object describes how to take the data from an AJAX request and prepare it for `models` and `model`.
            // These functions are meant to be overwritten (if necessary) in an extended model constructor.
            parsers = {

                parseModel: parserMaker,

                parseModels: parserMaker
            },

            // ## ajaxMethods
            // This object describes how to make an AJAX request for each ajax method (`create`, `update`, etc.)
            // Each AJAX method is an object in `ajaxMethods` and can have the following properties:
            // - `url`: Which property on the model contains the default URL for this method.
            // - `type`: The default HTTP request method.
            // - `data`: A method that takes the arguments from `makeRequest` (see above) and returns a data object for use in the AJAX call.


            ajaxMethods = {

                create: {
                    url: "_shortName",
                    type: "post"
                },

                update: {
                    // ## update.data
                    data: function(id, attrs) {
                        attrs = attrs || {};

                        // `this.id` is the property that represents the ID (and is usually `"id"`).
                        var identity = this.id;

                        // If the value of the property being used as the ID changed,
                        // indicate that in the request and replace the current ID property.
                        if (attrs[identity] && attrs[identity] !== id) {
                            attrs["new" + can.capitalize(id)] = attrs[identity];
                            delete attrs[identity];
                        }
                        attrs[identity] = id;

                        return attrs;
                    },
                    type: "put"
                },

                destroy: {
                    type: 'delete',
                    // ## destroy.data
                    data: function(id, attrs) {
                        attrs = attrs || {};
                        // `this.id` is the property that represents the ID (and is usually `"id"`).
                        attrs.id = attrs[this.id] = id;
                        return attrs;
                    }
                },

                findAll: {
                    url: "_shortName"
                },

                findOne: {}
            },
            // ## ajaxMaker
            // Takes a method defined just above and a string that describes how to call that method
            // and makes a function that calls that method with the given data.
            // - `ajaxMethod`: The object defined above in `ajaxMethods`.
            // - `str`: The string the configuration provided (such as `"/recipes.json"` for a `findAll` call).
            ajaxMaker = function(ajaxMethod, str) {
                return function(data) {
                    data = ajaxMethod.data ?
                    // If the AJAX method mentioned above has its own way of getting `data`, use that.
                    ajaxMethod.data.apply(this, arguments) :
                    // Otherwise, just use the data passed in.
                    data;

                    // Make the AJAX call with the URL, data, and type indicated by the proper `ajaxMethod` above.
                    return ajax(str || this[ajaxMethod.url || "_url"], data, ajaxMethod.type || "get");
                };
            },
            // ## createURLFromResource
            // For each of the names (create, update, destroy, findOne, and findAll) use the 
            // URL provided by the `resource` property. For example:
            // 		ToDo = can.Model.extend({
            // 			resource: "/todos"
            // 		}, {});
            // 	Will create a can.Model that is identical to:
            // 		ToDo = can.Model.extend({
            // 			findAll: "GET /todos",
            // 			findOne: "GET /todos/{id}",
            // 			create:  "POST /todos",
            // 			update:  "PUT /todos/{id}",
            // 			destroy: "DELETE /todos/{id}"
            // 		},{});
            // - `model`: the can.Model that has the resource property
            // - `method`: a property from the ajaxMethod object
            createURLFromResource = function(model, name) {
                if (!model.resource) {
                    return;
                }

                var resource = model.resource.replace(/\/+$/, "");
                if (name === "findAll" || name === "create") {
                    return resource;
                } else {
                    return resource + "/{" + model.id + "}";
                }
            };

        // # can.Model
        // A can.Map that connects to a RESTful interface.
        can.Model = can.Map.extend({
                // `fullName` identifies the model type in debugging.
                fullName: "can.Model",
                _reqs: 0,
                // ## can.Model.setup

                setup: function(base, fullName, staticProps, protoProps) {
                    // Assume `fullName` wasn't passed. (`can.Model.extend({ ... }, { ... })`)
                    // This is pretty usual.
                    if (fullName !== "string") {
                        protoProps = staticProps;
                        staticProps = fullName;
                    }
                    // Assume no static properties were passed. (`can.Model.extend({ ... })`)
                    // This is really unusual for a model though, since there's so much configuration.
                    if (!protoProps) {
                        protoProps = staticProps;
                    }

                    // Create the model store here, in case someone wants to use can.Model without inheriting from it.
                    this.store = {};

                    can.Map.setup.apply(this, arguments);
                    if (!can.Model) {
                        return;
                    }

                    // `List` is just a regular can.Model.List that knows what kind of Model it's hooked up to.

                    if (staticProps && staticProps.List) {
                        this.List = staticProps.List;
                        this.List.Map = this;
                    } else {
                        this.List = base.List.extend({
                                Map: this
                            }, {});
                    }

                    var self = this,
                        clean = can.proxy(this._clean, self);

                    // Go through `ajaxMethods` and set up static methods according to their configurations.
                    can.each(ajaxMethods, function(method, name) {
                        // Check the configuration for this ajaxMethod.
                        // If the configuration isn't a function, it should be a string (like `"GET /endpoint"`)
                        // or an object like `{url: "/endpoint", type: 'GET'}`.
                        if (!can.isFunction(self[name])) {
                            // Etiher way, `ajaxMaker` will turn it into a function for us.
                            self[name] = ajaxMaker(method, self[name] ? self[name] : createURLFromResource(self, name));
                        }

                        // There may also be a "maker" function (like `makeFindAll`) that alters the behavior of acting upon models
                        // by changing when and how the function we just made with `ajaxMaker` gets called.
                        // For example, you might cache responses and only make a call when you don't have a cached response.
                        if (self["make" + can.capitalize(name)]) {
                            // Use the "maker" function to make the new "ajaxMethod" function.
                            var newMethod = self["make" + can.capitalize(name)](self[name]);
                            // Replace the "ajaxMethod" function in the configuration with the new one.
                            // (`_overwrite` just overwrites a property in a given Construct.)
                            can.Construct._overwrite(self, base, name, function() {
                                // Increment the numer of requests...
                                can.Model._reqs++;
                                // ...make the AJAX call (and whatever else you're doing)...
                                var def = newMethod.apply(this, arguments);
                                // ...and clean up the store.
                                var then = def.then(clean, clean);
                                // Pass along `abort` so you can still abort the AJAX call.
                                then.abort = def.abort;

                                return then;
                            });
                        }
                    });

                    // Set up the methods that will set up `models` and `model`.
                    can.each(initializers, function(makeInitializer, name) {
                        var parseName = "parse" + can.capitalize(name),
                            dataProperty = self[name];

                        // If there was a different property to find the model's data in than `data`,
                        // make `parseModel` and `parseModels` functions that look that up instead.
                        if (typeof dataProperty === "string") {
                            can.Construct._overwrite(self, base, parseName, parsers[parseName](dataProperty));
                            can.Construct._overwrite(self, base, name, makeInitializer(dataProperty));
                        }

                        // If there was no prototype, or no `model` and no `parseModel`,
                        // we'll have to create a `parseModel`.
                        else if (!protoProps || (!protoProps[name] && !protoProps[parseName])) {
                            can.Construct._overwrite(self, base, parseName, parsers[parseName]());
                        }
                    });

                    // With the overridden parse methods, set up `models` and `model`.
                    can.each(parsers, function(makeParser, name) {
                        // If there was a different property to find the model's data in than `data`,
                        // make `model` and `models` functions that look that up instead.
                        if (typeof self[name] === "string") {
                            can.Construct._overwrite(self, base, name, makeParser(self[name]));
                        }
                    });

                    // Make sure we have a unique name for this Model.
                    if (self.fullName === "can.Model" || !self.fullName) {
                        self.fullName = "Model" + (++modelNum);
                    }

                    can.Model._reqs = 0;
                    this._url = this._shortName + "/{" + this.id + "}";
                },
                _ajax: ajaxMaker,
                _makeRequest: makeRequest,
                // ## can.Model._clean
                // `_clean` cleans up the model store after a request happens.
                _clean: function() {
                    can.Model._reqs--;
                    // Don't clean up unless we have no pending requests.
                    if (!can.Model._reqs) {
                        for (var id in this.store) {
                            // Delete all items in the store without any event bindings.
                            if (!this.store[id]._bindings) {
                                delete this.store[id];
                            }
                        }
                    }
                    return arguments[0];
                },

                models: initializers.models("data"),

                model: initializers.model()
            },


            {
                // ## can.Model#setup
                setup: function(attrs) {
                    // Try to add things as early as possible to the store (#457).
                    // This is the earliest possible moment, even before any properties are set.
                    var id = attrs && attrs[this.constructor.id];
                    if (can.Model._reqs && id != null) {
                        this.constructor.store[id] = this;
                    }
                    can.Map.prototype.setup.apply(this, arguments);
                },
                // ## can.Model#isNew
                // Something is new if its ID is `null` or `undefined`.

                isNew: function() {
                    var id = getId(this);
                    // 0 is a valid ID.
                    // TODO: Why not `return id === null || id === undefined;`?
                    return !(id || id === 0); // If `null` or `undefined`
                },
                // ## can.Model#save
                // `save` calls `create` or `update` as necessary, based on whether a model is new.

                save: function(success, error) {
                    return makeRequest(this, this.isNew() ? 'create' : 'update', success, error);
                },
                // ## can.Model#destroy
                // Acts like can.Map.destroy but it also makes an AJAX call.

                destroy: function(success, error) {
                    // If this model is new, don't make an AJAX call.
                    // Instead, we have to construct the Deferred ourselves and return it.
                    if (this.isNew()) {
                        var self = this;
                        var def = can.Deferred();
                        def.then(success, error);

                        return def.done(function(data) {
                            self.destroyed(data);
                        }).resolve(self);
                    }

                    // If it isn't new, though, go ahead and make a request.
                    return makeRequest(this, 'destroy', success, error, 'destroyed');
                },
                // ## can.Model#bind and can.Model#unbind
                // These aren't actually implemented here, but their setup needs to be changed to account for the store.

                _bindsetup: function() {
                    this.constructor.store[this.__get(this.constructor.id)] = this;
                    return can.Map.prototype._bindsetup.apply(this, arguments);
                },

                _bindteardown: function() {
                    delete this.constructor.store[getId(this)];
                    return can.Map.prototype._bindteardown.apply(this, arguments);
                },
                // Change the behavior of `___set` to account for the store.
                ___set: function(prop, val) {
                    can.Map.prototype.___set.call(this, prop, val);
                    // If we add or change the ID, update the store accordingly.
                    // TODO: shouldn't this also delete the record from the old ID in the store?
                    if (prop === this.constructor.id && this._bindings) {
                        this.constructor.store[getId(this)] = this;
                    }
                }
            });

        // Returns a function that knows how to prepare data from `findAll` or `findOne` calls.
        // `name` should be either `model` or `models`.
        var makeGetterHandler = function(name) {
            var parseName = "parse" + can.capitalize(name);
            return function(data) {
                // If there's a `parse...` function, use its output.
                if (this[parseName]) {
                    data = this[parseName].apply(this, arguments);
                }
                // Run our maybe-parsed data through `model` or `models`.
                return this[name](data);
            };
        },
            // Handle data returned from `create`, `update`, and `destroy` calls.
            createUpdateDestroyHandler = function(data) {
                if (this.parseModel) {
                    return this.parseModel.apply(this, arguments);
                } else {
                    return this.model(data);
                }
            };

        var responseHandlers = {

            makeFindAll: makeGetterHandler("models"),

            makeFindOne: makeGetterHandler("model"),
            makeCreate: createUpdateDestroyHandler,
            makeUpdate: createUpdateDestroyHandler
        };

        // Go through the response handlers and make the actual "make" methods.
        can.each(responseHandlers, function(method, name) {
            can.Model[name] = function(oldMethod) {
                return function() {
                    var args = can.makeArray(arguments),
                        // If args[1] is a function, we were only passed one argument before success and failure callbacks.
                        oldArgs = can.isFunction(args[1]) ? args.splice(0, 1) : args.splice(0, 2),
                        // Call the AJAX method (`findAll` or `update`, etc.) and pipe it through the response handler from above.
                        def = pipe(oldMethod.apply(this, oldArgs), this, method);

                    def.then(args[0], args[1]);
                    return def;
                };
            };
        });

        // ## can.Model.created, can.Model.updated, and can.Model.destroyed
        // Livecycle methods for models.
        can.each([

                "created",

                "updated",

                "destroyed"
            ], function(funcName) {
                // Each of these is pretty much the same, except for the events they trigger.
                can.Model.prototype[funcName] = function(attrs) {
                    var stub,
                        constructor = this.constructor;

                    // Update attributes if attributes have been passed
                    stub = attrs && typeof attrs === 'object' && this.attr(attrs.attr ? attrs.attr() : attrs);

                    // triggers change event that bubble's like
                    // handler( 'change','1.destroyed' ). This is used
                    // to remove items on destroyed from Model Lists.
                    // but there should be a better way.
                    can.trigger(this, "change", funcName);



                    // Call event on the instance's Class
                    can.trigger(constructor, funcName, this);
                };
            });


        // # can.Model.List
        // Model Lists are just like `Map.List`s except that when their items are
        // destroyed, they automatically get removed from the List.
        var ML = can.Model.List = can.List.extend({
                // ## can.Model.List.setup
                // On change or a nested named event, setup change bubbling.
                // On any other type of event, setup "destroyed" bubbling.
                _bubbleRule: function(eventName, list) {
                    return can.List._bubbleRule(eventName, list) || "destroyed";
                }
            }, {
                setup: function(params) {
                    // If there was a plain object passed to the List constructor,
                    // we use those as parameters for an initial findAll.
                    if (can.isPlainObject(params) && !can.isArray(params)) {
                        can.List.prototype.setup.apply(this);
                        this.replace(this.constructor.Map.findAll(params));
                    } else {
                        // Otherwise, set up the list like normal.
                        can.List.prototype.setup.apply(this, arguments);
                    }
                    this._init = 1;
                    this.bind('destroyed', can.proxy(this._destroyed, this));
                    delete this._init;
                },
                _destroyed: function(ev, attr) {
                    if (/\w+/.test(attr)) {
                        var index;
                        while ((index = this.indexOf(ev.target)) > -1) {
                            this.splice(index, 1);
                        }
                    }
                }
            });

        return can.Model;
    })(__m2, __m15, __m19);

    // ## util/string/deparam/deparam.js
    var __m32 = (function(can) {
        // ## deparam.js  
        // `can.deparam`  
        // _Takes a string of name value pairs and returns a Object literal that represents those params._
        var digitTest = /^\d+$/,
            keyBreaker = /([^\[\]]+)|(\[\])/g,
            paramTest = /([^?#]*)(#.*)?$/,
            prep = function(str) {
                return decodeURIComponent(str.replace(/\+/g, ' '));
            };
        can.extend(can, {
                deparam: function(params) {
                    var data = {}, pairs, lastPart;
                    if (params && paramTest.test(params)) {
                        pairs = params.split('&');
                        can.each(pairs, function(pair) {
                            var parts = pair.split('='),
                                key = prep(parts.shift()),
                                value = prep(parts.join('=')),
                                current = data;
                            if (key) {
                                parts = key.match(keyBreaker);
                                for (var j = 0, l = parts.length - 1; j < l; j++) {
                                    if (!current[parts[j]]) {
                                        // If what we are pointing to looks like an `array`
                                        current[parts[j]] = digitTest.test(parts[j + 1]) || parts[j + 1] === '[]' ? [] : {};
                                    }
                                    current = current[parts[j]];
                                }
                                lastPart = parts.pop();
                                if (lastPart === '[]') {
                                    current.push(value);
                                } else {
                                    current[lastPart] = value;
                                }
                            }
                        });
                    }
                    return data;
                }
            });
        return can;
    })(__m2, __m13);

    // ## route/route.js
    var __m31 = (function(can) {

        // ## route.js
        // `can.route`
        // _Helps manage browser history (and client state) by synchronizing the
        // `window.location.hash` with a `can.Map`._
        // Helper methods used for matching routes.
        var
        // `RegExp` used to match route variables of the type ':name'.
        // Any word character or a period is matched.
        matcher = /\:([\w\.]+)/g,
            // Regular expression for identifying &amp;key=value lists.
            paramsMatcher = /^(?:&[^=]+=[^&]*)+/,
            // Converts a JS Object into a list of parameters that can be
            // inserted into an html element tag.
            makeProps = function(props) {
                var tags = [];
                can.each(props, function(val, name) {
                    tags.push((name === 'className' ? 'class' : name) + '="' +
                        (name === "href" ? val : can.esc(val)) + '"');
                });
                return tags.join(" ");
            },
            // Checks if a route matches the data provided. If any route variable
            // is not present in the data, the route does not match. If all route
            // variables are present in the data, the number of matches is returned
            // to allow discerning between general and more specific routes.
            matchesData = function(route, data) {
                var count = 0,
                    i = 0,
                    defaults = {};
                // look at default values, if they match ...
                for (var name in route.defaults) {
                    if (route.defaults[name] === data[name]) {
                        // mark as matched
                        defaults[name] = 1;
                        count++;
                    }
                }
                for (; i < route.names.length; i++) {
                    if (!data.hasOwnProperty(route.names[i])) {
                        return -1;
                    }
                    if (!defaults[route.names[i]]) {
                        count++;
                    }

                }

                return count;
            },
            location = window.location,
            wrapQuote = function(str) {
                return (str + '')
                    .replace(/([.?*+\^$\[\]\\(){}|\-])/g, "\\$1");
            },
            each = can.each,
            extend = can.extend,
            // Helper for convert any object (or value) to stringified object (or value)
            stringify = function(obj) {
                // Object is array, plain object, Map or List
                if (obj && typeof obj === "object") {
                    // Get native object or array from Map or List
                    if (obj instanceof can.Map) {
                        obj = obj.attr();
                        // Clone object to prevent change original values
                    } else {
                        obj = can.isFunction(obj.slice) ? obj.slice() : can.extend({}, obj);
                    }
                    // Convert each object property or array item into stringified new
                    can.each(obj, function(val, prop) {
                        obj[prop] = stringify(val);
                    });
                    // Object supports toString function
                } else if (obj !== undefined && obj !== null && can.isFunction(obj.toString)) {
                    obj = obj.toString();
                }

                return obj;
            },
            removeBackslash = function(str) {
                return str.replace(/\\/g, "");
            },
            // A ~~throttled~~ debounced function called multiple times will only fire once the
            // timer runs down. Each call resets the timer.
            timer,
            // Intermediate storage for `can.route.data`.
            curParams,
            // The last hash caused by a data change
            lastHash,
            // Are data changes pending that haven't yet updated the hash
            changingData,
            // If the `can.route.data` changes, update the hash.
            // Using `.serialize()` retrieves the raw data contained in the `observable`.
            // This function is ~~throttled~~ debounced so it only updates once even if multiple values changed.
            // This might be able to use batchNum and avoid this.
            onRouteDataChange = function(ev, attr, how, newval) {
                // indicate that data is changing
                changingData = 1;
                clearTimeout(timer);
                timer = setTimeout(function() {
                    // indicate that the hash is set to look like the data
                    changingData = 0;
                    var serialized = can.route.data.serialize(),
                        path = can.route.param(serialized, true);
                    can.route._call("setURL", path);

                    lastHash = path;
                }, 10);
            };

        can.route = function(url, defaults) {
            // if route ends with a / and url starts with a /, remove the leading / of the url
            var root = can.route._call("root");

            if (root.lastIndexOf("/") === root.length - 1 &&
                url.indexOf("/") === 0) {
                url = url.substr(1);
            }

            defaults = defaults || {};
            // Extract the variable names and replace with `RegExp` that will match
            // an atual URL with values.
            var names = [],
                res,
                test = "",
                lastIndex = matcher.lastIndex = 0,
                next,
                querySeparator = can.route._call("querySeparator");

            // res will be something like [":foo","foo"]
            while (res = matcher.exec(url)) {
                names.push(res[1]);
                test += removeBackslash(url.substring(lastIndex, matcher.lastIndex - res[0].length));
                next = "\\" + (removeBackslash(url.substr(matcher.lastIndex, 1)) || querySeparator);
                // a name without a default value HAS to have a value
                // a name that has a default value can be empty
                // The `\\` is for string-escaping giving single `\` for `RegExp` escaping.
                test += "([^" + next + "]" + (defaults[res[1]] ? "*" : "+") + ")";
                lastIndex = matcher.lastIndex;
            }
            test += url.substr(lastIndex)
                .replace("\\", "");
            // Add route in a form that can be easily figured out.
            can.route.routes[url] = {
                // A regular expression that will match the route when variable values
                // are present; i.e. for `:page/:type` the `RegExp` is `/([\w\.]*)/([\w\.]*)/` which
                // will match for any value of `:page` and `:type` (word chars or period).
                test: new RegExp("^" + test + "($|" + wrapQuote(querySeparator) + ")"),
                // The original URL, same as the index for this entry in routes.
                route: url,
                // An `array` of all the variable names in this route.
                names: names,
                // Default values provided for the variables.
                defaults: defaults,
                // The number of parts in the URL separated by `/`.
                length: url.split('/')
                    .length
            };
            return can.route;
        };


        extend(can.route, {


                param: function(data, _setRoute) {
                    // Check if the provided data keys match the names in any routes;
                    // Get the one with the most matches.
                    var route,
                        // Need to have at least 1 match.
                        matches = 0,
                        matchCount,
                        routeName = data.route,
                        propCount = 0;

                    delete data.route;

                    each(data, function() {
                        propCount++;
                    });
                    // Otherwise find route.
                    each(can.route.routes, function(temp, name) {
                        // best route is the first with all defaults matching

                        matchCount = matchesData(temp, data);
                        if (matchCount > matches) {
                            route = temp;
                            matches = matchCount;
                        }
                        if (matchCount >= propCount) {
                            return false;
                        }
                    });
                    // If we have a route name in our `can.route` data, and it's
                    // just as good as what currently matches, use that
                    if (can.route.routes[routeName] && matchesData(can.route.routes[routeName], data) === matches) {
                        route = can.route.routes[routeName];
                    }
                    // If this is match...
                    if (route) {
                        var cpy = extend({}, data),
                            // Create the url by replacing the var names with the provided data.
                            // If the default value is found an empty string is inserted.
                            res = route.route.replace(matcher, function(whole, name) {
                                delete cpy[name];
                                return data[name] === route.defaults[name] ? "" : encodeURIComponent(data[name]);
                            })
                                .replace("\\", ""),
                            after;
                        // Remove matching default values
                        each(route.defaults, function(val, name) {
                            if (cpy[name] === val) {
                                delete cpy[name];
                            }
                        });

                        // The remaining elements of data are added as
                        // `&amp;` separated parameters to the url.
                        after = can.param(cpy);
                        // if we are paraming for setting the hash
                        // we also want to make sure the route value is updated
                        if (_setRoute) {
                            can.route.attr('route', route.route);
                        }
                        return res + (after ? can.route._call("querySeparator") + after : "");
                    }
                    // If no route was found, there is no hash URL, only paramters.
                    return can.isEmptyObject(data) ? "" : can.route._call("querySeparator") + can.param(data);
                },

                deparam: function(url) {

                    // remove the url
                    var root = can.route._call("root");
                    if (root.lastIndexOf("/") === root.length - 1 &&
                        url.indexOf("/") === 0) {
                        url = url.substr(1);
                    }

                    // See if the url matches any routes by testing it against the `route.test` `RegExp`.
                    // By comparing the URL length the most specialized route that matches is used.
                    var route = {
                        length: -1
                    },
                        querySeparator = can.route._call("querySeparator"),
                        paramsMatcher = can.route._call("paramsMatcher");

                    each(can.route.routes, function(temp, name) {
                        if (temp.test.test(url) && temp.length > route.length) {
                            route = temp;
                        }
                    });
                    // If a route was matched.
                    if (route.length > -1) {

                        var // Since `RegExp` backreferences are used in `route.test` (parens)
                        // the parts will contain the full matched string and each variable (back-referenced) value.
                        parts = url.match(route.test),
                            // Start will contain the full matched string; parts contain the variable values.
                            start = parts.shift(),
                            // The remainder will be the `&amp;key=value` list at the end of the URL.
                            remainder = url.substr(start.length - (parts[parts.length - 1] === querySeparator ? 1 : 0)),
                            // If there is a remainder and it contains a `&amp;key=value` list deparam it.
                            obj = (remainder && paramsMatcher.test(remainder)) ? can.deparam(remainder.slice(1)) : {};

                        // Add the default values for this route.
                        obj = extend(true, {}, route.defaults, obj);
                        // Overwrite each of the default values in `obj` with those in
                        // parts if that part is not empty.
                        each(parts, function(part, i) {
                            if (part && part !== querySeparator) {
                                obj[route.names[i]] = decodeURIComponent(part);
                            }
                        });
                        obj.route = route.route;
                        return obj;
                    }
                    // If no route was matched, it is parsed as a `&amp;key=value` list.
                    if (url.charAt(0) !== querySeparator) {
                        url = querySeparator + url;
                    }
                    return paramsMatcher.test(url) ? can.deparam(url.slice(1)) : {};
                },

                data: new can.Map({}),
                map: function(data) {
                    var appState;
                    // appState is a can.Map constructor function
                    if (data.prototype instanceof can.Map) {
                        appState = new data();
                    }
                    // appState is an instance of can.Map
                    else {
                        appState = data;
                    }
                    can.route.data = appState;
                },

                routes: {},

                ready: function(val) {
                    if (val !== true) {
                        can.route._setup();
                        can.route.setState();
                    }
                    return can.route;
                },

                url: function(options, merge) {

                    if (merge) {
                        options = can.extend({}, can.route.deparam(can.route._call("matchingPartOfURL")), options);
                    }
                    return can.route._call("root") + can.route.param(options);
                },

                link: function(name, options, props, merge) {
                    return "<a " + makeProps(
                        extend({
                                href: can.route.url(options, merge)
                            }, props)) + ">" + name + "</a>";
                },

                current: function(options) {
                    return this._call("matchingPartOfURL") === can.route.param(options);
                },
                bindings: {
                    hashchange: {
                        paramsMatcher: paramsMatcher,
                        querySeparator: "&",
                        bind: function() {
                            can.bind.call(window, 'hashchange', setState);
                        },
                        unbind: function() {
                            can.unbind.call(window, 'hashchange', setState);
                        },
                        // Gets the part of the url we are determinging the route from.
                        // For hashbased routing, it's everything after the #, for
                        // pushState it's configurable
                        matchingPartOfURL: function() {
                            return location.href.split(/#!?/)[1] || "";
                        },
                        // gets called with the serialized can.route data after a route has changed
                        // returns what the url has been updated to (for matching purposes)
                        setURL: function(path) {
                            location.hash = "#!" + path;
                            return path;
                        },
                        root: "#!"
                    }
                },
                defaultBinding: "hashchange",
                currentBinding: null,
                // ready calls setup
                // setup binds and listens to data changes
                // bind listens to whatever you should be listening to
                // data changes tries to set the path

                // we need to be able to
                // easily kick off calling setState
                // 	teardown whatever is there
                //  turn on a particular binding

                // called when the route is ready
                _setup: function() {
                    if (!can.route.currentBinding) {
                        can.route._call("bind");
                        can.route.bind("change", onRouteDataChange);
                        can.route.currentBinding = can.route.defaultBinding;
                    }
                },
                _teardown: function() {
                    if (can.route.currentBinding) {
                        can.route._call("unbind");
                        can.route.unbind("change", onRouteDataChange);
                        can.route.currentBinding = null;
                    }
                    clearTimeout(timer);
                    changingData = 0;
                },
                // a helper to get stuff from the current or default bindings
                _call: function() {
                    var args = can.makeArray(arguments),
                        prop = args.shift(),
                        binding = can.route.bindings[can.route.currentBinding || can.route.defaultBinding],
                        method = binding[prop];
                    if (method.apply) {
                        return method.apply(binding, args);
                    } else {
                        return method;
                    }
                }
            });

        // The functions in the following list applied to `can.route` (e.g. `can.route.attr('...')`) will
        // instead act on the `can.route.data` observe.
        each(['bind', 'unbind', 'on', 'off', 'delegate', 'undelegate', 'removeAttr', 'compute', '_get', '__get'], function(name) {
            can.route[name] = function() {
                // `delegate` and `undelegate` require
                // the `can/map/delegate` plugin
                if (!can.route.data[name]) {
                    return;
                }

                return can.route.data[name].apply(can.route.data, arguments);
            };
        });

        // Because everything in hashbang is in fact a string this will automaticaly convert new values to string. Works with single value, or deep hashes.
        // Main motivation for this is to prevent double route event call for same value.
        // Example (the problem):
        // When you load page with hashbang like #!&some_number=2 and bind 'some_number' on routes.
        // It will fire event with adding of "2" (string) to 'some_number' property
        // But when you after this set can.route.attr({some_number: 2}) or can.route.attr('some_number', 2). it fires another event with change of 'some_number' from "2" (string) to 2 (integer)
        // This wont happen again with this normalization
        can.route.attr = function(attr, val) {
            var type = typeof attr,
                newArguments;

            // Reading
            if (val === undefined) {
                newArguments = arguments;
                // Sets object
            } else if (type !== "string" && type !== "number") {
                newArguments = [stringify(attr), val];
                // Sets key - value
            } else {
                newArguments = [attr, stringify(val)];
            }

            return can.route.data.attr.apply(can.route.data, newArguments);
        };

        var // Deparameterizes the portion of the hash of interest and assign the
        // values to the `can.route.data` removing existing values no longer in the hash.
        // setState is called typically by hashchange which fires asynchronously
        // So it's possible that someone started changing the data before the
        // hashchange event fired.  For this reason, it will not set the route data
        // if the data is changing or the hash already matches the hash that was set.
        setState = can.route.setState = function() {
            var hash = can.route._call("matchingPartOfURL");
            var oldParams = curParams;
            curParams = can.route.deparam(hash);

            // if the hash data is currently changing, or
            // the hash is what we set it to anyway, do NOT change the hash
            if (!changingData || hash !== lastHash) {
                can.batch.start();
                for (var attr in oldParams) {
                    if (!curParams[attr]) {
                        can.route.removeAttr(attr);
                    }
                }
                can.route.attr(curParams);
                can.batch.stop();
            }
        };

        return can.route;
    })(__m2, __m15, __m19, __m32);

    // ## control/route/route.js
    var __m33 = (function(can) {

        // ## control/route.js
        // _Controller route integration._

        can.Control.processors.route = function(el, event, selector, funcName, controller) {
            selector = selector || "";
            if (!can.route.routes[selector]) {
                if (selector[0] === '/') {
                    selector = selector.substring(1);
                }
                can.route(selector);
            }
            var batchNum,
                check = function(ev, attr, how) {
                    if (can.route.attr('route') === (selector) &&
                        (ev.batchNum === undefined || ev.batchNum !== batchNum)) {

                        batchNum = ev.batchNum;

                        var d = can.route.attr();
                        delete d.route;
                        if (can.isFunction(controller[funcName])) {
                            controller[funcName](d);
                        } else {
                            controller[controller[funcName]](d);
                        }

                    }
                };
            can.route.bind('change', check);
            return function() {
                can.route.unbind('change', check);
            };
        };

        return can;
    })(__m2, __m31, __m11);

    window['can'] = __m4;
})();
(function(define) {
  if (typeof define == "undefined") {
    define = function(deps, fn) {
      can.Model.LocalStorage = fn(can.Model);
    }
  }

  define(['can/model'], function(Model) {
    return Model.extend({
      // Implement local storage handling
      localStore: function(cb) {
        var name = this.name,
          data = JSON.parse(window.localStorage[name] || (window.localStorage[name] = '[]')),
          res = cb.call(this, data);
        if (res !== false) {
          can.each(data, function(todo) {
            delete todo.editing;
          });
          window.localStorage[name] = JSON.stringify(data);
        }
      },

      findAll: function(params) {
        var def = new can.Deferred();
        this.localStore(function(todos) {
          var instances = [],
            self = this;
          can.each(todos, function(todo) {
            instances.push(new self(todo));
          });
          def.resolve({data: instances});
        });
        return def;
      },

      destroy: function(id) {
        var def = new can.Deferred();
        this.localStore(function(todos) {
          for (var i = 0; i < todos.length; i++) {
            if (todos[i].id === id) {
              todos.splice(i, 1);
              break;
            }
          }
          def.resolve({});
        });
        return def;
      },

      create: function(attrs) {
        var def = new can.Deferred();
        this.localStore(function(todos) {
          attrs.id = attrs.id || parseInt(100000 * Math.random(), 10);
          todos.push(attrs);
        });
        def.resolve({id: attrs.id});
        return def;
      },

      update: function(id, attrs) {
        var def = new can.Deferred(), todo;
        this.localStore(function(todos) {
          for (var i = 0; i < todos.length; i++) {
            if (todos[i].id === id) {
              todo = todos[i];
              break;
            }
          }
          can.extend(todo, attrs);
        });
        def.resolve({});
        return def;
      }
    }, {});
  });
})(window.define);

/*global can */
(function (namespace) {
	'use strict';

	// Basic Todo entry model
	var Todo = can.Model.LocalStorage.extend({
    storageName: 'todos-canjs'
	}, {
		init: function () {
			// Autosave when changing the text or completing the todo
			this.on('change', function (ev, prop) {
				if (prop === 'text' || prop === 'complete') {
					ev.target.save();
				}
			});
		}
	});

	// List for Todos
	Todo.List = Todo.List.extend({
		filter: function (check) {
			var list = [];

			this.each(function (todo) {
				if (check(todo)) {
					list.push(todo);
				}
			});

			return list;
		},

		completed: function () {
			return this.filter(function (todo) {
				return todo.attr('complete');
			});
		},

		remaining: function () {
			return this.attr('length') - this.completed().length;
		},

		allComplete: function () {
			return this.attr('length') === this.completed().length;
		}
	});

	namespace.Models = namespace.Models || {};
	namespace.Models.Todo = Todo;
})(this);

/* global can */
(function (namespace) {
	'use strict';

	var ESCAPE_KEY = 27;

	can.Component.extend({
		// Create this component on a tag  like `<todo-app>`.
		tag: 'todo-app',
		scope: {
			// Store the Todo model in the scope
			Todo: namespace.Models.Todo,
			// A list of all Todos retrieved from LocalStorage
			todos: new namespace.Models.Todo.List({}),
			// Edit a Todo
			edit: function (todo, el) {
				todo.attr('editing', true);
				el.parents('.todo').find('.edit').focus();
			},
			cancelEditing: function (todo, el, ev) {
				if (ev.which === ESCAPE_KEY) {
					el.val(todo.attr('text'));
					todo.attr('editing', false);
				}
			},
			// Returns a list of Todos filtered based on the route
			displayList: function () {
				var filter = can.route.attr('filter');
				return this.todos.filter(function (todo) {
					if (filter === 'completed') {
						return todo.attr('complete');
					}

					if (filter === 'active') {
						return !todo.attr('complete');
					}

					return true;
				});
			},
			updateTodo: function (todo, el) {
				var value = can.trim(el.val());

				if (value === '') {
					todo.destroy();
				} else {
					todo.attr({
						editing: false,
						text: value
					});
				}
			},
			createTodo: function (context, el) {
				var value = can.trim(el.val());
				var TodoModel = this.Todo;

				if (value !== '') {
					new TodoModel({
						text: value,
						complete: false
					}).save();

					can.route.removeAttr('filter');
					el.val('');
				}
			},
			toggleAll: function (scope, el) {
				var toggle = el.prop('checked');
				this.attr('todos').each(function (todo) {
					todo.attr('complete', toggle);
				});
			},
			clearCompleted: function () {
				this.attr('todos').completed().forEach(function (todo) {
					todo.destroy();
				});
			}
		},
		events: {
			// When a new Todo has been created, add it to the todo list
			'{Todo} created': function (Construct, ev, todo) {
				this.scope.attr('todos').push(todo);
			}
		},
		helpers: {
			link: function (name, filter) {
				var data = filter ? { filter: filter } : {};
				return can.route.link(name, data, {
					className: can.route.attr('filter') === filter ? 'selected' : ''
				});
			},
			plural: function (singular, num) {
				return num() === 1 ? singular : singular + 's';
			}
		}
	});
})(this);

/* global $, can */
(function () {
	'use strict';

	$(function () {
		// Set up a route that maps to the `filter` attribute
		can.route(':filter');

		// Render #app-template
		$('#todoapp').html(can.view('views/todos.mustache', {}));

		// Start the router
		can.route.ready();
	});
})();

(function(window) {
 can.view.preloadStringRenderer('views_todos_mustache',can.Mustache(function(scope,options) { var ___v1ew = [];___v1ew.push(
"<todo-app",can.view.pending({tagName:'todo-app',scope: scope,options: options,subtemplate: function(scope,options){
var ___v1ew = [];___v1ew.push(
"\n  <header id=\"header\">\n    <h1>todos</h1>\n    <input id=\"new-todo\" placeholder=\"What needs to be done?\" autofocus=\"\" can-enter=\"createTodo\"",can.view.pending({attrs: ['can-enter'], scope: scope,options: options}),">");___v1ew.push(
"\n  </header>\n  <section id=\"main\" class=\"");___v1ew.push(
can.view.txt(
true,
'section',
'class',
this,
can.Mustache.txt(
{scope:scope,options:options},
"^",{get:"if"},{get:"todos.length"},[

{fn:function(scope,options){var ___v1ew = [];___v1ew.push(
"hidden");return ___v1ew.join("");}}])));___v1ew.push(
"\"",can.view.pending({scope: scope,options: options}),">");___v1ew.push(
"\n    <input id=\"toggle-all\" type=\"checkbox\" ");___v1ew.push(
can.view.txt(
0,
'input',
1,
this,
can.Mustache.txt(
{scope:scope,options:options},
"#",{get:"if"},{get:"todos.allComplete"},[

{fn:function(scope,options){var ___v1ew = [];___v1ew.push(
"checked=\"checked\"");return ___v1ew.join("");}}])));___v1ew.push(
" can-click=\"toggleAll\"",can.view.pending({attrs: ['can-click'], scope: scope,options: options}),">");___v1ew.push(
"\n    <label for=\"toggle-all\">Mark all as complete</label>\n    <ul id=\"todo-list\">");___v1ew.push(
"\n");___v1ew.push(
can.view.txt(
0,
'ul',
0,
this,
can.Mustache.txt(
{scope:scope,options:options},
"#",{get:"each"},{get:"displayList"},[

{fn:function(scope,options){var ___v1ew = [];___v1ew.push(
"      <li class=\"todo");___v1ew.push(
can.view.txt(
true,
'li',
'class',
this,
can.Mustache.txt(
{scope:scope,options:options},
"#",{get:"if"},{get:"complete"},[

{fn:function(scope,options){var ___v1ew = [];___v1ew.push(
" completed");return ___v1ew.join("");}}])));___v1ew.push(
can.view.txt(
true,
'li',
'class',
this,
can.Mustache.txt(
{scope:scope,options:options},
"#",{get:"if"},{get:"editing"},[

{fn:function(scope,options){var ___v1ew = [];___v1ew.push(
" editing");return ___v1ew.join("");}}])));___v1ew.push(
"\"",can.view.pending({scope: scope,options: options}),">");___v1ew.push(
"\n        <div class=\"view\">\n          <input class=\"toggle\" type=\"checkbox\" can-value=\"complete\"",can.view.pending({attrs: ['can-value'], scope: scope,options: options}),">");___v1ew.push(
"\n          <label can-dblclick=\"edit\"",can.view.pending({attrs: ['can-dblclick'], scope: scope,options: options}),">");___v1ew.push(
can.view.txt(
1,
'label',
0,
this,
can.Mustache.txt(
{scope:scope,options:options},
null,{get:"text"})));___v1ew.push(
"</label>\n          <button class=\"destroy\" can-click=\"destroy\"",can.view.pending({attrs: ['can-click'], scope: scope,options: options}),">");___v1ew.push(
"</button>\n        </div>\n        <input class=\"edit\" type=\"text\" value=\"");___v1ew.push(
can.view.txt(
true,
'input',
'value',
this,
can.Mustache.txt(
{scope:scope,options:options},
null,{get:"text"})));___v1ew.push(
"\" can-blur=\"updateTodo\"\n               can-keyup=\"cancelEditing\" can-enter=\"updateTodo\"",can.view.pending({attrs: ['can-blur','can-keyup','can-enter'], scope: scope,options: options}),">");___v1ew.push(
"\n      </li>");___v1ew.push(
"\n");return ___v1ew.join("");}}])));___v1ew.push(
"    </ul>\n  </section>\n  <footer id=\"footer\" class=\"");___v1ew.push(
can.view.txt(
true,
'footer',
'class',
this,
can.Mustache.txt(
{scope:scope,options:options},
"^",{get:"if"},{get:"todos.length"},[

{fn:function(scope,options){var ___v1ew = [];___v1ew.push(
"hidden");return ___v1ew.join("");}}])));___v1ew.push(
"\"",can.view.pending({scope: scope,options: options}),">");___v1ew.push(
"\n\t\t\t\t\t<span id=\"todo-count\">\n\t\t\t\t\t\t<strong>");___v1ew.push(
can.view.txt(
1,
'strong',
0,
this,
can.Mustache.txt(
{scope:scope,options:options},
null,{get:"todos.remaining"})));___v1ew.push(
"</strong> ");___v1ew.push(
can.view.txt(
1,
'span',
0,
this,
can.Mustache.txt(
{scope:scope,options:options},
null,{get:"plural"},"item",{get:"todos.remaining"})));___v1ew.push(
" left\n\t\t\t\t\t</span>\n    <ul id=\"filters\">\n      <li>");___v1ew.push(
can.view.txt(
0,
'li',
0,
this,
can.Mustache.txt(
{scope:scope,options:options},
null,{get:"link"},"All",undefined)));___v1ew.push(
"</li>\n      <li>");___v1ew.push(
can.view.txt(
0,
'li',
0,
this,
can.Mustache.txt(
{scope:scope,options:options},
null,{get:"link"},"Active","active")));___v1ew.push(
"</li>\n      <li>");___v1ew.push(
can.view.txt(
0,
'li',
0,
this,
can.Mustache.txt(
{scope:scope,options:options},
null,{get:"link"},"Completed","completed")));___v1ew.push(
"</li>\n    </ul>\n    <button id=\"clear-completed\" class=\"");___v1ew.push(
can.view.txt(
true,
'button',
'class',
this,
can.Mustache.txt(
{scope:scope,options:options},
"^",{get:"if"},{get:"todos.completed.length"},[

{fn:function(scope,options){var ___v1ew = [];___v1ew.push(
"hidden");return ___v1ew.join("");}}])));___v1ew.push(
"\" can-click=\"clearCompleted\"",can.view.pending({attrs: ['can-click'], scope: scope,options: options}),">");___v1ew.push(
"\n      Clear completed (");___v1ew.push(
can.view.txt(
1,
'button',
0,
this,
can.Mustache.txt(
{scope:scope,options:options},
null,{get:"todos.completed.length"})));___v1ew.push(
")\n    </button>\n  </footer>\n");return ___v1ew.join('')}}) );___v1ew.push(
"></todo-app>\n");; return ___v1ew.join('') })); 
})(this);