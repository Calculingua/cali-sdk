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