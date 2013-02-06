exports.setUp = function(_context)
{
	Packages.java.lang.System.out.println("Hello");
};

exports.tearDown = function(_context)
{
	Packages.java.lang.System.out.println("Goodbye");
};