/*! Copyright (C) Calculingua - All Rights Reserved 
  Unauthorized copying of this file, via any medium is strictly prohibited 
  Proprietary and confidential 
 
  Author : [William Burke](mailto:wburke@calculingua.com)  
  Date : 2014-07-03 */ 

// # Emitter.js
// An emitter class for even emitting.  This is modeled after the node.js EventEmitter.  
//  
// Author : [William Burke](mailto:wburke@calculingua.com)
// Date : 11/25/2012

(function() {

	// ## Emitter
	// The Emitter class. Can be overloaded or used directly.
	function Emitter() {
		this.listeners = {};
		this.singleListener = {};
	}

	// ### emit()
	// Method for emitting events. The first argument should be an event type.
	// Subsequent argument should be the data emitting. Any number of data items
	// can be emitted.
	// On emitting, it will call each `listener` and `once listener`. It will
	// remove the `once listeners` called.
	Emitter.prototype.emit = function() {
		var args = Array.prototype.slice.call(arguments);
		var event = args.shift();
		// initialize the local iterators
		var localMulti = [];
		var localSingle = [];
		// Copy the class variables to isolate it from any additions or
		// subtractions. Copying to retaining the references to the functions.
		if (this.listeners[event]) {
			localMulti = this.listeners[event].slice(0);
		}
		if (this.singleListener[event]) {
			localSingle = this.singleListener[event].slice(0);

		}

		// iterate through the local variables
		for ( var i = 0; i < localMulti.length; i++) {
			try {
				localMulti[i].apply(null, args);
			} catch (ex) {
				console.error("EXCEPTION with Emitter.emit() on a `listener` callback : " + ex.toString());
			}

		}
		for ( var i = 0; i < localSingle.length; i++) {
			try {
				localSingle[i].apply(null, args);
			} catch (ex) {
				console.error("EXCEPTION with Emitter.emit() on a `once` callback : " + ex.toString());
			}

			// delete the oncees it from the original
			var k = this.singleListener[event].indexOf(localSingle[i]);
			this.singleListener[event].splice(k, 1);
		}
	};

	// ### addListener()
	// Add a listener to the emitter. The first arguemnt is the event type and
	// the second is the callback.
	Emitter.prototype.addListener = function(event, callback) {
		if (this.listeners[event] == null) {
			this.listeners[event] = [];
		}
		this.listeners[event].push(callback);
	};

	// ### on()
	// Identical to `addListener`.
	Emitter.prototype.on = function(event, callback) {
		this.addListener(event, callback);
	};

	// ### once()
	// Addes a listener that will be removed after calling. It only get called
	// once.
	Emitter.prototype.once = function(event, callback) {
		if (this.singleListener[event] == null) {
			this.singleListener[event] = [];
		}
		this.singleListener[event].push(callback);
	};

	// ### removeListener()
	// Removes a `listener` or a `once listener`.
	Emitter.prototype.removeListener = function(event, callback) {
		// remove the repeated listeners
		if (this.listeners[event]) {
			var i = this.listeners[event].indexOf(callback);
			if (i >= 0) {
				this.listeners[event].splice(i, 1);
			}
		}
		// remove the single listeners
		if (this.singleListener[event]) {
			var i = this.singleListener[event].indexOf(callback);
			if (i >= 0) {
				this.singleListener[event].splice(i, 1);
			}
		}
	};

	Emitter.prototype.removeAllListeners = function(args) {
		if (arguments.length > 0) {
			for ( var i = 0; i < arguments.length; i++) {
				delete this.listeners[arguments[i]];
				delete this.singleListener[arguments[i]];
			}
		} else {
			for ( var event in this.listeners) {
				delete this.listeners[event];
			}

			for ( var event in this.singleListener) {
				delete this.singleListener[event];
			}

		}
	};

	// create the namspace
	if (typeof cali == "undefined") {
		cali = {};
	}
	if (typeof cali.sdk == "undefined") {
		cali.sdk = {};
	}
	cali.sdk.Emitter = Emitter;
})();
// # Extend
// Adapted from several sources:
// 
// * [Classical Inheritence in Javascript](http://javascript.crockford.com/inheritance.html) by Douglas Crockford
// * [Object Oriented Programming in Javascript](http://mckoss.com/jscript/object.htm) by Mike Koss
// 
// Author : [William Burke](mailto:wburke@calculingua.com)  
// Date : 11/26/2012  

// ## extend()
// Adds an extend() funciton onto the Function.prototype object.  
// This function implements classical inheritence.  

// This adds the Object.create method in browsers that do not have it.  
if (!Object.create) {
	Object.create = function(o) {
		if (arguments.length > 1) {
			throw new Error('Object.create implementation only accepts the first parameter.');
		}
		function F() {
		}
		F.prototype = o;
		return new F();
	};
}

// Wrap our endend functionality in a closuer to keep it safe
(function() {
	function extend(parent) {
		this.prototype = Object.create(parent.prototype);
		this.prototype.constructor = parent;

		var d = 0, p = this.prototype;

		this.prototype.uber = function(args) {
			var f = d;
			var t = d;
			var v = parent.prototype;
			if (t) {
				while (t) {
					v = v.constructor.prototype;
					t -= 1;
				}
				f = v.constructor;
			} else {
				f = p.constructor;
			}
			d += 1;
			f.apply(v, arguments);
			// hoist the base properties from v into this
			for ( var prop in v) {
				if (typeof v[prop] != "function") {
					this[prop] = v[prop];
				}
			}
			d -= 1;
			return this;
		};

		return this;
	}

	// create the namspace
	if (typeof cali == "undefined") {
		cali = {};
	}
	if (typeof cali.sdk == "undefined") {
		cali.sdk = {};
	}
	cali.sdk.extend = extend;

})();

// Extend the Function.prototype object to have the `extend` method
if (Object.defineProperty) {
	Object.defineProperty(Function.prototype, "extend", {
		value : cali.sdk.extend,
		enumerable : false
	});
} else {
	Function.prototype.extend = cali.sdk.extend;
}

// # require.js
//  
// Author : [William Burke](mailto:wburke@calculingua.com)
// Date : 2/15/2013

(function() {

	function require(src, callback) {
		module = {};
		$.getScript(src).done(function(script, status) {
			callback(null, module.exports);
		}).fail(function(jqxhr, settings, err) {
			callback(jqxhr.statusText);
		});
	}

	// create the namspace
	if (typeof cali == "undefined") {
		cali = {};
	}
	if (typeof cali.sdk == "undefined") {
		cali.sdk = {};
	}
	cali.sdk.require = require;
})();
(function() {

	var getParams = function() {
		var urlParams = {};
		var match, pl = /\+/g, // Regex for replacing addition symbol with a
		// space
		search = /([^&=]+)=?([^&]*)/g, decode = function(s) {
			return decodeURIComponent(s.replace(pl, " "));
		}, query = window.location.search.substring(1);

		while (match = search.exec(query))
			urlParams[decode(match[1])] = decode(match[2]);

		return urlParams;
	};

	// create the namspace
	if (typeof cali == "undefined") {
		cali = {};
	}
	// attach the module to the proper place
	cali.getParams = getParams;

})();
