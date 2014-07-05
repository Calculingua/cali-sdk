var Runner = cali.remoteMethod.Runner;


describe("RemoteMethodRunner", function() {

	var async = null;
	var runner = null;
	var objs = null;
	
	beforeEach(function() {
		async = new AsyncMock();
		sinon.spy(async, "send");

		objs = {
			model: {
				data: {
					getIt: function() {},
					setIt: function() {}
				}
			},
			view: {},
			controller: {}
		};
	});
	
	afterEach(function(){
		async.send.restore();
	});

	it("should be a function named `Runner` in the `cali.remoteMethod` namespace", function() {
		expect(typeof cali.remoteMethod.Runner).toEqual("function");
	});

	describe("new Runner(objs)", function() {

		it("should be created with the `new` operator", function() {
			expect(new Runner(objs)).toBeTruthy();
		});

		it("should contain `listener` method", function() {
			expect((new Runner(objs)).listener).toBeTruthy();
		})
	});

	describe("#bind(async)", function() {

		beforeEach(function() {
			runner = new Runner(objs);
		});

		it("should exist", function() {
			expect(runner.bind).toBeTruthy();
		})

		it("should bind `listener` to `async` `remote` event", function() {
			var spy = sinon.spy(async, "on");
			expect(spy.callCount).toEqual(0);
			runner.bind(async);
			expect(spy.callCount).toEqual(1);
			expect(spy.getCall(0).args[0]).toEqual("remote");
			expect(spy.getCall(0).args[1]).toEqual(runner.listener);
		});
	});

	describe("#listener(args)", function() {
		beforeEach(function() {
			runner = new Runner(objs);
			runner.bind(async);
		});

		describe("when called with an array of arguments", function() {

			describe("that looks like the following: [null, 'obj.name', 'func', [param0, param1, ...]]", function() {

				var spy = null;
				beforeEach(function() {
					spy = sinon.spy(objs.model.data, "setIt");
					runner.listener([null, "model.data", "setIt", [4]]);
				});

				afterEach(function() {
					objs.model.data.setIt.restore();
				});

				it("should execute function `objs.obj.name.func", function() {
					expect(spy.callCount).toEqual(1);
				});

				it("should call the fucntion with arguments", function() {
					expect(spy.getCall(0).args[0]).toEqual(4);
				});

				it("the call should not contain a callback", function() {
					expect(spy.getCall(0).args.length).toEqual(1);
				});
			});

			describe("that includes a callbackId : [callbackId, 'obj.name', 'func', [param0, param1, ...]]", function() {

				var mock = null;
				beforeEach(function() {
					mock = sinon.stub(objs.model.data, "setIt", function(val, cb){
						if (cb)
							cb(null, "butts");
					});
					runner.listener(["butts-123", "model.data", "setIt", [4]]);
				});

				afterEach(function() {
					objs.model.data.setIt.restore();
				});

				it("should execute function `objs.obj.name.func", function() {
					expect(mock.callCount).toEqual(1);
				});

				it("should call the fucntion with arguments", function() {
					expect(mock.getCall(0).args[0]).toEqual(4);
				});

				it("should include a callback function", function() {
					expect(mock.getCall(0).args.length).toEqual(2);
					expect(typeof mock.getCall(0).args[1]).toEqual("function");
				});
				
				it("should execute `async.send('callback', callbackId, args)` after completion of the function", function(){
					expect(async.send.callCount).toEqual(1);
					expect(async.send.getCall(0).args[0]).toEqual("callback");
					expect(async.send.getCall(0).args[1]).toEqual("butts-123");
					expect(async.send.getCall(0).args[2]).toEqual([null, "butts"]);
				});				
			});
		});
	});
});
