// # Emitter.spec.js
// 
// Author : [William Burke](mailto:wburke@calculingua.com)
// Date : 11/25/2012

describe("A class that emitts events", function() {

	it("should allow for instanteation", function() {

		var emitter = new cali.sdk.Emitter();
		expect(emitter).toBeTruthy();
	});

	describe("that is instanteated", function() {

		emitter = null;
		beforeEach(function() {
			emitter = new cali.sdk.Emitter();
		});

		afterEach(function() {
			delete emitter;
			emitter = null;
		});

		it("should have an `emit` method", function() {
			expect(emitter.emit).toBeTruthy();
		});

		it("should have an `addListener` method", function() {
			expect(emitter.addListener).toBeTruthy();
		});

		it("should have an `on` method", function() {
			expect(emitter.on).toBeTruthy();
		});

		it("should have a `removeListener` method", function() {
			expect(emitter.removeListener).toBeTruthy();
		});

		it("should have an `once` method", function() {
			expect(emitter.once).toBeTruthy();
		});

		describe("and has a listener added with `addListener`", function() {
			emitter = null;
			var flag = null;
			var args = null;
			function callback() {
				flag = true;
				args = arguments;
			}
			beforeEach(function() {
				flag = null;
				args = null;
				emitter = new cali.sdk.Emitter();
				emitter.addListener("event", callback);
			});

			afterEach(function() {
				delete emitter;
				emitter = null;
			});

			it("should call callback when `event` is emitted", function() {
				runs(function() {
					emitter.emit("event", {});
				});

				waitsFor(function() {
					return flag;
				}, "flag to be set", 1000);

				runs(function() {
					expect(flag).toBeTruthy();
				});
			});

			it("should call callback with 1 data value on emission", function() {
				var data0 = "bugg";
				runs(function() {
					emitter.emit("event", data0);
				});

				waitsFor(function() {
					return flag;
				}, "flag to be set", 1000);

				runs(function() {
					expect(args[0]).toEqual(data0);
				});
			});

			it("should call callback with 2 data values on emission", function() {
				var data0 = "bugg";
				var data1 = "bull";
				runs(function() {
					emitter.emit("event", data0, data1);
				});

				waitsFor(function() {
					return flag;
				}, "flag to be set", 1000);

				runs(function() {
					expect(args[0]).toEqual(data0);
					expect(args[1]).toEqual(data1);
				});
			});

			it("should call callback with 3 or more data values on emission", function() {
				var data0 = "bugg";
				var data1 = "bull";
				var data2 = "buss";
				runs(function() {
					emitter.emit("event", data0, data1, data2);
				});

				waitsFor(function() {
					return flag;
				}, "flag to be set", 1000);

				runs(function() {
					expect(args[2]).toEqual(data2);
				});
			});

			it("should allow removing the listener, and not receiving a callback", function() {
				var data0 = "bugg";
				var flag2 = false;
				runs(function() {
					emitter.removeListener("event", callback);
					emitter.emit("event", data0);
				});

				waitsFor(function() {
					setTimeout(function() {
						flag2 = true;
					}, 200);
					return flag2;
				}, "flag to be set", 1000);

				runs(function() {
					expect(args).toBeFalsy();
				});
			});

			it("should allow adding another listener, and receiving callbacks on both", function() {
				var data0 = "bugg";
				var data2 = null;
				var cb2 = function(data) {
					data2 = data;
				};
				runs(function() {
					emitter.addListener("event", cb2);
					emitter.emit("event", data0);
				});

				waitsFor(function() {
					return ((data2 != null) && (args != null));
				}, "each callback to be called", 1000);

				runs(function() {
					expect(data2).toEqual(data0);
					expect(args[0]).toEqual(data0);
				});
			});

			it("should callback every time the event is emitted", function() {
				var data0 = "bugg";
				var data1 = "bugg2";
				var out = [];
				var k = 0;
				var cb2 = function(data) {
					out.push(data);
					k++;
				};
				runs(function() {
					emitter.addListener("event", cb2);
					emitter.emit("event", data0);
					emitter.emit("event", data1);
				});

				waitsFor(function() {
					return (k == 2);
				}, "callback to be called twice", 1000);

				runs(function() {
					expect(k).toEqual(2);
					expect(out).toEqual([ "bugg", "bugg2" ]);
				});
			});

			it("should allow adding listener to other event", function() {
				var data0 = "bugg";
				var data2 = null;
				var cb2 = function(data) {
					data2 = data;
				};
				runs(function() {
					emitter.addListener("event2", cb2);
					emitter.emit("event2", data0);
				});

				waitsFor(function() {
					return (data2 != null);
				}, "second callback being called", 1000);

				runs(function() {
					expect(data2).toEqual(data0);
					expect(args).toBeFalsy();
				});
			});
		});

		describe("that takes a listener added with `once`", function() {
			emitter = null;

			beforeEach(function() {
				emitter = new cali.sdk.Emitter();

			});

			afterEach(function() {
				delete emitter;
				emitter = null;
			});

			it("should callback only once", function() {
				var flag = false;
				var cnt = 0;
				var args = null;
				function callback() {
					cnt++;
					args = arguments;
				}
				runs(function() {
					emitter.once("event", callback);
					emitter.emit("event", "butts");
					emitter.emit("event", "butts2");
					flag = true;
				});

				waitsFor(function() {
					return flag;
				}, "each emission, and a little while", 1000);

				runs(function() {
					expect(cnt).toEqual(1);
				});
			});

			it("should allow removal prior to firing", function() {
				var flag = false;
				var cnt = 0;
				var args = null;
				function callback() {
					cnt++;
					args = arguments;
				}
				runs(function() {
					emitter.once("event", callback);
					emitter.removeListener("event", callback);
					emitter.emit("event", "butts");
					emitter.emit("event", "butts2");
					flag = true;
				});

				waitsFor(function() {
					return flag;
				}, "each emission, and a little while", 1000);

				runs(function() {
					expect(cnt).toEqual(0);
				});
			});
		});

		describe("and is robust to additions during callbacks", function() {
			emitter = null;

			beforeEach(function() {
				emitter = new cali.sdk.Emitter();
			});

			afterEach(function() {
				delete emitter;
				emitter = null;
			});

			it("should allow adding a `once` while in a `once` that won't get called until next time", function() {
				var flag = false;
				var cnt = 0;
				var args = null;
				function callback1() {
					cnt++;
					args = arguments;
				}
				function callback0() {
					cnt++;
					args = arguments;
					emitter.once("event", callback1);
				}
				runs(function() {
					emitter.once("event", callback0);
					emitter.emit("event", "butts");
					emitter.emit("event", "butts2");
					emitter.emit("event", "butts3");
					flag = true;
				});

				waitsFor(function() {
					return flag;
				}, "each emission, and a little while", 1000);

				runs(function() {
					expect(cnt).toEqual(2);
				});
			});

			it("should allow adding a `listener` while in a `listener` that won't get called until next time", function() {
				var flag = false;
				var args1 = [];
				function callback1(input) {
					args1.push(input);
				}
				var args0 = [];
				function callback0(input) {
					// add the listener if this is the first callback
					if (args0.length < 1) {
						emitter.addListener("event", callback1);
					}
					args0.push(input);
				}
				runs(function() {
					emitter.addListener("event", callback0);
					emitter.emit("event", "butts");
					emitter.emit("event", "butts2");
					emitter.emit("event", "butts3");
					flag = true;
				});

				waitsFor(function() {
					return flag;
				}, "each emission, and a little while", 1000);

				runs(function() {
					expect(args0).toEqual([ "butts", "butts2", "butts3" ]);
					expect(args1).toEqual([ "butts2", "butts3" ]);
				});
			});

			it("should allow adding a `listener` while in a `once` that won't get called until next time", function() {
				var flag = false;
				var args1 = [];
				function callback1(input) {
					args1.push(input);
				}
				var args0 = [];
				function callback0(input) {
					emitter.addListener("event", callback1);
					args0.push(input);
				}
				runs(function() {
					emitter.once("event", callback0);
					emitter.emit("event", "butts");
					emitter.emit("event", "butts2");
					emitter.emit("event", "butts3");
					flag = true;
				});

				waitsFor(function() {
					return flag;
				}, "each emission, and a little while", 1000);

				runs(function() {
					expect(args0).toEqual([ "butts" ]);
					expect(args1).toEqual([ "butts2", "butts3" ]);
				});
			});

			it("should allow adding a `once` while in a `listener` that won't get called until next time", function() {
				var flag = false;
				var args1 = [];
				function callback1(input) {
					args1.push(input);
				}
				var args0 = [];
				function callback0(input) {
					// add the listener if this is the first callback
					if (args0.length < 1) {
						emitter.once("event", callback1);
					}
					args0.push(input);
				}
				runs(function() {
					emitter.addListener("event", callback0);
					emitter.emit("event", "butts");
					emitter.emit("event", "butts2");
					emitter.emit("event", "butts3");
					flag = true;
				});

				waitsFor(function() {
					return flag;
				}, "each emission, and a little while", 1000);

				runs(function() {
					expect(args1).toEqual([ "butts2" ]);
					expect(args0).toEqual([ "butts", "butts2", "butts3" ]);
				});
			});
		});

		describe("and is robust to exceptions", function() {
			emitter = null;

			beforeEach(function() {
				emitter = new cali.sdk.Emitter();
			});

			afterEach(function() {
				delete emitter;
				emitter = null;
			});

			it("should continue with exception in `once`", function() {
				var flag = false;
				var args0 = [];
				function callback0(input) {
					args0.push(input);
					throw ("exception for testing purposes");
				}
				var args1 = [];
				function callback1(input) {
					args1.push(input);
				}
				runs(function() {
					emitter.once("event", callback0);
					emitter.once("event", callback1);
					emitter.emit("event", "butts");
					emitter.emit("event", "butts2");
					flag = true;
				});

				waitsFor(function() {
					return flag;
				}, "each emission, and a little while", 1000);

				runs(function() {
					expect(args0).toEqual([ "butts" ]);
					expect(args1).toEqual([ "butts" ]);
				});
			});

			it("should continue with exception in `listener`", function() {
				var flag = false;
				var args0 = [];
				function callback0(input) {
					args0.push(input);
					throw ("exception for testing purposes");
				}
				var args1 = [];
				function callback1(input) {
					args1.push(input);
				}
				runs(function() {
					emitter.addListener("event", callback0);
					emitter.once("event", callback1);
					emitter.emit("event", "butts");
					emitter.emit("event", "butts2");
					flag = true;
				});

				waitsFor(function() {
					return flag;
				}, "each emission, and a little while", 1000);

				runs(function() {
					expect(args0).toEqual([ "butts", "butts2" ]);
					expect(args1).toEqual([ "butts" ]);
				});
			});

		});

		describe("with a `removeAllListeners` method", function() {

			var emitter = null;

			beforeEach(function() {
				emitter = new cali.sdk.Emitter();
			});

			afterEach(function() {
				delete emitter;
				emitter = null;
			});

			it("should have a `removeAllListeners` method", function() {
				expect(emitter.removeAllListeners).toBeTruthy();
			});

			it("should have no listeners after a call", function() {
				emitter.on("test1", function() {

				});
				emitter.on("test2", function() {

				});
				emitter.on("test2", function() {

				});

				emitter.removeAllListeners();

				var listeners = [];
				for ( var i in emitter.listeners) {
					listeners.push(emitter.listeners[i]);
				}

				expect(listeners.length).toEqual(0);
			});

			it("should have no singleListener after a call", function() {
				emitter.once("test1", function() {

				});
				emitter.once("test2", function() {

				});
				emitter.once("test2", function() {

				});

				emitter.removeAllListeners();

				var listeners = [];
				for ( var i in emitter.singleListener) {
					listeners.push(emitter.singleListener[i]);
				}

				expect(listeners.length).toEqual(0);
			});

			it("should clear all listeners from a single event type", function() {
				emitter.once("test1", function() {

				});
				emitter.once("test2", function() {

				});
				emitter.on("test2", function() {

				});

				emitter.removeAllListeners("test2");

				var listeners = [];
				for ( var i in emitter.singleListener) {
					listeners.push(emitter.singleListener[i]);
				}
				for ( var i in emitter.listeners) {
					listeners.push(emitter.listeners[i]);
				}

				expect(listeners.length).toEqual(1);
				expect(emitter.listeners["test2"]).toBeFalsy();
				expect(emitter.singleListener["test2"]).toBeFalsy();
			});

		});
	});
});