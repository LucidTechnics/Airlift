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

exports['test create error reporter'] = function(_assert)
{
	var errorReporter = util.createErrorReporter();
	
	errorReporter.report('hello', 'message1', 'test');
	errorReporter.report('hello', 'message2', 'test');
	errorReporter.report('goodbye', 'message3', 'test');
	
	_assert.deepEqual({hello:[{name: 'hello', message: 'message1', category: 'test'},
							  {name: 'hello', message: 'message2', category: 'test'}],
					  goodbye: [{name: 'goodbye', message: 'message3', category: 'test'}]},
					  errorReporter.allErrors(), 'report error is not reporting errors correctly' );
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

exports['test primitive'] = function(_assert)
{
	var list = new Packages.java.util.ArrayList();
	var set = new Packages.java.util.HashSet();
	var integer = new Packages.java.lang.Integer(1);
	var long = new Packages.java.lang.Long(1);
	var double = new Packages.java.lang.Double(1);
	var float = new Packages.java.lang.Float(1);
	var short = new Packages.java.lang.Short(1);
	var character = new Packages.java.lang.Character(Packages.java.lang.Character.MAX_VALUE);
	var boolean = new Packages.java.lang.Boolean(true);
	var string = new Packages.java.lang.String('hello');
	var byte = new Packages.java.lang.Byte(Packages.java.lang.Byte.MAX_VALUE);
	var jsString = new String('hello');
	var jsNumber = 1;

	_assert.eq(util.primitive(list), list, 'list has changed');
	_assert.eq(util.primitive(set), set, 'set has changed');
	_assert.eq(util.primitive(string), string, 'string has changed');
	_assert.eq(util.primitive(jsString), jsString, 'jsString has changed');
	_assert.eq(util.primitive(jsNumber), jsNumber, 'jsNumber has changed');

	_assert.eq(util.primitive(integer), 1, 'integer is incorrect');
	_assert.eq(util.primitive(long), 1, 'long is incorrect');
	_assert.eq(util.primitive(double), 1, 'double is incorrect');
	_assert.eq(util.primitive(float), 1, 'float is incorrect');
	_assert.eq(util.primitive(short), 1, 'short is incorrect');
	_assert.eq(util.primitive(character), Packages.java.lang.Character.MAX_VALUE, 'character is incorrect');
	_assert.eq(util.primitive(boolean), true, 'boolean is incorrect');
	_assert.eq(util.primitive(byte), Packages.java.lang.Byte.MAX_VALUE, 'byte is incorrect');
	
	_assert.eq(!!util.primitive(integer).intValue, false, 'integer is not a primitive');
	_assert.eq(!!util.primitive(long).longValue, false, 'long is not a primitive');
	_assert.eq(!!util.primitive(double).doubleValue, false, 'double is not a primitive');
	_assert.eq(!!util.primitive(float).floatValue, false, 'float is not a primitive');
	_assert.eq(!!util.primitive(short).shortValue, false, 'short is not a primitive');
	_assert.eq(!!util.primitive(character).charValue, false, 'character is not a primitive');
	_assert.eq(!!util.primitive(boolean).booleanValue, false, 'boolean is not a primitive');
	_assert.eq(!!util.primitive(byte).byteValue, false, 'boolean is not a primitive');
};