// # require.spec.js
// 
// Author : [William Burke](mailto:wburke@calculingua.com)
// Date : 2/15/2013

describe("cali.sdk.require(module, callback)", function() {
	describe("asynchronousely loads a javascript file and returns the `modules.exports` variable", function() {

		it("should be at `cali.sdk.require`", function() {
			expect(typeof cali.sdk.require === "function").toBeTruthy();
		});

		describe("callback(err, module)", function() {
			it("should load the script and `callback(null, module.exports)`", function() {
				var err = null;
				var module = null;
				var called = false;
				runs(function() {
					cali.sdk.require("src/sdk/spec/foo.js", function(e, m) {
						err = e;
						module = m;
						called = true;
					});
				});

				waitsFor(function() {
					return called;
				}, "the callback to be called", 1000);

				runs(function() {
					//expect(foo).toBeFalsy();
					expect(err).toBeFalsy();
					expect(typeof module.plus === "function").toBeTruthy();
				});
			});

			it("should fail at loading the script and `callback(err, null)`", function() {
				var err = null;
				var module = null;
				var called = false;
				runs(function() {
					cali.sdk.require("src/sdk/spec/foobar.js", function(e, m) {
						err = e;
						module = m;
						called = true;
					});
				});

				waitsFor(function() {
					return called;
				}, "the callback to be called", 1000);

				runs(function() {
					expect(err).toBeTruthy();
					expect(module).toBeFalsy();
				});
			});
		});

	});
});