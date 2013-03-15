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

exports['test multi-try'] = function(_assert)
{
	var list = util.list();
	util.multiTry(function() { list.add('stuff'); }, 5);
	
	_assert.eq(list.size(), 1, 'multi try should succeed once');

	var result = util.multiTry(function() { return 7 }, 5);

	_assert.eq(result, 7, 'test multi try should return value');

	list = util.list();
	util.multiTry(function(_tries) { list.add('stuff'); if (_tries < 5) throw 'error'; }, 5);

	_assert.eq(list.size(), 5, 'multi try should succeed five times');

	list = util.list();
	util.multiTry(function(_tries) { list.add('stuff'); if (_tries < 6) throw 'error'; },
				  5,
				  function(_tries, _exception) { list.add('stuff'); }
				 );

	_assert.eq(list.size(), 6, 'multi try should succeed five times then the complete failure should add a sixth');

	list = util.list();
	_assert.throws(function()
	{
		util.multiTry(function(_tries, _exception) { list.add('stuff'); if (_tries < 6) throw 'error'; }, 5);
	},
	'multi try should throw an exception');
		
	_assert.eq(list.size(), 5, 'multi try should have succeeded five times after throwing an exception');
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

exports["test callback iterator"] = function(_assert)
{
	var list = util.list();
	list.add('fuzzy');
	list.add('insurance');
	list.add('whatchamacallit');

	var copyList = util.list();

	var iterator = list.iterator();
	var callbackIterator = util.callbackIterator(iterator, function(_next) { copyList.add(_next); });

	for (var item in Iterator(callbackIterator)) {} //exercise the iterator
	
	_assert.eq(copyList, list, 'call back iterator not working correctly');
};

exports['test create list'] = function(_assert)
{
	var list = util.list();
	_assert.ok(list instanceof java.util.ArrayList, 'list is not an ArrayList');

	list = util.list(1);

	list.add('element');

	var copy = util.list(list);

	_assert.eq(copy, list, 'list was not copied correctly');
};

exports['test create set'] = function(_assert)
{
	var set = util.set();
	_assert.ok(set instanceof java.util.HashSet, 'set is not a HashSet');

	set = util.set(1);
	
	set.add('element');

	var copy = util.set(set);

	_assert.eq(copy, set, 'set was not copied correctly');
};

exports['test create map'] = function(_assert)
{
	var map = util.map();
	_assert.ok(map instanceof java.util.HashMap, 'map is not a HashMap');

	map = util.map(1);
	map.put('element', 1);

	var copy = util.map(map);

	_assert.eq(copy, map, 'map was not copied correctly');
};

exports['test convert JavaScript string to Java string'] = function(_assert)
{
	var string = new String('Hello');
	var javaString = util.string(string);

	_assert.eq(new Packages.java.lang.String(string), javaString, 'string conversion not correct');
	_assert.eq("java.lang.String", javaString.getClass().getName(), 'string conversion did not produce java.lang.String');
};

exports['test convert JavaScript string to Java boolean'] = function(_assert)
{
	var boolean = new Packages.java.lang.Boolean(true).booleanValue();
	var javaBoolean = util.boolean('true');

	_assert.eq(boolean, javaBoolean, 'boolean conversion not correct');
	_assert.eq(false, util.boolean(undefined), 'boolean undefined conversion not correct');
	_assert.eq(false, util.boolean(null), 'boolean null conversion not correct');
};

exports['test convert JavaScript number to Java int'] = function(_assert)
{
	var number = 5;
	var javaNumber = util['int'](number);

	_assert.eq(new Packages.java.lang.Integer(number).intValue(), javaNumber, 'int conversion not correct');
};

exports['test convert JavaScript number to Java double'] = function(_assert)
{
	var number = 5.2;
	var javaNumber = util['double'](number);

	_assert.eq(new Packages.java.lang.Double(number).doubleValue(), javaNumber, 'double conversion not correct');
};

exports['test convert JavaScript number to Java long'] = function(_assert)
{
	var number = 232423232323232;
	var javaNumber = util['long'](number);

	_assert.eq(new Packages.java.lang.Long(number).longValue(), javaNumber, 'long conversion not correct');
};

exports['test convert JavaScript number to Java short'] = function(_assert)
{
	var number = 2;
	var javaNumber = util['short'](number);

	_assert.eq(new Packages.java.lang.Short(number).shortValue(), javaNumber, 'short conversion not correct');
};

exports['test convert JavaScript number to Java float'] = function(_assert)
{
	var number = 5.2;
	var javaNumber = util['float'](number);

	_assert.eq(new Packages.java.lang.Float(number).floatValue(), javaNumber, 'float conversion not correct');
};

exports['test padding'] = function(_assert)
{
	var string1 = '9';
	var string2 = new Packages.java.lang.String('9');

	_assert.eq('00009', util.leftPad(string1, 5, '0'), 'left pad of JavaScript string with 4 zeroes failed');
	_assert.eq(util.string('00009'), util.leftPad(string2, 5, '0'), 'left pad of Java string with 4 zeroes failed');
	_assert.eq(util.string(util.leftPad(string1, 5, '0')), '' + util.leftPad(string2, 5, '0'), 'left pad JavaScript string and Java string failed');

	_assert.eq('90000', util.rightPad(string1, 5, '0'), 'right pad of JavaScript string with 4 zeroes failed');
	_assert.eq(util.string('90000'), util.rightPad(string2, 5, '0'), 'right pad of Java string with 4 zeroes failed');
	_assert.eq(util.string(util.rightPad(string1, 5, '0')), '' + util.rightPad(string2, 5, '0'), 'right pad JavaScript string and Java string failed');
};

exports['test load resource'] = function(_assert)
{
	var assertResourceString = util.load('airlift/assert.js');

	_assert.eq(assertResourceString.substring(0, 14), "// http://wiki", 'unable to load correct resource');
};

exports['test create StringBuffer'] = function(_assert)
{
	var stringBuffer = util.stringBuffer('Hello');

	_assert.ok((stringBuffer instanceof java.lang.StringBuffer), 'string buffer not created');
	_assert.eq(stringBuffer.toString(), "Hello", 'string buffer and string are not equal');
};