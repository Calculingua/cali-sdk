// # RemoteMethodFactory.js
// 
// Author : [William Burke](mailto:wburke@calculingua.com)  
// Date : 12/2/2013  

(function() {

	function RemoteMethodFactory(){
		var self = this;
		this.async = null;
		var cbId = 0;
		var cbList = {};
		
		this.listener = function(args){
			var cbId = args[0];
			var out = args[1];
			if(typeof cbList[cbId] == "function"){
				cbList[cbId].apply(this, out);
				delete cbList[cbId];
			}
		};
		
		var proxySend = function(name, func){
			
			return function(){
				var args = [];
				var callbackId = null;
				for (var i = 0; i < arguments.length; i++) {
					args.push(arguments[i]);
				}
				if(typeof args[args.length - 1] == "function"){
					var cb = args.pop();
					callbackId = "callback-" + cbId;
					cbId++;
					cbList[callbackId] = cb;
				}
				self.async.send("remote", callbackId, name, func, args);
			};
		};
		
		this.create = function(name, methodList){
			var obj = {};
			for(var k in methodList){
				obj[methodList[k]] = proxySend(name, methodList[k]);
			}
			return obj;
		};
		
		this.bind = function(async){
			this.async = async;
			this.async.on("callback", this.listener);
		};
	}
	
	// create the namspace
	if (typeof cali == "undefined") {
		cali = {};
	}
	if (typeof cali.sdk == "undefined") {
		cali.sdk = {};
	}
	if(typeof cali.sdk.remoteMethod == "undefined"){
		cali.sdk.remoteMethod = {};
	}
	cali.sdk.remoteMethod.Factory = RemoteMethodFactory;
	
})();
