foo = {};
foo.bar = {};

foo.bar.plus = function(x, y) {
	return x + y;
};

module.exports = foo.bar;