// # extend.spec.js
// 
// Author : [William Burke](mailto:wburke@calculingua.com)  
// Date : 11/26/2012  

describe("An `extend` function that creats OO inheritence", function() {
	function Object0() {
		this.name = "Object0";
		this.obj0 = "Object0 obj0";

		this.method1 = function() {
			return "method1";
		};
	}
	Object0.prototype.method0 = function() {
		return this.name;
	};

	it("should be a method on the gloabal `Function` object", function() {

		expect(Function.extend).toBeTruthy();

	});

	it("should not be enumerable", function() {
		var props = [];
		for ( var p in Function) {
			props.push(p);
		}

		expect(props.indexOf("extend")).toEqual(-1);
	});

	describe("the resulting object", function() {

		it("should create a proper prototype chain", function() {
			function Object1() {
				this.name = "Object1";
				this.obj1 = "Object1 obj1";
			}
			Object1.extend(Object0);

			var obj1 = new Object1();
			expect(obj1 instanceof Object1).toBeTruthy();
			expect(obj1 instanceof Object0).toBeTruthy();
			expect(obj1 instanceof Object).toBeTruthy();
		});

		it("should create an `uber` method", function() {
			function Object1() {
				this.uber();
				this.name = "Object1";
				this.obj1 = "Object1 obj1";
			}
			Object1.extend(Object0);

			var obj1 = new Object1();
			expect(obj1 instanceof Object1).toBeTruthy();
			expect(obj1 instanceof Object0).toBeTruthy();
			expect(obj1 instanceof Object).toBeTruthy();
		});

		it("should not have `extend` as enumerable", function() {
			function Object1() {
				this.uber();
				this.name = "Object1";
				this.obj1 = "Object1 obj1";
			}
			Object1.extend(Object0);

			var obj1 = new Object1();

			var props = [];
			for ( var p in obj1) {
				props.push(p);
			}

			expect(props.indexOf("extend")).toEqual(-1);
		});

		it("should have the same methods and properties as the prototype after calling `uber`", function() {
			function Object1() {
				this.uber();
			}
			Object1.extend(Object0);
			var obj1 = new Object1();

			expect(obj1.method0()).toEqual("Object0");
			expect(obj1.name).toEqual("Object0");
			expect(obj1.method1()).toEqual("method1");
		});

		it("should be able to overload properties", function() {
			function Object1() {
				this.uber();
				this.name = "Object1";
			}
			// cali.sdk.extend(Object1, Object0);
			Object1.extend(Object0);
			var obj1 = new Object1();

			expect(obj1.method0()).toEqual("Object1");
			expect(obj1.name).toEqual("Object1");
			expect(obj1.method1()).toEqual("method1");
		});

		it("should be able to create new methods", function() {
			function Object1() {
				this.uber();
				this.name = "Object1";
			}
			Object1.extend(Object0);

			Object1.prototype.method2 = function() {
				return "method2";
			};

			var obj1 = new Object1();

			expect(obj1.method2()).toEqual("method2");
		});

		it("should be able to pass arguments to the `uber` methods", function() {
			function Object1(name) {
				this.name = name;
			}
			Object1.prototype.method1 = function() {
				return this.name;
			};

			function Object2() {
				this.uber("butts");
			}
			Object2.extend(Object1);
			Object2.prototype.method2 = function() {
				return this.name;
			};

			var obj2 = new Object2();

			expect(obj2.name).toEqual("butts");
			expect(obj2.method1()).toEqual("butts");
			expect(obj2.method2()).toEqual("butts");
			expect(obj2 instanceof Object2).toBeTruthy();
			expect(obj2 instanceof Object1).toBeTruthy();
			expect(obj2 instanceof Object).toBeTruthy();
		});

		it("should allow methods created in parent constructor to be available", function() {
			function Object1(name) {
				this.name = name;
				var x = 0;
				this.internalMethod0 = function() {
					x++;
					return x;
				};
			}
			Object1.prototype.method2 = function() {
				return this.name;
			};

			function Object2() {
				this.uber("butts");
			}
			Object2.extend(Object1);

			var obj2 = new Object2();

			expect(obj2.name).toEqual("butts");
			expect(obj2.internalMethod0()).toEqual(1);
		});

		it("should allow methods created in parent constructor to be available for overriding", function() {
			function Object1(name) {
				this.name = name;
				this.x = 0;
				this.internalMethod0 = function() {
					this.x++;
					return this.x;
				};
			}
			Object1.prototype.method2 = function() {
				return this.name;
			};

			function Object2() {
				this.uber("butts");
				this.internalMethod0 = function() {
					this.x += 2;
					return this.x;
				};
			}
			Object2.extend(Object1);

			var obj2 = new Object2();

			expect(obj2.name).toEqual("butts");
			expect(obj2.internalMethod0()).toEqual(2);
			obj2.x = 3;
			expect(obj2.internalMethod0()).toEqual(5);
		});

		it("should allow methods created in parent constructor to be available for overriding by child proto", function() {
			function Object1(name) {
				this.name = name;
				this.x = 0;
				this.internalMethod0 = function() {
					this.x++;
					return this.x;
				};
			}
			Object1.prototype.method2 = function() {
				return this.name;
			};

			function Object2() {
				this.uber("butts");
			}
			Object2.extend(Object1);

			Object2.prototype.internalMethod0 = function() {
				this.x += 2;
				return this.x;
			};

			var obj2 = new Object2();

			expect(obj2.name).toEqual("butts");
			expect(obj2.internalMethod0()).toEqual(2);
			obj2.x = 3;
			expect(obj2.internalMethod0()).toEqual(5);
		});

		it("should allow multiple levels of inheritence", function() {
			function Object1(name) {
				this.name = name;
				this.x = 0;
				this.internalMethod0 = function() {
					this.x++;
					return this.x;
				};
			}
			Object1.extend(Object0);
			Object1.prototype.method2 = function() {
				return this.name;
			};

			function Object2() {
				this.uber("butts");
			}
			Object2.extend(Object1);

			Object2.prototype.internalMethod0 = function() {
				this.x += 2;
				return this.x;
			};

			var obj2 = new Object2();

			expect(obj2.name).toEqual("butts");
			expect(obj2.method1()).toEqual("method1");
			expect(obj2.internalMethod0()).toEqual(2);
			obj2.x = 3;
			expect(obj2.internalMethod0()).toEqual(5);
		});

		it("should allow overriding of multiple levels deep", function() {
			function Object1(name) {
				this.name = name;
				this.x = 0;
				this.internalMethod0 = function() {
					this.x++;
					return this.x;
				};
			}
			Object1.extend(Object0);
			Object1.prototype.method2 = function() {
				return this.name;
			};

			function Object2() {
				this.uber("butts");
			}
			Object2.extend(Object1);
			Object2.prototype.method1 = function() {
				return "method1 from another";
			};

			Object2.prototype.internalMethod0 = function() {
				this.x += 2;
				return this.x;
			};

			var obj2 = new Object2();

			expect(obj2.name).toEqual("butts");
			expect(obj2.method0()).toEqual("butts");
			expect(obj2.method1()).toEqual("method1 from another");
			expect(obj2.internalMethod0()).toEqual(2);
			obj2.x = 3;
			expect(obj2.internalMethod0()).toEqual(5);
		});

		it("should leave the base class unchanged", function() {
			function Object1(name) {
				this.name = name;
				this.x = 0;
				this.internalMethod0 = function() {
					this.x++;
					return this.x;
				};
			}
			Object1.extend(Object0);
			Object1.prototype.method2 = function() {
				return this.name;
			};

			function Object2() {
				this.uber("butts");
			}
			Object2.extend(Object1);
			Object2.prototype.method1 = function() {
				return "method1 from another";
			};

			Object2.prototype.internalMethod0 = function() {
				this.x += 2;
				return this.x;
			};
			Object2.prototype.method0 = function() {
				return "something else entierely";
			};

			var obj2 = new Object2();
			var obj1 = new Object1("butts2");

			expect(obj1.name).toEqual("butts2");
			expect(obj1.method1()).toEqual("method1");
			expect(obj1.method0()).toEqual("butts2");
			expect(obj1.internalMethod0()).toEqual(1);
			expect(obj2.method1()).toEqual("method1 from another");
		});

	});

});