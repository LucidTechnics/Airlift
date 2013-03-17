var mockWebContext = require('./mockWebContext').create({productionMode: false});

var res = require('airlift/resource').create(mockWebContext);
var util = require('airlift/util');

var web = require('airlift/web').create(mockWebContext),
context = require('./mockContext').person(),
bediako = require('./mockPerson').create("6524d6f79d19", "Bediako George", 'middle aged', '01/01/1970', 43);

context.WEB_CONTEXT = mockWebContext;

var assertContextIsOK = function(_assert, _resourceName, _value, _attributeName, _resource, _metadata, _context)
{
	_assert.eq(bediako, _resource, 'resource is not the resource provided to each');
	_assert.eq(bediako[_attributeName], _value, 'value for: ' + _attributeName + ' is not correct');
	_assert.eq(bediako[_attributeName], _resource[_attributeName], 'resource attribute value for: ' + _attributeName + ' is not correct');

	_assert.eq(true, util.hasValue(_metadata), 'resource attribute metadata for: ' + _attributeName + ' is not present');
	_assert.eq(true, util.hasValue(_metadata.type), 'resource attribute metadata type for: ' + _attributeName + ' is not present');

	_assert.eq(true, util.hasValue(_context.report) && util.typeOf(_context.report) === 'function', 'this should have a report function');
	_assert.eq(true, util.hasValue(_context.allErrors) && util.typeOf(_context.allErrors) === 'function', 'this should have a allErrors function');
	_assert.eq(true, util.hasValue(_context.getErrors) && util.typeOf(_context.getErrors) === 'function', 'this should have a getErrorList function');
	_assert.eq(false, util.isEmpty(_context.attributesMetadata), 'attributes metadata should not be empty');
	_assert.eq(_context.attributesMetadata.attributes[_attributeName].name, _attributeName, 'attribute metadata for: ' + _attributeName + ' is not correct');

	_assert.eq(true, util.hasValue(_context.resourceMetadata), 'resource meta data should have a value');
	_assert.eq(false, util.isEmpty(_context.resourceMetadata), 'resource meta data should not be empty');
	_assert.eq(_context.resourceMetadata.name, _resourceName, 'resource has wrong name');
};

exports['test each'] = function(_assert)
{
	var attributes = [];
	
	res.each('person', bediako, function(_value, _attributeName, _resource, _metadata)
	{
		attributes.push(_attributeName);
		assertContextIsOK(_assert, 'person', _value, _attributeName, _resource, _metadata, this);
		
	}, undefined, context);

	_assert.deepEqual(attributes, context.attributes, 'attribute list is not correct');

	attributes = [];
	var callbackResult = [];
	
	res.each('person', bediako, function(_value, _attributeName, _resource, _metadata)
	{
		attributes.push(_attributeName);
		assertContextIsOK(_assert, 'person', _value, _attributeName, _resource, _metadata, this);

	}, function() {callbackResult.push(this.resourceName)}, context);

	_assert.deepEqual(attributes, context.attributes, 'attribute list is not correct with callback');
	_assert.deepEqual(callbackResult, ['person'], 'callback result list is not correct');


	attributes = [];
	callbackResult = [];
	context.resourceMetadata.attributes = context.attributesMap;
	
	res.each('person', bediako, function(_value, _attributeName, _resource, _metadata)
	{
		attributes.push(_attributeName);
		assertContextIsOK(_assert, 'person', _value, _attributeName, _resource, _metadata, this);

	}, function() {callbackResult.push(this.resourceName)}, context);

	_assert.deepEqual(attributes, context.attributes, 'using attributes map results in attribute list not correct with callback');
	_assert.deepEqual(callbackResult, ['person'], 'using attributes map results in callback result list not correct');
};

exports['test map'] = function(_assert)
{
	var attributes = [];

	//create a person resource using map ...
	var person = res.map('person', bediako, function(_value, _attributeName, _resource, _metadata)
	{
		attributes.push(_attributeName);

		assertContextIsOK(_assert, 'person', _value, _attributeName, _resource, _metadata, this);

		return _value;

	}, undefined, context);

	_assert.deepEqual(attributes, context.attributes, 'attribute list is not correct');

	//test that the person resource is the same as the bediako resource ...
	res.each('person', person, function(_value, _attributeName, _resource)
	{
		attributes.push(_attributeName);

		_assert.eq(bediako[_attributeName], _value, 'value for: ' + _attributeName + ' is not correct');
		_assert.eq(bediako[_attributeName], _resource[_attributeName], 'resource attribute value for: ' + _attributeName + ' is not correct');

	}, undefined, context);

	attributes = [];
	var callbackResult = [];

	person = res.map('person', bediako, function(_value, _attributeName, _resource, _metadata)
	{
		attributes.push(_attributeName);

		assertContextIsOK(_assert, 'person', _value, _attributeName, _resource, _metadata, this);

		return _value;
	}, function() {callbackResult.push(this.resourceName)}, context);

	_assert.deepEqual(attributes, context.attributes, 'attribute list is not correct with callback');
	_assert.deepEqual(callbackResult, ['person'], 'callback result list is not correct');

	//test that the person resource is the same as the bediako resource ...
	res.each('person', person, function(_value, _attributeName, _resource)
	{
		attributes.push(_attributeName);

		_assert.eq(bediako[_attributeName], _value, 'value for: ' + _attributeName + ' is not correct');
		_assert.eq(bediako[_attributeName], _resource[_attributeName], 'resource attribute value for: ' + _attributeName + ' is not correct');

	}, undefined, context);
};


exports['test transform'] = function(_assert)
{
	var attributes = [];
	var dictionary = {fullName: 'name'};
	
	//create a person resource using map ...
	var person = res.transform(dictionary, 'person', bediako, function(_value, _attributeName, _resource, _metadata)
	{
		attributes.push(_attributeName);

		assertContextIsOK(_assert, 'person', _value, _attributeName, _resource, _metadata, this);

		return _value;

	}, undefined, context);

	_assert.deepEqual(attributes, context.attributes, 'transformed attribute list is not correct');

	//test that the transformed person resource is the same as the bediako resource ...
	res.each('person', bediako, function(_value, _attributeName, _resource)
	{
		attributes.push(_attributeName);

		var transformedAttributeName = dictionary[_attributeName]||_attributeName;
		_assert.eq(person[transformedAttributeName], _value, 'transformed value for: ' + _attributeName + ' is not correct');
		_assert.eq(person[transformedAttributeName], _resource[_attributeName], 'transformed resource attribute value for: ' + transformedAttributeName + ' is not correct');

	}, undefined, context);

	attributes = [];
	var callbackResult = [];

	person = res.transform(dictionary, 'person', bediako, function(_value, _attributeName, _resource, _metadata)
	{
		attributes.push(_attributeName);

		assertContextIsOK(_assert, 'person', _value, _attributeName, _resource, _metadata, this);

		return _value;
	}, function() {callbackResult.push(this.resourceName)}, context);

	_assert.deepEqual(attributes, context.attributes, 'attribute list is not correct with callback');
	_assert.deepEqual(callbackResult, ['person'], 'callback result list is not correct');

	//test that the transformed person resource is the same as the bediako resource ...
	res.each('person', bediako, function(_value, _attributeName, _resource)
	{
		attributes.push(_attributeName);

		var transformedAttributeName = dictionary[_attributeName]||_attributeName;
		_assert.eq(person[transformedAttributeName], _value, 'transformed value for: ' + _attributeName + ' is not correct');
		_assert.eq(person[transformedAttributeName], _resource[_attributeName], 'transformed resource attribute value for: ' + transformedAttributeName + ' is not correct');

	}, undefined, context);
};

exports['test reduce'] = function(_assert)
{
	var attributes = [];
	
	var reducedResult = res.reduce('person:', 'person', bediako, function(_base, _value, _attributeName, _resource, _metadata)
	{
		attributes.push(_attributeName);

		assertContextIsOK(_assert, 'person', _value, _attributeName, _resource, _metadata, this);

		var formattedValue = Packages.airlift.util.FormatUtil.format(_value||"");
		return _base + ':' + _attributeName + '=' + formattedValue;		
	}, undefined, context);

	_assert.eq("person::fullName=Bediako George:shortName=Bediako:status=middle aged:birthDate=01-01-1970:age=43.0:friendList=[\"friend1\",\"friend2\",\"friend3\"]:familySet=[\"family1\"]:auditPostDate=:auditPutDate=:auditUserId=:id=6524d6f79d19",
			   reducedResult, 'unexpected reduced result');

	attributes = [];
	var callbackResult = [];
	reducedResult = res.reduce('person:', 'person', bediako, function(_base, _value, _attributeName, _resource, _metadata)
	{
		attributes.push(_attributeName);

		assertContextIsOK(_assert, 'person', _value, _attributeName, _resource, _metadata, this);

		var formattedValue = Packages.airlift.util.FormatUtil.format(_value||"");
		return _base + ':' + _attributeName + '=' + formattedValue;		
	}, function() { callbackResult.push(this.resourceName) }, context);

	_assert.eq("person::fullName=Bediako George:shortName=Bediako:status=middle aged:birthDate=01-01-1970:age=43.0:friendList=[\"friend1\",\"friend2\",\"friend3\"]:familySet=[\"family1\"]:auditPostDate=:auditPutDate=:auditUserId=:id=6524d6f79d19",
			   reducedResult, 'unexpected reduced result with callback');

};

exports['test sequence'] = function(_assert)
{
	var results = [];
	
	var sequence = res.sequence(
	 function() { results.push(1); },
	 function() { results.push(2); },
	 function() { results.push(3); },
	 function() { results.push(4); }
	);

	sequence();

	_assert.deepEqual([1,2,3,4], results, 'all functions did not appear to run in sequence');

	var attributes = [];
	
	res.each('person', bediako, res.sequence(function(_value, _attributeName, _resource, _metadata)
	{
		attributes.push(_attributeName);

		assertContextIsOK(_assert, 'person', _value, _attributeName, _resource, _metadata, this);

	}), undefined, context);

	_assert.deepEqual(attributes, context.attributes, 'attribute list is not correct');
};

exports['test json'] = function(_assert)
{
	var result = res.json([]);
	_assert.eq('[]', result, 'JavaScript empty array serialization failed');

	result = res.json(['bediako']);
	_assert.eq('["bediako"]', result, 'JavaScript array serialization failed');

	result = res.json({});
	_assert.eq('{}', result, 'JavaScript empty object serialization failed');

	result = res.json({name: "bediako"});
	_assert.eq('{"name":"bediako"}', result, 'JavaScript object serialization failed');

	result = res.json({name: new Packages.java.lang.String("bediako")});
	_assert.eq('{"name":"bediako"}', result, 'JavaScript object with Java String serialization failed');

	result = res.json({number: new Packages.java.lang.Integer(1)});
	_assert.eq('{"number":1}', result, 'JavaScript object with Java Integer serialization failed');

	result = res.json({time: new Date(5)});
	_assert.eq('{"time":"1970-01-01T00:00:00.005Z"}', result, 'JavaScript object with JavaScript Date serialization failed');

	result = res.json({time: new Packages.java.util.Date(5)});
	_assert.eq('{"time":"1970-01-01T00:00:00.005Z"}', result, 'JavaScript object with java.util.Date serialization failed');

	var list = new Packages.java.util.ArrayList();
	list.add("bediako");
	result = res.json(list);
	_assert.eq('["bediako"]', result, 'Java ArrayList serialization failed');

	var set = new Packages.java.util.HashSet();
	set.add("bediako");
	result = res.json(set);
	_assert.eq('["bediako"]', result, 'Java HashSet serialization failed');
};

exports['test compose'] = function(_assert)
{
	var results = [];

	var compose = res.compose(
	  function() { results.push(1); },
	  function() { results.push(2); },
	  function() { results.push(3); },
	  function() { results.push(4); }
	);

	compose();

	_assert.deepEqual([1, 2, 3, 4], results, 'all functions did not appear to run in composition');

	var attributes = [];

	res.each('person', bediako, res.compose(function(_value, _attributeName, _resource, _metadata)
	{
		attributes.push(_attributeName);

		assertContextIsOK(_assert, 'person', _value, _attributeName, _resource, _metadata, this);

	}), undefined, context);

	_assert.deepEqual(attributes, context.attributes, 'attribute list is not correct');

	attributes = [];
	results = [];
	res.each('person', bediako, res.compose(function(_value, _attributeName, _resource, _metadata)
	{
		results.push(1);
		_assert.eq(_value, _resource[_attributeName], 'first function execution is not correct');
		attributes.push(_attributeName);

		return 5;
	},
	function(_value, _attributeName, _resource, _metadata)
	{
		_assert.notEq(_value, _resource[_attributeName], 'subsequent function execution is not correct');
		_assert.eq(results.length > 0, _value === 5, 'subsequent function value argument is not correct');
		results = [];
		
	}), undefined, context);

	_assert.deepEqual(attributes, context.attributes, 'attribute list is not correct after second compose test');
};

exports['test watch'] = function(_assert)
{
	var executionTest = [], attributes = {};

	var watchFunction = function(_value, _attributeName, _resource, _metadata)
	{
		executionTest.push(1);

		attributes[_attributeName] = (attributes[_attributeName] && attributes[_attributeName] + 1)||1;

		assertContextIsOK(_assert, 'person', _value, _attributeName, _resource, _metadata, this);
	};
	
	var watch = res.watch('birthDate', 'age', watchFunction);
	res.each('person', bediako, watch, undefined, context);
	var result = {age: 1};
	
	_assert.deepEqual(result, attributes, 'wrong attributes visited before watch execution');
	_assert.eq(1, executionTest.length, 'watch allowed execution to occur more than once.');

	executionTest = [];
	attributes = {};
	result = {age: 1};
	
	var watch = res.watch('birthDate', watchFunction, 'age');
	res.each('person', bediako, watch, undefined, context);

	_assert.deepEqual(result, attributes, 'wrong attributes visited before watch execution when order is unorthodox');
	_assert.eq(1, executionTest.length, 'watch allowed execution to occur more than once when order is unorthodox.');

	executionTest = [];
	attributes = {};
	result = {id: 1};

	watch = res.watch(watchFunction);
	res.each('person', bediako, watch, undefined, context);
	
	_assert.deepEqual(result, attributes, 'wrong attributes visited before watch execution');
	_assert.eq(1, executionTest.length, 'watch allowed execution to occur more than once.');

	executionTest = [];
	attributes = {};
	result = {age: 1};
	
	watch = res.watch(['birthDate', 'age'], watchFunction);
	res.each('person', bediako, watch, undefined, context);
	var result = {age: 1};

	_assert.deepEqual(result, attributes, 'wrong attributes visited before watch execution');
	_assert.eq(1, executionTest.length, 'watch allowed execution to occur more than once.');
};

exports['test copy'] = function(_assert)
{
	var target = {};
	
	res.each('person', bediako, res.copy.partial(target), undefined, context);

	_assert.eq(bediako.id, target.id, 'id not equal');
	_assert.eq(bediako.fullName, target.fullName, 'fullName not equal');
	_assert.eq(bediako.shortName, target.shortName, 'shortName not equal');
	_assert.eq(bediako.status, target.status, 'status not equal');
	_assert.eq(bediako.birthDate, target.birthDate, 'birthDate not equal');
	_assert.eq(bediako.age, target.age, 'age not equal');
	_assert.eq(bediako.friendList, target.friendList, 'friendList not equal');
	_assert.eq(bediako.familySet, target.familySet, 'familySet not equal');
};

exports['test clone'] = function(_assert)
{
	var target = res.map('person', bediako, res.clone, undefined, context);

	_assert.eq(bediako.id, target.id, 'id not equal');
	_assert.eq(bediako.fullName, target.fullName, 'fullName not equal');
	_assert.eq(bediako.shortName, target.shortName, 'shortName not equal');
	_assert.eq(bediako.status, target.status, 'status not equal');
	_assert.eq(bediako.birthDate, target.birthDate, 'birthDate not equal');
	_assert.eq(bediako.age, target.age, 'age not equal');
	_assert.eq(bediako.friendList, target.friendList, 'friendList not equal');
	_assert.eq(bediako.familySet, target.familySet, 'familySet not equal');
};
