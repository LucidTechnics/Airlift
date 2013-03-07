var javaArray = require('airlift/javaArray');
var util = require('airlift/util');

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

	a[0].getClass && _assert.ok((a[0] instanceof type), 'first object right type');
	a[1].getClass && _assert.ok((a[1] instanceof type), 'second object right type');

	_assert.ok((initializer.length === 2), 'initializer created successfully.');
	_assert.ok((a[0] === initializer[0]), 'first object not initialized successfully');
	_assert.ok((a[1] === initializer[1]), 'second object not initialized successfully');
	
	_assert.ok(!util.hasValue(a[2]) || (a[2] === 0) || (a[2] === false), 'third entry not initialized successfully');
};

var createFunction = function(_length, _assert, _type, _create, _objectInitializer)
{
	var Type = _type;
	
	var object1 = _objectInitializer && _objectInitializer()||new Type();
	_assert.ok(true === util.hasValue(object1), 'object 1 is not defined');
	
	var object2 = _objectInitializer && _objectInitializer()||new Type();
	_assert.ok(true === util.hasValue(object1), 'object 2 is not defined');

	var a = _create.call(javaArray, [object1, object2]);

	return { a: a, initializer: [object1, object2], type: Type, length: _length };
};

var arrayLength= 3;
var create = createFunction.partial(arrayLength);

exports['test create java array of Object'] = function(_assert)
{
	testArrayCreation(_assert, create.partial(_assert, Packages.java.lang.Object, javaArray.createArray.partial(arrayLength, Packages.java.lang.Object)));
};

exports['test create java array of String'] = function(_assert)
{
	testArrayCreation(_assert, create.partial(_assert, Packages.java.lang.String, javaArray.stringArray.partial(arrayLength), function() { return new Packages.java.lang.String('x'); }));
};

exports['test create byte array'] = function(_assert)
{
	testArrayCreation(_assert, create.partial(_assert, Packages.java.lang.Byte.TYPE, javaArray.byteArray.partial(arrayLength), function() { return Packages.java.lang.Byte.MAX_VALUE; } ));
};

exports['test create byteObject array'] = function(_assert)
{
	testArrayCreation(_assert, create.partial(_assert, Packages.java.lang.Byte, javaArray.byteObjectArray.partial(arrayLength), function() { return new Packages.java.lang.Byte(Packages.java.lang.Byte.MAX_VALUE); }));
};

exports['test create short array'] = function(_assert)
{
	testArrayCreation(_assert, create.partial(_assert, Packages.java.lang.Short.TYPE, javaArray.shortArray.partial(arrayLength), function() { return Packages.java.lang.Short.MAX_VALUE; } ));
};

exports['test create shortObject array'] = function(_assert)
{
	testArrayCreation(_assert, create.partial(_assert, Packages.java.lang.Short, javaArray.shortObjectArray.partial(arrayLength), function() { return new Packages.java.lang.Short(Packages.java.lang.Short.MAX_VALUE); }));
};

exports['test create char array'] = function(_assert)
{	
	testArrayCreation(_assert, create.partial(_assert, Packages.java.lang.Character.TYPE, javaArray.charArray.partial(arrayLength), function() { return Packages.java.lang.Character.MAX_VALUE; }));
};

exports['test create characterObject array'] = function(_assert)
{
	testArrayCreation(_assert, create.partial(_assert, Packages.java.lang.Character, javaArray.characterObjectArray.partial(arrayLength), function() { return new Packages.java.lang.Character(Packages.java.lang.Character.MAX_VALUE); }));
};

exports['test create int array'] = function(_assert)
{
	testArrayCreation(_assert, create.partial(_assert, Packages.java.lang.Integer.TYPE, javaArray.intArray.partial(arrayLength), function() { return Packages.java.lang.Integer.MAX_VALUE; }));
};

exports['test create integerObject array'] = function(_assert)
{
	testArrayCreation(_assert, create.partial(_assert, Packages.java.lang.Integer, javaArray.integerObjectArray.partial(arrayLength), function() { return new Packages.java.lang.Integer(Packages.java.lang.Integer.MAX_VALUE); }));
};

exports['test create long array'] = function(_assert)
{
	testArrayCreation(_assert, create.partial(_assert, Packages.java.lang.Long.TYPE, javaArray.longArray.partial(arrayLength), function() { return Packages.java.lang.Long.MAX_VALUE; }));
};

exports['test create longObject array'] = function(_assert)
{
	testArrayCreation(_assert, create.partial(_assert, Packages.java.lang.Long, javaArray.longObjectArray.partial(arrayLength), function() { return new Packages.java.lang.Long(Packages.java.lang.Long.MAX_VALUE); }));
};

exports['test create boolean array'] = function(_assert)
{
	testArrayCreation(_assert, create.partial(_assert, Packages.java.lang.Boolean.TYPE, javaArray.booleanArray.partial(arrayLength), function() { return true; }));
};

exports['test create booleanObject array'] = function(_assert)
{
	testArrayCreation(_assert, create.partial(_assert, Packages.java.lang.Boolean, javaArray.booleanObjectArray.partial(arrayLength), function() { return new Packages.java.lang.Boolean(Packages.java.lang.Boolean.TRUE); }));
};

exports['test create float array'] = function(_assert)
{
	testArrayCreation(_assert, create.partial(_assert, Packages.java.lang.Float.TYPE, javaArray.floatArray.partial(arrayLength), function() { return Packages.java.lang.Float.MAX_VALUE; }));
};

exports['test create floatObject array'] = function(_assert)
{
	testArrayCreation(_assert, create.partial(_assert, Packages.java.lang.Float, javaArray.floatObjectArray.partial(arrayLength), function() { return new Packages.java.lang.Float(Packages.java.lang.Float.MAX_VALUE); }));
};

exports['test create double array'] = function(_assert)
{
	testArrayCreation(_assert, create.partial(_assert, Packages.java.lang.Double.TYPE, javaArray.doubleArray.partial(arrayLength), function() { return Packages.java.lang.Double.MAX_VALUE; }));
};

exports['test create doubleObject array'] = function(_assert)
{
	testArrayCreation(_assert, create.partial(_assert, Packages.java.lang.Double, javaArray.doubleObjectArray.partial(arrayLength), function() { return new Packages.java.lang.Double(Packages.java.lang.Double.MAX_VALUE); }));
};