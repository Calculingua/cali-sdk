// # RemoteMethodRunner.js
// 
// Author : [William Burke](mailto:wburke@calculingua.com)  
// Date : 12/2/2013  


(function(){
	
	function RemoteMethodRunner(objs){
		var self = this;
		
		this.listener = function(args){
			var cbId = args[0];
			var objName = args[1];
			var funcName = args[2];
			var arguments = args[3];
			
			var calledObj = objs;
			var objNameToks = objName.split(".");
			for(var k in objNameToks){
				calledObj = calledObj[objNameToks[k]];
			}
			if(cbId != null){
				arguments.push(function(){
					var args = [];
					for(var i = 0; i < arguments.length; i++){
						args.push(arguments[i]);
					}
					self.async.send("callback", cbId, args);
				});
			}
			calledObj[funcName].apply(this, arguments);
		}
		
		this.bind = function(async){
			self.async = async;
			async.on("remote", self.listener);
		}
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
	cali.sdk.remoteMethod.Runner = RemoteMethodRunner;
})();