var Factory = cali.remoteMethod.Factory;

describe("RemoteMethodFactory", function() {

	var async = null;
	var factory = null;

	beforeEach(function() {
		async = new AsyncMock();
	})

	it("should be an object in the namespace `cali.remoteMethod`", function() {
		expect(cali.remoteMethod.Factory).toBeTruthy();
	});

	describe("new Factory()", function() {

		it("should be created with the `new` operator", function() {
			expect(new Factory()).toBeTruthy();
		});

		it("should contain `listener` method", function() {
			expect((new Factory()).listener).toBeTruthy();
		})
	});

	describe("#bind(async)", function() {

		beforeEach(function() {
			factory = new Factory(async);
		});

		it("should exist", function() {
			expect(factory.bind).toBeTruthy();
		})

		it("should bind `listener` to `async` `callback` event", function() {
			var spy = sinon.spy(async, "on");
			expect(spy.callCount).toEqual(0);
			factory.bind(async);
			expect(spy.callCount).toEqual(1);
			expect(spy.getCall(0).args[0]).toEqual("callback");
			expect(spy.getCall(0).args[1]).toEqual(factory.listener);
		});
	})

	describe("#create(name, methodList)", function() {
		beforeEach(function() {
			factory = new Factory(async);
			factory.bind(async);
		});

		it("should exist", function() {
			expect(factory.create).toBeTruthy();
		});

		it("should return object with specified methods", function() {
			var model = factory.create("model", ["getIt", "setIt"]);

			expect(model.getIt).toBeTruthy();
			expect(model.setIt).toBeTruthy();
		});

		describe("when using the return object to execute a function", function() {
			var model = {};
			beforeEach(function() {
				model.data = factory.create("model.data", ["getIt", "setIt"]);
			});

			describe("without a callback specified", function() {
				it("should call `async.send('remote', null, 'obj', 'func', args)`", function() {
					sinon.spy(async, "send");
					model.data.setIt(4);
					expect(async.send.callCount).toEqual(1);
					expect(async.send.getCall(0).args[0]).toEqual("remote");
					expect(async.send.getCall(0).args[1]).toEqual(null);
					expect(async.send.getCall(0).args[2]).toEqual("model.data");
					expect(async.send.getCall(0).args[3]).toEqual("setIt");
					expect(async.send.getCall(0).args[4]).toEqual([4]);
				});
			});

			describe("with a callback specified", function() {
				it("should call `async.send('remote', callbackId, 'obj', 'func', args)", function() {
					sinon.spy(async, "send");
					model.data.setIt(4, function() {});
					expect(async.send.callCount).toEqual(1);
					expect(async.send.getCall(0).args[0]).toEqual("remote");
					expect(async.send.getCall(0).args[1]).toBeTruthy();
					expect(async.send.getCall(0).args[2]).toEqual("model.data");
					expect(async.send.getCall(0).args[3]).toEqual("setIt");
					expect(async.send.getCall(0).args[4]).toEqual([4]);
				});

				it("should update the callbackId with each method call", function() {
					sinon.spy(async, "send");

					model.data.setIt(4, function() {});
					model.data.setIt(5, function() {});
					model.data.getIt(function() {});

					expect(async.send.callCount).toEqual(3);
					expect(async.send.getCall(0).args[1]).toBeTruthy();
					expect(async.send.getCall(1).args[1]).toBeTruthy();
					expect(async.send.getCall(2).args[1]).toBeTruthy();
					expect(async.send.getCall(0).args[1] !== async.send.getCall(1).args[1] && async.send.getCall(1).args[1] !== async.send.getCall(2).args[1] && async.send.getCall(0).args[1] !== async.send.getCall(2).args[1]).toBeTruthy();
					expect(async.send.getCall(0).args[4]).toEqual([4]);
					expect(async.send.getCall(1).args[4]).toEqual([5]);
					expect(async.send.getCall(2).args[4]).toEqual([]);
				})
			});
		});
	});

	describe("#listener(args)", function() {
		beforeEach(function() {
			factory = new Factory(async);
			factory.bind(async);
		});

		it("should exist", function() {
			expect(factory.listener).toBeTruthy();
		});

		describe("uses first args as callbackId and applies function with remaining args", function() {
			var model = {};
			beforeEach(function() {
				model.data = factory.create("model.data", ["getIt", "setIt"]);
				sinon.spy(async, "send");
			});

			describe("with 1 function previously called", function() {
				var spy = null;
				var cbId = null;
				beforeEach(function() {
					spy = sinon.spy();
					model.data.setIt(4, spy);
					cbId = async.send.getCall(0).args[1];
				});

				it("should call the callback", function() {
					factory.listener([cbId, [null, 88]]);
					expect(spy.callCount).toEqual(1);
					expect(spy.getCall(0).args[0]).toEqual(null);
					expect(spy.getCall(0).args[1]).toEqual(88);
				})
			});

			describe("with multiple calles to the same function", function() {
				var spies = [];
				var cbIds = [];
				beforeEach(function() {
					for (var i = 0; i < 3; i++) {
						var spy = sinon.spy();
						model.data.setIt(4, spy);
						spies.push(spy);
						cbIds.push(async.send.getCall(i).args[1])
					}
				});

				it("should call the callbacks when done in order", function() {

					for (var i = 0; i < 3; i++) {
						factory.listener([cbIds[i], [null, i]]);
						expect(spies[i].callCount).toEqual(1);
						expect(spies[i].getCall(0).args[0]).toEqual(null);
						expect(spies[i].getCall(0).args[1]).toEqual(i);
					}
				});

				it("should call the callbacks when done out of order", function() {

					var call = [2, 0, 1];
					for (var k in call) {
						var i = call[k];
						factory.listener([cbIds[i], [null, i]]);
						expect(spies[i].callCount).toEqual(1);
						expect(spies[i].getCall(0).args[0]).toEqual(null);
						expect(spies[i].getCall(0).args[1]).toEqual(i);
					}
				});
			});
		})

	});
});
