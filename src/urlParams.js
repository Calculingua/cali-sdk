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
