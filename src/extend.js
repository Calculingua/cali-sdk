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
