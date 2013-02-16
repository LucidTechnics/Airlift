var res = require('airlift/resource');
var util = require('airlift/util');

var web = require('./mockWeb').create(),
context = require('./mockContext').person(),
bediako = require('./mockPerson').create("6524d6f79d19", "Bediako George", 'middle aged', '01/01/1970', 43);

var assertContextIsOK = function(_assert, _resourceName, _value, _attributeName, _resource, _context)
{
	_assert.eq(bediako, _resource, 'resource is not the resource provided to each');
	_assert.eq(bediako[_attributeName], _value, 'value for: ' + _attributeName + ' is not correct');
	_assert.eq(bediako[_attributeName], _resource[_attributeName], 'resource attribute value for: ' + _attributeName + ' is not correct');

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
	
	res.each('person', bediako, function(_value, _attributeName, _resource)
	{
		attributes.push(_attributeName);

		assertContextIsOK(_assert, 'person', _value, _attributeName, _resource, this);
		
	}, context);

	_assert.deepEqual(attributes, context.attributes, 'attribute list is not correct');
};

exports['test map'] = function(_assert)
{
	var attributes = [];

	//create a person resource using map ...
	var person = res.map('person', bediako, function(_value, _attributeName, _resource)
	{
		attributes.push(_attributeName);

		assertContextIsOK(_assert, 'person', _value, _attributeName, _resource, this);

		return _value;

	}, context);

	_assert.deepEqual(attributes, context.attributes, 'attribute list is not correct');

	//test that the person resource is the same as the bediako resource ...
	res.each('person', person, function(_value, _attributeName, _resource)
	{
		attributes.push(_attributeName);

		_assert.eq(bediako[_attributeName], _value, 'value for: ' + _attributeName + ' is not correct');
		_assert.eq(bediako[_attributeName], _resource[_attributeName], 'resource attribute value for: ' + _attributeName + ' is not correct');

	}, context);
};

exports['test reduce'] = function(_assert)
{
	var attributes = [];
	
	var reducedResult = res.reduce('person:', 'person', bediako, function(_base, _value, _attributeName, _resource)
	{
		attributes.push(_attributeName);

		assertContextIsOK(_assert, 'person', _value, _attributeName, _resource, this);

		var formattedValue = Packages.airlift.util.FormatUtil.format(_value||"");
		return _base + ':' + _attributeName + '=' + formattedValue;		
	}, context);

	_assert.eq("person::fullName=Bediako George:shortName=Bediako:status=middle aged:birthDate=01-01-1970:age=43.0:friendList=[\"friend1\",\"friend2\",\"friend3\"]:familySet=[\"family1\"]:auditPostDate=:auditPutDate=:auditUserId=:id=6524d6f79d19",
			   reducedResult, 'unexpected reduced result');
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
	
	res.each('person', bediako, res.sequence(function(_value, _attributeName, _resource)
	{
		attributes.push(_attributeName);

		assertContextIsOK(_assert, 'person', _value, _attributeName, _resource, this);

	}), context);

	_assert.deepEqual(attributes, context.attributes, 'attribute list is not correct');
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

	_assert.deepEqual([4,3,2,1], results, 'all functions did not appear to run in composition');

	var attributes = [];

	res.each('person', bediako, res.compose(function(_value, _attributeName, _resource)
	{
		attributes.push(_attributeName);

		assertContextIsOK(_assert, 'person', _value, _attributeName, _resource, this);

	}), context);

	_assert.deepEqual(attributes, context.attributes, 'attribute list is not correct');
};

exports['test watch'] = function(_assert)
{
	var executionTest = [], attributes = {};
	
	var watch = res.watch('birthDate', 'age', function(_value, _attributeName, _resource)
	{
		executionTest.push(1);

		attributes[_attributeName] = (attributes[_attributeName] && attributes[_attributeName] + 1)||1;

		assertContextIsOK(_assert, 'person', _value, _attributeName, _resource, this);
	});

	res.each('person', bediako, watch, context);

	var result = {age: 1};
	
	_assert.deepEqual(result, attributes, 'wrong attributes visited before watch execution');
	_assert.eq(1, executionTest.length, 'watch allowed execution to occur more than once.');
};

exports['test copy'] = function(_assert)
{
	var target = {};
	
	res.each('person', bediako, res.copy.partial(target), context);

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
	var target = res.map('person', bediako, res.clone, context);

	_assert.eq(bediako.id, target.id, 'id not equal');
	_assert.eq(bediako.fullName, target.fullName, 'fullName not equal');
	_assert.eq(bediako.shortName, target.shortName, 'shortName not equal');
	_assert.eq(bediako.status, target.status, 'status not equal');
	_assert.eq(bediako.birthDate, target.birthDate, 'birthDate not equal');
	_assert.eq(bediako.age, target.age, 'age not equal');
	_assert.eq(bediako.friendList, target.friendList, 'friendList not equal');
	_assert.eq(bediako.familySet, target.familySet, 'familySet not equal');
};
