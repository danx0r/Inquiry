/*!
 * jQuery JavaScript Library v1.4.3
 * http://jquery.com/
 *
 * Copyright 2010, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2010, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Thu Oct 14 23:10:06 2010 -0400
 */
(function( window, undefined ) {

// Use the correct document accordingly with window argument (sandbox)
var document = window.document;
var jQuery = (function() {

// Define a local copy of jQuery
var jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context );
	},

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// A simple way to check for HTML strings or ID strings
	// (both of which we optimize for)
	quickExpr = /^(?:[^<]*(<[\w\W]+>)[^>]*$|#([\w\-]+)$)/,

	// Is it a simple selector
	isSimple = /^.[^:#\[\.,]*$/,

	// Check if a string has a non-whitespace character in it
	rnotwhite = /\S/,
	rwhite = /\s/,

	// Used for trimming whitespace
	trimLeft = /^\s+/,
	trimRight = /\s+$/,

	// Check for non-word characters
	rnonword = /\W/,

	// Check for digits
	rdigit = /\d/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,

	// Useragent RegExp
	rwebkit = /(webkit)[ \/]([\w.]+)/,
	ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
	rmsie = /(msie) ([\w.]+)/,
	rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,

	// Keep a UserAgent string for use with jQuery.browser
	userAgent = navigator.userAgent,

	// For matching the engine and version of the browser
	browserMatch,
	
	// Has the ready events already been bound?
	readyBound = false,
	
	// The functions to execute on DOM ready
	readyList = [],

	// The ready event handler
	DOMContentLoaded,

	// Save a reference to some core methods
	toString = Object.prototype.toString,
	hasOwn = Object.prototype.hasOwnProperty,
	push = Array.prototype.push,
	slice = Array.prototype.slice,
	trim = String.prototype.trim,
	indexOf = Array.prototype.indexOf,
	
	// [[Class]] -> type pairs
	class2type = {};

jQuery.fn = jQuery.prototype = {
	init: function( selector, context ) {
		var match, elem, ret, doc;

		// Handle $(""), $(null), or $(undefined)
		if ( !selector ) {
			return this;
		}

		// Handle $(DOMElement)
		if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;
		}
		
		// The body element only exists once, optimize finding it
		if ( selector === "body" && !context && document.body ) {
			this.context = document;
			this[0] = document.body;
			this.selector = "body";
			this.length = 1;
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			// Are we dealing with HTML string or an ID?
			match = quickExpr.exec( selector );

			// Verify a match, and that no context was specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					doc = (context ? context.ownerDocument || context : document);

					// If a single string is passed in and it's a single tag
					// just do a createElement and skip the rest
					ret = rsingleTag.exec( selector );

					if ( ret ) {
						if ( jQuery.isPlainObject( context ) ) {
							selector = [ document.createElement( ret[1] ) ];
							jQuery.fn.attr.call( selector, context, true );

						} else {
							selector = [ doc.createElement( ret[1] ) ];
						}

					} else {
						ret = jQuery.buildFragment( [ match[1] ], [ doc ] );
						selector = (ret.cacheable ? ret.fragment.cloneNode(true) : ret.fragment).childNodes;
					}
					
					return jQuery.merge( this, selector );
					
				// HANDLE: $("#id")
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $("TAG")
			} else if ( !context && !rnonword.test( selector ) ) {
				this.selector = selector;
				this.context = document;
				selector = document.getElementsByTagName( selector );
				return jQuery.merge( this, selector );

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return (context || rootjQuery).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return jQuery( context ).find( selector );
			}

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if (selector.selector !== undefined) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The current version of jQuery being used
	jquery: "1.4.3",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return slice.call( this, 0 );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this.slice(num)[ 0 ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems, name, selector ) {
		// Build a new jQuery matched element set
		var ret = jQuery();

		if ( jQuery.isArray( elems ) ) {
			push.apply( ret, elems );
		
		} else {
			jQuery.merge( ret, elems );
		}

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		ret.context = this.context;

		if ( name === "find" ) {
			ret.selector = this.selector + (this.selector ? " " : "") + selector;
		} else if ( name ) {
			ret.selector = this.selector + "." + name + "(" + selector + ")";
		}

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
		// Attach the listeners
		jQuery.bindReady();

		// If the DOM is already ready
		if ( jQuery.isReady ) {
			// Execute the function immediately
			fn.call( document, jQuery );

		// Otherwise, remember the function for later
		} else if ( readyList ) {
			// Add the function to the wait list
			readyList.push( fn );
		}

		return this;
	},
	
	eq: function( i ) {
		return i === -1 ?
			this.slice( i ) :
			this.slice( i, +i + 1 );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ),
			"slice", slice.call(arguments).join(",") );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},
	
	end: function() {
		return this.prevObject || jQuery(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	// copy reference to target object
	var target = arguments[0] || {}, i = 1, length = arguments.length, deep = false, options, name, src, copy, copyIsArray;

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
	noConflict: function( deep ) {
		window.$ = _$;

		if ( deep ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},
	
	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,
	
	// Handle when the DOM is ready
	ready: function( wait ) {
		// A third-party is pushing the ready event forwards
		if ( wait === true ) {
			jQuery.readyWait--;
		}

		// Make sure that the DOM is not already loaded
		if ( !jQuery.readyWait || (wait !== true && !jQuery.isReady) ) {
			// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
			if ( !document.body ) {
				return setTimeout( jQuery.ready, 1 );
			}

			// Remember that the DOM is ready
			jQuery.isReady = true;

			// If a normal DOM Ready event fired, decrement, and wait if need be
			if ( wait !== true && --jQuery.readyWait > 0 ) {
				return;
			}

			// If there are functions bound, to execute
			if ( readyList ) {
				// Execute all of them
				var fn, i = 0;
				while ( (fn = readyList[ i++ ]) ) {
					fn.call( document, jQuery );
				}

				// Reset the list of functions
				readyList = null;
			}

			// Trigger any bound ready events
			if ( jQuery.fn.triggerHandler ) {
				jQuery( document ).triggerHandler( "ready" );
			}
		}
	},
	
	bindReady: function() {
		if ( readyBound ) {
			return;
		}

		readyBound = true;

		// Catch cases where $(document).ready() is called after the
		// browser event has already occurred.
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			return setTimeout( jQuery.ready, 1 );
		}

		// Mozilla, Opera and webkit nightlies currently support this event
		if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );
			
			// A fallback to window.onload, that will always work
			window.addEventListener( "load", jQuery.ready, false );

		// If IE event model is used
		} else if ( document.attachEvent ) {
			// ensure firing before onload,
			// maybe late but safe also for iframes
			document.attachEvent("onreadystatechange", DOMContentLoaded);
			
			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", jQuery.ready );

			// If IE and not a frame
			// continually check to see if the document is ready
			var toplevel = false;

			try {
				toplevel = window.frameElement == null;
			} catch(e) {}

			if ( document.documentElement.doScroll && toplevel ) {
				doScrollCheck();
			}
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	// A crude way of determining if an object is a window
	isWindow: function( obj ) {
		return obj && typeof obj === "object" && "setInterval" in obj;
	},

	isNaN: function( obj ) {
		return obj == null || !rdigit.test( obj ) || isNaN( obj );
	},

	type: function( obj ) {
		return obj == null ?
			String( obj ) :
			class2type[ toString.call(obj) ] || "object";
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}
		
		// Not own constructor property must be Object
		if ( obj.constructor &&
			!hasOwn.call(obj, "constructor") &&
			!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
			return false;
		}
		
		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
	
		var key;
		for ( key in obj ) {}
		
		return key === undefined || hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		for ( var name in obj ) {
			return false;
		}
		return true;
	},
	
	error: function( msg ) {
		throw msg;
	},
	
	parseJSON: function( data ) {
		if ( typeof data !== "string" || !data ) {
			return null;
		}

		// Make sure leading/trailing whitespace is removed (IE can't handle it)
		data = jQuery.trim( data );
		
		// Make sure the incoming data is actual JSON
		// Logic borrowed from http://json.org/json2.js
		if ( rvalidchars.test(data.replace(rvalidescape, "@")
			.replace(rvalidtokens, "]")
			.replace(rvalidbraces, "")) ) {

			// Try to use the native JSON parser first
			return window.JSON && window.JSON.parse ?
				window.JSON.parse( data ) :
				(new Function("return " + data))();

		} else {
			jQuery.error( "Invalid JSON: " + data );
		}
	},

	noop: function() {},

	// Evalulates a script in a global context
	globalEval: function( data ) {
		if ( data && rnotwhite.test(data) ) {
			// Inspired by code by Andrea Giammarchi
			// http://webreflection.blogspot.com/2007/08/global-scope-evaluation-and-dom.html
			var head = document.getElementsByTagName("head")[0] || document.documentElement,
				script = document.createElement("script");

			script.type = "text/javascript";

			if ( jQuery.support.scriptEval ) {
				script.appendChild( document.createTextNode( data ) );
			} else {
				script.text = data;
			}

			// Use insertBefore instead of appendChild to circumvent an IE6 bug.
			// This arises when a base node is used (#2709).
			head.insertBefore( script, head.firstChild );
			head.removeChild( script );
		}
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
	},

	// args is for internal usage only
	each: function( object, callback, args ) {
		var name, i = 0,
			length = object.length,
			isObj = length === undefined || jQuery.isFunction(object);

		if ( args ) {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.apply( object[ name ], args ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.apply( object[ i++ ], args ) === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
						break;
					}
				}
			} else {
				for ( var value = object[0];
					i < length && callback.call( value, i, value ) !== false; value = object[++i] ) {}
			}
		}

		return object;
	},

	// Use native String.trim function wherever possible
	trim: trim ?
		function( text ) {
			return text == null ?
				"" :
				trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				text.toString().replace( trimLeft, "" ).replace( trimRight, "" );
		},

	// results is for internal usage only
	makeArray: function( array, results ) {
		var ret = results || [];

		if ( array != null ) {
			// The window, strings (and functions) also have 'length'
			// The extra typeof function check is to prevent crashes
			// in Safari 2 (See: #3039)
			// Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
			var type = jQuery.type(array);

			if ( array.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( array ) ) {
				push.call( ret, array );
			} else {
				jQuery.merge( ret, array );
			}
		}

		return ret;
	},

	inArray: function( elem, array ) {
		if ( array.indexOf ) {
			return array.indexOf( elem );
		}

		for ( var i = 0, length = array.length; i < length; i++ ) {
			if ( array[ i ] === elem ) {
				return i;
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var i = first.length, j = 0;

		if ( typeof second.length === "number" ) {
			for ( var l = second.length; j < l; j++ ) {
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
		var ret = [], retVal;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var ret = [], value;

		// Go through the array, translating each of the items to their
		// new value (or values).
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			value = callback( elems[ i ], i, arg );

			if ( value != null ) {
				ret[ ret.length ] = value;
			}
		}

		return ret.concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	proxy: function( fn, proxy, thisObject ) {
		if ( arguments.length === 2 ) {
			if ( typeof proxy === "string" ) {
				thisObject = fn;
				fn = thisObject[ proxy ];
				proxy = undefined;

			} else if ( proxy && !jQuery.isFunction( proxy ) ) {
				thisObject = proxy;
				proxy = undefined;
			}
		}

		if ( !proxy && fn ) {
			proxy = function() {
				return fn.apply( thisObject || this, arguments );
			};
		}

		// Set the guid of unique handler to the same of original handler, so it can be removed
		if ( fn ) {
			proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;
		}

		// So proxy can be declared as an argument
		return proxy;
	},

	// Mutifunctional method to get and set values to a collection
	// The value/s can be optionally by executed if its a function
	access: function( elems, key, value, exec, fn, pass ) {
		var length = elems.length;
	
		// Setting many attributes
		if ( typeof key === "object" ) {
			for ( var k in key ) {
				jQuery.access( elems, k, key[k], exec, fn, value );
			}
			return elems;
		}
	
		// Setting one attribute
		if ( value !== undefined ) {
			// Optionally, function values get executed if exec is true
			exec = !pass && exec && jQuery.isFunction(value);
		
			for ( var i = 0; i < length; i++ ) {
				fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
			}
		
			return elems;
		}
	
		// Getting an attribute
		return length ? fn( elems[0], key ) : undefined;
	},

	now: function() {
		return (new Date()).getTime();
	},

	// Use of jQuery.browser is frowned upon.
	// More details: http://docs.jquery.com/Utilities/jQuery.browser
	uaMatch: function( ua ) {
		ua = ua.toLowerCase();

		var match = rwebkit.exec( ua ) ||
			ropera.exec( ua ) ||
			rmsie.exec( ua ) ||
			ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) ||
			[];

		return { browser: match[1] || "", version: match[2] || "0" };
	},

	browser: {}
});

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

browserMatch = jQuery.uaMatch( userAgent );
if ( browserMatch.browser ) {
	jQuery.browser[ browserMatch.browser ] = true;
	jQuery.browser.version = browserMatch.version;
}

// Deprecated, use jQuery.browser.webkit instead
if ( jQuery.browser.webkit ) {
	jQuery.browser.safari = true;
}

if ( indexOf ) {
	jQuery.inArray = function( elem, array ) {
		return indexOf.call( array, elem );
	};
}

// Verify that \s matches non-breaking spaces
// (IE fails on this test)
if ( !rwhite.test( "\xA0" ) ) {
	trimLeft = /^[\s\xA0]+/;
	trimRight = /[\s\xA0]+$/;
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);

// Cleanup functions for the document ready method
if ( document.addEventListener ) {
	DOMContentLoaded = function() {
		document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
		jQuery.ready();
	};

} else if ( document.attachEvent ) {
	DOMContentLoaded = function() {
		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( document.readyState === "complete" ) {
			document.detachEvent( "onreadystatechange", DOMContentLoaded );
			jQuery.ready();
		}
	};
}

// The DOM ready check for Internet Explorer
function doScrollCheck() {
	if ( jQuery.isReady ) {
		return;
	}

	try {
		// If IE is used, use the trick by Diego Perini
		// http://javascript.nwbox.com/IEContentLoaded/
		document.documentElement.doScroll("left");
	} catch(e) {
		setTimeout( doScrollCheck, 1 );
		return;
	}

	// and execute any waiting functions
	jQuery.ready();
}

// Expose jQuery to the global object
return (window.jQuery = window.$ = jQuery);

})();


(function() {

	jQuery.support = {};

	var root = document.documentElement,
		script = document.createElement("script"),
		div = document.createElement("div"),
		id = "script" + jQuery.now();

	div.style.display = "none";
	div.innerHTML = "   <link/><table></table><a href='/a' style='color:red;float:left;opacity:.55;'>a</a><input type='checkbox'/>";

	var all = div.getElementsByTagName("*"),
		a = div.getElementsByTagName("a")[0],
		select = document.createElement("select"),
		opt = select.appendChild( document.createElement("option") );

	// Can't get basic test support
	if ( !all || !all.length || !a ) {
		return;
	}

	jQuery.support = {
		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: div.firstChild.nodeType === 3,

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText insted)
		style: /red/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: a.getAttribute("href") === "/a",

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.55$/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Make sure that if no value is specified for a checkbox
		// that it defaults to "on".
		// (WebKit defaults to "" instead)
		checkOn: div.getElementsByTagName("input")[0].value === "on",

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Will be defined later
		optDisabled: false,
		checkClone: false,
		scriptEval: false,
		noCloneEvent: true,
		boxModel: null,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableHiddenOffsets: true
	};

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as diabled)
	select.disabled = true;
	jQuery.support.optDisabled = !opt.disabled;

	script.type = "text/javascript";
	try {
		script.appendChild( document.createTextNode( "window." + id + "=1;" ) );
	} catch(e) {}

	root.insertBefore( script, root.firstChild );

	// Make sure that the execution of code works by injecting a script
	// tag with appendChild/createTextNode
	// (IE doesn't support this, fails, and uses .text instead)
	if ( window[ id ] ) {
		jQuery.support.scriptEval = true;
		delete window[ id ];
	}

	root.removeChild( script );

	if ( div.attachEvent && div.fireEvent ) {
		div.attachEvent("onclick", function click() {
			// Cloning a node shouldn't copy over any
			// bound event handlers (IE does this)
			jQuery.support.noCloneEvent = false;
			div.detachEvent("onclick", click);
		});
		div.cloneNode(true).fireEvent("onclick");
	}

	div = document.createElement("div");
	div.innerHTML = "<input type='radio' name='radiotest' checked='checked'/>";

	var fragment = document.createDocumentFragment();
	fragment.appendChild( div.firstChild );

	// WebKit doesn't clone checked state correctly in fragments
	jQuery.support.checkClone = fragment.cloneNode(true).cloneNode(true).lastChild.checked;

	// Figure out if the W3C box model works as expected
	// document.body must exist before we can do this
	jQuery(function() {
		var div = document.createElement("div");
		div.style.width = div.style.paddingLeft = "1px";

		document.body.appendChild( div );
		jQuery.boxModel = jQuery.support.boxModel = div.offsetWidth === 2;

		if ( "zoom" in div.style ) {
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			// (IE < 8 does this)
			div.style.display = "inline";
			div.style.zoom = 1;
			jQuery.support.inlineBlockNeedsLayout = div.offsetWidth === 2;

			// Check if elements with layout shrink-wrap their children
			// (IE 6 does this)
			div.style.display = "";
			div.innerHTML = "<div style='width:4px;'></div>";
			jQuery.support.shrinkWrapBlocks = div.offsetWidth !== 2;
		}

		div.innerHTML = "<table><tr><td style='padding:0;display:none'></td><td>t</td></tr></table>";
		var tds = div.getElementsByTagName("td");

		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		// (only IE 8 fails this test)
		jQuery.support.reliableHiddenOffsets = tds[0].offsetHeight === 0;

		tds[0].style.display = "";
		tds[1].style.display = "none";

		// Check if empty table cells still have offsetWidth/Height
		// (IE < 8 fail this test)
		jQuery.support.reliableHiddenOffsets = jQuery.support.reliableHiddenOffsets && tds[0].offsetHeight === 0;
		div.innerHTML = "";

		document.body.removeChild( div ).style.display = "none";
		div = tds = null;
	});

	// Technique from Juriy Zaytsev
	// http://thinkweb2.com/projects/prototype/detecting-event-support-without-browser-sniffing/
	var eventSupported = function( eventName ) {
		var el = document.createElement("div");
		eventName = "on" + eventName;

		var isSupported = (eventName in el);
		if ( !isSupported ) {
			el.setAttribute(eventName, "return;");
			isSupported = typeof el[eventName] === "function";
		}
		el = null;

		return isSupported;
	};

	jQuery.support.submitBubbles = eventSupported("submit");
	jQuery.support.changeBubbles = eventSupported("change");

	// release memory in IE
	root = script = div = all = a = null;
})();

jQuery.props = {
	"for": "htmlFor",
	"class": "className",
	readonly: "readOnly",
	maxlength: "maxLength",
	cellspacing: "cellSpacing",
	rowspan: "rowSpan",
	colspan: "colSpan",
	tabindex: "tabIndex",
	usemap: "useMap",
	frameborder: "frameBorder"
};




var windowData = {},
	rbrace = /^(?:\{.*\}|\[.*\])$/;

jQuery.extend({
	cache: {},

	// Please use with caution
	uuid: 0,

	// Unique for each copy of jQuery on the page	
	expando: "jQuery" + jQuery.now(),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	data: function( elem, name, data ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		elem = elem == window ?
			windowData :
			elem;

		var isNode = elem.nodeType,
			id = isNode ? elem[ jQuery.expando ] : null,
			cache = jQuery.cache, thisCache;

		if ( isNode && !id && typeof name === "string" && data === undefined ) {
			return;
		}

		// Get the data from the object directly
		if ( !isNode ) {
			cache = elem;

		// Compute a unique ID for the element
		} else if ( !id ) {
			elem[ jQuery.expando ] = id = ++jQuery.uuid;
		}

		// Avoid generating a new cache unless none exists and we
		// want to manipulate it.
		if ( typeof name === "object" ) {
			if ( isNode ) {
				cache[ id ] = jQuery.extend(cache[ id ], name);

			} else {
				jQuery.extend( cache, name );
			}

		} else if ( isNode && !cache[ id ] ) {
			cache[ id ] = {};
		}

		thisCache = isNode ? cache[ id ] : cache;

		// Prevent overriding the named cache with undefined values
		if ( data !== undefined ) {
			thisCache[ name ] = data;
		}

		return typeof name === "string" ? thisCache[ name ] : thisCache;
	},

	removeData: function( elem, name ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		elem = elem == window ?
			windowData :
			elem;

		var isNode = elem.nodeType,
			id = isNode ? elem[ jQuery.expando ] : elem,
			cache = jQuery.cache,
			thisCache = isNode ? cache[ id ] : id;

		// If we want to remove a specific section of the element's data
		if ( name ) {
			if ( thisCache ) {
				// Remove the section of cache data
				delete thisCache[ name ];

				// If we've removed all the data, remove the element's cache
				if ( isNode && jQuery.isEmptyObject(thisCache) ) {
					jQuery.removeData( elem );
				}
			}

		// Otherwise, we want to remove all of the element's data
		} else {
			if ( isNode && jQuery.support.deleteExpando ) {
				delete elem[ jQuery.expando ];

			} else if ( elem.removeAttribute ) {
				elem.removeAttribute( jQuery.expando );

			// Completely remove the data cache
			} else if ( isNode ) {
				delete cache[ id ];

			// Remove all fields from the object
			} else {
				for ( var n in elem ) {
					delete elem[ n ];
				}
			}
		}
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		if ( elem.nodeName ) {
			var match = jQuery.noData[ elem.nodeName.toLowerCase() ];

			if ( match ) {
				return !(match === true || elem.getAttribute("classid") !== match);
			}
		}

		return true;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		if ( typeof key === "undefined" ) {
			return this.length ? jQuery.data( this[0] ) : null;

		} else if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		var parts = key.split(".");
		parts[1] = parts[1] ? "." + parts[1] : "";

		if ( value === undefined ) {
			var data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);

			// Try to fetch any internally stored data first
			if ( data === undefined && this.length ) {
				data = jQuery.data( this[0], key );

				// If nothing was found internally, try to fetch any
				// data from the HTML5 data-* attribute
				if ( data === undefined && this[0].nodeType === 1 ) {
					data = this[0].getAttribute( "data-" + key );

					if ( typeof data === "string" ) {
						try {
							data = data === "true" ? true :
								data === "false" ? false :
								data === "null" ? null :
								!jQuery.isNaN( data ) ? parseFloat( data ) :
								rbrace.test( data ) ? jQuery.parseJSON( data ) :
								data;
						} catch( e ) {}

					} else {
						data = undefined;
					}
				}
			}

			return data === undefined && parts[1] ?
				this.data( parts[0] ) :
				data;

		} else {
			return this.each(function() {
				var $this = jQuery( this ), args = [ parts[0], value ];

				$this.triggerHandler( "setData" + parts[1] + "!", args );
				jQuery.data( this, key, value );
				$this.triggerHandler( "changeData" + parts[1] + "!", args );
			});
		}
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});




jQuery.extend({
	queue: function( elem, type, data ) {
		if ( !elem ) {
			return;
		}

		type = (type || "fx") + "queue";
		var q = jQuery.data( elem, type );

		// Speed up dequeue by getting out quickly if this is just a lookup
		if ( !data ) {
			return q || [];
		}

		if ( !q || jQuery.isArray(data) ) {
			q = jQuery.data( elem, type, jQuery.makeArray(data) );

		} else {
			q.push( data );
		}

		return q;
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ), fn = queue.shift();

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
		}

		if ( fn ) {
			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift("inprogress");
			}

			fn.call(elem, function() {
				jQuery.dequeue(elem, type);
			});
		}
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
		}

		if ( data === undefined ) {
			return jQuery.queue( this[0], type );
		}
		return this.each(function( i ) {
			var queue = jQuery.queue( this, type, data );

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
		time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
		type = type || "fx";

		return this.queue( type, function() {
			var elem = this;
			setTimeout(function() {
				jQuery.dequeue( elem, type );
			}, time );
		});
	},

	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	}
});




var rclass = /[\n\t]/g,
	rspaces = /\s+/,
	rreturn = /\r/g,
	rspecialurl = /^(?:href|src|style)$/,
	rtype = /^(?:button|input)$/i,
	rfocusable = /^(?:button|input|object|select|textarea)$/i,
	rclickable = /^a(?:rea)?$/i,
	rradiocheck = /^(?:radio|checkbox)$/i;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, name, value, true, jQuery.attr );
	},

	removeAttr: function( name, fn ) {
		return this.each(function(){
			jQuery.attr( this, name, "" );
			if ( this.nodeType === 1 ) {
				this.removeAttribute( name );
			}
		});
	},

	addClass: function( value ) {
		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				self.addClass( value.call(this, i, self.attr("class")) );
			});
		}

		if ( value && typeof value === "string" ) {
			var classNames = (value || "").split( rspaces );

			for ( var i = 0, l = this.length; i < l; i++ ) {
				var elem = this[i];

				if ( elem.nodeType === 1 ) {
					if ( !elem.className ) {
						elem.className = value;

					} else {
						var className = " " + elem.className + " ", setClass = elem.className;
						for ( var c = 0, cl = classNames.length; c < cl; c++ ) {
							if ( className.indexOf( " " + classNames[c] + " " ) < 0 ) {
								setClass += " " + classNames[c];
							}
						}
						elem.className = jQuery.trim( setClass );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				self.removeClass( value.call(this, i, self.attr("class")) );
			});
		}

		if ( (value && typeof value === "string") || value === undefined ) {
			var classNames = (value || "").split( rspaces );

			for ( var i = 0, l = this.length; i < l; i++ ) {
				var elem = this[i];

				if ( elem.nodeType === 1 && elem.className ) {
					if ( value ) {
						var className = (" " + elem.className + " ").replace(rclass, " ");
						for ( var c = 0, cl = classNames.length; c < cl; c++ ) {
							className = className.replace(" " + classNames[c] + " ", " ");
						}
						elem.className = jQuery.trim( className );

					} else {
						elem.className = "";
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value, isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				self.toggleClass( value.call(this, i, self.attr("class"), stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className, i = 0, self = jQuery(this),
					state = stateVal,
					classNames = value.split( rspaces );

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space seperated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			} else if ( type === "undefined" || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery.data( this, "__className__", this.className );
				}

				// toggle whole className
				this.className = this.className || value === false ? "" : jQuery.data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ";
		for ( var i = 0, l = this.length; i < l; i++ ) {
			if ( (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) > -1 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		if ( !arguments.length ) {
			var elem = this[0];

			if ( elem ) {
				if ( jQuery.nodeName( elem, "option" ) ) {
					// attributes.value is undefined in Blackberry 4.7 but
					// uses .value. See #6932
					var val = elem.attributes.value;
					return !val || val.specified ? elem.value : elem.text;
				}

				// We need to handle select boxes special
				if ( jQuery.nodeName( elem, "select" ) ) {
					var index = elem.selectedIndex,
						values = [],
						options = elem.options,
						one = elem.type === "select-one";

					// Nothing was selected
					if ( index < 0 ) {
						return null;
					}

					// Loop through all the selected options
					for ( var i = one ? index : 0, max = one ? index + 1 : options.length; i < max; i++ ) {
						var option = options[ i ];

						// Don't return options that are disabled or in a disabled optgroup
						if ( option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) && 
								(!option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" )) ) {

							// Get the specific value for the option
							value = jQuery(option).val();

							// We don't need an array for one selects
							if ( one ) {
								return value;
							}

							// Multi-Selects return an array
							values.push( value );
						}
					}

					return values;
				}

				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				if ( rradiocheck.test( elem.type ) && !jQuery.support.checkOn ) {
					return elem.getAttribute("value") === null ? "on" : elem.value;
				}
				

				// Everything else, we just grab the value
				return (elem.value || "").replace(rreturn, "");

			}

			return undefined;
		}

		var isFunction = jQuery.isFunction(value);

		return this.each(function(i) {
			var self = jQuery(this), val = value;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call(this, i, self.val());
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray(val) ) {
				val = jQuery.map(val, function (value) {
					return value == null ? "" : value + "";
				});
			}

			if ( jQuery.isArray(val) && rradiocheck.test( this.type ) ) {
				this.checked = jQuery.inArray( self.val(), val ) >= 0;

			} else if ( jQuery.nodeName( this, "select" ) ) {
				var values = jQuery.makeArray(val);

				jQuery( "option", this ).each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					this.selectedIndex = -1;
				}

			} else {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	attrFn: {
		val: true,
		css: true,
		html: true,
		text: true,
		data: true,
		width: true,
		height: true,
		offset: true
	},
		
	attr: function( elem, name, value, pass ) {
		// don't set attributes on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 ) {
			return undefined;
		}

		if ( pass && name in jQuery.attrFn ) {
			return jQuery(elem)[name](value);
		}

		var notxml = elem.nodeType !== 1 || !jQuery.isXMLDoc( elem ),
			// Whether we are setting (or getting)
			set = value !== undefined;

		// Try to normalize/fix the name
		name = notxml && jQuery.props[ name ] || name;

		// Only do all the following if this is a node (faster for style)
		if ( elem.nodeType === 1 ) {
			// These attributes require special treatment
			var special = rspecialurl.test( name );

			// Safari mis-reports the default selected property of an option
			// Accessing the parent's selectedIndex property fixes it
			if ( name === "selected" && !jQuery.support.optSelected ) {
				var parent = elem.parentNode;
				if ( parent ) {
					parent.selectedIndex;
	
					// Make sure that it also works with optgroups, see #5701
					if ( parent.parentNode ) {
						parent.parentNode.selectedIndex;
					}
				}
			}

			// If applicable, access the attribute via the DOM 0 way
			// 'in' checks fail in Blackberry 4.7 #6931
			if ( (name in elem || elem[ name ] !== undefined) && notxml && !special ) {
				if ( set ) {
					// We can't allow the type property to be changed (since it causes problems in IE)
					if ( name === "type" && rtype.test( elem.nodeName ) && elem.parentNode ) {
						jQuery.error( "type property can't be changed" );
					}

					if ( value === null ) {
						if ( elem.nodeType === 1 ) {
							elem.removeAttribute( name );
						}

					} else {
						elem[ name ] = value;
					}
				}

				// browsers index elements by id/name on forms, give priority to attributes.
				if ( jQuery.nodeName( elem, "form" ) && elem.getAttributeNode(name) ) {
					return elem.getAttributeNode( name ).nodeValue;
				}

				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				if ( name === "tabIndex" ) {
					var attributeNode = elem.getAttributeNode( "tabIndex" );

					return attributeNode && attributeNode.specified ?
						attributeNode.value :
						rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
							0 :
							undefined;
				}

				return elem[ name ];
			}

			if ( !jQuery.support.style && notxml && name === "style" ) {
				if ( set ) {
					elem.style.cssText = "" + value;
				}

				return elem.style.cssText;
			}

			if ( set ) {
				// convert the value to a string (all browsers do this but IE) see #1070
				elem.setAttribute( name, "" + value );
			}

			// Ensure that missing attributes return undefined
			// Blackberry 4.7 returns "" from getAttribute #6938
			if ( !elem.attributes[ name ] && (elem.hasAttribute && !elem.hasAttribute( name )) ) {
				return undefined;
			}

			var attr = !jQuery.support.hrefNormalized && notxml && special ?
					// Some attributes require a special call on IE
					elem.getAttribute( name, 2 ) :
					elem.getAttribute( name );

			// Non-existent attributes return null, we normalize to undefined
			return attr === null ? undefined : attr;
		}
	}
});




var rnamespaces = /\.(.*)$/,
	rformElems = /^(?:textarea|input|select)$/i,
	rperiod = /\./g,
	rspace = / /g,
	rescape = /[^\w\s.|`]/g,
	fcleanup = function( nm ) {
		return nm.replace(rescape, "\\$&");
	},
	focusCounts = { focusin: 0, focusout: 0 };

/*
 * A number of helper functions used for managing events.
 * Many of the ideas behind this code originated from
 * Dean Edwards' addEvent library.
 */
jQuery.event = {

	// Bind an event to an element
	// Original by Dean Edwards
	add: function( elem, types, handler, data ) {
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// For whatever reason, IE has trouble passing the window object
		// around, causing it to be cloned in the process
		if ( jQuery.isWindow( elem ) && ( elem !== window && !elem.frameElement ) ) {
			elem = window;
		}

		if ( handler === false ) {
			handler = returnFalse;
		}

		var handleObjIn, handleObj;

		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
		}

		// Make sure that the function being executed has a unique ID
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure
		var elemData = jQuery.data( elem );

		// If no elemData is found then we must be trying to bind to one of the
		// banned noData elements
		if ( !elemData ) {
			return;
		}

		// Use a key less likely to result in collisions for plain JS objects.
		// Fixes bug #7150.
		var eventKey = elem.nodeType ? "events" : "__events__",
			events = elemData[ eventKey ],
			eventHandle = elemData.handle;
			
		if ( typeof events === "function" ) {
			// On plain objects events is a fn that holds the the data
			// which prevents this data from being JSON serialized
			// the function does not need to be called, it just contains the data
			eventHandle = events.handle;
			events = events.events;

		} else if ( !events ) {
			if ( !elem.nodeType ) {
				// On plain objects, create a fn that acts as the holder
				// of the values to avoid JSON serialization of event data
				elemData[ eventKey ] = elemData = function(){};
			}

			elemData.events = events = {};
		}

		if ( !eventHandle ) {
			elemData.handle = eventHandle = function() {
				// Handle the second event of a trigger and when
				// an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && !jQuery.event.triggered ?
					jQuery.event.handle.apply( eventHandle.elem, arguments ) :
					undefined;
			};
		}

		// Add elem as a property of the handle function
		// This is to prevent a memory leak with non-native events in IE.
		eventHandle.elem = elem;

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = types.split(" ");

		var type, i = 0, namespaces;

		while ( (type = types[ i++ ]) ) {
			handleObj = handleObjIn ?
				jQuery.extend({}, handleObjIn) :
				{ handler: handler, data: data };

			// Namespaced event handlers
			if ( type.indexOf(".") > -1 ) {
				namespaces = type.split(".");
				type = namespaces.shift();
				handleObj.namespace = namespaces.slice(0).sort().join(".");

			} else {
				namespaces = [];
				handleObj.namespace = "";
			}

			handleObj.type = type;
			if ( !handleObj.guid ) {
				handleObj.guid = handler.guid;
			}

			// Get the current list of functions bound to this event
			var handlers = events[ type ],
				special = jQuery.event.special[ type ] || {};

			// Init the event handler queue
			if ( !handlers ) {
				handlers = events[ type ] = [];

				// Check for a special event handler
				// Only use addEventListener/attachEvent if the special
				// events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}
			
			if ( special.add ) { 
				special.add.call( elem, handleObj ); 

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add the function to the element's handler list
			handlers.push( handleObj );

			// Keep track of which events have been used, for global triggering
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	global: {},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, pos ) {
		// don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		if ( handler === false ) {
			handler = returnFalse;
		}

		var ret, type, fn, j, i = 0, all, namespaces, namespace, special, eventType, handleObj, origType,
			eventKey = elem.nodeType ? "events" : "__events__",
			elemData = jQuery.data( elem ),
			events = elemData && elemData[ eventKey ];

		if ( !elemData || !events ) {
			return;
		}
		
		if ( typeof events === "function" ) {
			elemData = events;
			events = events.events;
		}

		// types is actually an event object here
		if ( types && types.type ) {
			handler = types.handler;
			types = types.type;
		}

		// Unbind all events for the element
		if ( !types || typeof types === "string" && types.charAt(0) === "." ) {
			types = types || "";

			for ( type in events ) {
				jQuery.event.remove( elem, type + types );
			}

			return;
		}

		// Handle multiple events separated by a space
		// jQuery(...).unbind("mouseover mouseout", fn);
		types = types.split(" ");

		while ( (type = types[ i++ ]) ) {
			origType = type;
			handleObj = null;
			all = type.indexOf(".") < 0;
			namespaces = [];

			if ( !all ) {
				// Namespaced event handlers
				namespaces = type.split(".");
				type = namespaces.shift();

				namespace = new RegExp("(^|\\.)" + 
					jQuery.map( namespaces.slice(0).sort(), fcleanup ).join("\\.(?:.*\\.)?") + "(\\.|$)");
			}

			eventType = events[ type ];

			if ( !eventType ) {
				continue;
			}

			if ( !handler ) {
				for ( j = 0; j < eventType.length; j++ ) {
					handleObj = eventType[ j ];

					if ( all || namespace.test( handleObj.namespace ) ) {
						jQuery.event.remove( elem, origType, handleObj.handler, j );
						eventType.splice( j--, 1 );
					}
				}

				continue;
			}

			special = jQuery.event.special[ type ] || {};

			for ( j = pos || 0; j < eventType.length; j++ ) {
				handleObj = eventType[ j ];

				if ( handler.guid === handleObj.guid ) {
					// remove the given handler for the given type
					if ( all || namespace.test( handleObj.namespace ) ) {
						if ( pos == null ) {
							eventType.splice( j--, 1 );
						}

						if ( special.remove ) {
							special.remove.call( elem, handleObj );
						}
					}

					if ( pos != null ) {
						break;
					}
				}
			}

			// remove generic event handler if no more handlers exist
			if ( eventType.length === 0 || pos != null && eventType.length === 1 ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				ret = null;
				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			var handle = elemData.handle;
			if ( handle ) {
				handle.elem = null;
			}

			delete elemData.events;
			delete elemData.handle;

			if ( typeof elemData === "function" ) {
				jQuery.removeData( elem, eventKey );

			} else if ( jQuery.isEmptyObject( elemData ) ) {
				jQuery.removeData( elem );
			}
		}
	},

	// bubbling is internal
	trigger: function( event, data, elem /*, bubbling */ ) {
		// Event object or event type
		var type = event.type || event,
			bubbling = arguments[3];

		if ( !bubbling ) {
			event = typeof event === "object" ?
				// jQuery.Event object
				event[ jQuery.expando ] ? event :
				// Object literal
				jQuery.extend( jQuery.Event(type), event ) :
				// Just the event type (string)
				jQuery.Event(type);

			if ( type.indexOf("!") >= 0 ) {
				event.type = type = type.slice(0, -1);
				event.exclusive = true;
			}

			// Handle a global trigger
			if ( !elem ) {
				// Don't bubble custom events when global (to avoid too much overhead)
				event.stopPropagation();

				// Only trigger if we've ever bound an event for it
				if ( jQuery.event.global[ type ] ) {
					jQuery.each( jQuery.cache, function() {
						if ( this.events && this.events[type] ) {
							jQuery.event.trigger( event, data, this.handle.elem );
						}
					});
				}
			}

			// Handle triggering a single element

			// don't do events on text and comment nodes
			if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 ) {
				return undefined;
			}

			// Clean up in case it is reused
			event.result = undefined;
			event.target = elem;

			// Clone the incoming data, if any
			data = jQuery.makeArray( data );
			data.unshift( event );
		}

		event.currentTarget = elem;

		// Trigger the event, it is assumed that "handle" is a function
		var handle = elem.nodeType ?
			jQuery.data( elem, "handle" ) :
			(jQuery.data( elem, "__events__" ) || {}).handle;

		if ( handle ) {
			handle.apply( elem, data );
		}

		var parent = elem.parentNode || elem.ownerDocument;

		// Trigger an inline bound script
		try {
			if ( !(elem && elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()]) ) {
				if ( elem[ "on" + type ] && elem[ "on" + type ].apply( elem, data ) === false ) {
					event.result = false;
					event.preventDefault();
				}
			}

		// prevent IE from throwing an error for some elements with some event types, see #3533
		} catch (inlineError) {}

		if ( !event.isPropagationStopped() && parent ) {
			jQuery.event.trigger( event, data, parent, true );

		} else if ( !event.isDefaultPrevented() ) {
			var target = event.target, old, targetType = type.replace(rnamespaces, ""),
				isClick = jQuery.nodeName(target, "a") && targetType === "click",
				special = jQuery.event.special[ targetType ] || {};

			if ( (!special._default || special._default.call( elem, event ) === false) && 
				!isClick && !(target && target.nodeName && jQuery.noData[target.nodeName.toLowerCase()]) ) {

				try {
					if ( target[ targetType ] ) {
						// Make sure that we don't accidentally re-trigger the onFOO events
						old = target[ "on" + targetType ];

						if ( old ) {
							target[ "on" + targetType ] = null;
						}

						jQuery.event.triggered = true;
						target[ targetType ]();
					}

				// prevent IE from throwing an error for some elements with some event types, see #3533
				} catch (triggerError) {}

				if ( old ) {
					target[ "on" + targetType ] = old;
				}

				jQuery.event.triggered = false;
			}
		}
	},

	handle: function( event ) {
		var all, handlers, namespaces, namespace_sort = [], namespace_re, events, args = jQuery.makeArray( arguments );

		event = args[0] = jQuery.event.fix( event || window.event );
		event.currentTarget = this;

		// Namespaced event handlers
		all = event.type.indexOf(".") < 0 && !event.exclusive;

		if ( !all ) {
			namespaces = event.type.split(".");
			event.type = namespaces.shift();
			namespace_sort = namespaces.slice(0).sort();
			namespace_re = new RegExp("(^|\\.)" + namespace_sort.join("\\.(?:.*\\.)?") + "(\\.|$)");
		}

		event.namespace = event.namespace || namespace_sort.join(".");

		events = jQuery.data(this, this.nodeType ? "events" : "__events__");

		if ( typeof events === "function" ) {
			events = events.events;
		}

		handlers = (events || {})[ event.type ];

		if ( events && handlers ) {
			// Clone the handlers to prevent manipulation
			handlers = handlers.slice(0);

			for ( var j = 0, l = handlers.length; j < l; j++ ) {
				var handleObj = handlers[ j ];

				// Filter the functions by class
				if ( all || namespace_re.test( handleObj.namespace ) ) {
					// Pass in a reference to the handler function itself
					// So that we can later remove it
					event.handler = handleObj.handler;
					event.data = handleObj.data;
					event.handleObj = handleObj;
	
					var ret = handleObj.handler.apply( this, args );

					if ( ret !== undefined ) {
						event.result = ret;
						if ( ret === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}

					if ( event.isImmediatePropagationStopped() ) {
						break;
					}
				}
			}
		}

		return event.result;
	},

	props: "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// store a copy of the original event object
		// and "clone" to set read-only properties
		var originalEvent = event;
		event = jQuery.Event( originalEvent );

		for ( var i = this.props.length, prop; i; ) {
			prop = this.props[ --i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Fix target property, if necessary
		if ( !event.target ) {
			event.target = event.srcElement || document; // Fixes #1925 where srcElement might not be defined either
		}

		// check if target is a textnode (safari)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Add relatedTarget, if necessary
		if ( !event.relatedTarget && event.fromElement ) {
			event.relatedTarget = event.fromElement === event.target ? event.toElement : event.fromElement;
		}

		// Calculate pageX/Y if missing and clientX/Y available
		if ( event.pageX == null && event.clientX != null ) {
			var doc = document.documentElement, body = document.body;
			event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
			event.pageY = event.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0);
		}

		// Add which for key events
		if ( event.which == null && (event.charCode != null || event.keyCode != null) ) {
			event.which = event.charCode != null ? event.charCode : event.keyCode;
		}

		// Add metaKey to non-Mac browsers (use ctrl for PC's and Meta for Macs)
		if ( !event.metaKey && event.ctrlKey ) {
			event.metaKey = event.ctrlKey;
		}

		// Add which for click: 1 === left; 2 === middle; 3 === right
		// Note: button is not normalized, so don't use it
		if ( !event.which && event.button !== undefined ) {
			event.which = (event.button & 1 ? 1 : ( event.button & 2 ? 3 : ( event.button & 4 ? 2 : 0 ) ));
		}

		return event;
	},

	// Deprecated, use jQuery.guid instead
	guid: 1E8,

	// Deprecated, use jQuery.proxy instead
	proxy: jQuery.proxy,

	special: {
		ready: {
			// Make sure the ready event is setup
			setup: jQuery.bindReady,
			teardown: jQuery.noop
		},

		live: {
			add: function( handleObj ) {
				jQuery.event.add( this,
					liveConvert( handleObj.origType, handleObj.selector ),
					jQuery.extend({}, handleObj, {handler: liveHandler, guid: handleObj.handler.guid}) ); 
			},

			remove: function( handleObj ) {
				jQuery.event.remove( this, liveConvert( handleObj.origType, handleObj.selector ), handleObj );
			}
		},

		beforeunload: {
			setup: function( data, namespaces, eventHandle ) {
				// We only want to do this special case on windows
				if ( jQuery.isWindow( this ) ) {
					this.onbeforeunload = eventHandle;
				}
			},

			teardown: function( namespaces, eventHandle ) {
				if ( this.onbeforeunload === eventHandle ) {
					this.onbeforeunload = null;
				}
			}
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} : 
	function( elem, type, handle ) {
		if ( elem.detachEvent ) {
			elem.detachEvent( "on" + type, handle );
		}
	};

jQuery.Event = function( src ) {
	// Allow instantiation without the 'new' keyword
	if ( !this.preventDefault ) {
		return new jQuery.Event( src );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;
	// Event type
	} else {
		this.type = src;
	}

	// timeStamp is buggy for some events on Firefox(#3843)
	// So we won't rely on the native value
	this.timeStamp = jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

function returnFalse() {
	return false;
}
function returnTrue() {
	return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	preventDefault: function() {
		this.isDefaultPrevented = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		
		// if preventDefault exists run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// otherwise set the returnValue property of the original event to false (IE)
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		this.isPropagationStopped = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		// if stopPropagation exists run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}
		// otherwise set the cancelBubble property of the original event to true (IE)
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	},
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse
};

// Checks if an event happened on an element within another element
// Used in jQuery.event.special.mouseenter and mouseleave handlers
var withinElement = function( event ) {
	// Check if mouse(over|out) are still within the same parent element
	var parent = event.relatedTarget;

	// Firefox sometimes assigns relatedTarget a XUL element
	// which we cannot access the parentNode property of
	try {
		// Traverse up the tree
		while ( parent && parent !== this ) {
			parent = parent.parentNode;
		}

		if ( parent !== this ) {
			// set the correct event type
			event.type = event.data;

			// handle event if we actually just moused on to a non sub-element
			jQuery.event.handle.apply( this, arguments );
		}

	// assuming we've left the element since we most likely mousedover a xul element
	} catch(e) { }
},

// In case of event delegation, we only need to rename the event.type,
// liveHandler will take care of the rest.
delegate = function( event ) {
	event.type = event.data;
	jQuery.event.handle.apply( this, arguments );
};

// Create mouseenter and mouseleave events
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		setup: function( data ) {
			jQuery.event.add( this, fix, data && data.selector ? delegate : withinElement, orig );
		},
		teardown: function( data ) {
			jQuery.event.remove( this, fix, data && data.selector ? delegate : withinElement );
		}
	};
});

// submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function( data, namespaces ) {
			if ( this.nodeName.toLowerCase() !== "form" ) {
				jQuery.event.add(this, "click.specialSubmit", function( e ) {
					var elem = e.target, type = elem.type;

					if ( (type === "submit" || type === "image") && jQuery( elem ).closest("form").length ) {
						e.liveFired = undefined;
						return trigger( "submit", this, arguments );
					}
				});
	 
				jQuery.event.add(this, "keypress.specialSubmit", function( e ) {
					var elem = e.target, type = elem.type;

					if ( (type === "text" || type === "password") && jQuery( elem ).closest("form").length && e.keyCode === 13 ) {
						e.liveFired = undefined;
						return trigger( "submit", this, arguments );
					}
				});

			} else {
				return false;
			}
		},

		teardown: function( namespaces ) {
			jQuery.event.remove( this, ".specialSubmit" );
		}
	};

}

// change delegation, happens here so we have bind.
if ( !jQuery.support.changeBubbles ) {

	var changeFilters,

	getVal = function( elem ) {
		var type = elem.type, val = elem.value;

		if ( type === "radio" || type === "checkbox" ) {
			val = elem.checked;

		} else if ( type === "select-multiple" ) {
			val = elem.selectedIndex > -1 ?
				jQuery.map( elem.options, function( elem ) {
					return elem.selected;
				}).join("-") :
				"";

		} else if ( elem.nodeName.toLowerCase() === "select" ) {
			val = elem.selectedIndex;
		}

		return val;
	},

	testChange = function testChange( e ) {
		var elem = e.target, data, val;

		if ( !rformElems.test( elem.nodeName ) || elem.readOnly ) {
			return;
		}

		data = jQuery.data( elem, "_change_data" );
		val = getVal(elem);

		// the current data will be also retrieved by beforeactivate
		if ( e.type !== "focusout" || elem.type !== "radio" ) {
			jQuery.data( elem, "_change_data", val );
		}
		
		if ( data === undefined || val === data ) {
			return;
		}

		if ( data != null || val ) {
			e.type = "change";
			e.liveFired = undefined;
			return jQuery.event.trigger( e, arguments[1], elem );
		}
	};

	jQuery.event.special.change = {
		filters: {
			focusout: testChange, 

			beforedeactivate: testChange,

			click: function( e ) {
				var elem = e.target, type = elem.type;

				if ( type === "radio" || type === "checkbox" || elem.nodeName.toLowerCase() === "select" ) {
					return testChange.call( this, e );
				}
			},

			// Change has to be called before submit
			// Keydown will be called before keypress, which is used in submit-event delegation
			keydown: function( e ) {
				var elem = e.target, type = elem.type;

				if ( (e.keyCode === 13 && elem.nodeName.toLowerCase() !== "textarea") ||
					(e.keyCode === 32 && (type === "checkbox" || type === "radio")) ||
					type === "select-multiple" ) {
					return testChange.call( this, e );
				}
			},

			// Beforeactivate happens also before the previous element is blurred
			// with this event you can't trigger a change event, but you can store
			// information
			beforeactivate: function( e ) {
				var elem = e.target;
				jQuery.data( elem, "_change_data", getVal(elem) );
			}
		},

		setup: function( data, namespaces ) {
			if ( this.type === "file" ) {
				return false;
			}

			for ( var type in changeFilters ) {
				jQuery.event.add( this, type + ".specialChange", changeFilters[type] );
			}

			return rformElems.test( this.nodeName );
		},

		teardown: function( namespaces ) {
			jQuery.event.remove( this, ".specialChange" );

			return rformElems.test( this.nodeName );
		}
	};

	changeFilters = jQuery.event.special.change.filters;

	// Handle when the input is .focus()'d
	changeFilters.focus = changeFilters.beforeactivate;
}

function trigger( type, elem, args ) {
	args[0].type = type;
	return jQuery.event.handle.apply( elem, args );
}

// Create "bubbling" focus and blur events
if ( document.addEventListener ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {
		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( focusCounts[fix]++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			}, 
			teardown: function() { 
				if ( --focusCounts[fix] === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};

		function handler( e ) { 
			e = jQuery.event.fix( e );
			e.type = fix;
			return jQuery.event.trigger( e, null, e.target );
		}
	});
}

jQuery.each(["bind", "one"], function( i, name ) {
	jQuery.fn[ name ] = function( type, data, fn ) {
		// Handle object literals
		if ( typeof type === "object" ) {
			for ( var key in type ) {
				this[ name ](key, data, type[key], fn);
			}
			return this;
		}
		
		if ( jQuery.isFunction( data ) || data === false ) {
			fn = data;
			data = undefined;
		}

		var handler = name === "one" ? jQuery.proxy( fn, function( event ) {
			jQuery( this ).unbind( event, handler );
			return fn.apply( this, arguments );
		}) : fn;

		if ( type === "unload" && name !== "one" ) {
			this.one( type, data, fn );

		} else {
			for ( var i = 0, l = this.length; i < l; i++ ) {
				jQuery.event.add( this[i], type, handler, data );
			}
		}

		return this;
	};
});

jQuery.fn.extend({
	unbind: function( type, fn ) {
		// Handle object literals
		if ( typeof type === "object" && !type.preventDefault ) {
			for ( var key in type ) {
				this.unbind(key, type[key]);
			}

		} else {
			for ( var i = 0, l = this.length; i < l; i++ ) {
				jQuery.event.remove( this[i], type, fn );
			}
		}

		return this;
	},
	
	delegate: function( selector, types, data, fn ) {
		return this.live( types, data, fn, selector );
	},
	
	undelegate: function( selector, types, fn ) {
		if ( arguments.length === 0 ) {
				return this.unbind( "live" );
		
		} else {
			return this.die( types, null, fn, selector );
		}
	},
	
	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},

	triggerHandler: function( type, data ) {
		if ( this[0] ) {
			var event = jQuery.Event( type );
			event.preventDefault();
			event.stopPropagation();
			jQuery.event.trigger( event, data, this[0] );
			return event.result;
		}
	},

	toggle: function( fn ) {
		// Save reference to arguments for access in closure
		var args = arguments, i = 1;

		// link all the functions, so any of them can unbind this click handler
		while ( i < args.length ) {
			jQuery.proxy( fn, args[ i++ ] );
		}

		return this.click( jQuery.proxy( fn, function( event ) {
			// Figure out which function to execute
			var lastToggle = ( jQuery.data( this, "lastToggle" + fn.guid ) || 0 ) % i;
			jQuery.data( this, "lastToggle" + fn.guid, lastToggle + 1 );

			// Make sure that clicks stop
			event.preventDefault();

			// and execute the function
			return args[ lastToggle ].apply( this, arguments ) || false;
		}));
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
});

var liveMap = {
	focus: "focusin",
	blur: "focusout",
	mouseenter: "mouseover",
	mouseleave: "mouseout"
};

jQuery.each(["live", "die"], function( i, name ) {
	jQuery.fn[ name ] = function( types, data, fn, origSelector /* Internal Use Only */ ) {
		var type, i = 0, match, namespaces, preType,
			selector = origSelector || this.selector,
			context = origSelector ? this : jQuery( this.context );
		
		if ( typeof types === "object" && !types.preventDefault ) {
			for ( var key in types ) {
				context[ name ]( key, data, types[key], selector );
			}
			
			return this;
		}

		if ( jQuery.isFunction( data ) ) {
			fn = data;
			data = undefined;
		}

		types = (types || "").split(" ");

		while ( (type = types[ i++ ]) != null ) {
			match = rnamespaces.exec( type );
			namespaces = "";

			if ( match )  {
				namespaces = match[0];
				type = type.replace( rnamespaces, "" );
			}

			if ( type === "hover" ) {
				types.push( "mouseenter" + namespaces, "mouseleave" + namespaces );
				continue;
			}

			preType = type;

			if ( type === "focus" || type === "blur" ) {
				types.push( liveMap[ type ] + namespaces );
				type = type + namespaces;

			} else {
				type = (liveMap[ type ] || type) + namespaces;
			}

			if ( name === "live" ) {
				// bind live handler
				for ( var j = 0, l = context.length; j < l; j++ ) {
					jQuery.event.add( context[j], "live." + liveConvert( type, selector ),
						{ data: data, selector: selector, handler: fn, origType: type, origHandler: fn, preType: preType } );
				}

			} else {
				// unbind live handler
				context.unbind( "live." + liveConvert( type, selector ), fn );
			}
		}
		
		return this;
	};
});

function liveHandler( event ) {
	var stop, maxLevel, elems = [], selectors = [],
		related, match, handleObj, elem, j, i, l, data, close, namespace, ret,
		events = jQuery.data( this, this.nodeType ? "events" : "__events__" );

	if ( typeof events === "function" ) {
		events = events.events;
	}

	// Make sure we avoid non-left-click bubbling in Firefox (#3861)
	if ( event.liveFired === this || !events || !events.live || event.button && event.type === "click" ) {
		return;
	}

	if ( event.namespace ) {
		namespace = new RegExp("(^|\\.)" + event.namespace.split(".").join("\\.(?:.*\\.)?") + "(\\.|$)");
	}

	event.liveFired = this;

	var live = events.live.slice(0);

	for ( j = 0; j < live.length; j++ ) {
		handleObj = live[j];

		if ( handleObj.origType.replace( rnamespaces, "" ) === event.type ) {
			selectors.push( handleObj.selector );

		} else {
			live.splice( j--, 1 );
		}
	}

	match = jQuery( event.target ).closest( selectors, event.currentTarget );

	for ( i = 0, l = match.length; i < l; i++ ) {
		close = match[i];

		for ( j = 0; j < live.length; j++ ) {
			handleObj = live[j];

			if ( close.selector === handleObj.selector && (!namespace || namespace.test( handleObj.namespace )) ) {
				elem = close.elem;
				related = null;

				// Those two events require additional checking
				if ( handleObj.preType === "mouseenter" || handleObj.preType === "mouseleave" ) {
					event.type = handleObj.preType;
					related = jQuery( event.relatedTarget ).closest( handleObj.selector )[0];
				}

				if ( !related || related !== elem ) {
					elems.push({ elem: elem, handleObj: handleObj, level: close.level });
				}
			}
		}
	}

	for ( i = 0, l = elems.length; i < l; i++ ) {
		match = elems[i];

		if ( maxLevel && match.level > maxLevel ) {
			break;
		}

		event.currentTarget = match.elem;
		event.data = match.handleObj.data;
		event.handleObj = match.handleObj;

		ret = match.handleObj.origHandler.apply( match.elem, arguments );

		if ( ret === false || event.isPropagationStopped() ) {
			maxLevel = match.level;

			if ( ret === false ) {
				stop = false;
			}
		}
	}

	return stop;
}

function liveConvert( type, selector ) {
	return (type && type !== "*" ? type + "." : "") + selector.replace(rperiod, "`").replace(rspace, "&");
}

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		if ( fn == null ) {
			fn = data;
			data = null;
		}

		return arguments.length > 0 ?
			this.bind( name, data, fn ) :
			this.trigger( name );
	};

	if ( jQuery.attrFn ) {
		jQuery.attrFn[ name ] = true;
	}
});

// Prevent memory leaks in IE
// Window isn't included so as not to unbind existing unload events
// More info:
//  - http://isaacschlueter.com/2006/10/msie-memory-leaks/
if ( window.attachEvent && !window.addEventListener ) {
	jQuery(window).bind("unload", function() {
		for ( var id in jQuery.cache ) {
			if ( jQuery.cache[ id ].handle ) {
				// Try/Catch is to handle iframes being unloaded, see #4280
				try {
					jQuery.event.remove( jQuery.cache[ id ].handle.elem );
				} catch(e) {}
			}
		}
	});
}


/*!
 * Sizzle CSS Selector Engine - v1.0
 *  Copyright 2009, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
	done = 0,
	toString = Object.prototype.toString,
	hasDuplicate = false,
	baseHasDuplicate = true;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
[0, 0].sort(function(){
	baseHasDuplicate = false;
	return 0;
});

var Sizzle = function(selector, context, results, seed) {
	results = results || [];
	context = context || document;

	var origContext = context;

	if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
		return [];
	}
	
	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	var parts = [], m, set, checkSet, extra, prune = true, contextXML = Sizzle.isXML(context),
		soFar = selector, ret, cur, pop, i;
	
	// Reset the position of the chunker regexp (start from head)
	do {
		chunker.exec("");
		m = chunker.exec(soFar);

		if ( m ) {
			soFar = m[3];
		
			parts.push( m[1] );
		
			if ( m[2] ) {
				extra = m[3];
				break;
			}
		}
	} while ( m );

	if ( parts.length > 1 && origPOS.exec( selector ) ) {
		if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
			set = posProcess( parts[0] + parts[1], context );
		} else {
			set = Expr.relative[ parts[0] ] ?
				[ context ] :
				Sizzle( parts.shift(), context );

			while ( parts.length ) {
				selector = parts.shift();

				if ( Expr.relative[ selector ] ) {
					selector += parts.shift();
				}
				
				set = posProcess( selector, set );
			}
		}
	} else {
		// Take a shortcut and set the context if the root selector is an ID
		// (but not if it'll be faster if the inner selector is an ID)
		if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
				Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {
			ret = Sizzle.find( parts.shift(), context, contextXML );
			context = ret.expr ? Sizzle.filter( ret.expr, ret.set )[0] : ret.set[0];
		}

		if ( context ) {
			ret = seed ?
				{ expr: parts.pop(), set: makeArray(seed) } :
				Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );
			set = ret.expr ? Sizzle.filter( ret.expr, ret.set ) : ret.set;

			if ( parts.length > 0 ) {
				checkSet = makeArray(set);
			} else {
				prune = false;
			}

			while ( parts.length ) {
				cur = parts.pop();
				pop = cur;

				if ( !Expr.relative[ cur ] ) {
					cur = "";
				} else {
					pop = parts.pop();
				}

				if ( pop == null ) {
					pop = context;
				}

				Expr.relative[ cur ]( checkSet, pop, contextXML );
			}
		} else {
			checkSet = parts = [];
		}
	}

	if ( !checkSet ) {
		checkSet = set;
	}

	if ( !checkSet ) {
		Sizzle.error( cur || selector );
	}

	if ( toString.call(checkSet) === "[object Array]" ) {
		if ( !prune ) {
			results.push.apply( results, checkSet );
		} else if ( context && context.nodeType === 1 ) {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i])) ) {
					results.push( set[i] );
				}
			}
		} else {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
					results.push( set[i] );
				}
			}
		}
	} else {
		makeArray( checkSet, results );
	}

	if ( extra ) {
		Sizzle( extra, origContext, results, seed );
		Sizzle.uniqueSort( results );
	}

	return results;
};

Sizzle.uniqueSort = function(results){
	if ( sortOrder ) {
		hasDuplicate = baseHasDuplicate;
		results.sort(sortOrder);

		if ( hasDuplicate ) {
			for ( var i = 1; i < results.length; i++ ) {
				if ( results[i] === results[i-1] ) {
					results.splice(i--, 1);
				}
			}
		}
	}

	return results;
};

Sizzle.matches = function(expr, set){
	return Sizzle(expr, null, null, set);
};

Sizzle.matchesSelector = function(node, expr){
	return Sizzle(expr, null, null, [node]).length > 0;
};

Sizzle.find = function(expr, context, isXML){
	var set;

	if ( !expr ) {
		return [];
	}

	for ( var i = 0, l = Expr.order.length; i < l; i++ ) {
		var type = Expr.order[i], match;
		
		if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
			var left = match[1];
			match.splice(1,1);

			if ( left.substr( left.length - 1 ) !== "\\" ) {
				match[1] = (match[1] || "").replace(/\\/g, "");
				set = Expr.find[ type ]( match, context, isXML );
				if ( set != null ) {
					expr = expr.replace( Expr.match[ type ], "" );
					break;
				}
			}
		}
	}

	if ( !set ) {
		set = context.getElementsByTagName("*");
	}

	return {set: set, expr: expr};
};

Sizzle.filter = function(expr, set, inplace, not){
	var old = expr, result = [], curLoop = set, match, anyFound,
		isXMLFilter = set && set[0] && Sizzle.isXML(set[0]);

	while ( expr && set.length ) {
		for ( var type in Expr.filter ) {
			if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
				var filter = Expr.filter[ type ], found, item, left = match[1];
				anyFound = false;

				match.splice(1,1);

				if ( left.substr( left.length - 1 ) === "\\" ) {
					continue;
				}

				if ( curLoop === result ) {
					result = [];
				}

				if ( Expr.preFilter[ type ] ) {
					match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

					if ( !match ) {
						anyFound = found = true;
					} else if ( match === true ) {
						continue;
					}
				}

				if ( match ) {
					for ( var i = 0; (item = curLoop[i]) != null; i++ ) {
						if ( item ) {
							found = filter( item, match, i, curLoop );
							var pass = not ^ !!found;

							if ( inplace && found != null ) {
								if ( pass ) {
									anyFound = true;
								} else {
									curLoop[i] = false;
								}
							} else if ( pass ) {
								result.push( item );
								anyFound = true;
							}
						}
					}
				}

				if ( found !== undefined ) {
					if ( !inplace ) {
						curLoop = result;
					}

					expr = expr.replace( Expr.match[ type ], "" );

					if ( !anyFound ) {
						return [];
					}

					break;
				}
			}
		}

		// Improper expression
		if ( expr === old ) {
			if ( anyFound == null ) {
				Sizzle.error( expr );
			} else {
				break;
			}
		}

		old = expr;
	}

	return curLoop;
};

Sizzle.error = function( msg ) {
	throw "Syntax error, unrecognized expression: " + msg;
};

var Expr = Sizzle.selectors = {
	order: [ "ID", "NAME", "TAG" ],
	match: {
		ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
		ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,
		TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
		CHILD: /:(only|nth|last|first)-child(?:\((even|odd|[\dn+\-]*)\))?/,
		POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
		PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
	},
	leftMatch: {},
	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},
	attrHandle: {
		href: function(elem){
			return elem.getAttribute("href");
		}
	},
	relative: {
		"+": function(checkSet, part){
			var isPartStr = typeof part === "string",
				isTag = isPartStr && !/\W/.test(part),
				isPartStrNotTag = isPartStr && !isTag;

			if ( isTag ) {
				part = part.toLowerCase();
			}

			for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
				if ( (elem = checkSet[i]) ) {
					while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

					checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
						elem || false :
						elem === part;
				}
			}

			if ( isPartStrNotTag ) {
				Sizzle.filter( part, checkSet, true );
			}
		},
		">": function(checkSet, part){
			var isPartStr = typeof part === "string",
				elem, i = 0, l = checkSet.length;

			if ( isPartStr && !/\W/.test(part) ) {
				part = part.toLowerCase();

				for ( ; i < l; i++ ) {
					elem = checkSet[i];
					if ( elem ) {
						var parent = elem.parentNode;
						checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
					}
				}
			} else {
				for ( ; i < l; i++ ) {
					elem = checkSet[i];
					if ( elem ) {
						checkSet[i] = isPartStr ?
							elem.parentNode :
							elem.parentNode === part;
					}
				}

				if ( isPartStr ) {
					Sizzle.filter( part, checkSet, true );
				}
			}
		},
		"": function(checkSet, part, isXML){
			var doneName = done++, checkFn = dirCheck, nodeCheck;

			if ( typeof part === "string" && !/\W/.test(part) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn("parentNode", part, doneName, checkSet, nodeCheck, isXML);
		},
		"~": function(checkSet, part, isXML){
			var doneName = done++, checkFn = dirCheck, nodeCheck;

			if ( typeof part === "string" && !/\W/.test(part) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn("previousSibling", part, doneName, checkSet, nodeCheck, isXML);
		}
	},
	find: {
		ID: function(match, context, isXML){
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		},
		NAME: function(match, context){
			if ( typeof context.getElementsByName !== "undefined" ) {
				var ret = [], results = context.getElementsByName(match[1]);

				for ( var i = 0, l = results.length; i < l; i++ ) {
					if ( results[i].getAttribute("name") === match[1] ) {
						ret.push( results[i] );
					}
				}

				return ret.length === 0 ? null : ret;
			}
		},
		TAG: function(match, context){
			return context.getElementsByTagName(match[1]);
		}
	},
	preFilter: {
		CLASS: function(match, curLoop, inplace, result, not, isXML){
			match = " " + match[1].replace(/\\/g, "") + " ";

			if ( isXML ) {
				return match;
			}

			for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
				if ( elem ) {
					if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n]/g, " ").indexOf(match) >= 0) ) {
						if ( !inplace ) {
							result.push( elem );
						}
					} else if ( inplace ) {
						curLoop[i] = false;
					}
				}
			}

			return false;
		},
		ID: function(match){
			return match[1].replace(/\\/g, "");
		},
		TAG: function(match, curLoop){
			return match[1].toLowerCase();
		},
		CHILD: function(match){
			if ( match[1] === "nth" ) {
				// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
				var test = /(-?)(\d*)n((?:\+|-)?\d*)/.exec(
					match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
					!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

				// calculate the numbers (first)n+(last) including if they are negative
				match[2] = (test[1] + (test[2] || 1)) - 0;
				match[3] = test[3] - 0;
			}

			// TODO: Move to normal caching system
			match[0] = done++;

			return match;
		},
		ATTR: function(match, curLoop, inplace, result, not, isXML){
			var name = match[1].replace(/\\/g, "");
			
			if ( !isXML && Expr.attrMap[name] ) {
				match[1] = Expr.attrMap[name];
			}

			if ( match[2] === "~=" ) {
				match[4] = " " + match[4] + " ";
			}

			return match;
		},
		PSEUDO: function(match, curLoop, inplace, result, not){
			if ( match[1] === "not" ) {
				// If we're dealing with a complex expression, or a simple one
				if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
					match[3] = Sizzle(match[3], null, null, curLoop);
				} else {
					var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);
					if ( !inplace ) {
						result.push.apply( result, ret );
					}
					return false;
				}
			} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
				return true;
			}
			
			return match;
		},
		POS: function(match){
			match.unshift( true );
			return match;
		}
	},
	filters: {
		enabled: function(elem){
			return elem.disabled === false && elem.type !== "hidden";
		},
		disabled: function(elem){
			return elem.disabled === true;
		},
		checked: function(elem){
			return elem.checked === true;
		},
		selected: function(elem){
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			elem.parentNode.selectedIndex;
			return elem.selected === true;
		},
		parent: function(elem){
			return !!elem.firstChild;
		},
		empty: function(elem){
			return !elem.firstChild;
		},
		has: function(elem, i, match){
			return !!Sizzle( match[3], elem ).length;
		},
		header: function(elem){
			return (/h\d/i).test( elem.nodeName );
		},
		text: function(elem){
			return "text" === elem.type;
		},
		radio: function(elem){
			return "radio" === elem.type;
		},
		checkbox: function(elem){
			return "checkbox" === elem.type;
		},
		file: function(elem){
			return "file" === elem.type;
		},
		password: function(elem){
			return "password" === elem.type;
		},
		submit: function(elem){
			return "submit" === elem.type;
		},
		image: function(elem){
			return "image" === elem.type;
		},
		reset: function(elem){
			return "reset" === elem.type;
		},
		button: function(elem){
			return "button" === elem.type || elem.nodeName.toLowerCase() === "button";
		},
		input: function(elem){
			return (/input|select|textarea|button/i).test(elem.nodeName);
		}
	},
	setFilters: {
		first: function(elem, i){
			return i === 0;
		},
		last: function(elem, i, match, array){
			return i === array.length - 1;
		},
		even: function(elem, i){
			return i % 2 === 0;
		},
		odd: function(elem, i){
			return i % 2 === 1;
		},
		lt: function(elem, i, match){
			return i < match[3] - 0;
		},
		gt: function(elem, i, match){
			return i > match[3] - 0;
		},
		nth: function(elem, i, match){
			return match[3] - 0 === i;
		},
		eq: function(elem, i, match){
			return match[3] - 0 === i;
		}
	},
	filter: {
		PSEUDO: function(elem, match, i, array){
			var name = match[1], filter = Expr.filters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			} else if ( name === "contains" ) {
				return (elem.textContent || elem.innerText || Sizzle.getText([ elem ]) || "").indexOf(match[3]) >= 0;
			} else if ( name === "not" ) {
				var not = match[3];

				for ( var j = 0, l = not.length; j < l; j++ ) {
					if ( not[j] === elem ) {
						return urn false;
		},
		ID
				return true;
			} else {
				Sizzle.error( Sizzle.selectors = {
	order: [ "ID", "NAME",name );
	lementsByTa+6'
				var testelem, match){
			var type = match[1], node = elem;
			switchped() ) {
				case 'isxo" === elemm		firxo" ===			while (, node , noem.previousSibling)	 ) {
						if , noe].nodeType === 1 )  {
							return urn   {
						}
					}
					if ( type === 	fir" 1 )  {
						return tru 	}
					}
			, node = elem;
	= elemm		laxo" ===			while (, node , noentTeusSibling)	 ) {
						if , noe].nodeType === 1 )  {
							return urn   {
						}
					}
					return true;
	= elemm		nxo" ===			var rs}s9A + fn.			var not = matchame ];

=			vnodeType fn.		nts[fix] === 0				}
					return 				}
		emm		nxo" ){
			var dILD.testselector						var parent = elem.parentchame ];

while ( pa(et[i] =siz jQuerem.t
			var d!even).test(eselecch) >= 0) ) ion()--fo ch[3]) >h[3];

		hile (,et[i] =n !elem.fir	hile; hile (, node , noentTeu!inplace ) {ing)	 ) {
						if , noe].nolace ) {	 ) {
				select= ++)--fo>h[3];

;
							} ector						va=siz jQuer.t
			var urn 				}
		emm		nxo" ){
iffr parent				selectb jQuer.teckSet, nodeCheck, isXrn 			lem.type;
		/ters[ name ].teckhandleObj:fined" ) {
				var retID", "NAME",name );
	lementsByTa+6'
				var testelem, match){
			var type = match[1], node = elem;
			switchped() ) {
				case 'isxo"	if ( lem){
			resByT#ch){
) {
				var firxo" ==Iwhile (, node , noem.previousx;
			return = 0; checkSet[i] g",
				isTag = isPid function(ma=== "nth" ) {
				// pae , noem.previousx;
			reft = masout loem || false :
			ckSet)st(elem.nodeName);
		}
	},
	setFilteon(ma=== "nth" isXML ) {
				re , noem.previousx;
			re1] ===						result.pust(elem.n			isTag = isP}
	},
)( elem ) {
		 < l; j++ch, i, cu ( e ( !isXML && Expr.attrMae , noem.previousSiblif ( name === "cr teste, not, 	PSEUDO: ){
			
// More  checkS	PSEUDO: ){
			
// More{
						i		var d				
// More 	} else ue );
			}
	
// More  function(chn			isTag = is === el,rn falst;
		ite, noteler ( ; iing)	 ) {
			2"cr tesc		}
	}, "not" )when the inpute, not,} else ue );
	 ) {
				!="  funct	 ) {
				=" ?rn falst;
		=;
					  funct	 ) {
				*=" ?rn falst;
 < l; j++							if (  funct	 ) {
				~=" ?rn fae1] ===lst;
	+				curLoop[i]							if (  funct) {
		 ?rn falst;
	em te, not!ction(ele funct	 ) {
				!=" ?rn falst;
	!=;
					  funct	 ) {
				^=" ?rn falst;
 < l; j++							"	if ( funct	 ) {
				$=" ?rn falst;
 if ( Exlst;
 	},
		lt:					 	},
		)		=;
					  funct	 ) {
				|=" ?rn falst;
		=;
					 	};

	;
 if ( Ex0,:					 	},
		oggl)		=;
					 +		-"  functmatch[1].toLowelem.disabled , i, match, array );
			} else if ( name ===2"contains" ) {
		 array.lenn (elem.textContent || elem.innerText || Sizzle.getText([ elem ]) || "").indexif ( fi	CLASS: /rts[1]," ) {
		 functionlterescapxt = context;a) {
			retur|select|
			==				ame ]+};

Sients ter = Expr.filter[ typh, i, curLoession
		if ( expr  live = eventression
		if ( expr.sourc
	+	(/(?!asDu-]|\)(?!asD(-]|))/.sourc
var tych[1];
				anyFound =   live = eventr/(^re we check ?)/.sourc
	+	ession
		if ( expr.sourc
] === "~=" )(\d+if t rescapx): "focure noults );
t = context;a );
s[i].getAcurLoa );
t =s );
some sort o"" ) ent youa );
s[0set = posPrlicate;
	match =null; i++ ) {
				if ( chec || "").indselector, ret, cur,	r = Sizzl || "on( orig,Pet is h[3], null					 to d funmdisca.ID.tebrowse&& !Ecapcesste valuce, "&"n 		a  !eldle  thiszl || "d the hbuizztermethods = fuA inf "&ifitext){
	: function {
 || "dholds DOM conte= fu((e.keyCodattacate = f context
		},
		NAMbrowse&)
lector s );
some sort o"" ) ent youe );
			ee );
			h = " ".?:[\w !elss[0seent.lse :
		ttp://isovidn IDmatlb	},rmethodXML && includes  !!e
sed under {
	oults );
t = context;a );
s[i].getAcurLoret );
				ype !== 9 ) {; i++ )length; i <( context && y );
	odeType === 1 ) {
			for ( i s );
some sort oi++ ) {
				iftec || "").indem;
			switc

				for ( = 1;
		},
		l					r] - 0urn urn fa ter = Exp{
		= 1;
		},
				return ret.length ==
			return= 1;
s, seed );
		Sizz.parentNode :
						= 1;
s, n ret.length ==
			return= 1;
s, seed );
		Sizz
	
		jQuery.attCLASS:}"focure n) {
					,3],urn 	checkFn vent.special[ e );
			h = " ".?, 0].eD );
			Pr = m[3]lengt < results"ID", "NAME"a, bfor ( i = 0; ) {
	bfor ( ith; i++ ) {
				r d!even)ocument;

	ts.length =!a.?, 0].eD );
			Pr = m[3]) {
b.?, 0].eD );
			Pr = m[3]lengtQuery.attr.?, 0].eD );
			Pr = m[3]?( el:tch[3] 	jQuery.attr.?, 0].eD );
			Pr = m[3(b) & 4]?( el:tch[3}"fo.parentNo < results"ID", "NAME"a, bfor ( i.lengpesults[bpesults[aupesuat[i] =n !el_chapesubt[i] =n !el_gtQue[ curaups[als[fi( fn, arctiocontexachiidnnt) {l,arent =& !wt earstChi = 0; ) {
	bfor ( ith; i++ ) {
				r d!even)ocument;


^\w/.testtiocontexachi],urn 	s ( && dnnt) {l)arent =&dt liqu key					indem;
			 = 0; ucurLoohapelengtQuery.att],urn 	checkE"a, bfo


^\w/.tesno;
					sarechi], "" t
	args[0contexachise;
onnfirstindem;
			 = 0;!aapelengtQuery.att-1ange = function t!hapelengtQuery.attch[3] 	jQuw/.Ogs[rwis testy' elemmefar thfunctiargs[0treelem.typnt.djQuw/.wn: uizd apeIDmlse lle  ;
		
		[i] =n !elhandle0, 0].so exprn true;
e[ clengtQuapm.type !==e[ cl;gtQue[ cure[  ( ; i < l; i++ 	jQue[ curhap{
				namespae[ clengtQubpm.type !==e[ cl;gtQue[ cure[  ( ; i < l; i++ 	jQupe !=apmext" === ebe !=bp checkSet[i]f th );
	walType a, fngs[0treellooType ndlerise;
 ==anctChi;
							var pass	// Fice(1	// brn ret.length  = 0; p else !=bps, se.innerText || ],urn 	checkE"apif ( bps, se.indexif ( [i]f tWthfn ( winm=== "~ apegs[0treelem.dt li],urn 	y					indturn i % 2 ===e ue );],urn 	checkE"a, bpif ( -1		i		var],urn 	checkE"apif ( b i < l;  so a],urn 	checks"ID", "NAME"a, b ) ) {
r ( i = 0; ) {
	bfor ( itery.attCLASS:	eturn fn.e[ cura			var urn 	{
				namespae[ clengtQu ]( matc) {
	bfor ( ituery.att-1an	text, isX[ cure[  		var urn 	{
3] 	jQuery.attch[3}"fotp://UtilitylastToggle;
		eryreivurn el[0t				lst;
	 ( =zl || "d ( DOM conte= ( var j = 0, s"ID", "NAME"e( thior ( et );
				er   {
			tch[ type ].exec(;= match.ha ret.lengthwerCase() =ch.handle://G && part					
			t				contexa"" CDATA conte=0) ) {
				alse :
			ckSe3st(elem.nodeN:
			ckSe4 (parts[0] =+me );
	lemeV ) {
			velem a "&surn aryt	var funcanyFcepte0, Elemeconte=0)= function testChange:
						e8 (parts[0] =+me ( var j = 0, lions in [\w !els< l; i++ ) {
ery.attCLASS( orig,C				 to  Siza.ID.tebrowse&&unctionctivate:s		}
(elem
			rig,q 200he hby h when Blackber(a"" psovidn ID !!ear, "")[\\]+)+|[>+~])]f tWt' elgourn eotia== 1 IDmak[0].typetivate: {
					ler, fitd
(ele( et ) is h=.special[ c" }, hen Bla("div"l,rn i;
};"she ca		==		ve D}, ()) j = im3n+2', is h[3];
HTom he"<a
(ele='		==i;
+		'/>" elem, Ia== 1 ir, ceot 1 && contivate:,ction. It falatus)+\)|\ Copyr ir,qu kestChet );o		},
special[ e );
			h = " "2',;o		h[3se&t but y() is ,);o				} ector		fo


^ arctio !!ear, ""keydown:dt l handleObj.preTexaftery.dh when Blackbe)]f tWe.keyslows t	vars a, fnh[ togs[rebrowse&s (hbind t.tebranc	varf ( evenspecial[ the document #6 t.pre(parts				break.IDs"ID", "NAMEById(match[1]);
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return !== "unde?  h[dunction(match,ML = Sizzlhn			isTag = i				vry 4.6 returns
				hn			isTag = i				sPid f	lemeV ) {unction(match,ar ret =					if (  = [], results
			v {
				retu.IDs"ID", "NAMEe , noem.previousSibliz jQue#3861)
	(chn			isTag = i				vry 4.6 returns
					(chn			isTag = i				sPid feven)ocumenteturn = 0; checkSet[i] iz jQi] iz j	lemeV ) {unction(ma;ults
	 ) {
eo			 Copyrtor		() is < l; ;o		},
 is h=.dexOf(f tre(?:\(hlueter.06/10/})kSet[\\]+)+|[>+~])]f tC				 to  Siza.ID.tebrowse&&unctionc urnctivate:s)]f t
			}dourn  old = expr, result = [],

^ art" }, fIDmak[0tivate:
 "NAME"vh=.special[ c" }, hen Bla("div"ll; div.re
		dtor		()special[ c" }, C, Elemm[3]fo


^ ar event.butno;0, Elemexachi], "" ( evensiv. old = expr, result = [],parts.pop();
				p				break.TAGs"ID", "NAMEById(match[1])eviousSibli].getAttribute("name") === matmatch[1].replace(/\iousQuery| ele Hanpos],ure;0, ElemeCheck par) || "" ).leng*urn urn false;tmpesult		ret.push( results[i];n context.gn ret.length === 0 ? null : retfr parent				selectb jQuetmp	return context.getElementsByTagName(matc.getAttrtmpan	text, isselector, ret, cuts
	 ) {
f tC				 to  Siza.I=zl sTag = i&unctioncisXML) ) {
artSl sTag = is; div.[3];
HTom he"<a
artS='#'></a>" e( evensiv.	} ector		fusin fo1)
siv.	} ector		n			isTag = ivry 4.6 returns
			, issiv.	} ector		n			isTag = isPartStrvry 4.#";
				p				bDO: ){
			.artSl=(elem, i){
			return i === lem.n			isTag = isPartSt, 2) cuts
	 ) {
E"vh=.dexOf(f tre(?:\(hlueter.06/10/})kSet[ evenspecial[ q 200text, isAnction( \\]+)+|[>+~])]le ( expContext =Contex,ME"vh=.special[ c" }, hen Bla("div"ll;  div.[3];
HTom he"<p }
	},='TEST'></p>" eleof theeturnet;
		(e) {}
ue
	r = f sh(unicz jQcharacbefor
			r(elem) ,qu rTexmz j	=0) ) {
div.q 200text, isAnct lem)v.q 200text, isAnc(".TEST],parts.poatch){
			varr + "(\\.ur,	r 	Context = context;q 200match[1]);
(result ? co		varreturn [];
	}
	
	if ( !selector |Quw/.Ourncu f q 200text, isAnctgleent.node !selects |Quw/.(IDs0-\uFFFF\-do;
		 !!elileent.HTom  !selects)Check parest(parts!ad)
	do {
		chunker.eray( checkSet,  {
			ret = Sizzle.finlectb jQulector Engi Expr.filtlts );
	}
 {
			rq 200text, isAnc(q 200),uniqueSode = elemd undeqsaE			sm === partig,qSA	 !!e falrnamerncglehen Bla-;o		(paq 20ien(match, Went =& !!elar, ""kelem.by ler, f0he h =& !queSIDsont 1 && co(match, \)|\ !!e});
}p		
			tar th(T(e)kdown:Andrve Dup {
nh[ t part	chasDup)(match, IEe8 incl;
		 !!el[3];=== 1 tivate:s)]		heckSet[i] === true n = 0; checkSet[i] = true n = 0ame);
		}
	},
	setFent.adery.isFunction]le ( expttribute("nrn aipttribute("nrn he"__+\]|\\__"em.parenlector Engi Expr.filtlts );
	}
 {
			rq 200text, isAnc(4.#";==i;
+		] ===q 200 ),uniqueSodee = elemd undepseudoE			sm =e = elemturallctor Engi i] ==curLoop;
};	varreturn nrn heolLoop[i] = = true;
							}return n CopyrisTag = is Pid (match){
			return
eturn
etuatch, h Expr.fiexpContex;q 200match[1]);
(result ? co;ults
			vush( resulem.flileexpContextoop;
};Contex[lem.fl] heolLContex[lem.fl]{
3] 	jQuE"vh=.dexOf(f tre(?:\(hlueter.06/10/	})kSet}t[\\]+)+|[>+~])] fn.atml},
special[ e );
			h = " ",rn pr, con},
atmlxpr, context, isX).cltmlxpozMr, context, isX).cltmlxwebkitMr, context, isX).cltmlxmsMr, context, isem.tyseudoW!!e foop === reslector E arctem.shouurLfail {
				nnyFcept= expr://G cko includes 
			swiunctioncon(ele[3steadrn pr, conent youe );
			ee );
			h = " ", ":+\]|\\ (matc
lemd unde pseudoE			stoop;
}yseudoW!!e foofo:
//  -
ck par) || a ) ) {
	tion(expr, context, isXML){
	var s et;

	if (Loop;
};	lecto gth === 0 ?yseudoW!!e f) {
 {
		 functiurn frn "radif (Loo
			var type = mapr, conent youet;

	if (LoElementsByTagNed under the turn !== "un		return [];
	}

	for ( var i = 0, l = Expr.outs
	 ) })kSet[\\]+)+|[>+~])]"NAME"vh=.special[ c" }, hen Bla("div"ll;; div.[3];
HTom he"<E"vh}
	},='t( mae'></E"v><E"vh}
	},='t( m'></E"v>" elem, O
	ranet;
		; i <at ?tchdh}
	},(elem(06/9.6)lem, A in,iltlt, argumentsame") === matCesult.pusacbuallct !winsn(expr, siv. old = expr, Cesult.pust(esiv. old = expr, Cesult.pu("e],parts.poatch){
			var + "(\\.) {
f theeturnet| a )}
	},l sTag = is, incl;
		 : [];[ namesm(06/3.2); div.6'
	tor		nresult.puscalc"t = posPrsiv. old = expr, Cesult.pu("e],parts.poatch1{
			var + "(\\.) 	tych[1]{
			v				resullse " isXM"r tych[1]reak. isXMs"ID", "NAMEById(match[1]);
				//r ( i = 0;	for ( var i = 0, l = resultCesult.pusry 4.6 returns
				// nodes that t, isXML){
			match = " " + Cesult.pu(.replace(/\\/g, "; {
E"vh=.dexOf(f tre(?:\(hlueter.06/10/})kSet[astToggletion(match, Prsirec(soFalementById !== "undefined" && !isXMLes thaviousSibling) && elem.nodeType !== 1t = match[1];
			match.werCase					}
				}

	 ) {
						if ( !werCase() =[sir[], rere nou= curLp === resul= null &&D", "NAME",nion testChckhandleObce ) {ing)	 anyFound = found 					}
		estChckhset	}

				r );
			} elsME",nion testCh = 0; checkSet[i] // nodesyFound estChckhandleObj:fined" ) {
			estChckhset 
			if  elsME",nion testCh = 0ame);
		}
	},
	setFiltee[ clengtQuent.data = mat}

				r );
			} elsME",nwerCase() =[sir[], rext, isXML){izzle.fildisabled: fun"`").replace(k = partPrsirec(soFalementById !== "undefined" && !isXMLes thaviousSibling) && elem.nodeType !== 1t = match[1];
			match.werCase					}
				}

	 ) {
						if ( !werCase() =[sir[], rere nou= curLp === resul= null &&D", "NAME",nion testChckhandleObce ) {ing)	 anyFound = found 					}
		estChckhset	}

				r );
			} elsME",nion testCh = 0; checkSet[!anyFound ) {
		 nodes that ad estChckhandleObj:fined" ) {
				estChckhset 
			if  etTeusSibling)	 )  ( vu(context),
		soFar = E",nion testCFiltee[ clengtQuend = found }

					expr r );
			} e elsME",nheckSet[i] ==eckFn = dirChec(soFa	estC] ,parts.pop();
				pQuent.data = mat}

				 r );
			} e }		} elsME",nwerCase() =[sir[], rext, isXML){izzle.fildisabled: fun"`")!= null; i++ ) },
special[ e );
			h = " "l; i++ ) }?= context;a, b !expr ) {
ase !=b nodeal; i++ ) }?=al; i++ ) (b) : }

	Set} := context;a, b !expr ) {
!!(r.?, 0].eD );
			Pr = m[3(b) & 16 = function(ex	 node=(elem, i){
			retuf te );
			h = " "yCod "&ifitdandle0
	ss far that incl;
		yet  !wintuf t(suataas"chan to no	}
		}06/10 - #4833) )]"NAME );
			h = " "y=place(/?testChow];
D );
			rNotTag ): 0) e );
			h = " "2',;e = mat );
			h = " "y?at );
			h = " "=== elem.tontexHTom"] = isPartCLASS: // (but note=(elem, i){

	if ( context.n~])]"NAMtmpS results[] = r			er  ById(m	varo		},
= true n = 0; che? [= true ]				checkS elem, Pr = m[3]0-\uFFFF\-mu mabej:finxaftery par dirChlem, An windmu ma:des(ar = m[3{l)aem.typopyr hromiurn fdown: pare"" (n true;
	t.data = {
		 functiurn frcontext );
		} eoo
			va] = r	+)--fo ch[3led:Process( sead click dblclick= {
		 functiurn fpr: expr}xt, Process( se	checkSet = seProcess(h,aret the conng*urler
				co		tch[ type ].exec( );
			oope !== 1t = match[1];
			maction(el = chunker.oopif ( tmpS re, curLoop = seteckFn = dirChec] = r( tmpS re, c( orig,EXPOSEseover m; i < leckFn ;seover mo.((?:[\w\u00c0-\uFFFF\;seover mo.(([":".fileover mo.((			retur;seover mhasDup?:[\w\u00chasDuplica;seover murn []; ( var j = 0, ;seover m	 nodD ) head)
	do {
		;seover m; i++ ) },
!= null; i++ )  or/})kSet[SS: /runti;
		/Unti;$
		"r
					s)  {
		/^re 
					s|)  {Unti;|)  {All{
		"ig,Note:rctem.= even.shouurLbeji		}
v!
 *oreven"lctpexOtdan
			!= nul	"rmultiProcess( se/,
		"isS, null		/^.[^:#\[\.,]*$
		""" ) t =s );
some sort o"" ) 		"1]," )eover mo.((	 function;useover mfnmo.te""({ar m = c){
	var s uery.each( ("b et );
				/ WinretuStartPrer  " m ="jQuery.each(		cots.poat;


^\h[ type ].exec( );
		/ Win	},
				return ret.length cots.poatr = checkSet	gine - v1 : con = chunker/ Wiif ( rearts.shif[1].reop();
				pQu ar event.butt){
	: func.getAtachihasDup		pQuh[ type ].func	},
				nn respe !== 1t net.length ==h[ type ].rs[i];n etur!== 1t r inplace && found esp[r, set){
t[nh, context){=
							resn);
};

Sizzlpr r );
			} e els	} e }		} els	izz
	
		jQuery.attCLASS:},

d/i).test( elem 	for ( j ("b et )	for (s ems.push({tandleObj m.t
			var Win dirChes being unloade\h[ type ].exec( );
		/for (s		},
				return ret.length =ound eover m; i++ ) (ar Wi,	/for (ss, se.length ==
				var d!even).ls	izz
	
	)SS:},

ddes c){
	var s uery.each( ("b t
			var WinretuStartPrwinnow(r Wi,	 = chunker isPa(			retu,	 = chunk)SS:},

dr ) {
		){
	var s uery.each( ("b t
			var WinretuStartPrwinnow(r Wi,	 = chunker}

	S  " m) {
"jQuery.each(SS:},
e = s		){
	var s uery.each( ("b t
			va!, contextXnodne - v1 :irChec = chunker/ Wi  0, l = Expr.ou},

d: handl		){
	var s uery.eacstor += part ("b et );
				 {; i );,.e[ cur/ Wii0handleObj.deover m	 s );
	}0-\uFFFF\-atch[1] || ""ById(mapr, con},
{},	 = chunkerl select1s.shif[1].re[ cch[2]\uFFFF\ = parts.pop();

		}

		event.cur2]\uFFFF\ = part		return ret.length ==Process( sead clickch.handleund ) {
	pr, coneProcess(h,
				pQuent.datoneProcess(h, )eover mo.((	 functionrn "raduery.each( ?		vnodeTys.push({

	if ( context.n,ML = Winr += part 			}
		},r
				co			} e }		} elsME",n	namespae[ ci] =urhow];
D );
			ri] =ur	!=;
	= 1 && (parts[;

		}

ts[0]) && nr) || a ) ) {
	Quent.data =t.datoneProcess(hoop[i] = k par) || .jq 200 ?r) || .< l; (=urcu ( erles.push(=urcm	 ] = fals context){=
			retur{
ts[0]) &:{

	if ( coTag :c(soFal sel:rl sele}match){
			return
	reture[ cure[  ( ; i < l; i++th cosel\\/gen).ls	izz
hat t, isXMCLASS:	eturn fn.ar curionrn "raduery.eacsh( ?		vnos.push({

	if ( scontext.n,ML = Winr += part 	trFn ) 
;

		}

		event.cur/ Win	},
				return ret.length e[ cur/ Wii.handleu	namespae[ clengtQu	checkSe }?=Se .< l; (=urcu ( erles.push]reak.pr, context, is((soFa

	if ( se.length ==
			returne[ cl;gtQur r );
		ByTagNetrue;
						e[ cure[  ( ; i < l; i++th rune ) lts, c!=urhow];
D );
			rse {tc) {
		= 1 && (parts[;
 r );
			} e }		} els	izz
	
		jQueryoatr = checkS.filt? eover mhasDup(rt.no		CLASS: "b t
			var WinretuStartPriftec": handl"jQuery.eacsh(SS:},
e = arD funmdisc	soFar = m[3];
	anetivate: {
		in = ar	soFpr, coeed &&1)
	(chte:s)]< l; :ID", "NAME"e( t{
r ( i = 0;
				,ML = SizzlestCFiltext),
		soFar = Et
			vaeover m	ns );
	}/ Wii0h,		pQu arIL && rece= ss<at / optir	soFts[0]) && !Eus.djQuQu arIL && rece= ss<rethoptir	soFt,urn 	s achihs.djQuQuace(/?ts.push({e( t{
r:ar Winr ; i ()in [\w; i()< l; i++ u arLoc = test[ar = m[3];
		
		desir {
	ivate:
 Et
			vaeover m	ns );
	
pQu arIL && rece= ss<ateover ];=== 1,y par dsByTe = " "yCodhs.djQuQestChjq 200 ?r() =[( pare , no/ Wi  .ou},

dad= c){
	var s uery.eactor += part ("b et )set 
	= Sizzle.isXML(ciltext),
		so?rn fas.push({

	if ( context.n,ML = Winr += part 			}
	eover mltlts );
	}uery.each(			}
hrom )eover mmeor 	}/ Wi j = contexrts.shit
			var WinretuStartPrisDe;
onnfirst(r.leftMa)st(eisDe;
onnfirst(rhroftMa)s?		}
hrom:t	gine - v1hasDup( hrom)  .ou},

dandtextStr = typeo( ("b t
			var Winad=	}/ Wi )  {using e, curL	var m, A p+ )mlsey3], null					 to  Siza.I=zle = " "yCodse;
onnfirstiunct
			at.getEleme(shouurLbeji		}
v!
 *far thfea],ure).).replace(isDe;
onnfirst(riz jQ( ("bt
			va!iz jQ, c!r" 1 ) ) {
				v, cr" 1 ) ) {
				h = 0; checkSet1et}t[eover moach({ar function(elem, i"e( t{
r ( i	} else {
				for ( ; i < l; i++t
			vaile (, nodheckSet[i];:
						el1heckSet[i] =rFn )  "") +					sion(elem, i"e( t{
r ( it
			vaeover mdie.getTextdone++, chech(SS:},
e+					sUnti;ion(elem, i"e( t; i )unti;

r ( it
			vaeover mdie.getTextdone++, chec )unti;

SS:},
en	checkbox: fun"e( t{
r ( it
			vaeover mnth.getText2			r	var urn 	ch(SS:},
e+  {eckbox: fun"e( t{
r ( it
			vaeover mnth.getText2			if ( typeof cont

SS:},
en	chAl;ion(elem, i"e( t

r ( it
			vaeover mdie.getTextdr	var urn 	ch(SS:},
e+  {Al;ion(elem, i"e( t

r ( it
			vaeover mdie.getTextdif ( typeof cont

SS:},
en	chUnti;ion(elem, i"e( t; i )unti;

r ( it
			vaeover mdie.getTextdr	var urn 	c )unti;

SS:},
e)  {Unti;ion(elem, i"e( t; i )unti;

r ( it
			vaeover mdie.getTextdof ( typeof contexunti;

SS:},
et,urn 	sion(elem, i"e( t

r ( it
			vaeover mt,urn 	(		for ( ; i < l;.	} ector		return "SS:},
en [\w; iion(elem, i"e( t

r ( it
			vaeover mt,urn 	(		for 	} ector		fo

:},
envar nosion(elem, i"e( t

r ( it
			vaeover m== elem..getTextdno	}
	"a)s?		}
	for nvar noD );
			rNotTag  nvar noW< low e );
			m:t	gine - v1ltlts );
	}ens in [\w !els< l; rL	,L){
	var s etByIdf3]lengteover mfn
// More ML){
	var s unti;, uery.each( ("b et );
				ne - v1ltp(ar Wi,	fnexunti;

SS:str( left!runti;rn "rad=== eloFar = EProcess( seunti;SS:	eturnet = coontextXnod= Sizzle.isXML(ciltext),
		so(parts[0] ==dne - v1 :irChec = chunkerr] && (che	jQueryoat/ Win	},
		.filt? eover mhasDup() ) {
r		CLASSurnet = (/ Win	},
		.filtNotrmultiProcess(rn "raduery.each([2] =r
					s)  {rn "rad=== eloFar = Eeryoatr = re "&su(& (che	jQuery		var WinretuStartPriftecetById"" ) ent yoargelects).join(",")< l;  so	var eover mo.te""({ar m) {
		){
	var s n [];
ens ser.ex{
r ( i = 0;.ex{
r ( i	}

		//":des(m );


		+ ")" (che	jQuery		vaens sparts.poatch1{?t	gine - v1 : c.pr, context, is(ens si0h,	if ( e? [ ens si0h et = [m:t	gine - v1 : c.pr, con(n [];
ens s(SS:},
e =dieion(elem, i"e( t; sirecunti;

r ( i| ""ById(stCh {
		forase() =[sir[], r	namespae[ ci] =urh[i];:
						e9 nodeunti;
	;

					if ( se {tcalse :
						ele, c!s.push({e[ clm	 ]cunti;

loFar = E[1].re[ h = 0; checkSet[!anyFounById(st	returne[ cl;gtQu}gth e[ cure[ [sir[], r}jQuery		vaById(stSS:},

dd= i;
		}
	},
c(soFatch[0] )sirece( t

r ( it
, not, t
, notatch;( i| ""			aat;


^\h[ typ;) {
	 e[ cure[ [sir[oFar = E[1].re[ h = 0; checkSet[nod++			aa=oop, inplace, resd expression: " + mt, isXMLurSS:},

dt,urn 	i;
		}
	},
cnece( t

r ( ie ].rs[ilt		reth[ typ;)n;.funcn			var urn 				}
		e = 0;.n = 0; checkSet[i] i				ee( t

r ( i mt	returnnse.indexif ( [i]t, isXMC curL	var m, I nul
			m par dnnt) {l;
		}
	},alitylao.substr( \)|\des).replace(winnow(
	(chte:s, qualifi r( keepelengtObj.deover m	 F		}
	},
cqualifi reloFar = t
			vaeover mgrep(	(chte:s, n(elem, i"e( t; itch[1] || ""t
	Vpe !=!!qualifi rent youe( t; i )turn "SS:t t, isXMCLAVpe !		ekeep;
	
	)SS
heckSet[i] ==qualifi re = 0; cheFar = t
			vaeover mgrep(	(chte:s, n(elem, i"e( t; itch[1] |=== "not" )  !		equalifi r) !		ekeep;
	
	)SS
heckSet[i] === Sizzlqualifi reiltext),
		so(partsft.substr(stCh eover mgrep(	(chte:s, n(elem, i"e( ttch[1] |=== "noestCh = 0; checkSet;
	
	)SS
h				if (S, nulrn "radqualifi reloFar =  t
			vaeover m :irChequalifi r( ubstr(st, !keep).indem;
			switcqualifi reidne - v1 :irChecqualifi r( ubstr(st< l; i++ ) {
ery.atteover mgrep(	(chte:s, n(elem, i"e( t; itch[1] === "noteover m	ns );
	}e( t; qualifi reloe;
			!		ekeep;
	}Set}t[t[SS: /rinrn eeover ]= /teover \d+="n+" d+|rFn )"/g		"rlean toWhin "pacll		/^\s+
		"rxltml, elem/<(?!ction(r|col|embed|hr|img|
		},
rn k|meta|
		am)(([\w:]+)[^>)(?:/>/ig		"rtatch[1lem/<([\w:]+)
		"rtbod ]= /<tbod /i		"ratml},
/<|&#?\w+;
		"rnoandleObj/<(?:she ca|;=== 1|embed|n(elem|styre)/i		"rn Safari  /n Safar?:\((e[^=]|=?:\in Safar.)/i	 (f tn Safar="n Safar"*oren Safari(atml5)	"raplace(  /\=([^="'>\s]+\/)>/g		"wrapMgpesu[1] n(elem
		N1xtd<uery.e multinul='multinul'>r  "</uery.e>((?:[\	lege = c	N1xtd<fi ldset>r  "</fi ldset>r(?:[\	type; c	N1xtd<tcess>r  "</tcess>r(?:[\	t,
		N2xtd<tcess><tbod >r  "</tbod ></tcess>r(?:[\	t; c	N3xtd<tcess><tbod ><tr>r  "</tr></tbod ></tcess>r(?:[\	col
		N2xtd<tcess><tbod ></tbod ><colgroup>r  "</colgroup></tcess>r(?:[\	ctio c	N1xtd<ltp>r  "</ltp>r(?:[\	_arent:  c	Nse ""pr: e], "; {wrapMgp.n(egroupesuwrapMgp.n(elem;{wrapMgp.tbod ]= wrapMgp.tfo		},
wrapMgp.colgroup},
wrapMgp.caplace(  wrapMgp.type;;{wrapMgp.th(  wrapMgp.tdar m, IEnet;
		seriL) )  <rn k> \)|\<she ca> tatncisXML)ly[ even!eover mtupport.atmlSeriL) )  ch[1]wrapMgp._arent: s[ilN1xtddiv<E"v>"  "</E"v>"l]{
}useover mfnmo.te""({ar		checkbox: fun = part ("b Obj.deover m	 F		}
	},
ker.eray( cheery		var Winoach(kbox: funin urn false;uerf ems.push(r Wil;gtQuruerfmurn n = paent yor Wi,	i, uerfmurn n))se.index& (che	jQui] === Sizzl= parent.adery.isFnod= parent.					if ( !anyFouery		var Wino ).l().re
		d= (/ Wii0h nod= Wii0hhow];
D );
			rse e );
			) c" },  0, 				s = part & (che	jQuery		vaeover murn (o/ Wi  .ou},

dwrapAl;ion(elem, i"atml}t ("b Obj.deover m	 F		}
	},
"atml}t ay( cheery		var Winoach(kbox: funin urn fas.push(r Wil.wrapAl;
"atmlent yor Wi,	i)se.index& (che	jQui] === Wii0h n urn f arctio	(chte:s to wrapt partandleOar, ""1] || ""wraptems.push({atml,d= Wii0hhow];
D );
			r).eq(0) clone(}

	Set
		e = 0;= Wii0hh) ) {
				vn urn fawraph[3se&t but y()= Wii0h n.indexi
 fawraphltp(s being unloade\atch.werCase= Wi;sME",n	namespa	for 	} ector		f				(chn	} ector		n = 0; checkSet[!anyFoundeerCase() =em){
			return 		var testelem, emat}

		}).re
		d=r Wil;gtQe	jQuery		var Wi.ou},

dwrapI3];
ion(elem, i"atml}t ("b Obj.deover m	 F		}
	},
"atml}t ay( cheery		var Winoach(kbox: funin urn fas.push(r Wil.wrapI3];

"atmlent yor Wi,	i)se.index& (che	jQuery		var Winoach(kbox: funch[1] || ""uerf ems.push(o/ Wi  contextn(s emuerfmntextn(s(Set
		e = 0;ntextn(s = parts.pop();
ntextn(s wrapAl;
"atmlrts.shifNetrue;
					uerfmre
		d= atmlrts.ndexif ( .ou},

dwrapion(elem, i"atml}t ("b ery		var Winoach(kbox: funch[1] |s.push(o/ Wi   wrapAl;
"atmlrts.f ( .ou},

dunwrapion(elem, i( ("b t
			var Winr ; i ()ioach(kbox: funch[1] | even!eover m== elem..gr Wi,	"bod "se.length =s.push(o/ Wi   dblclicWith.g= Winr [\w !els< l; iexif ( .		d= .ou},

dae
		dion(elem, i( ("b t
			var WindomManipoargelectser}

	, n(elem, i"e( ttch[1] | = 0;= Win = 0; checkSet[!anyFounr Winae
		dtor		()turn "SS:t xif ( .ou},

dpdbl		dion(elem, i( ("b t
			var WindomManipoargelectser}

	, n(elem, i"e( ttch[1] | = 0;= Win = 0; checkSet[!anyFounr Win[3se&t but y()e , no/ Wi 	} ector		fo

:t xif ( .ou},

dbbut yion(elem, i( ("b i] === Wii0h nod= Wii0hh) ) {
				vn urn ft
			var WindomManipoargelectser isPa, n(elem, i"e( ttch[1] |	r Winr ; i < l;.[3se&t but y()e , no/ Wise.index& (chem;
			 = 0; rgelects = parts.pop();et )set 
	s.push( rgelectsi0he.indeseCHILD.test( mas;

		 Wintos );
	) "SS:t t, isXMr WinretuStartPrs;

	"bbut y",; rgelects< l; i++ ),

daf {
		){
	var s( ("b i] === Wii0h nod= Wii0hh) ) {
				vn urn ft
			var WindomManipoargelectser isPa, n(elem, i"e( ttch[1] |	r Winr ; i < l;.[3se&t but y()e , no/ Wi			var urn 			.index& (chem;
			 = 0; rgelects = parts.pop();et )set 
	r WinretuStartPrr Wi,	"af {
",; rgelects< l; ieseCHILD.test( mas;

	s.push( rgelectsi0hentos );
	) "SS:t t, isXMsLASS:	et:},
e = arkeepDatayCodf && n {
eObju f  urn--do;.ex{e );
			{
eropyr c){
	var s uery.eactokeepDatay.pop()em.className + " ").replace(/[\/ Wii.h").indexOf(match) >= 0k parestxt, isX).cne - v1 :irChec = chunker = not.l  0, l = ElengtQu	check!keepDatayem || false :
			ckSet[!anyFoundeover m;leanData( lem.n			El= expr, result = [],cl;gtQur eover m;leanData(  = not.l  urn 		var tesion testCh) ) {
				vn urn fa			for ( ; i < l;. Copyrtor		()turn "SS:t els	izz
	
		: "b t
			var Wi.ou},

dm ).length;
		},.pop()em.className + " ").replace(/[\/ Wii.h").indexOf(match) >= 0 arRCopyr e = " "ycontexa"" )  {" "ylueter.leakeCheck par|| false :
			ckSet[!anyFouneover m;leanData( lem.n			El= expr, result = [],cl;gtQu inplace,RCopyr any\ Coainn 		conte=0)n	namespa	for 	} ector		f!anyFoun	for  Copyrtor		()turn 	} ector		fo

:t xif (	: "b t
			var Wi.ou},

dcloneion(elem, i"evects< anyFo arDn: parclone
b et );
				/ Winltp(s being unloade\ even!eover mtupport.noCloneEv (, nod!eover m	 nodD )(r Wil;
				pQu arIEneopitexevects<b, ""kvial sTachEv (, 
			r(eQu ar the hclone< l;. Ct yype aeTachEv (, ont 1 r(eQu arclone will a inf Copyr  parevects<	
			tar/rts[eOb		pQu arIn {
			 to dleOar, ""rr Wi,	whihs. [3];
HTom.		pQu arUnem.tun}, lyno/ Wismeanswinm=xmz if) {
iem){to		pQu ar sTag = is}06/10 t){
			ifacbuallct urncsunk.djQuQu aram.selecteitexwill .ex{beneopitdt(suataas" 1 r(eQu args[0c.pusasTag = ivontan0].typ).ade\atch.atml},
/ Wino= i
HTom, ow];
D );
			r,
/ Winow];
D );
			;gtQu	check!atml}t ("b 		]"NAME"vh=.ow];
D );
			 c" }, hen Bla("div"ll;  		 div.re
		dtor		()= Winrlone< l;(}

	Scl;gtQur atml},
siv.[3];
HTomurn 		var testelem, eover m;lean([atmledblclickrinrn eeover 
				gtQur  ar){
			acate = f conIEe8 far thaplace=/n "r/>muerf-: hand a tatgtQur edblclickraplace, '="$1">')gtQur edblclickrlean toWhin "pacl
				], ow];
D );
			)h[3led:fNetrue;
					t
			var Winrlone< l;(}

	S

:t xif ( .oyFo arCopy  parevects<	
			tar/rts[uralown: parclone
b k par|vects<hild;
		.length eloneCopyEv (,Prr Wi,	r] && (ch eloneCopyEv (,Prr Wi1 : co [],,	r] 1 : co [], & (che	jQuce,RC			var arcloneeed &
t t, isXMCLA.ou},

datmlion(elem, i"lst;
	( ("b i] ==lst;
		=;
					if ( !anyFouery		var Wii0h nod= Wii0hhlse :
			ckSet[?1] |	r Wii0hh[3];
HTom.dblclickrinrn eeover 
				 			}
	rFn ) 
;
f thSiza.Irent =&tevena.shortcutxa"" ju mahs. [3];
HTom(chem;
			 = 0;= Sizzllst;
		=;
xt),
		sonod!rnoandlern "radlst;
	( 		, is(eover mtupport.lean toWhin "pacll, c!rlean toWhin "paclrn "radlst;
	(( 		, is!wrapMgp[ (rtatch[1rcontexlst;
	( 9 ) ""pr: ]), '5', '2n', '3n+ h n urp();ett;
		i

	;
 dblclickrxltml, e  "<$1></$2>"ts.shiflector Engh[ type ].exec( );
		/ Win	},
				return ret.length  0 arRCopyr e = " "ycontexa"" )  {" "ylueter.leakeChecb i] === Wiiretfr parent				selectb jQueeover m;leanData( = Wiiret			El= expr, result = [],cl;gtQur 	= Wiiret[3];
HTom hev ) {
		:t els	izu inplace,Ifr the h[3];
HTom throws		nnyFcept= e,ahs.  par atlb	},rmethoded:fNed under th1] |	r Wino ).l().re
		d= lst;
	(;gtQu inplem;
			 = 0;eover m	 F		}
	},
"lst;
	(  th1] |r Winoach(kbox: funinurn false;uerf ems.push(r Wil;gtQuruerfmltml
"lst;
ent yor Wi,	i, uerfmltml
))se.index& (
:fNetrue;
				r Wino ).l().re
		d= lst;
	(;gtQe	jQuery		var Wi.ou},

ddblclicWithion(elem, i"lst;
	( ("b i] === Wii0h nod= Wii0hh) ) {
				vn urn f ar event.butt){
	: fu	(chte:s 		if Copyrd<	
			tar/DOM bbut y mal cachi[3se&t.djQuQ args !Ecan help fix dblclin 		a kSet[i]{
			r [\w tivate:s)]		 = 0;eover m	 F		}
	},
"lst;
	(  th1] |eery		var Winoach(kbox: funin urn faalse;uerf ems.push(r Wil, expttruerfmltml
)
		:t euerfmdblclicWith.glst;
ent yo r Wi,	i, curLoo"SS:t ell;gtQu inpla = 0;= Sizzllst;
	ontext),
		soFar = E"ett;
		is.push(ett;
).aeTach(l;gtQu inplaery		var Winoach(kbox: funch[1] |i| ""	rn [];/ Wi			var urn 	,else {
			r Winr ; i < l;;sME",ns.push(r Wil. Copyr(Set
		ee = 0;. && (parts[;
s.push(. &&).bbut y()lst;
	(;gtQugNetrue;
						s.push(r ; i ).re
		d= lst;
	(;gtQuels	izz).indem;
			switct, isXMr WinretuStartPrs.push(eover m	 F		}
	},
ett;
) ? lst;
(
r		ett;
), "bulclicWith"prlst;
	(;gtQe	u},

daeTach		){
	var s uery.each( ("b t
			var Win Copyr(	 = chunker}

	  .ou},

ddomManip		){
	var s argi,	/fbex,Mcatlb	},r( ("b et );
 ( chec	} ecprlst;
	= argii0h,	she casCh {
		frag " ", r ; i ) 
;
f tWent =
		 lone< l;	frag " "ext){
	; i++ )en Safar} eltWebKit
e\ even!eover mtupport.n SafClone nod rgelects = partsckSe3snod= Sizzllst;
		=;
xt),
		sonodrn Safarrn "radlst;
	( ay( cheery		var Winoach(kbox: funn urn fas.push(r Wil.domManipo argi,	/fbex,Mcatlb	},,= "hidden";
x& (che	jQui] ==eover m	 F		}
	},
ett;
) ay( cheery		var Winoach(kbox: funin urn false;uerf ems.push(r Wil;gtQurargii0h		i

	;
 nt yor Wi,	i, /fbex,aret fmltml
)t =					if (l;gtQuruerfmdomManipo argi,	/fbex,Mcatlb	},se.index& (che	jQui] === Wii0h n urn flse {
			lst;
	em 

	;
 r ; i < l;;sME",ce,Ifrwt' eli{
asfrag " ", ju mahs. t){
	[3stead];
	 uizdn 		a 	ve one
b ui] ==eover mtupport.) ) {
				vnodheckSe nodheckSet[i];:
			ckSet1 nodheckSetr [\w !els = partsckSe/ Win	},
		. th1] |eer.getAttr{sfrag " ":dheckSe }s.shifNetrue;
					er.getAttreover m uizdFrag " "o argi,	/ Wi,	 he casCl;gtQu}gth gth frag " "t, t
, noi1 rag " ";gth gth ntent rag " "tr [\w !els = partsckSeselectb jQtestselefrag " "t,  rag " "tm){
			return 	z.parentNode :estselefrag " "tm){
			return 	zinpla = 0;:estse th1] |	rfbex,= /fbex,nodne - v1== elem..g	} ecpr"tr"Sodee = eh[ type ].exec( );
		/ Win	},
				return ret.length  0catlb	}, nt yogtQur 	=fbex,agtQur 	aro		(/ Wiif ( 	} ect 			}
		},/ Wiif (		}
		}eop();Notr
, noi1andlefbex,ML = Win	},
		.filt,agtQur 	a rag " "trlone< l;(}

	Sc:gtQur 	a rag " "gtQur "SS:t els	izz
npla = 0; he casn	},
		. th1] |eeover moach(; he cas,r|valShe case.indexif ( [i]t, isXMr Wi.ou}L	var .replace(ro		()e , noe[ clengtt
			vaeover m== elem..etTextd=fbex")s?		}(lem.n			El= expr, result = tbod ")h[3,ML
un	for re
		dtor		(estChow];
D );
			 c" }, hen Bla("tbod "))Sc:gtQemat}
`").replace(eloneCopyEv (,Prts[,	r] lengtesults[i]; {
erynoach(kbox: funn urn  = 0;= Win = 0lem.tontePrts[s, snodrts[s, ray){
			r ay( cheery		v (che	jQue ( expDataytreover mdata( rts[s,++]  conurDataytreover mdata( / Wi,	expDatay),unvects<h	expDataynodrxpData.nvectsSS
h				ifevects< anyFodaeleteonurData.(e) {} (ch eurData.nvects<h	{}s.shif ter = Expr.filterevects< anyFodf ter = Exp(e) {}rlterevectsFound =  !anyFoundeover mevectnad=	}/ Wi,ound ,revectsFound = [p(e) {}rl],revectsFound = [p(e) {}rl]mdata "SS:t els	izz
	
		:}Set}t[eover m uizdFrag " " ML){
	var s argi,	n!elss[ he casClengtesulfrag " ", andlefbex, andle;
 ( che
	
d ) he(contexi] iz jii0h ? iz jii0hhow];
D );
			rse iz jii0h : e );
			) elem, OurncandleO"sML)l" (1/2 KB)t / opts t){
			ifassocia	(pa{
				soFprin{e );
			{
 arClonn 		n(elems"chstext)oFts[0])eeedta	(,lem.dt;
		 :dleOt)om
u arIEn6 incl;
		ven" && 
			}you type<dery.i>*ore<embed>u	(chte:s i{
asfrag " "lem, A in,iWebKit includes clone 'n Safar'r sTag = is}ce(elone !el_cem.dt;
		 :dlegtObj.dargi = partsckSesenod= Sizzlargii0h		=;
xt),
		sonodargii0h = parts< 512t lem ) h=,
special[ 		, i!rnoandlern "radargii0h	[2] =(eover mtupport.n SafClone , c!rn Safarrn "radargii0h	[) n urp()andlefbex,d }

					andle;
 ( cheidne - v1 rag " "e[dargii0h		}

	 ) {
andle;
 ( cheFar = E[1].rendle;
 ( che!kSeselectb jQtrag " " MLendle;
 ( ch

:t xif (	: -
ck par!trag " " .pop()erag " " MLspe c" }, D );
			Frag " "o"SS:teover m;lean( argi,	spe		frag " ",  he casCl;gt -
ck parandlefbex,.pop()ne - v1 rag " "e[dargii0h		 MLendle;
 ( ch}?= rag " " :tch[3} {
ery.att{sfrag " ":dfrag " ", andlefbex:randlefbex,} c( orne - v1 rag " "e<h	{}s.seover moach({arre
		dTo: "re
		d",
dpdbl		dTo: "pdbl		d",
d[3se&t but y:	"bbut y",
d[3se&tAf {
		"af {
",
ddblclicAl;io"bulclicWith"L	,L){
	var s etByIdrts[uralolengteover mfn
// More ML){
	var s uery.each( ("b et );
				 {; i3se&t ems.push(ouery.each(			}
lse {
			r Win= partsckSesenod= Wii0hh) ) {
				SS:t

	 ) {
heckSe nodheckSet[i];:
			ckSet1 nodheckSetr [\w !els = partsckSe1 nodi3se&t = partsckSeselectb ji3se&t[drts[uralo]()= Wii0h n.indet, isXMr Wi.ou:t

	z.parentNodeh[ type ].exec( );
		i3se&t = part		return ret.length  tch.werCe<h	(eop();?ar Winrlone(}

	Sc: r Wil.j = c;rn fas.push(	i3se&ts, se[drts[uralo]()werCe<c;rn faeryoatr = ; icat()werCe<c;rn fatch, h Expr.fir WinretuStartPriftecetByIdi3se&t uery.each(SS:/g, "; 	var eover mo.te""({ar;leanion(elem, i"e( tsmatch[1]);
frag " ",  he casClengthreturn [];
	}
	
	if ( !selector |Qm, != true nc" }, hen BlaLfails}06/10 {
				nny			st = iunctionc= Sizzl'dery.i'
la = 0;= Sizzl= true nc" }, hen BlaL=y 4.6 returns
	length eeturn [];
	}
	
	how];
D );
			rse {	}
	
	i0h nod{	}
	
	i0hhow];
D );
			rse e );
			 (che	jQue ( ;
				 {


^\h[ type ].exec( )").replace(/[\ens si.h").indexOf(match) >= 0k par= SizzlestCFiltexr] - 0urn urn faestCF+		erurn 	zinpla = 0;!e( ttch[1] |	{	}
in {
		:t inplace,Ce, "&".atml}t),
		, ceotDOM conte== 0k par= SizzlestCFiltext),
		sonod!ratmlen "radi( ttchn urn faestCF=l= true nc" },  0, 				s turn "SSrn 	z.parenk par= SizzlestCFiltext),
		so
				pQu arFix "XHTom"-styre tatnci{
allebrowse&srn faestCF=l	for  Clclickrxltml, e  "<$1></$2>"ts.shifvelem im 
	in "pacl
	ogs[rwis t< l; j+ wo;
		 !!elas	if firstindb et )	felem(rtatch[1rcontexi( ttch9 ) ""pr: ]), '5', '2n', '3n+(		}
		wraptemwrapMgp[ 	felh,ML wrapMgp._arent: (		}
		depth(  wrapi0h,		pQu
E"vh=.= true nc" }, hen Bla("div"ll;; ifveleGoown:atml}a"" b	},,= 			}peel offuniqueSwrappe&srn fadiv.[3];
HTom hewrapi1] );
stCF+ewrapi2]l;; ifveleMpyr  ot 1 &&ight iepth; ifv	namespaiepth-- !anyFoundE"vh=.siv.6'
	tor		urn 		var tes arRCopyr IE's auto[3se&t.d <tbod ><	
			tfbex, rag " "er tes even!eover mtupport.tbod ]n urp();i]f th ,
		,wad a <tcess>, *may*p(eyr spur typ <tbod >p();i] Exp(esBod ]= rtbod en "ra
stC+(		}
			tbod ]= 	feleltex=fbex"onod!(esBod ]agtQur 	asiv.	} ector		fusisiv.	} ector		nr [\w !els<:op[i] = ]f th ,
		,wad a b		if<type;>*ore<tfo		>p[i] = ]wrapi1] eltex<tcess>ronod!(esBod ]agtQur 	aasiv.r [\w !els<:otQur 	aalt		ret.p\h[ type ].j]= 	bod e= parts-tch.j]e;
	 ; --jelectb jQuei] ==eover m== elem..grbod [.j]]xtd=bod "se.nod!rbod [.j]]tr [\w !els = partslectb jQue	rbod [.j]]t( ; i < l;. Copyrtor		()rbod [.j]](match){
			return
rn 		var tes arIEneo nul, ly kills}lean to 
	in "pacl 
			}[3];
HTom  !Eus.djQuQu even!eover mtupport.lean toWhin "pacllnodrlean toWhin "paclrn "radi( ttchn urn faadiv.[3se&t but y()= true nc" },  0, 				s rlean toWhin "paclrconte
stC+i0h n,nsiv.	} ector		f urn 		var tesestCF=lsiv.r [\w !elsurn 	zinpla = 0;|| false :
			 th1] |eery	returnturn "SS:t xetrue;
					t
	m )eover mmeor 	}iftecturn "SS:t xif (S
h				iftrag " " .pop()

		}

		eve;){
t[.gn ret.length = = 0; he cas,nodne - v1== elem..g{
t[.g,;"she ca		[2] =(!{
t[.g.und =Notr
t[.g.und ;
		}
	},
	setFilte"rue /javashe ca	chn urn faa he casnreturn ct[.g.) ) {
				v?n ct[.g.) ) {
				. Copyrtor		() ct[.g 
r		CLAt.getElemenrn 		vetrue;
						ound esp[retfr parent				selectb jQue
							retest( maiftec[iF+eulls] ; icat(ne - v1ltlts );
	esp[ret			El= expr, result = she ca	c),cl;gtQur 		retur rag " "tre
		dtor		()CLAt.getElemenls	izz
	
		jQuery.attCLASS:},
	ar;leanDataion(elem, i"e( tsh( ("b et )data aip, andlem )eover mandle(		}
ler, aom )eover mevectnler, ao,yFodaeleteExpa""om )eover mtupport.aeleteExpa""oSS:t

	h[ type ].exec( )").replace(/[\ens si.h").indexOf(match) >= 0k par|| false lem.tnodne - v1==Data[|| false lem.;
		}
	},
	set]tch[1] |	{	}
in {
		:t inplarn he() =[)eover mo.(a""om];gth gth ntenti	f!anyFoundataytrandle[ti	f]Elemenrn 		posPrsataynoddata.nvects<lectb jQu ter = Expr.filterdata.nvects<lectb jQu= = 0; er, aoFound =  !anyFoundndeover mevectn Copyr(	e , no/
			 oop[i] = = true;
							}eover m CopyrEv (,Pre , no/
		,rdata.(e) {}
match){
			return
eturn
eturrn 		posPrseleteExpa""omn urn faadeleteo() =[)eover mo.(a""om];grn 		vetrue;k par|| fa CopyrisTag = i[!anyFoundeerCn CopyrisTag = is eover mo.(a""omtElemenls	izrrn 		aeleteonndle[ti	f]Elemexif (	: -	var .replace(|valShe ca( i )turn "anyFion testChcrc,.pop()ne - v1ajax(nyFouurl:testChcrc			}
hsync = isPa,yFodaataaren:;"she ca	
f ( .ou} true;
			eover mglobalEval testCh
	
	if (estCh
	
	Ctextn(if (estCh[3];
HTom f (: expr}xt, ion testCh) ) {
				vn urn 	for ( ; i < l;. Copyrtor		()turn "SS:}t}t[t[SS: /ralphaytr/alpha\([^)]*\)/i		"ropacityltr/opacity=([^)]*)
		"rdashAlphaytr/-([a-z])/ig		"rue
	rytr/([A-Z])/g		"rr] pxl		/^-?\d+re 
x)?$/i		"r			aat/^-?\d/,

dcssShowttr{sar = m[3		"absol= i"prlisibility		"hidden",nsi			ay		"block" },
enssWidth(  [ "Lefl"jQ"Rightr(?:[\nssHeight   [ "Top"jQ"Bottomr(?:[\nurCSS,elem, andlem					  terarent: Viewt			Co n= idStyre
				Co n= idStyre ,
special[ erent: Viewt lem )cial[ erent: Viewt			Co n= idStyre,

drcem.l,
	s ML){
	var s a ( vlettech( ("b t
			valettec;
	Ue
	r,
	set;, "; {eover mfnmcote=(elem, i){cetByIdlst;
	( ("bf thStt to '6 returns'  !Ea co-opgtObj.dargelects = partsckSe2	em 

	;
		=;
					if ( !anyFot, isXMr Wi.ou}Lgtt
			vaeover mac not	}/ Wi,oetByIdlst;
er}

	, n(elem, i"e( t,cetByIdlst;
	( ("btt
			valst;
	onte					if ( ?t	gine - v1styrei"e( t,cetByIdlst;
	( :t	gine - v1cot	}e( t,cetBy "SS:}) c( orne - v1o.te""({arm, Addlterstyre selectey hookodf &&pyrrrin to 	
		deent: arm, be(eyi &&pf dlethe h =eed &the h rstyre selectey[\nssHooko: ("btopacity: ("bt				ion(elem, i"e( t; co n= id.length = = 0;co n= id.length =
f tWenshouurLalways dleOa r] - 0 b	},<	
			opacityp();i] Expt
	m )nurCSS.getTextdopacity"xtdopacity"
match){
ery.attCLAFilte""v?n"1"r		CLASSurn= = true;
						=== "noestChstyre.opacitySS:t els	izz
	
		:},elem, Exclud.  par ollowhe hcsm.selecteitextt l h px[\nssN] - 0: ("bt"zI l; ": }

	,yFo"ftexWeight": }

	,yFo"opacity": }

	,yFo"zoomr: }

	,yFo"rn eHeight": }

		:},elem, Addlterselecteitexwhos[0c.pus}you wishxtt fix bbut ylem, d &the h &&dlethe h parlst;
[\nssPeleo: ("btm, isXML) )  flo{
	;sm.selecteyyFo"flo{
":)eover mtupport.;smFlo{
	?n";smFlo{
"r		"styreFlo{
"	:},elem, Geth =eed &xt)oFttyre selectey ontatDOM < l;
	ttyreion(elem, i"e( t; etByIdlst;
erniqueSoanyFo arDn;
		setFttyres}ce(
	
	i =ee0, Elem conte==  = 0;
				,ML || false :
			ckSe3,ML || false :
			ckSe8 , c!estChstyre ay( cheery		v (che	jQu ar event.butt){
	wt' el !!e});
{
				soF&ight etBy
i] Expt
	Idrts[ch[1lemeover manm.l,
	sad=== el(		}
ltyre ,
estChstyre, hookodemeover massHooko[drts[ch[1l];grn nh[1lemeover massPeleo[drts[ch[1l] , crts[ch[1.oyFo arC				 ifrwt' eld &the h rlst;
[\ i] ==lst;
	ent.					if ( !anyFou ar event.butt){
	NaN \)|\dexO=lst;
s 		i;
		set.thSi: #7116gth ntent= Sizzllst;
		=;
xr] - 0urnodisNaNexlst;
	( 9 )lst;
		=\dexO= th1] |eery		v
		:t inplace,IfOa r] - 0 wad passedlte, l h 'px'  ot 1 &(yFceptandle0cterin{CSSrselecteite)gth ntent= Sizzllst;
		=;
xr] - 0urnod!eover massN] - 0[drts[ch[1l] Far = E"ett;
	+		epx"
		:t inplace,IfOa hook wad providar} hs. t){
	lst;
erogs[rwis tju mad &xt)oFter, fitdtlst;
[\ 	check!aookod, c!= se
"rin{aooko( 9 )(lst;
	= aooko.se
i"e( t; lst;
	(( ent.					if ( !anyFou
f tWrapped  ot)  {" "yIE<	
			tarowhe hy			sor
			 'inlstis' lst;
s 		i providaryFou
f tFix
s bug #5509yFou
lector Engistyre
// More MLv ) {
		:t Ned under the 	:t inpl= true;
				ce,IfOa hook wad providar dleOgs[0con-co n= id.lst;
		
			tar t[\ 	checkaookodnod"ge
"rin{aooko2] =(t
	m )aooko.ge
i"e( t;  isPa, niqueSo( ent.					if ( !anyFou
ery.attCLASS::t inplace,Ogs[rwis tju madleOgs[0lst;
		
			tarFttyre dery.i cheery		v styre
// MoreSS:/g, ",

dcssion(elem, i"e( t; etByIdniqueSoanyFo ar event.butt){
	wt' el !!e});
{
				soF&ight etBy
i] Expt
	Idrts[ch[1lemeover manm.l,
	sad=== el(		}
hookodemeover massHooko[drts[ch[1l];grn nh[1lemeover massPeleo[drts[ch[1l] , crts[ch[1.oyFo arIfOa hook wad providar dleOgs[0co n= id.lst;
		
			tar t[\ checkaookodnod"ge
"rin{aooko2] =(t
	m )aooko.ge
i"e( t; }

	, niqueSo( ent.					if ( !anyFouery.attCLASS
lace,Ogs[rwis ,za.I= way to dleOgs[0co n= id.lst;
	 !wins} hs. t){

		vetrue;k parnurCSS !anyFouery.attnurCSS.getTextetByIdrts[NtBy "SS:
		:},elem, Armethodandlequickrncswapp
		, c/out{CSSrselecteite to dleOcorry.e calcul{
iem)
	twapion(elem, i"etTextn(elems,Mcatlb	},r( ("b et )expttr{}s.shi arRCoe - 0 tar/rld.lst;
s,M\)|\i3se&t gs[0cve ones

	h[ type ].nh[1lilee(elems"!anyFourld
// More MLestChstyre
// MoreSS:/	estChstyre
// More<h	e(elems
// MoreSS:/g,
 0catlb	}, nt yo turn "SSrn  arRCve&t gs[0rld.lst;
s

	h[ typnh[1lilee(elems"!anyFouestChstyre
// More<h	eld
// MoreSS:/g, ",

dcnm.l,
	s		){
	var s u ,
		,( ("btt
			vau ,
		 dblclick=rdashAlpha;  cem.l,
	s "SS:}t}var m, DEPRECATED, Us tje - v1cot	)e[3steadrje - v1curCSS emeover masss.seover moach(["height"xtdwidth"], n(elem, i"i,cetBy "engteover massHooko[d/ More<h	("bt			ion(elem, i"e( t; co n= idIdniqueSoanyFo et )lstet
		e = 0;nt n= id.length = = 0;estChoffse
Width(!tch){
			va E"ett<h				WHi"e( t; etByIdniqueSoSSurn= = true;
						eover mtwtp(ae( t; cssShow,ngth;
		},.pop()a E"ett<h				WHi"e( t; etByIdniqueSoSSreturn urn 		var test
			valst	+ "px"
		:t i	 ",

deseCion(elem, i"e( t; lst;
	( ("bt	ound er] pxrn "radlst;
	( ay( che  arignt y negt = s widthM\)|\height lst;
s #1599 = E"ett;
	=dhecseFlo{

ett;
)et
		ee = 0;ett;
	>ch){
			va E"t
			valst;
	+ "px"
		:t	var teNetrue;
					t
			vav ) {
		:tz
	
		:}; 	var  even!eover mtupport.opacityl"engteover massHooko.opacityltr("bt			ion(elem, i"e( t; co n= id !anyFou arIE<ustex		returdf &&ppacityp();ery.attCppacityrn "ra(co n= id em || facur; i Styre ? || facur; i Styre1 :irCh :oestChstyre. :irCh) f (: )s?		}
	(hecseFlo{

= even.$1) / 100)	+ ""<:otQurco n= id ?n"1"r		erurn ",

deseCion(elem, i"e( t; lst;
	( ("bt	lse;utyre ,
estChstyre;sME",ce,IEp(es }
oubex,{
			opacitylif it includes (eyr layoutME",ce,Forc" && byld &the hgs[0zoomrl sel		}
ltyre.zoomrct1s.shiff thSthgs[0alphay :irCh to  St gs[0rpacityp();et )epacityltreover m	 NaNeett;
) ?otQur""<:otQur"alpha(opacity=m );lst;
	* 100	+ ")"(		}
	 :irCh = styre. :irCh f (: s.shifstyre. :irCh =/ralpharn "ra :irCh) ?		}
	 :irChedblclickralpha; opacitySc:gtQurstyre. :irCh + ' ' + opacitySS:t		:}; 	r  even			Co n= idStyre ( ("bcurCSS emn(elem, i"e( t; eewntByIdetBy "engt] Expt
	Iderent: View; co n= idStyre;sME"nh[1lemnh[1 dblclick=rue
	rxtd-$1"r);
		}
	},
	setSS
h				if!(erent: Viewt,
estChow];
D );
			 erent: View) ay( cheery		va					if (SS:/g,
 0et = (co n= idStyre ,
srent: Viewt			Co n= idStyrei"e( t; eexO= loFar = Eeryoatco n= idStyret			PelecteyVst;
(cetBy "SS:		ound espFilte""vnod!eover ma i++ ) (aestChow];
D );
			 e );
			h = " " )turn "a!anyFou
erym )eover mttyrei"e( t,cetByse.indexif ( [i]t, isXMCLASS:}SS
vetrue;k parspecial[ e );
			h = " "l;ur; i Styre ( ("bcurCSS emn(elem, i"e( t; etBy "engt] Explef" )rsLef" )re
				for ;ur; i Styre em || facur; i Styre[d/ More,;utyre ,
estChstyre;sME"ce,F
			tarFaweinm=xh	},rbylDean EdwardsME"ce,http://erikmoae.net/arch= ss/2007/07/27/18.54.15/#0, Elem-102291oyFo arIfOwt' el.ex{eeal});
{
			a)regul{r pix
l r] - 0yFo ar = ia r] - 0 t){
	had a weirdre""n 	,ewy need  otce, "&".&&  ot)ix
le==  = 0;
er] pxrn "rad ) {
rnodrr] rn "rad ) {
rh) >= 0 arRCoe - 0 tar/rts[uralolst;
s

		lef" = styre.lef".indersLef"F=l	for  untimeStyre.lef".i>= 0 arPu
	[3 gs[0cve lst;
s to dleOa0co n= id.lst;
	outME",	for  untimeStyre.lef"				for ;ur; i Styre.lef".indestyre.lef"			nh[1lelte"ftexSize"v?n"1em"r		(t
	mf (0n.indet,  = styre.)ix
lLef"F+ "px"
	>= 0 arRCve&t gs[0changed.lst;
s

	estyre.lef"			lef".inde	for  untimeStyre.lef"			rsLef";if ( [i]t, isXMCLASS:}SS`").replace(			WHi"e( t; etByIdniqueSoengtesulwhiata =nh[1lelte"width"v?nnssWidth(: nssHeight,
E"ett<h	nh[1lelte"width"v?nestChoffse
Width(:nestChoffse
Height;t, ion teiqueSelte"b{
			",( ("btt
			valstet ( [ieover moach(;whiat,ngth;
		},.pop() = 0;
	iqueSoanyFo etl -=dhecseFlo{

ne - v1cot	}e( t,c"padd
		so+o/ Wise) f (0SS:/g,
 0et = eiqueSelte"mar[ur"SoanyFo etl +=dhecseFlo{

ne - v1cot	}e( t,c"mar[ur"S+o/ Wise) f (0SSnpl= true;
				etl -=dhecseFlo{

ne - v1cot	}e( t,c"b{
			",+o/ Wis+ "Width"ve) f (0SS:/g,ex& (
:t
			valstet	r  eveneover mo.(tXnodne - v1o.((			returl"engteover mo.((			retur.hidden emn(elem, i"e( t "engt] Expwidth(  estChoffse
Width,\height =nestChoffse
Height;t,  === "notwidth( tch){nodheight ==;
			9 )(!eover mtupport.relicessHiddenOffse
o2] =(estChstyre.si			ayX).cne - v1cot	}e( t,c"si			ay"ve) 	=;
xrone"t;, "; {teover mo.((			retur.lisible emn(elem, i"e( t "engt]=== "no!eover mo.((			retur.hidden()turn "SS:}et}t[t[SS: /jscm )eover mnow(l(		rshe caaat/<she ca\b[^<]\((e(?!<\/she ca>)<[^<]\)*<\/she ca>/gi		"ruery.e 0, ctio 		/^re uery.e|t0, ctio)/i		"r].typ 		/^re color|date|datetime|Coail|hidden|mtexh|r] - 0|passw{
	|range|search|t0l|t0, |time|url|week)$/i		"r	oCtextn(i		/^re GET|HEAD|DELETE)$
		"rbr	},,  = /\[\]$
		"jsreObj/\=\?(&|$)
		"rqver ]= /\?
		"rtsytr/([?&])_=[^&]*
		"rurli		/^r\w+:)?\/\/([^\/?#]+)
		"r20i		/%20/g		"rhadh(  /#.*$
		lem, Keepea0copy];
		
		rld.lo{drmethoded_lo{dridne - v1 n.lo{d;useover mfnmo.te""({arlo{dion(elem, i"url, r ;ams,Mcatlb	},r( ("b ntent= Sizzlurli!ltext),
		sonod_lo{dray( cheery		va_lo{dtest( ma/ Wi,o rgelects< l;
Fo arDn;
		do	a)reqvest;k pnou	(chte:s 		ifbe});
reqvestaryFovetrue;k par!/ Win	},
		. th1] |t, isXMr Wi.ou:e	jQue ( eff emurl.< l; j+(" "ll;  k pareff >ch){
			va lse;uercess( seurl."" ) (eff,eurl.	},
		n.indeurli		url."" ) (0,reff& (che	jQuce,Drent: stt l GET
reqvestjQue ( /
			texGET".oyFo arIfOt)oFtsce,d r ;am fun wad providar;  k parr ;ams !anyFou arIf it's aon(elem, S:		ound eover m	 F		}
	},
"r ;ams !a!anyFou
f tWifassele t){
	[t's cate =tlb	},otQurcatlb	},r="r ;ams
		:t	r ;ams =trFn ) 
;
ace,Ogs[rwis ,z uizd	a kSeamau ,
		r teNetrue;ntent= Sizzlr ;ams =nt.adery.isF!anyFou
r ;ams =teover mr ;am( r ;ams,Mne - v1ajaxhStt tos.quedi
	},alSoSSretu/
			texPOST"
		:t i	 "	jQue ( uerf em= Wi;sME" arRCqvest;: funcmote{e );
			{
)ne - v1ajax(nyFouurl:turl,
etu/
		:o/
		,
etuaataaren:;"atml",
etuaata: r ;ams,
Qurco nleteion(elem, i"rlss[ tatusa!anyFou
f tIf suc notfulIdi3ing e: fuHTom  ceotalle	soFpr, coee	(chte:s
		ee = 0; tatusailtextuc not"X).c tatusailtex.exmz if)ns
	length ;
f thSiza.Ia;uercess( wad ter, fitdgth ;
uerfmltml
"uercess( agtQur 	 arC" }, 	at.ummyME"vhwn:arld.: func ( chgtQur 	s.push("<E"v>")gtQur e  ari3ing e: funtextn(s ;
		
		d );
			rte,  Copyhe hgs[0 he casgtQur e  areotavoid any\'Punmdssace(Denins' y			sor06/10gtQur e .re
		d=nc .respons  0, edblclickr he ca
				)op[i] = ]f tLoc = test[ter, fitdt	(chte:s
		ee e . : co = chunk)<:op[i] = f tIf .ex, ju mai3ing e: fumlseunc ( cp[i] = nc .respons  0,   urn 		var tesion tcatlb	},r( ("b  ;
uerfmoach(;catlb	},,=[nc .respons  0, s[ tatusFatchgetElemenls	izz
	
	)s.shit
			var Wi;S:},

dteriL) ) ion(elem, i( ("b t
			vaeover mr ;am(/ WinteriL) ) s );
	));S:},

dteriL) ) s );
ion(elem, i( ("b t
			var Winltp(s being unloade\ery		var Wino(chte:s ? eover mltlts );
	r Wino(chte:sSc: r Wi (che)gtQ1 :irChes being unloade\ery		var Winnem.tnod!/ Winsi	cessd 		, is	(= Winr SafariNotruery.e 0, ctiorn "ra= Win = 0lem.),ML
unde\e].typrn "ra= Win/
		)) (che)gtQ1ltp(s being u i )turn "anyFo et )lst ems.push(r Wil.val )et
		et
			valst		=\dexO=agtQurdexO=			}
	eover miss );
	lst) ?		}
	ine - v1ltp0;ett, n(elem, i"ett, ir( ("b  ;

ery.att{snem.:nestChetByIdlst;
		ett,} c  ;

}Sc:gtQur {snem.:nestChetByIdlst;
		ett,} c  }l.j = c;rnrL	var m, AsTach a b(elh ;
	n(elem, rdf &&(e) {he hcommte AJAXrevectsseover moach( "ajaxh ctt ajaxh op ajaxCo nlete ajaxE			stajaxhuc nottajaxh		d"					t(" "l, n(elem, i"i,coolengteover mfn
oe ML){
	var s fh( ("b t
			var Winb: coo, n"SS:}et}var eover mo.te""({ar			ion(elem, i"url, data acatlb	},,= 
			 th1] m, dhifto rgelects<ionsatay rgelect wad omitar;  k pareover m	 F		}
	},
"data "r( ("b  /
			teund =Notcatlb	}, c  ;catlb	},r="data;
etuaata =trFn ) f ( [i]t, isXMne - v1ajax(nyFou/
		:oxGET",yFouurl:turl,
etuaata: data 

	esuc not:acatlb	},,
etuaataaren:;/
		
	 ( .ou},

d			She caion(elem, i"url, catlb	},r( ("b ery.atteover mg = url, rFn  acatlb	},,= she ca	c.ou},

d			JSONion(elem, i"url, data acatlb	},r( ("b ery.atteover mg = url, data acatlb	},,="json	c.ou},

dpos	ion(elem, i"url, data acatlb	},,= 
			 th1] m, dhifto rgelects<ionsatay rgelect wad omitar;  k pareover m	 F		}
	},
"data "r( ("b  /
			teund =Notcatlb	}, c  ;catlb	},r="data;
etuaata =t{}) f ( [i]t, isXMne - v1ajax(nyFou/
		:oxPOST",yFouurl:turl,
etuaata: data 

	esuc not:acatlb	},,
etuaataaren:;/
		
	 ( .ou},

dajaxhStup		){
	var s uett tos,.pop()ne - v1o.te""(Mne - v1ajaxhStt tos, uett tos,..ou},

dajaxhSttn 	sioop()url:tlo {
iem.href,
etglobal: }

	,yFo/
		:oxGET",yFontextn(aren:;"est() {
iem/x-www-f &m-urlenc= 0d",
d	pro notDataio}

	,yFohsync =}

	,yFo/*yFo/imeou	io0e
	
dataiorFn  p()us{
eOm.:nrFn  p()passw{
	:nrFn  p()quedi
	},al = isPa,yFo*/
 f arctCodfreplace(ean{benpyrrrinenrbylct yype ne - v1ajaxhStup
 fxh
		){
	var s( ("b ]t, isXMcve w< low XMLHttpRCqvest(& (che,yFohcceptsioop()	xmlio"est() {
iem/xml,d=ue /xml",
etuatmlio"rue /atml",
etushe caio"rue /javashe ca,o st() {
iem/javashe ca	,
etujsonio"est() {
iem/json,d=ue /javashe ca	,
etu		chec"rue /lclin	,
etu_arent:  c"*/*	
f (ou},

dajax		){
	var s rts[Sett tos,.pop()e ( um )eover me.te""(}

	, {},Mne - v1ajaxhStt tos, rts[Sett tos),
etujsonps[ tatusFadata a/
			tes.und ;
	Ue
	r,
	set,	n!Ctextn(i		r	oCtextn(rn "ra=
		)et
		s.urli		s.url dblclick=rhadh,(: expr
 f arUs trts[uralo(.ex{e.te""ed);
	}
	
	idery.ilif it wad providar;  s.eeturn [];rts[Sett tos,nodrts[hStt tos.eeturn [!=\dexO=adrts[hStt tos.eeturn [: i;sME" arce, "&".aata k pnoto ltiodyh rst,
		r t = 0; .sataynods.pro notDataXnod= Sizzle.satayontext),
		soFar = Ee.satay=teover mr ;am( e.sata, s.quedi
	},alSoSSree	jQuce,){
			aJSONP P ;am fun Catlb	},sr t = 0; .sata:
			ckSe"jsonpsoFar = Entent= Si	ckSe"GET".length = = 0;!jsrern "radu.urlichn urn faa .urli+em(rqver rn "radu.urlich? "&"r		e?")	+ (s.jsonp f (:catlb	},")	+ "=?"
		:t	va	Fovetrue;k par!e.satay, c!ssrern "rae.satachn urn fae.satay=tae.sata,are.sata,+ "&"r		e")	+ (s.jsonp f (:catlb	},")	+ "=?"
		:t} = Ee.sataT
			texjson	SSree	jQuce,Buizd	temporaryaJSONP n(elem, S:	 = 0; .sata:
			ckSe"jsonsonod( .sataynodssrern "rae.satach).cnsrern "rae.url loFar = Ejsonp 		s.jsonpCatlb	},	9 )("jsonpso+/jsc++)
	>= 0 arRClclice: fu=aretqveniceboth	[3 gs[0qver ]u ,
		,and.: fusata = Entent .satayn urn fae.satay=tae.sata,+ ""  dblclic(nsre,(:=so+/jsonp + "$1"l;gtQu inplas.urli		s.url dblclicknsre,(:=so+/jsonp + "$1"l;g>= 0 arWy need  otmevent.bu>= 0 art){
		aJSONP utyre respons   !Econt= id.selectly = Ee.sataT
			texshe ca	;g>= 0 ar){
			aJSONP-styre lo{d
		r tee ( cu momJsonp 		w< low[/jsonp ];grn 	w< low[/jsonp ] ML){
	var s tmpf!anyFoundataytrtmp;		}
	eover m(e) {}huc notnt , xh
s[ tatusFadataetElemeneover m(e) {}Co nletent , xh
s[ tatusFadataetElgth = = 0;eover m	 F		}
	},
"cu momJsonp chn urn faacu momJsonps tmpf!SSurn= = true;
						m, Garbagfuntlly.i che 	w< low[/jsonp ] ML					if (SS che 	lector Engi	aeleteow< low[/jsonp ];g  ;

}ed unde/jsonpE			st the 	:trn
eturrn 		posPrype;hn urn faaype;. Copyrtor		()she case.inde	va	FovSS:/g,
 0et =  .sata:
			ckSe"she ca		nods.andlem 	=\dexO= th1] |s.andlem = isPaSS:/g,
 0et =  .andlem 	=\ isPaXnod= Si	ckSe"GET".length e ( /um )eover mnow(l;g>= 0 arlectdblclin 		_=lif it is	tar t[\ 	 Expt
	m )s.url dblclickrns} "$1_=so+/tsl;g>= 0 ark pnoth
		,wad dblclicd, l h /ime tampf ot 1 &e""1] |s.urli		t
	m+ ((espFiltee.url ,ar(rqver rn "rae.url ,ar"&"r		e?")	+ "_=so+/tsr		e")SSree	jQuce,Ionsatay !Eavailfbex, re
		dnsatay oturlif &&dle
reqvestsr t = 0; .sataXnod= Si	ckSe"GET".length  .urli+em(rqver rn "rae.url ,ar"&"r		e?")	+  .sataSSree	jQuce,W undif &&a 	ve  St zzlreqvestsr t = 0; .globalXnodne - v1aplave++( tch){Far = Ejover mevectn ,
ggChec"ajaxh ctt"SoSSree	jQuce,Mr, cos		nnabsol= i URL,M\)|\savtext)oFdoprinp()e ( r ;/um )rurlrcontexu.urlic,"b ]t,mote{= r ;/umnod(r ;/ui1] nodhec/ui1] ontelo {
iem.seltontl	9 )hec/ui2] ontelo {
iem.hos	).oyFo arIfOwt' elreqvesthe h rncmote{e );
			{
) arand.:ryhe hgo.lo{drJSONh &&She cas{
			a)GET
 0et =  .sata:
			ckSe"she ca		nod= Si	ckSe"GET".nodrcmote{length e ( ype;h,
special[ 			El= expr, result = ype;")h[3,MLrspecial[ e );
			h = " ";gth e ( she caaatd );
			 c" }, hen Bla("she ca	c.ou 0et =  .she caChecsese th1] |	she ca.checsese=  .she caChecses
		:t} = Eehe ca.crc,tee.url;g>= 0 ar){
			aShe caslo{d
		r te = 0;!jsonp chh1] |	et )done  = isPaSS
				m, AsTach (e) {}rrdf &&allebrowse&srn faehe ca.onlo{dridehe ca.ontiodydta	(change ML){
	var sn urn faa = 0;!done nod(!r Win CodySta	(,ML
unde\		r Win CodySta	(,ckSe"lo{dns
	ML = Win CodySta	(,ckSe"co nlete	chn urn faa	done  =}

						}
	eover m(e) {}huc notnt , xh
s[ tatusFadataetElemeneneover m(e) {}Co nletent , xh
s[ tatusFadataetElgth = 0 ar){
			alueter.leakr06/10gtQur eehe ca.onlo{dridehe ca.ontiodydta	(change MLrFn ) f n 		posPrype;hnodshe ca.) ) {
				vn urn fa	aaype;. Copyrtor		()she case.inde	
			return
eturn;gtQu inpla arUs t[3se&t but y	[3stead];
	re
		dtor		   otcir);
{" "ya6/106 bug.npla arctCodariseor
			 a b	s[0c			v !Eus.d (#2709rand.#4378).ade\ype;.[3se&t but y()she ca,oype;.	} ector		f ur>= 0 arWy (e) {}
Cve&yth
		, the hgs[0 he ca e = " "yi3ing m, S:		ery		va					if (SS:/g,
 0 Expt
qvestDone  = isPaSS
		 arC" }, 	: funcqvest;dery.i ch Expxh
,tee.xh
etSS
h				if!xh
,ay( cheery		v (che	jQu arO
		hgs[0 o},, jQu arPasthe hdexO=us{
eOm.,&dlneratnd a logtersopup}ce(O
	ra (#2865)
 0et =  .us{
eOm.,ay( chexh
.lecn(/
		,re.url,re.hsync,  .us{
eOm.,  .passw{
	).indem;
			switcxh
.lecn(/
		,re.url,re.hsyncoSSree	jQuce,Need 	nnyFqueS:ry/c undif &&crossFdoprinlreqvestsr06/Firbutx 3
 	lector Enf thSthntextn(-r.filtonsatayter, fitdt =ee0,extn(-bod ] !Elstisif &&/ Wis/
		
	 0et = (e.satayonhdexO=nod!	oCtextn(		9 )(rts[Sett tos,nodrts[hStt tos.eeturn(arenchn urn faxh
.sesRCqvestHpe;Che"Ctextn(-aren",re.eeturn(arenc;gtQu inpla arhSthgs[0If-Mz if)ns-Sinice =e/ &&If-None-Mr, coype;	rxtif intifMz if)nsxmz e.ou 0et =  .ifMz if)nsxlength = = 0;eover m6'
	Mz if)ns[e.url  !anyFoundxh
.sesRCqvestHpe;Che"If-Mz if)ns-Sinic",;eover m6'
	Mz if)ns[e.url  urn 		var tesion tjover metag[e.url  !anyFoundxh
.sesRCqvestHpe;Che"If-None-Mr, c",;eover metag[e.url "SS:t els	izz
npla arhSthype;	rcem.cate =tleeedhe ca knows	t){
	[t's 	nnXMLHttpRCqvestnpla arOurncsend.: fuype;	rcif it's noto drcmote{XHRr te = 0;!rcmote{length dxh
.sesRCqvestHpe;Che"X-Reqvestar-With"pr"XMLHttpRCqvest"c;gtQu inpla arhSthgs[0Acceptsuype;	rcf &&/ oFtsrv	rxtdbl		dhe h n.: fusataT
		
	 0xh
.sesRCqvestHpe;Che"Accept",re.sata:
			nods.hccepts[re.sata:
			] ?		}
	s.hccepts[re.sata:
			] + ", */*; q=0.01"<:otQurs.hccepts._arent: SoSSreeed unde/ype;	rE			st the jQuce,Allow"cu mom/ype;	rs/mime/
		exa"" earrncabort
 0et =  .bbut yh		d	nods.bbut yh		d nt yos.eeturn , xh
s[ )m 	=\ isPaX!anyFou ar){
			acateglobalXAJAXrcoun {
ou 0et =  .globalXnodne - v1aplave--	ckSet[!anyFouneover mevectn ,
ggChec"ajaxh op" c;gtQu inpla ar: han lecndar  o},, jQu0xh
.abort(n.indet, isXM isPaSS:/g,
 0et =  .globalXFar = Ejover m ,
ggChGlobalnt , "ajaxh		d", [xh
s[ ]SoSSree	jQuce,Waitif &&a respons   otcem.,b	},otQe ( entiodydta	(change MLxh
.lntiodydta	(change ML){
	var s] !Timeou	X!anyFou arT funcqvest;wad aborttdgth 			if!xh
,9 )xh
. CodySta	(,ckSe);Not !Timeou	XckSe"abortso
				pQu arO
	ra incl;
		nt y entiodydta	(change bbut y maWispoi "gtQurm, doewy simul{
e.cate =tlr tesion t!t
qvestDone !anyFoundeover m(e) {}Co nletent , xh
s[ tatusFadataetEln 		var test
qvestDone  =}

						}ion txh
,ay( chetcxh
.lntiodydta	(change MLeover mnoopEln 		var te arT fuquensf	rcisneo nul, ,and.: fusatay !Eavailfbex,  &&/ oFncqvest;/imed	outME",vetrue;k par!t
qvestDone nodxh
,nod(xh
. CodySta	(,ckSe4;Not !Timeou	XckSe"/imeou	""a!anyFou
erqvestDone  =}

						}xh
.lntiodydta	(change MLeover mnoopElotQurstatusait !Timeou	XckSe"/imeou	" ?		}
	i"/imeou	" :gtQur !eover mhttphuc notntxh
,ayagtQur 	"y			s" :gtQur 	 .ifMz if)nsxnodne - v1httpNo	Mz if)ns( xh
s[ .urlich?rn fa	aax.exmz if)ns
	:otQur 	axtuc not"ElotQurtch.wrrMsgElgth = = 0; tatusailtextuc not"Xlength =
f tW undif &,M\)|\d und,nXML	d );
			rhecse y			sogth =
lector Engi	f tpro not.: fusatay(runt.: fuxml	tarough,httpDataXregar {}ss ;
	catlb	},)gtQur esatay=teover mhttpData( xh
s[ .sata:
		s[ SoSSreturned unde/hecserE			st thgtQur 	 tatusait"hecsery			s".inde	
	wrrMsg	=dhecserE			sSSreturnln 		var tes ar event.butt){
	: funcqvest;wad suc notful  &&.exmz if)nsgth = = 0; tatusailtextuc not"X).c tatusailtex.exmz if)ns
	length ;
f tJSONP (e) {}sr0(s ;wn suc note =tlb	},otQure = 0;!jsonp chh1] |	
	eover m(e) {}huc notnt , xh
s[ tatusFadataetElemenenln 		v true;
						eover m(e) {}E			snt , xh
s[ tatusFawrrMsg	tEln 		var tesf tFireOgs[0co nul, ,(e) {}rr
Qure = 0;!jsonp chh1] |	
eover m(e) {}Co nletent , xh
s[ tatusFadataetEln 		var tesntenti!Timeou	XckSe"/imeou	" ay( chetcxh
.abort(n.inde	var tesf th op lueter.leakeChecbet =  .hsync ay( chetcxh
 MLrFn ) f n ls	izz
	
	SS
lace,Oyrrrine	tarFabort,(e) {}r,za.Irent =&(IEn6 incl;
		allow"it,r = it){
's OK)
Qu arO
	ra incl;
		fireOlntiodydta	(change a		all ontabort
 0lector Enet )expAbort,MLxh
.abort;jQu0xh
.abort ML){
	var sn urn fa arxh
.abort 06/107y !Enoto dnt = s JSon(elem, S:		) arand.includes (eyr a	nt y selecteyyFo	}ion txh
,nodrxpAbort nt y ay( chetcrxpAbort nt yntxh
,a.inde	var teslntiodydta	(change(e"abortso
;gtQu SSreeed unde/abortE			st the jQuce,Timeou	Xr Safar
cbet =  .hsync nods./imeou	op();length  etTimeou	(kbox: funn urn fa arC				 to  Se;k p: funcqvest; !Estill hre
		
		r te}ion txh
,nod!t
qvestDone !anyFoundlntiodydta	(change(e"/imeou	" a) f n ls	izz,ds./imeou	oSSree	jQuce,Send.: fusata = lector Enxh
.se""(Mn!Ctextn(i).c .satay==\dexO=addexO=	t .sataynSSnpl= d unde/se""E			st thgtQueover m(e) {}E			snt , xh
s[rFn  ase""E			st ur>= 0 arFireOgs[0co nul, ,(e) {}rr
Qureover m(e) {}Co nletent , xh
s[ tatusFadataetEln e	jQuce,firbutx 1.5 incl;
		fireOdta	(change f &&sync reqvestsr t = 0;! .hsync ay( chelntiodydta	(change(tEln e	jQuce,t, isXMXMLHttpRCqvest eotallow"aborthe hgs[0ncqvest;etc.ou t, isXMxh
;	:},elem, SeriL) ) 		nna );
 ;
	normu	(chte:s  &&a  St zzlem, key/lst;
s  ceota0qver ]u ,
		

r ;am		){
	var s a; }
edi
	},alSopop()e ( um ) {; l h ML){
	var s]key; lst;
	( ("bt	 arIfOlst;
	is aon(elem, Idi3von" && and.t, isXM0(s lst;
[\ 	ett;
		is.pushm	 F		}
	},
ett;
) ? lst;
(
r		ett;
) f ns[re.	},
		.e MLenc= 0URICo nonent(key)	+ "=so+/enc= 0URICo nonent(ett;
)etQu SSre
la arhSthg
edi
	},alS ot "hidf &&s.push <Set.3.2 be(eyi &.r t = 0;g
edi
	},alS	=;
					if ( !anyFoug
edi
	},alS	Mne - v1ajaxhStt tos.quedi
	},alEln e	re
la arIfOanna );
 wad passedlte, lssele t){
	[t	is anna );
 ;
	normu	(chte:s.r t = 0;eover miss );
	ach).ca.jqver ]( ("bt	 arSeriL) ) 	 par ormu	(chte:s
Qureover moach( a,ngth;
		},.pop()a ad=	}/ WihetById/ Wihlst;
	(;gtQu (;gtQu
pl= true;
				ce,IfOquedi
	},al,/enc= 0	 par"rxp" way ( parway t.3.2 o )exp{
ou 0ce,didltt)erogs[rwis tenc= 0	r ;ams recurs= sly.ou 0h[ type ].prbuix i{
as.pop()a  uizdP ;amtntprbuix, l[prbuix],Oquedi
	},al,/l h e.indexif ( [i] arRC			var func ( che hteriL) )aem, S:	t
			vau.joi ("&"  dblclic(r20, "+"c;rnrL	var freplace( uizdP ;amtntprbuix, obj,Oquedi
	},al,/l h epop( = 0;eover miss );
	obj
rnodobjn	},
		. th1] m, SeriL) ) 		 );
 item.ou eover moach( obj,On(elem, i"i,cvoFar = Entent=
edi
	},alSNotrbr	},, rn "radprbuix !a!anyFou
f tT" }, each a );
 item ad a snt a&.r ta ad=	}prbuix, v "SSrn 	z.parennyFou
f tIfOa );
 item  !Enon-snt a& (a );
 ;r;dery.i),/enc= 0	i:s
		eem, ielerict< l; S otnc olv		deteriL) )aem,  ambiguitylissees.
		eem, Note t){
	r	}, (as ;
	1.0.0)nt =
		 ur; i ly	deteriL) )e
		eem, iestarOa );
s.selectly,M\)|\attempthe hgo.do doemaylctuse
		eem, aFtsrv	r y			s. Possible fix
s 		if otmz ify	r	},'s
		eem, deteriL) )aem,  algorithm  &&/o provida anne(elem  &&flag
		eem, tt forc" a );
 teriL) )aem,  tt benshallow.p()a  uizdP ;amtntprbuix	+ "[so+/nt= Sizzll =nt.adery.isF).cne - v1iss );
	l) ? ir		e" )	+ "]"prl,Oquedi
	},al,/l h e.indexif ((;gtQu
pvetrue;k par!/
edi
	},alSnodobjyonhdexO=nod= Sizzlobjy=nt.adery.isF!anyFo = 0;eover misEmptyOery.i( obj !a!anyFouad=	}prbuix, : expr
 f arSeriL) ) 	dery.ilitem.ou z.parennyFoueover moach( obj,On(elem, i"k,cvoFar = E  uizdP ;amtntprbuix	+ "[so+/k	+ "]"prl,Oquedi
	},al,/l h e.index"SS:
		:	tQu
pvetrue;h1] m, SeriL) ) 	snt a& item.ou ad=	}prbuix, obj !;S:}t}t[ arctCod !Estill  n.: fus.push dery.i...df &&now
f tW ntf otmzvy maWis otne - v1ajax inm=xday eover mo.te""({a{
 arCoun {
df &&(oln to 	
		r] - 0 ;
	rplave0qveri
s

rplaveio0e
{
 arLast-Mz if)nsuype;	rcandlemf &&nrn [reqvestjQ6'
	Mz if)ns: {},
	etag: {},

	(e) {}E			s		){
	var s u, xh
s[ tatusFaw. th1] m, IfOa lo {lacatlb	},rwad ter, fitd,	fireOit
 0et =  .e			st thgtQu .e			s nt ynts.eeturn , xh
s[ tatusFaw. Eln e	jQuce,FireOgs[0globalX =tlb	},otQet =  .globalXFar = Ejover m ,
ggChGlobalnt , "ajaxE			s", [xh
s[ Faw]SoSSree		},

	(e) {}Suc not:a){
	var s u, xh
s[ tatusFasatayn urn m, IfOa lo {lacatlb	},rwad ter, fitd,	fireOitM\)|\pass.&&   fusata = et =  .suc note thgtQu .suc not nt ynts.eeturn , sata, statusFaxh
,a.inde	jQuce,FireOgs[0globalX =tlb	},otQet =  .globalXFar = Ejover m ,
ggChGlobalnt , "ajaxSuc not", [xh
s[ ]SoSSree		},

	(e) {}Co nleteion(elem, i"u, xh
s[ tatusyn urn m, Pro not.nc ( cp[iet =  .ao nul, , th1] |s.ao nul,  nt ynts.eeturn , xh
s[ tatus,a.inde	jQuce,T funcqvest;wad ao nul, dotQet =  .globalXFar = Ejover m ,
ggChGlobalnt , "ajaxCo nlete", [xh
s[ ]SoSSree	jQuce,){
			acateglobalXAJAXrcoun {
ou et =  .globalXnodne - v1aplave--	ckSet[!anyFoueover mevectn ,
ggChec"ajaxh op" c;gtQe		},
Qu
p ,
ggChGlobalion(elem, i"u, /
		,rargi[!anyFoos.eeturn 	nods.a true nurli	=\dexO=ads.push(s.a true 
r		eover mevect)n ,
ggChe/
		,rargi..ou},

dce,Drtunmdnes<ion	nnXMLHttpRCqvest;wad suc notful  &&.ex
	(ttphuc notion(elem, i"xh
,ay( chlector Enf tIEny			stinm=/ime iunctionc1223 
			}[tnshouurLben204cem.c" }, itM\d suc not,  Se;#1450r En=== "no!xh
.status,nodlo {
iem.seltontl	elte"file:",ML
undexh
.status,>=n200 nodxh
.status,< 300,ML
undexh
.status,ckSe304,9 )xh
.status,ckSe1223SSreeed undee the jQut, isXM isPaSS:},

dce,Drtunmdnes<ion	nnXMLHttpRCqvest;unctioncNo	Mz if)ns
	(ttpNo	Mz if)nsion(elem, i"xh
,eurl "engt] Expl'
	Mz if)ns,MLxh
.gesRCspons Hpe;Che"Last-Mz if)ns"c,"b ]e	felemxh
.gesRCspons Hpe;Che"E	fe"tSS
h				ifl'
	Mz if)ns,!anyFoueover m6'
	Mz if)ns[url  =fl'
	Mz if)nsSS:/g,
 0et = e	fel!anyFoueover metag[url  =fetagSS:/g,
 0t, isXMxh
.status,ckSe304SS:},

dhttpDataion(elem, i"xh
,et
		s[ Soengt] Expctlemxh
.gesRCspons Hpe;Che"ntextn(-r.fi") f (: ,"b ]xml	=d= Si	ckSe"xml"y, c!t
			nod.i.< l; j+("xml") >ch),
etuaatalemxmO=adxh
. Cspons XML	:dxh
. Cspons  0, SS
h				ifxmO=noddata.e );
			h = " "llse lem.tckSe"hecsery			s"l!anyFoueover me			snt"hecsery			s"l!SSree	jQuce,Allow"a}prb- :irCh to freplace(to  ani
	z 	: funcspons jQuce,od !Er Safarito keepeb	},wards ao n{
ibilityou et =  	nods.dataF:irCh !anyFouaatalems.dataF:irCh(adata a/
			a.inde	jQuce,T fu :irCh t =&aplut yyrhecse : funcspons jQuntent= Sizzlsatay==text),
		soFar = E/, Geth: fuJavaShe casdery.i,za.IJSONh !Eus.d.ou 0et = t
			ckSe"jsonso, c!t
			nod.i.< l; j+("json	c	>ch){
			va Esatay=teover mr ;seJSON(adataetElgth  arIfOt)oFr.filtse"she ca	,(|val	[t	in0globalX  true rn 	z.parenet = t
			ckSe"she ca		, c!t
			nod.i.< l; j+("javashe ca	ch>ch){
			va Eeover mglobalEval tdataetEln 	xif ( [i]t, isXMsataSSr( [	var m*
 *rC" }, 	: funcqvest;dery.i; MicrosofaLfailed  ot) lectly  *ri nle
			r: fuXMLHttpRCqvest;06/107y(t =
		ncqvest;lo {lafiles),
 *rdoewy use : fuAplaveXOery.i 
			}[tn !Eavailfbex
 *rAddi
	},alyyrXMLHttpRCqvest;ean{bensi	cessd 06/107/IE8rdo
 *rwy need aM islb	}, 
 */  evenw< low AplaveXOery.i lengteover majaxhStt tos.xh
 MLgth;
		},.pop() = 0;w< low lo {
iem.seltontl	!lte"file:",!anyFoug
ctor Engt, isXMcve w< low XMLHttpRCqvest(& (cheeed undexh
E			s the 	:( [i]g
ctor Ent, isXMcve w< low AplaveXOery.i("Microsofa XMLHTTP"oSSreeed undeaplaveE			s the 	}et}t[ arDntext) !Ebrowse& tupport{XHR reqvests? eover mtupport.ajax = !!eover majaxhStt tos.xh
etSS
t[SS: /	(chsi			ayX= {},
	rfx/
		ex		/^re toggle|show|hide)$
		"rfx			aat/^([+\-]=)?([\d+.\-]+)(.*)$
		"/imerId		"fxisTaum ) jQuce,height anim{
iem)
		[ "height"xtdmar[urTop"jQ"mar[urBottomr,c"padd
		Top"jQ"padd
		Bottomr(?:[\uce,widthM\)im{
iem)
		[ "width"jQ"mar[urLefl"jQ"mar[urRight"xtdpadd
		Lefl"jQ"padd
		Rightr(?:[\uce,epacityl\)im{
iem)
		[ "opacity"
]
	];useover mfnmo.te""({arshowion(elem, i"upeidIdnasn 	,ecatlb	},r( ("b ntentupeidi).c peidi tch){Far = Et
			var Win\)im{
een		nFx("show"jQ3),"upeidIdnasn 	,ecatlb	},).indem;
			switch[ type ].exec( )j em= Wi = part		retujn ret.length = arRC St gs[0inrn ensi			ay ;
		
 !Ecle
			r:o.leasXM0f it isgth = arbe});
hidden bylctsc{dns rures}c&&.ex
	u 0et = !eover msata(r Wi[.g,;"oldsi			ay"
rnodr Wi[.ghstyre.si			ayX	=;
xrone" !anyFoundr Wi[.ghstyre.si			ayX		erurn 		var tesf thetu	(chte:s whiata(eyr been pyrrrinden {
			si			ay		roner tesf ti{
asttyreshee	r:o.wh{
ev 0 tar/arent: Sbrowse& ttyre isgth = arf &&suc			nny(chte:
	u 0et = r Wi[.ghstyre.si			ayX	=;
x"Xnodne - v1cot	}/ Wi[.g,;"si			ay"veX	=;
xrone" !anyFoundeover msata(r Wi[.g,;"oldsi			ay"Iderent: Di			ay(r Wi[.gn = 0lem.)"SS:t els	izz
npla arhSthtar/ai			ay ;
	most ;
		
			(chte:s i{
astsce,d loopgte  areotavoid : funtestan		ncflowwitch[ typ		eve;)retujn ret.length =r Wi[.ghstyre.si			ayX		eover msata(r Wi[.g,;"oldsi			ay"
rf (: s.	izz
nplat, isXMr Wi.ou:e	:},

dhideion(elem, i"upeidIdnasn 	,ecatlb	},r( ("b ntentupeidi).c peidi tch){Far = Et
			var Win\)im{
een		nFx("hide"jQ3),"upeidIdnasn 	,ecatlb	},).iindem;
			switch[ type ].exec( )j em= Wi = part		retujn ret.length =et )di			ayX		eover mcot	}/ Wi[.g,;"si			ay"veElgth = = 0;di			ayX!=;
xrone" !anyFoundeover msata( r Wi[.g,;"oldsi			ay"Idei			ayX"SS:t els	izz
npla arhSthtar/ai			ay ;
		
			(chte:s i{
astsce,d loopgte  areotavoid : funtestan		ncflowwitch[ typ		eve;)retujn ret.length =r Wi[.ghstyre.si			ayX		xrone"s.	izz
nplat, isXMr Wi.ou:e	:},

d arhave		
		rld.toggleon(elem, S:_toggle		eover mfnmtoggle,

dtoggle		){
	var s fn, fn2,Mcatlb	},r( ("b et )bool	=d= Si;
	nnSelte"b{olean"SS
h				ifs.pushm	 F		}
	},
fn)Xnodne - v1	 F		}
	},
fn2"r( ("b  / Wi _toggletest( ma/ Wi,o rgelects< l;
Foz.parenet = nnSel\dexO=).cbool	( ("b  / Wi oach(gth;
		},.pop()a lse;uta	(,ccbool	? nnS		eover (r Wil.is(":hidden"tElemeneover (r Wil[;uta	(,? "show" 		"hide" ](e.index"SSindem;
			switcr Win\)im{
ee		nFx("toggle"jQ3),"fn, fn2,Mcatlb	},a.inde	jQut
			var Wi;S:},

df{dnToion(elem, i"upeidIdtoIdnasn 	,ecatlb	},r( ("b t
			var Win :irChe":hidden"tmcot	dopacity"xt0).show().e""()gtQur n\)im{
ee{opacity: to},"upeidIdnasn 	,ecatlb	},).in},

da)im{
eion(elem, i") le,"upeidIdnasn 	,ecatlb	},r( ("b et )optt y  )eover mtpeid(upeidIdnasn 	,ecatlb	},).iind = 0;eover misEmptyOery.i( ) le ) ay( cheery		va/ Wi oach()optt y.ao nul, , .inde	jQut
			var Wi[)optt y.qveuem 	=\ isPaX? "oach" 		"qveue" ](gth;
		},.pop()a arXXX ‘r Wi’.includes always (eyr a	lse lem.t
			}runn to 	
	gte  areest;suite
nplaet )optm )eover me.te""({},Moptt y),"p(		}
	isEle
			rem= Wi fr parent				s(		}
	hidden emisEle
			rnodne - v(r Wil.is(":hidden"t(		}
	uerf em= Wi;sME"ch[ typpltersele.length =et )nh[1lemeover manm.l,
	sadpveElgth = = 0;pX!=;
eOm.,ay( ched	prop[d/ More<h	prop[dp ];g  ;

aeleteoprop[dp ];g  ;

p<h	nh[1urn 		var tes = 0;prop[p]Selte"hide" nodhidden 9 )hrop[p]Selte"show" nod!hidden ay( ched	t
			vaoca.co nul,  nt ynr Wilurn 		var tes = 0;isEle
			rnod0;pXelte"height" 9 )hlelte"width"vchn urn faa ar event.butt){
	noth
		,sneake	outME", = arRCcord	all 3 pyrrflow"asTag = i!EbectusetIEnincludesME", = archange 	
		ryrrflow"asTag = it
			}ryrrflowXM\)|ME", = arryrrflowY 		ifse	r:o./ oFt Morlst;
[\ 	btopt.ryrrflow"  [ / Winttyre.oyrrflow, / Winttyre.oyrrflowX, / Winttyre.oyrrflowYm];grn 		a arhSthsi			ayXselectey :o.inrn e-blockdf &&(eight/widthrn 		a ar\)im{
iem)  n.inrn en	(chte:s t){
		r ,(ev});
{
dth/(eightrn 		a ar\)im{
tdgth ;
 = 0;eover mcot	}/ Wi,o"si			ay"veX	=;
xinrn e" 		, is	undeover mcot	}/ Wi,o"flo{
"veX	=;
xrone" !anyFound0et = !eover mtupport.inrn eBlockNeedsLayoutvn urn fa	aa/ Winttyre.si			ayX		xinrn e-block"Elgth = 0= true;
							}et )di			ayX		erent: Di			ay(r Win = 0lem.)Elgth = 0sf ti{rn e-l selu	(chte:s 	ccept.inrn e-block;gth = 0sf tblock-l selu	(chte:s need  otb[0inrn en{
			layoutME",th = = 0;di			ayX	=;
xinrn e" n urn fa	aaa/ Winttyre.si			ayX		xinrn e-block"Elgth = 00= true;
							}a/ Winttyre.si			ayX		xinrn e".inde	
	}a/ Winttyre.zoomrct1s.th = 00=
h = 00=
h = 0}rn 		var tes = 0;ne - v1iss );
	)hrop[p]Schn urn faa arC" }, 	(k pneeded);\)|\add  otter, alEasn 	rn faa(opt.ter, alEasn 	 h	e(e.ter, alEasn 	 9 ){})[p]Se)hrop[p][1];g  ;

prop[p]Se)hrop[p][0]SS:t els	izz
nplak parept.ryrrflow"!=\dexO= th1] |e/ Winttyre.oyrrflow =	"hidden"s.	izz
nplaoca.curA)imm )eover me.te""({},Mhrop)Elgth eover moach( ) le,"elem, i){cetByIdlst.length =et )e MLrew	eover mfx
"uerf,Mopt,cetByse.ir tes = 0;rfx/
		ern "ralst) n urn faae[alst		=Se"/oggle"X? hidden ? "show" 		"hide" 		ett,]( ) le )SSurn= = true;
						e ( r ;/um )rfx			rcontelst),
h = 00s ctt = e.cur(}

	) f (0SSnpltes = 0;r ;/umn urn fa	aet )end =dhecseFlo{

)hec/ui2] ),
h = 00	unit{= r ;/u[33,MLr"px"
	>= 0	 0 arWy need  otco n= i s cttn 	 lst;
[\ 	bts = 0;unit{!=;
xpx" n urn fa	aaeover mttyrei"uerf,MetById(end MLr1)	+ unite.inde	
	0s ctt = ((end MLr1)	/ e.cur(}

	)) *rd ctt;rn fa	aaeover mttyrei"uerf,MetByIds ctt + unite.inde	
	}	>= 0	 0 arIfOa +=/-em=oken {ad providar} wt' eldohe h rnclt = s \)im{
iem[\ 	bts = 0;hec/ui1] n urn fa	aaend =d((r ;/ui1] 	=Se"-="X? -1 		1) *rend)	+   ctt;rn fa	a}	>= 0	 0e.cu mom(   ctt,/enr} hnit{)Elgth = = true;
							e.cu mom(   ctt,/ett, ""
match){
e 	:trn
etu} ur>= 0 arF &&JS]u ,
.e co nuiance cheery		va/

					( .ou},

d mop		){
	var s cleasQveue, gotoEndr( ("b et )/imerum )eover m/imeru.iind = 0;cleasQveue	( ("b  / Wi qveue([] .inde	jQu/ Wi oach(gth;
		},.pop()a argo.in   {"rs trt;	rcem.anyth
		,added  otgs[0qveue	dur to 	
		loopn !Eignt ydwitch[ type ].exec/imerun	},
		.-t1s.ex>eve;)r--xlength = = 0;/imeru[.ghturn 	=Se/ Wise;
						 = 0gotoEndn urn fa	a arf &ice: funrn [step  otb[0	
		lastME",th /imeru[.g(}

	)atch){
e 
",th /imeru					ce(i,	1)SS:t els	izz
tu} ur>= ce,o ctt : funrn [[3 gs[0qveue;k p: fulast[step {ad;
		f &icdotQet = !gotoEndr( ("b u/ Wi deqveue(a.inde	jQut
			var Wi;S:}
L	var freplace(		nFx(et
		s[			a( ("bet )objy=r{}s.sheover moach( fxisTau.a tcattest( m {; fxisTau."" ) (0,			)),ngth;
		},.pop()obj[ / Wire<h	t
		;,ex& (
:t
			vaobjet}t[ arGlneratnnshortcutrdf &&cu mom/\)im{
iem)
eover moach({arslidaDown:n		nFx("show"jQ1),
hslidaUp:n		nFx("hide"jQ1),
hslidaToggle				nFx("toggle"jQ1),
hf{dnIn:n{ opacity: "show" },
hf{dnOu	io{ opacity: "hide" }
},"elem, i){cetById) lerl"engteover mfn[d/ More<h	n(elem, i"upeidIdnasn 	,ecatlb	},r( ("b t
			var Win\)im{
een) ler,"upeidIdnasn 	,ecatlb	},r(;S:}et}var eover mo.te""({arupeidion(elem, i"upeidIdnasn 	,efnr( ("b et )optlemspeidinod= Sizzlepeidi tchadery.isF?)eover me.te""({},Mepeid
r		("b uco nleteionn 9 )!nn em |asn 	 9 lemeneover m	 F		}
	},
"epeidi)XnodupeidIlemedur{
iem:dupeidIleme|asn 	ionn em |asn 	 9  |asn 	 nod!eover m	 F		}
	},
|asn 	) em |asn 	
	
	SS
laoca.dur{
iemm )eover mfxhoffF?)0 :d= Sizzloca.dur{
iemm =;
xr] - 0ur?loca.dur{
iemm:nplaoca.dur{
iemmin)eover mfxhupeids ? eover mfxhupeids[oca.dur{
iem]r		eover mfxhupeids._arent: ur>= ce,Qveuen 	
	
ept.rxpttroca.co nul, ;
	
ept.ao nul, ,ML){
	var sn urn fk parept.qveue;!	=\ isPaX!anyFouneover (r Wil deqveue(a.indels	iz = 0;eover m	 F		}
	},
"ept.rxpt) n urn faept.rxp nt ynt/ WiseEln 	xif (s.shit
			vaept.ou},

d|asn 	iourn rn eas		){
	var s e,"n,	firstNumIdeiff ay( cheery		vafirstNum	+ eiff * pEln },
Quswn 	ion{
	var s e,"n,	firstNumIdeiff ay( cheery		va((-Mr,h.aos(p*Mr,h.PI)/2)	+ 0.5) *reiff +	firstNum.ou:e	:},

d/imeru:) {;

dfxion(elem, i"e( t; n(elems,Msele.lengthr Wine(elems"h	e(elems;jQu/ Wi ourn 	"e( t;jQu/ Wi sele.e)hropSS
h				if!e(elems.rts[ ay( chel(elems.rts[ =t{}) f ( :}
L	var eover mfxhselto/
			te{
d arhi nle freplace(f &&s &the hasttyre lst;
[\upd{
eion(elem, i( ("b ntentr Wine(elems.step ( ("b u/ Wi e(elems.step nt ynt/ Wi.e( t; } Win =w, / Wi, .inde	jQu(eover mfxhutep[/ Wi sele]F).cne - v1fxhutep._arent: )nt/ WiseEln},

d arGeth: fu ur; i  s )e
	 urion(elem, i( ("b ntentr Wine( t[/ Wi sele]FonhdexO=nod(!r WinestChstyre	ML = WinestChstyre
/ Wi sele]Fel\dexO) ay( cheery		va/ Wi o( t[ / Wi sele.eSS:/g,
 0 Expt =dhecseFlo{

)eover mcot	}/ Wi.e( t; } Win) le ) a;shit
			va
,nodr > -10000 ? h :o0Eln},

d arh ctt an/\)im{
iem f
			one r] - 0 tm.anogs[r
acu mom		){
	var s f
		IdtoIdhnit{)engthr Wino cttTimem )eover mnow(l;gthr Wino ctt,ML)
		;jQu/ Wi ond =dto;jQu/ Wi unit{= unit{ML = Winunit{ML "px"
		:} Win =wrem= Wi   ctt;rn } Win)osrem= Wi   c, ,ML0SSnple ( uerf em= Wi; fxm )eover mfx;rn freplace(t( gotoEndr( ("b 	t
			vauerfmutep0gotoEndn.inde	jQu/ ourn 	"/ Wi.e( tSS
h				ift()Xnodne - v1/imeru	push(t)tnod!/imerId ( ("b u/imerId =&s &In {
val fxhti},,=fxhin {
valoSSree		},

	 arhi nle 'show'on(elem, S:showion(elem, in urn m, RCoe - 0 war tewy s cttidIdem.caatIrent =&go.b	},r:o.it l{
ergthr Wine(elems.rts[
/ Wi sele]Fe)eover mttyrei"/ Wi.e( t; } Win) le );gthr Wine(elems.show  =}

			rn m, Beg[3 gs[0\)im{
iem[\  ar event.butt){
	wy s ctt a		a small {
dth/(eightreotavoid any[\  arfladh(;
	ctextn(gthr Wincu mom(/ Wi sele.elte"width"vML = Winsele.elte"height" ? 1 		0; } Wincur()xpr
 f arS ctt byldhow to 	
		y(chte:
	ueover ("/ Wi.e( t ).show();		},

	 arhi nle 'hide'on(elem, S:hideion(elem, in urn m, RCoe - 0 war tewy s cttidIdem.caatIrent =&go.b	},r:o.it l{
ergthr Wine(elems.rts[
/ Wi sele]Fe)eover mttyrei"/ Wi.e( t; } Win) le );gthr Wine(elems.hide  =}

			rn m, Beg[3 gs[0\)im{
iem[\ r Wincu mom(/ Wi cur(),(0n.in},

	 arEach step of an/\)im{
iem
d mep		){
	var s gotoEndr( ("b et )/m )eover mnow(l, done  =}

			
h				ifgotoEndrML =x>evr Wine(elems.dur{
iemm+ r Wino cttTimem( ("b u/ Wi  =wrem= Wi ond;"b u/ Wi )osrem= Wi   c, ,ML1;"b u/ Wi upd{
e(l;g>= 0r Wine(elems.curA)im[ / Wi sele.e  =}

			
h	ch[ type ].exin r Wine(elems.curA)imxlength = = 0;/ Wine(elems.curA)im[i] onte "hidn urn fa	done  = isPaSS:t els	izz
s	iz = 0;done !anyFoun arRC St gs[0oyrrflowgth = = 0;/ Wine(elems.ryrrflow"!=\dexO=nod!eover mtupport.shrinkWrapBlockise;
						S: /	(ch 	"/ Wi.e( t; n(elems evr Wine(elemsatch){
eover moach( [(: , "X , "Yr(?: freplace((< l; ; lst;
n urn fa	aestChstyre
hadyrrflowm );lst;
	]"h	e(elems.ryrrflow[< l; ];g  ;

}en.inde	var tesf tHine	tarFe = " "yi p: fu"hide" lect{
iemm{ad doner tes = 0;/ Wine(elems.hide !anyFoundeover 	r Wino(ch).hide(n.inde	var tesf tRC St gs[0selecteilss[i p: fuitem had been hidden  &&shownr tes = 0;/ Wine(elems.hide ML = Wine(elems.show !anyFoundh[ type ].pxin r Wine(elems.curA)imxlength =aaeover mttyrei"/ Wi.e( t; p, r Wine(elems.rts[
p]
match){
e 	:trn
r tesf tEont= iOgs[0co nul, ,n(elem, S:		)r Wine(elems.co nul,  nt ynt/ Wi.e( t )s.	izz
nplat, isXM isPaSS
= = true;
				et )n evr - r Wino cttTime;"b u/ Wi   c, ,MLn /vr Wine(elems.dur{
iem.i>= 0 arPrrformutarFeasn 	 n(elem, Idarent: is otswn 					et )ter, alEasn 	 h	= Wine(elems.ser, alEasn 	 nodr Wine(elems.ser, alEasn 	
/ Wi sele];				et )arent: Easn 	 h	= Wine(elems.|asn 	 9  (eover moasn 	.swn 	 ? "sw
		so: "rn eas"tEleme/ Wi )osremeover moasn 	[ter, alEasn 	 9 )arent: Easn 	](/ Wi   c, ,"n,	0; 1,vr Wine(elems.dur{
iemtEleme/ Wi  =wrem= Wi   cttm+ ((/ Wi ond - r Wino ctt) *r/ Wi )os).i>= 0 arPrrformutarFnrn [step ;
		
		\)im{
iem[\ 	/ Wi upd{
e(l;gnde	jQut
			var

				}
}ar eover mo.te""()eover mfx,;
		ti},ion(elem, in urn et )/imerum )eover m/imeru.iindh[ type ].exec(;)retu/imerun	},
		n ret.length k par!/imeru[.g() n urn fa/imeru					ce(i--,	1)SS:t e 	:( [i]k par!/imerun	},
		. th1] |ne - v1fxhutop(oSSree		},

	in {
val: 13,

d mop		){
	var s th1] cleasIn {
val  /imerId (;gthrimerId =&rFn ) f},

d peidsiourn slowio60),
etfas	io20),
et/e,Drent: s peid
tu_arent:  c400ou},

d mep		op()opacity: ){
	var s fx. th1] |ne - v1ttyrei"fxhe( t,c"opacity"xtfxh =wr)Eln },

tu_arent:  c){
	var s fx. th1] |et = nxnestChstyre	nodnxnestChstyre[ fxhsele.e !=\dexO= th1] |enxnestChstyre[ fxhsele.e = (fxhsele.elte"width"vML fxhsele.elte"height" ? Mr,h.max(0,rfxh =w
r		fxh =w
r+	fxhunitSS:t e true;
					nxnestC[ fxhsele.e = fxh =wSS:t e 	:( nrL	var ion tjover me.(tXnodne - v1o.((			returl"engteover mo.((			retur.\)im{
td emn(elem, i"e( t "engt]=== "noeover mgrep0eover m/imeru,	){
	var s fnr( ("b 	t
			vaturn 	=Sefnmo( t;jQu})n	},
		n 	}et}t[freplace(erent: Di			ay(	lse lem.tepop( = 0;!	(chsi			ay[	lse lem.t]r( ("b et )	(ch 	"eover 	"<m );lse lem.t+ ">").re
		dTo("bod "t(		}
si			ayX		estChcot	dsi			ay"
.iindestCh CopyretSS
h				ifsi			ayX	=;
xrone" 9 )ai			ayX	=;
x"X!anyFouai			ayX		xblock"El	:( [i]	(chsi			ay[	lse lem.t]r=)ai			ay;S:}
L	t
			vaturnsi			ay[	lse lem.t]et}t[t[SS: /rtable em/^t(?:able|d|h)$/i		"rroo(i		/^re bod |atml)$/iar ion t"getBou	dhe Cli" "Ry.isFin special[ e );
			h = " "l"engteover mfnhoffsese= f		}
	},
"eptlems ( ("b et )	(ch 	"r Wi[0?: boxSS
h				ifeptlems ( (  cheery		va/ Wi oach(gth;
		}, ir( ("b  ;eover moffses.sesOffses	}/ Wi,on(elems,Mi e.index"SS:
		[i]k par!	(ch 9 )!estChownerD );
			r( ("b 	t
			varFn ) f ( [i]et = eurn 	=SeestChownerD );
			.bod ]( ("b 	t
			vaeover moffses.bod Offses	}e( t )s.	i( [i]g
ctor EnboxX		estChgetBou	dhe Cli" "Ry.i(oSSreeed undee the jQuet )doc SeestChownerD );
			(		}
socE(ch 	"soc e );
			h = " ";g[\  ar event.butwt' eldes deal});
{
			a)si	conny.itd DOM	lse [i]k par!boxX, c!sover mcontains0;docE(ch )turn "a( ("b 	t
			vaboxX, c{ mop		0,rlef	io0 vSS:/g,
 0et )body 	"soc body(		}
w
	 	"getW< low(soct(		}
cli" "Tle. 	"socEstChcli" "Tle. ).cbodyhcli" "Tle. ).c0(		}
cli" "Lefl 	"socEstChcli" "Lefl ).cbodyhcli" "Lefl ).c0,
etusheollTle. 	"(w
	.pageYOffsesF).cne - v1tupport.boxMse O=noddocEstChsheollTle. ).cbodyhsheollTle.),
etusheollLefl 	"(w
	.pageXOffsesF).cne - v1tupport.boxMse O=noddocEstChsheollLefl ).cbodyhsheollLefl),
etutle. 	"box.tle. + sheollTle. - cli" "Tle,
etulefl 	"box.lefl + sheollLefl - cli" "Lefls.shit
			va{ mop		tle,"lef	iolefl }n 	}et
e true;
		eover mfnhoffsese= f		}
	},
"eptlems ( ("b et )	(ch 	"r Wi[0?SS
h				ifeptlems ( (  cheery		va/ Wi oach(gth;
		}, ir( ("b  ;eover moffses.sesOffses	}/ Wi,on(elems,Mi e.index"SS:
		[i]k par!	(ch 9 )!estChownerD );
			r( ("b 	t
			varFn ) f ( [i]et = eurn 	=SeestChownerD );
			.bod ]( ("b 	t
			vaeover moffses.bod Offses	}e( t )s.	i( [i]eover moffses.ini
	L) ) etSS
h	et )offsesP ) {
 SeestChoffsesP ) {
,MseevOffsesP ) {
 SeestC(		}
soc SeestChownerD );
			(tco n= idStyre, socE(ch 	"soc e );
			h = " ",r Enbody 	"soc body((erent: View 	"soc erent: View,r EnseevCo n= idStyreX		erent: View ?	erent: ViewhgetCo n= idStyrei"e( t; dexO= t:nestCh ur; i Styre,
etutle.SeestChoffsesTle,"lef	.SeestChoffsesLefls.shiwhireX( (ourn 	"e( t.) ) {
				) em |urn ontebody em |urn ontesocE(ch  th1] |et = eover moffses.supportsFixedPosi
	}, nodheevCo n= idStyre )osi
iemm =;
xfix
s
	length ;breaks.	izz
nplaco n= idStyreX		erent: View ?	erent: ViewhgetCo n= idStyreie( t; dexO t:nestCh ur; i Styre;
etutle. -	"e( t.sheollTle;
etulefl -	"e( t.sheollLefls.shi]et = eurn 	=SeoffsesP ) {
 n urn fa/le. +SeestChoffsesTleatch){lefl +SeestChoffsesLefls.shi |et = eover moffses.inclNotAddBrt;	rcnod!(eover moffses.inclAddBrt;	rForTableAndCell 	nodrtablern "raestChe= 0lem.)" !anyFoundrle. +SehecseFlo{

)co n= idStyre bot;	rTleWidthM ) f (0SS	ch){lefl +SehecseFlo{

)co n= idStyre bot;	rLeflWidthM) f (0SS	ch)n
r tesseevOffsesP ) {
 SeoffsesP ) {
SS	ch)offsesP ) {
 SeestChoffsesP ) {
s.	izz
nplaet = eover moffses.subtractsBrt;	rForOyrrflowNotVisible nod.o n= idStyre ryrrflow"!=;
xvisible" n urn fa/le. +SehecseFlo{

)co n= idStyre bot;	rTleWidthM ) f (0SS	ch)lefl +SehecseFlo{

)co n= idStyre bot;	rLeflWidthM) f (0SS	chz
nplaseevCo n= idStyreX		co n= idStyre) f ( [i]et = heevCo n= idStyre )osi
iemm =;
xnclt = s" 9 )heevCo n= idStyre )osi
iemm =;
x  c,ic",!anyFougle. +SebodyhoffsesTleatch)lefl +SebodyhoffsesLefls.f ( [i]et = eover moffses.supportsFixedPosi
	}, nodheevCo n= idStyre )osi
iemm =;
xfix
s
	length gle. +SeMr,h.max(ddocEstChsheollTle,cbodyhsheollTle.)atch)lefl +SeMr,h.max(ddocEstChsheollLefl,cbodyhsheollLefl, .inde	jQut
			va{ mop		tle,"lef	iolefl }n 	}et}r eover moffsese= op( ni
	L) ) ion(elem, in urn et )body 	"soc;
			.bod , container atd );
			 c" }, hen Bla("div"t(FinnerDiv,Er SafDiv,Etfbex, td,cbodyMar[urTop =dhecseFlo{

)eover mcot	bod , dmar[urTop")M) f (0,
etuatmlX		x<divsttyre=')osi
iem:absol= i;mop	0;lef	i0;mar[uri0;bot;	r:5px intisi#000;padd
		i0;width:1px;height:1px;'><div></div></div><table ttyre=')osi
iem:absol= i;mop	0;lef	i0;mar[uri0;bot;	r:5px intisi#000;padd
		i0;width:1px;height:1px;' cellpadd
		='0' cellsplin 	='0'><tr><td></td></tr></table>"
	>= eover mo.te""()containerhstyre,a{ )osi
iem:e"absol= i", mop		0,rlef	io0, mar[urio0, bot;	r:o0, width: "1px",&(eight: "1px",&visibility:	"hidden" }{)ElgthcontainerhinnerHTMLX		atml.indbodyh[3se&t but y()container,cbodyh	} ector		f uri]ennerDivX		containerh	} ector		uri]r SafDiv eminnerDivh	} ector		uri]td eminnerDivhnrn Sibln 	.	} ector		h	} ector		ur
 u/ Wi dnclNotAddBrt;	rc	"(r SafDivhoffsesTle"!=;
5);gthr WininclAddBrt;	rForTableAndCell 		"(tdhoffsesTle"==;
5);gri]r SafDivnttyre.)osi
iemm 
xfix
s
;ri]r SafDivnttyre.tle.Se"20px"
	>= ce,oafari subtracts ) ) {
 bot;	r,widthMar tewhiatais 5pxgthr WinsupportsFixedPosi
	}, 	"(r SafDivhoffsesTle"==;
2);Notr SafDivhoffsesTle"==;
15);gthr SafDivnttyre.)osi
iemm 
r SafDivnttyre.tle.Se""SS
h		nnerDivhttyre.oyrrflow =	"hidden"s.	i	nnerDivhttyre.)osi
iemm 
xnclt = s"ur
 u/ Wi subtractsBrt;	rForOyrrflowNotVisible 	"(r SafDivhoffsesTle"==;
-5);gri]/ Wi dnclNotIncludeMar[urInBod Offses 	"(bodyhoffsesTle ontebodyMar[urTop);gri]bodyh Copyrtor		()container ).indbodyX		container eminnerDivm 
r SafDiv 	"rable emtd =&rFn ) f]eover moffses.ini
	L) )  MLeover mnoopEln},

tbod Offses c){
	var s bod ]( ("b et )/le.SebodyhoffsesTle,"lef	.SebodyhoffsesLefls.[i]eover moffses.ini
	L) ) etSS
h	et = eover moffses.inclNotIncludeMar[urInBod Offses length gle. +SehecseFlo{

)eover mcot	bod , dmar[urTop")M) f (0atch)lefl +SehecseFlo{

)eover mcot	bod , dmar[urLefl")M) f (0atche	jQut
			va{ mop		tle,"lef	iolefl }n 	},
e
	sesOffsesion(elem, i"e( t; n(elems,Mi]( ("b et ))osi
iemm 
eover mcot	}e( t,c")osi
iem expr
 f arses )osi
iemm	} ec(Fin-cas   op/lefl 		ifse	revec  n.  c,ic}e( t[i]et = hosi
iemm =;
x  c,ic",!anyFouestChstyre.)osi
iemm 
xnclt = s"ur:/g,
 0et ) urE(ch 	"eover 	}e( t )(		}
curOffses 	" urE(chmoffses()(		}
curCSSTop =deover mcot	}e( t,c" op" c(		}
curCSSLefl 	"eover mcot	}e( t,c"lefl" c(		}
calcul{
ePosi
	}, 	"(hosi
iemm =;
xabsol= i"Xnodne - v1	ns );
	'auto', [curCSSTop, curCSSLefl]) > -1),r Enselerl= {}, curPosi
	}, 	"{}, curTop, curLefls.[i]m, ieed  otb[0able  otcalcul{
e hosi
iemmet eigs[r)/le.orolefl  !Eautm.and hosi
iemmesnabsol= i[i]et = calcul{
ePosi
	}, !anyFoucurPosi
	}, 	" urE(chmhosi
iem(l;gnde	jQucurTop. 	"calcul{
ePosi
	}, ? curPosi
	},.tle. :ehecseIn

)curCSSTop,  10M) f (0atchcurLefl 	"calcul{
ePosi
	}, ? curPosi
	},.lefl :ehecseIn

)curCSSLefl,c10M) f (0at
h	et = eover m	 F		}
	},
"eptlems ( ay( chel(elems"h	e(elems.nt ynte( t,ci, curOffses ls.f ( [i]et =e(elems.tle on dexO t{r Enseler.tle.Se=e(elems.tle - curOffses.tle
r+	curTopSSree		]et =e(elems.lefl on dexO t{r Enseler.lef	.Se=e(elems.lefl - curOffses.lefl
r+	curLefls.f ( Qu
plion t" the sFin eptlems ( ("b el(elems. the .nt ynte( t,c) lerl"SSreeetrue;
				 urE(chmcot	}) lerl"SSree		}
}ar seover mfnmo.te""({ar)osi
iem:en(elem, i( ("b ntent!r Wi[0?r( ("b 	t
			varFn ) f ( [i]et )	(ch 	"r Wi[0?:.[i]m, Geth*" }l*eoffsesP ) {

h)offsesP ) {
 Ser WineffsesP ) {
()(	[i]m, Gethcorry.i effsess
h)offses       Ser Wineffses()(		}) ) {
Offses 	"rroo(rn "raeffsesP ) {
[0?he= 0lem.) ? { mop		0,rlef	io0 v :eeffsesP ) {
neffses()pr
 f arSubtractFe = " "ymar[urs[i]m, io
eio
			 anny(chte: had mar[urioautm.gs[0offsesLefl.and mar[urLefl[i]m, areOgs[0t Morin Safari ctushe h ffses.lefl :o.incorry.ilytb[00
h)offses.tle. -	"hecseFlo{

)eover mcot	e( t,c"mar[urTop")M) f (0atch ffses.lefl -	"hecseFlo{

)eover mcot	e( t,c"mar[urLefl")M) f (0at[i]m, AddeoffsesP ) {
 bot;	rs		}) ) {
Offses.gle. +SehecseFlo{

)eover mcot	effsesP ) {
[0?,e"b{t;	rTleWidth")M) f (0atch) ) {
Offses.lefl +SehecseFlo{

)eover mcot	effsesP ) {
[0?,e"b{t;	rLeflWidth")M) f (0at[i]m, SubtractFt)oFrwo effsess
h)t
			va{gth gle:  offses.tle. - ) ) {
Offses.gle,
etulefl:h ffses.lefl - ) ) {
Offses.lefl[i]}Eln},

teffsesP ) {
:en(elem, i( ("b ery		va/ Wi map(gth;
		},.pop()aet )offsesP ) {
 Ser WineffsesP ) {
,MLrspecial[ bod atch)whireX( effsesP ) {
,nod(!rroo(rn "raeffsesP ) {
he= 0lem.) nodne - v1cot	offsesP ) {
,M")osi
iem )m =;
x  c,ic") n urn faeffsesP ) {
 SeoffsesP ) {
hoffsesP ) {
s.	izz
b 	t
			vaoffsesP ) {
s.	i}c;rnrL	var 
 arC" }, 	sheollLefl,and sheollTle.method)
eover moach( ["Lefl"jQ"Top"],On(elem, i"i,ceOm.,ay( cet )method Se"sheollm );lh[1urgteover mfn[dmethod e<h	n(elem, ilst) ("b et )	(ch 	"r Wi[0?: wiv (ch
i]k par!	(ch ( ("b 	t
			varFn ) f ( [i]et = ett,!=;
					if ( !anyFou arhSthtar/sheollaoffses"b 	t
			va/ Wi oach(gth;
		},.pop()a
w
	 	"getW< low(t/ WiseElshi |et = w
	 !anyFoundw
	.sheollTl(yFound	!i ? lstS		eover (w
	)hsheollLefl(),
h = 00 i ? lstS		eover (w
	)hsheollTop(o
h = 0)SSurn= = true;
						r Wi[dmethod e<h	va ) f n ls	izz"SSreeetrue;
				w
	 	"getW< low(te( t )s.yFou arRC			var fusheollaoffses"b 	t
			vaw
	 ? ("pageXOffsessFin w
	) ? w
	[ i ? "pageYOffsesso: "pageXOffsessF]	:otQurne - v1tupport.boxMse O=nodw
	.special[ e );
			h = " "[dmethod e<9 lemen	w
	.special[ bod [dmethod e<:otQurestC[ method eSSree		};L	var freplace(		tW< low(te( t );
		t
			vaeover misW< low(te( t );?rn e( t :rn e( t fr parent				9h?rn fe( t erent: View 9  |( t.) ) {
W< low<:otQu isPaSS}t[t[S arC" }, 	innerHeight(FinnerWidth,	outerHeight,and outerWidthMmethod)
eover moach([ "Height"xtdWidth" ],On(elem, i"i,ceOm.,ay(  cet )/
			teeOm..glLower,
	sa)s.yFf ti{nerHeight,and innerWidthgteover mfn["innerm );lh[1e<h	n(elem, i( ("b ery		va/ Wi[0?r?rn fhecseFlo{

)eover mcot	}/ Wi[0?: t
		s["padd
		"vchn :otQurFn ) f}s.yFf touterHeight,and outerWidthgteover mfn["outerm );lh[1e<h	n(elem, i mar[urr( ("b t
			var Wi[0?r?rn fhecseFlo{

)eover mcot	}/ Wi[0?: t
		s[mar[urr?c"mar[urso: "b{t;	r"vchn :otQurFn ) f}s.yFeover mfn[dt
			] h	n(elem, i"u )  n urn m, Gethw< low,widthM &&(eight"b et )	(ch 	"r Wi[0?;
i]k par!	(ch ( ("b 	t
			vau )  ==\dexO=addexO=	tr Wi;S: ( Qu
plion teover m	 F		}
	},
"e )  n ay( cheery		va/ Wi oach(gth;
		}, ir( ("b  ;e ( uerf emeover ("/ Wi
match){uerf[dt
			]
"e )  nt ynt/ Wi,ci, uerf[dt
			]
) ) a;shiex"SS:
		[i]t
			vaeover misW< low(te( t );?rn sf tEver o en	(sy use special[ e );
			h = " "lorrspecial[ bod tdbl		dhe h n.Quirks vsrS cndards mse [i]fe( t e );
			 co n{
Mse m =;
xCSS1Co n{
" em |urn.special[ e );
			h = " "[d"cli" "m );lh[1 e<9 leme|urn.special[ bod [d"cli" "m );lh[1 e<:.yFou arGethd );
			rwidthM &&(eight"b 	(e( t fr parent				9) ? f tis.&& ahd );
			tch){f tEigs[r)sheoll[Width/Height] ;r;dffses[Width/Height],ewhiatev 0 is.g" }, 
ou 0	Mr,h.max(lemen	|urn.special[h = " "["cli" "m );lh[1],lemen	|urn.bod ["sheollm );lh[1], |urn.special[h = " "["sheollm );lh[1],lemen	|urn.bod ["offsessF);lh[1], |urn.special[h = " "["offsessF);lh[1]lemen)<:.yFouu arGeth &&s &rwidthM &&(eight  n.: fuy(chte:
	u){u )  ==;
					if ( ?rn fa	m, Gethw<dthM &&(eight  n.: fuy(chte:
	u){fhecseFlo{

)eover mcot	}e( t; }
			a )<:.yFouuu arhSthtar/w<dthM &&(eight  n.: fuy(chte: (arent: S ot)ix	(smet lst;
	is unit{}ss)						r Wimcot	}/
		s[= Sizzle )  ==;
xt),
		so?le )  :le )  +
xpx" nn 	}et
evar 
})(w< lowvar