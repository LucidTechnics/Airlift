exports.run = function(_name, _test)
{
	Packages.java.util.System.out.println('Executing test module: ' + _name);

	_test.setUp();
	_test.tearDown();

	Packages.java.util.System.out.println('Test module: ' + _name + ' execution is completed');
};