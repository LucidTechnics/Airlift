var javaArray = require('airlift/javaArray');

var testArrayCreation = function(_assert, _createFunction)
{
	var result = _createFunction();
	var a = result.a;
	var initializer = result.initializer;
	var type = result.type;
	var length = result.length;
	
	_assert.ok(a, 'java array not created');
	_assert.ok((a instanceof Packages.java.lang.Object), 'array object not created');
	_assert.ok((a.getClass().isArray() === true), 'array of objects not created');
	_assert.ok((a.length === length), 'array of objects not created with correct length');

	_assert.ok((a[0] instanceof type), 'first object right type');
	_assert.ok((a[1] instanceof type), 'second object right type');
	
	_assert.ok((a[0] === initializer[0]), 'first object not initialized successfully');
	_assert.ok((a[2] === null), 'third entry not initialized successfully');
};

var createFunction = function(_length, _type, _objectInitializer)
{	
	var Type = _type;
	var object1 = _objectInitializer && _objectInitializer()||new Type();
	var object2 = _objectInitializer && _objectInitializer()||new Type();
	var initializer = [object1, object2];
	
	var a = javaArray.createArray(_length, Type, initializer);

	return { a: a, initializer: initializer, type: Type, length: _length };
};

var create = createFunction.partial(3);

exports['test create java array of Object'] = function(_assert)
{
	testArrayCreation(_assert, create.partial(Packages.java.lang.Object));
};

exports['test create java array of String'] = function(_assert)
{
	testArrayCreation(_assert, create.partial(Packages.java.lang.String));
};

exports['test create byte array'] = function(_assert)
{
	testArrayCreation(_assert, create.partial(Packages.java.lang.Byte.TYPE, function() { return Packages.java.lang.Byte.MAX_VALUE; } ));
};

exports['test create byteObject array'] = function(_assert)
{
	testArrayCreation(_assert, create.partial(Packages.java.lang.Byte));
};

exports['test create short array'] = function(_assert)
{
	testArrayCreation(_assert, create.partial(Packages.java.lang.Short.TYPE, function() { return Packages.java.lang.Short.MAX_VALUE; } ));
};

exports['test create shortObject array'] = function(_assert)
{
	testArrayCreation(_assert, create.partial(Packages.java.lang.Short));
};

exports['test create char array'] = function(_assert)
{
	testArrayCreation(_assert, create.partial(Packages.java.lang.Character.TYPE, function() { return new Packages.java.lang.Character('a').charValue(); } ));
};

exports['test create characterObject array'] = function(_assert)
{
	testArrayCreation(_assert, create.partial(Packages.java.lang.Character));
};

exports['test create int array'] = function(_assert)
{
	testArrayCreation(_assert, create.partial(Packages.java.lang.Integer.TYPE, function() { return ""; } ));
};

exports['test create integerObject array'] = function(_assert)
{
	testArrayCreation(_assert, create.partial(Packages.java.lang.Integer));
};

exports['test create long array'] = function(_assert)
{
	testArrayCreation(_assert, create.partial(Packages.java.lang.Long.TYPE, function() { return Packages.java.lang.Long.MAX_VALUE; } ));
};

exports['test create longObject array'] = function(_assert)
{
	testArrayCreation(_assert, create.partial(Packages.java.lang.Long));
};

exports['test create boolean array'] = function(_assert)
{
	testArrayCreation(_assert, create.partial(Packages.java.lang.Boolean.TYPE, function() { return Packages.java.lang.Boolean.MAX_VALUE; } ));
};

exports['test create booleanObject array'] = function(_assert)
{
	testArrayCreation(_assert, create.partial(Packages.java.lang.Boolean));
};

exports['test create float array'] = function(_assert)
{
	testArrayCreation(_assert, create.partial(Packages.java.lang.Float.TYPE, function() { return Packages.java.lang.Float.MAX_VALUE; } ));
};

exports['test create floatObject array'] = function(_assert)
{
	testArrayCreation(_assert, create.partial(Packages.java.lang.Float));
};

exports['test create double array'] = function(_assert)
{
	testArrayCreation(_assert, create.partial(Packages.java.lang.Double.TYPE, function() { return Packages.java.lang.Double.MAX_VALUE; } ));
};

exports['test create doubleObject array'] = function(_assert)
{
	testArrayCreation(_assert, create.partial(Packages.java.lang.Double));
};