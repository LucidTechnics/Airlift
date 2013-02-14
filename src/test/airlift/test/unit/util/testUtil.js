var util = require('airlift/util');

exports['test type of function'] = function(_assert)
{
	_assert.eq("object", util.typeOf({}), 'typeof cannot detect JavaScript object');
	_assert.eq("object", util.typeOf(new java.lang.Object()), 'typeof cannot detect Java object');
	_assert.eq("function", util.typeOf(function() {}), 'typeof cannot detect JavaScript function');
	_assert.eq("array", util.typeOf([]), 'typeof cannot detect JavaScript array');
	_assert.eq("number", util.typeOf(1), 'typeof cannot detect JavaScript number');
	_assert.eq("string", util.typeOf('1'), 'typeof cannot detect JavaScript string');
};

exports['test is empty function'] = function(_assert)
{
	_assert.eq(true, util.isEmpty({}), 'isEmpty cannot detect an empty object');
	_assert.eq(false, util.isEmpty({name: 'Bediako'}), 'isEmpty cannot detect a non empty object');
};

exports['test create class'] = function(_assert)
{
	_assert.eq(new Packages.java.lang.String().getClass(), util.createClass('java.lang.String'), 'createClass does not create the right class');
	_assert.eq(new Packages.java.util.Date().getClass(), util.createClass('java.util.Date'), 'createClass does not create the right class');
	_assert.eq(new Packages.airlift.util.JavaScriptingUtil().getClass(), util.createClass('airlift.util.JavaScriptingUtil'), 'createClass does not create the right class');
}

exports['test create error object'] = function(_assert)
{
	_assert.deepEqual({message: 'message 1', name: 'error', category: 'test'}, util.createError('error', 'message 1', 'test'), 'createError does not create the error object correctly');
}

exports['test is white space'] = function(_assert)
{
	_assert.eq(true, util.isWhitespace('    \t\n'), 'is white space does not detect white space properly');
	_assert.eq(false, util.isWhitespace('    \t\nxyz  \t'), 'is white space does not detect non white space properly');
};

exports['test hasValue exists and isDefined doesn\'t'] = function(_assert)
{
	_assert.eq(true, !!util.hasValue, 'hasValue function does not exist on util');
	_assert.eq(false, !!util.isDefined, 'isDefined function does exist on util. It should not and you should use hasValue instead.');
};

exports['test report error'] = function(_assert)
{
	var errors = {};
	var error1 = {message: 'message 1', name: 'error', category: 'test'};
	var error2 = {message: 'message 2', name: 'error', category: 'test'};
	var error3 = {message: 'message 3', name: 'error', category: 'test'};

	util.reportError(errors, 'hello', error1);
	util.reportError(errors, 'hello', error2);
	util.reportError(errors, 'goodbye', error3);
	
	_assert.deepEqual({hello:[error1, error2], goodbye: [error3]}, errors, 'report error is not reporting errors correctly' );
};

exports['test multi-try NEEDS TO BE CREATED ONCE MOCKUPS WORKS'] = function(_assert)
{
	_assert.eq(true, true);
};

exports['test create date'] = function(_assert)
{
	var date = new Packages.java.util.Date();
	var javaScriptDate = new Date();
	
	_assert.eq(date, util.createDate(date.getTime()), 'create date does not create the right date');
	_assert.eq(javaScriptDate.getTime(), util.createDate(javaScriptDate.getTime()).getTime(), 'createDate will create right java.util.Date from milliseconds from a JavaScript date');
	_assert.eq(util.createClass('java.util.Date'), util.createDate().getClass(), 'create date initializes to a java.util.Date');
};

exports['test create calendar NEEDS TO BE CREATED ONCE MOCKUPS WORKS'] = function(_assert)
{
	_assert.eq(true, true);
	
	/*
	var date = new Packages.java.util.Date();
	var javaScriptDate = new Date();

	_assert.eq(date, util.createCalendar({date: date}).getTime(), 'create calendar did not create the right calendar object');
	*/
};

exports['test guid creation'] = function(_assert)
{
	_assert.eq(util.createClass('java.lang.String'), util.guid(12).getClass(), 'guid not creating guids of class java.lang.String');
	_assert.eq(12, util.guid(12).length(), 'guid not creating guids of the right length');
	_assert.eq(1, util.guid(1).length(), 'guid not creating guids of the right length');
	_assert.eq(32, util.guid(32).length(), 'guid not creating guids of the right length');
	_assert.eq(10, util.guid(10).length(), 'guid not creating guids of the right length');
	
	var guids = {};

	//simple sanity check ... by no means is this exhaustive ...
	//perhaps this should be placed in another performance related set
	//of tests?
	for (var i = 0; i < 100000; i++)
	{
		var guid = util.guid(32);

		if (guids[guid])
		{
			_assert.ok(false, 'guid collision occurred in set of 1000000 for a guid of length 32 characters!');
		}
		else
		{
			guids[guid] = 1;
		}
	}
};

exports['test string trim'] = function(_assert)
{
	_assert.eq("Bediako", util.trim(" Bediako "), 'util trim function is not working correctly');
};