var array = [];
var list = new Packages.java.util.ArrayList();
var set = new Packages.java.util.HashSet();

var collection = require('airlift/collection');
var util = require('airlift/util');

exports.setUp = function()
{
	array.push(1);
	array.push(true);
	array.push(20);
	array.push('hello');

	list.add(1);
	list.add(true);
	list.add(20);
	list.add('hello');

	set.add(1);
	set.add(true);
	set.add(20);
	set.add('hello');
};

exports['test set up successful'] = function(_assert)
{
	_assert.eq(array.length, 4, 'array initialization successful');
	_assert.eq(list.size(), 4, 'list initialization successful');
	_assert.eq(set.size(), 4, 'set initialization successful');
};

exports['test every'] = function(_assert)
{	
	_assert.eq(true, collection.every(array, function(_item, _index, _collection) { return !!_item; }), 'ARRAY: every does not return true for universal true check');
	_assert.eq(false, collection.every(array, function(_item, _index, _collection) { if ("hello".equalsIgnoreCase(_item) === true) { return false; } return true; }), 'ARRAY: every does not return false for at least one check returning false');

	_assert.eq(true, collection.every(list, function(_item, _index, _collection) { return !!_item; }), 'LIST: every does not return true for universal true check');
	_assert.eq(false, collection.every(list, function(_item, _index, _collection) { if ("hello".equalsIgnoreCase(_item) === true) { return false; } return true; }), 'LIST: every does not return false for at least one check returning false');

	_assert.eq(true, collection.every(set, function(_item, _index, _collection) { return !!_item; }), 'SET: every does not return true for universal true check');
	_assert.eq(false, collection.every(set, function(_item, _index, _collection) { if ("hello".equalsIgnoreCase(_item) === true) { return false; } return true; }), 'SET: every does not return false for at least one check returning false');

};


exports['test for each'] = function(_assert)
{
	var results = [];
	var index = 0;

	collection.forEach(array, function(_item, _index, _collection)
	{
		_assert.eq(index++, _index, 'ARRAY: index is out of sync');
		results.push(_item);
	});
	
	_assert.eq(results.length, array.length, 'ARRAY: result length not equal to collection length');
	_assert.eq(results[0], array[0], 'ARRAY: first item in result is not equal');
	_assert.eq(results[1], array[1], 'ARRAY: second item in result is not equal');
	_assert.eq(results[2], array[2], 'ARRAY: third item in result is not equal');
	_assert.eq(results[3], array[3], 'ARRAY: fourth item in result is not equal');
	
	results = [];
	index = 0;

	collection.forEach(list, function(_item, _index, _collection)
	{
		_assert.eq(index++, _index, 'LIST: index is out of sync');
		results.push(_item);
	});

	_assert.eq(results.length, list.size(), 'LIST: result length not equal to collection length');
	_assert.eq(results[0], list.get(0), 'LIST: first item in result is not equal');
	_assert.eq(results[1], list.get(1), 'LIST: second item in result is not equal');
	_assert.eq(results[2], list.get(2), 'LIST: third item in result is not equal');
	_assert.eq(results[3], list.get(3), 'LIST: fourth item in result is not equal');

	results = [];
	index = 0;

	collection.forEach(set, function(_item, _index, _collection)
	{
		_assert.eq(index++, _index, 'SET: index is out of sync');
		results.push(_item);
	});

	_assert.eq(results.length, set.size(), 'SET: result length not equal to collection length');
	_assert.eq(true, set.contains(results[0]), 'SET: first item in result is not equal');
	_assert.eq(true, set.contains(results[1]), 'SET: second item in result is not equal');
	_assert.eq(true, set.contains(results[2]), 'SET: third item in result is not equal');
	_assert.eq(true, set.contains(results[3]), 'SET: fourth item in result is not equal');
};

exports['test filter'] = function(_assert)
{
	var index = 0;

	var results = collection.filter(array, function(_item, _index, _collection)
	{
		_assert.eq(index++, _index, 'ARRAY: index is out of sync');

		if (_index % 2 === 0)
		{
			return false;
		}
		else
		{
			return true;
		}
	});

	_assert.eq(results.length, array.length - 2, 'ARRAY: result length not correct');
	_assert.eq(results[0], array[1], 'ARRAY: first item in result is not equal');
	_assert.eq(results[1], array[3], 'ARRAY: second item in result is not equal');

	index = 0;

	results = collection.filter(list, function(_item, _index, _collection)
	{
		_assert.eq(index++, _index, 'LIST: index is out of sync');

		if (_index % 2 === 0)
		{
			return false;
		}
		else
		{
			return true;
		}
	});

	_assert.eq(results.size(), list.size() - 2, 'LIST: result length not correct');
	_assert.eq(results.get(0), list.get(1), 'LIST: first item in result is not equal');
	_assert.eq(results.get(1), list.get(3), 'LIST: second item in result is not equal');

	index = 0;

	results = collection.filter(set, function(_item, _index, _collection)
	{
		_assert.eq(index++, _index, 'SET: index is out of sync');

		if (_index % 2 === 0)
		{
			return false;
		}
		else
		{
			return true;
		}
	});

	_assert.eq(results.size(), set.size() - 2, 'SET: result length not correct');
	_assert.eq(true, set.contains(results.get(0)), 'SET: first item in result is not equal');
	_assert.eq(true, set.contains(results.get(1)), 'SET: second item in result is not equal');
};

exports['test map'] = function(_assert)
{
	var index = 0;

	var results = collection.map(array, function(_item, _index, _collection)
	{
		_assert.eq(index++, _index, 'ARRAY: index is out of sync');
		return _item;
	});

	_assert.eq(results.length, array.length, 'ARRAY: result length not equal to collection length');
	_assert.eq(results[0], array[0], 'ARRAY: first item in result is not equal');
	_assert.eq(results[1], array[1], 'ARRAY: second item in result is not equal');
	_assert.eq(results[2], array[2], 'ARRAY: third item in result is not equal');
	_assert.eq(results[3], array[3], 'ARRAY: fourth item in result is not equal');

	index = 0;

	results = collection.map(list, function(_item, _index, _collection)
	{
		_assert.eq(index++, _index, 'LIST: index is out of sync');
		return _item;
	});

	_assert.eq(results.size(), list.size(), 'LIST: result length not equal to collection length');
	_assert.eq(results.get(0), list.get(0), 'LIST: first item in result is not equal');
	_assert.eq(results.get(1), list.get(1), 'LIST: second item in result is not equal');
	_assert.eq(results.get(2), list.get(2), 'LIST: third item in result is not equal');
	_assert.eq(results.get(3), list.get(3), 'LIST: fourth item in result is not equal');

	index = 0;

	results = collection.map(set, function(_item, _index, _collection)
	{
		_assert.eq(index++, _index, 'SET: index is out of sync');
		return _item;
	});

	_assert.eq(results.size(), set.size(), 'SET: result length not equal to collection length');
	_assert.eq(true, set.contains(results.get(0)), 'SET: first item in result is not equal');
	_assert.eq(true, set.contains(results.get(1)), 'SET: second item in result is not equal');
	_assert.eq(true, set.contains(results.get(2)), 'SET: third item in result is not equal');
	_assert.eq(true, set.contains(results.get(3)), 'SET: fourth item in result is not equal');
};

exports['test some'] = function(_assert)
{	
	_assert.eq(false, collection.some(array, function(_item, _index, _collection) { return !!!_item; }), 'ARRAY: some does not return false for universal false check');
	_assert.eq(true, collection.some(array, function(_item, _index, _collection) { if ("hello".equalsIgnoreCase(_item) === true) { return false; } return true; }), 'ARRAY: some does not return true for at least one check returning true');

	_assert.eq(false, collection.some(list, function(_item, _index, _collection) { return !!!_item; }), 'LIST: some does not return false for universal false check');
	_assert.eq(true, collection.some(list, function(_item, _index, _collection) { if ("hello".equalsIgnoreCase(_item) === true) { return false; } return true; }), 'LIST: some does not return true for at least one check returning true');

	_assert.eq(false, collection.some(set, function(_item, _index, _collection) { return !!!_item; }), 'SET: every does not return false for universal false check');
	_assert.eq(true, collection.some(set, function(_item, _index, _collection) { if ("hello".equalsIgnoreCase(_item) === true) { return false; } return true; }), 'SET: some does not return true for at least one check returning true');
};

exports['test split'] = function(_assert)
{
	var index = 0;

	var results = collection.split(array, function(_item, _index, _collection)
	{
		_assert.eq(index++, _index, 'ARRAY: index is out of sync');

		if (_index % 2 === 0)
		{
			return false;
		}
		else
		{
			return true;
		}
	});

	_assert.eq(results.success.length, array.length - 2, 'ARRAY: success result length not correct');
	_assert.eq(results.fail.length, array.length - 2, 'ARRAY: fail result length not correct');
	_assert.eq(results.success[0], array[1], 'ARRAY: first item in success result is not equal');
	_assert.eq(results.success[1], array[3], 'ARRAY: second item in success result is not equal');
	_assert.eq(results.fail[0], array[0], 'ARRAY: first item in fail result is not equal');
	_assert.eq(results.fail[1], array[2], 'ARRAY: second item in fail result is not equal');

	index = 0;

	results = collection.split(list, function(_item, _index, _collection)
	{
		_assert.eq(index++, _index, 'LIST: index is out of sync');

		if (_index % 2 === 0)
		{
			return false;
		}
		else
		{
			return true;
		}
	});

	_assert.eq(results.success.size(), list.size() - 2, 'LIST: success result length not correct');
	_assert.eq(results.fail.size(), list.size() - 2, 'LIST: fail result length not correct');
	_assert.eq(results.success.get(0), list.get(1), 'LIST: first item in success result is not equal');
	_assert.eq(results.success.get(1), list.get(3), 'LIST: second item in success result is not equal');
	_assert.eq(results.fail.get(0), list.get(0), 'LIST: first item in fail result is not equal');
	_assert.eq(results.fail.get(1), list.get(2), 'LIST: second item in fail result is not equal');

	index = 0;

	results = collection.split(set, function(_item, _index, _collection)
	{
		_assert.eq(index++, _index, 'SET: index is out of sync');

		if (_index % 2 === 0)
		{
			return false;
		}
		else
		{
			return true;
		}
	});

	_assert.eq(results.success.size(), set.size() - 2, 'SET: success result length not correct');
	_assert.eq(results.fail.size(), set.size() - 2, 'SET: fail result length not correct');
	_assert.eq(true, set.contains(results.success.get(0)), 'SET: first item in success result is not equal');
	_assert.eq(true, set.contains(results.success.get(1)), 'SET: second item in success result is not equal');
	_assert.eq(true, set.contains(results.fail.get(0)), 'SET: first item in fail result is not equal');
	_assert.eq(true, set.contains(results.fail.get(1)), 'SET: second item in fail result is not equal');
};


exports['test partition'] = function(_assert)
{
	var array = [], list = new java.util.ArrayList(), set = new java.util.HashSet();
	
	array.push({name: 'Bediako'});
	array.push({name: 'Loki'});
	array.push({name: 'Connor'});
	array.push({name: 'Bediako'});

	list.add({name: 'Bediako'});
	list.add({name: 'Loki'});
	list.add({name: 'Connor'});
	list.add({name: 'Bediako'});

	set.add({name: 'Bediako'});
	set.add({name: 'Loki'});
	set.add({name: 'Connor'});
	set.add({name: 'Bediako'});

	var partition = collection.partition(array, 'name');
	
	_assert.deepEqual(partition.keys, ['Bediako', 'Loki', 'Connor'], 'ARRAY: keys are not correct');
	_assert.deepEqual(partition.partition, {Bediako: [{name: 'Bediako'}, {name: 'Bediako'}], Loki: [{name: 'Loki'}], Connor: [{name: 'Connor'}]}, 'ARRAY: partition is not correct');

	partition = collection.partition(list, 'name');

	var listKeys = new java.util.ArrayList();
	listKeys.add('Bediako');
	listKeys.add('Loki');
	listKeys.add('Connor');

	var listPartition = new java.util.HashMap();
	var bediakoList = new java.util.ArrayList();
	bediakoList.add({name: 'Bediako'});
	bediakoList.add({name: 'Bediako'});

	var lokiList = new java.util.ArrayList();
	lokiList.add({name: 'Loki'});

	var connorList = new java.util.ArrayList();
	connorList.add({name: 'Connor'});

	listPartition.put('Bediako', bediakoList);
	listPartition.put('Loki', lokiList);
	listPartition.put('Connor', connorList);
	
	_assert.deepEqual(partition.keys, listKeys, 'LIST: keys are not correct');

	for(var entry in Iterator(partition.partition.entrySet()))
	{
		var key = entry.getKey();
		var value = entry.getValue();

		if ("Bediako".equals(key) === true)
		{
			_assert.eq(value.size(), 2, 'LIST: Bediako value list count not correct');
			_assert.eq(value.get(0).name, "Bediako", 'LIST: 0 wrong object in Bediako list');
			_assert.eq(value.get(1).name, "Bediako", 'LIST: 1 wrong object in Bediako list');
		}

		if ("Loki".equals(key) === true)
		{
			_assert.eq(value.size(), 1, 'LIST: Loki value list count not correct');
			_assert.eq(value.get(0).name, "Loki", 'LIST: 0 wrong object in Loki list');
		}

		if ("Connor".equals(key) === true)
		{
			_assert.eq(value.size(), 1, 'LIST: Connor value list count not correct');
			_assert.eq(value.get(0).name, "Connor", 'LIST: 0 wrong object in Connor list');
		}
	}

	partition = collection.partition(set, 'name');

	_assert.deepEqual(new java.util.HashSet(partition.keys), new java.util.HashSet(listKeys), 'SET: keys are not correct');

	for(var entry in Iterator(partition.partition.entrySet()))
	{
		var key = entry.getKey();
		var value = entry.getValue();

		if ("Bediako".equals(key) === true)
		{
			_assert.eq(value.size(), 2, 'SET: Bediako value list count not correct');
		}

		if ("Loki".equals(key) === true)
		{
			_assert.eq(value.size(), 1, 'SET: Loki value list count not correct');
		}

		if ("Connor".equals(key) === true)
		{
			_assert.eq(value.size(), 1, 'SET: Connor value list count not correct');
		}
	}
};

exports['test reduce'] = function(_assert)
{
	_assert.eq('1true20hello', collection.reduce(array, function(_result, _item, _index, _collection) { return _result + '' + _item; }, ''), 'ARRAY: reduced result concatenation not correct');
	_assert.eq('1.0true20.0hello', collection.reduce(list, function(_result, _item, _index, _collection) { return _result + '' + _item; }, ''), 'LIST: reduced result concatenation not correct');

	var set = new java.util.HashSet();
	set.add(1);
	set.add(2);
	set.add(3);
	set.add(4);

	_assert.eq(10, collection.reduce(set, function(_result, _item, _index, _collection) { return _result + _item.intValue(); }, 0), 'SET: reduced result addition result not correct');
};

exports['test reduce right'] = function(_assert)
{
	_assert.eq('hello20true1', collection.reduceRight(array, function(_result, _item, _index, _collection) { return _result + '' + _item; }, ''), 'ARRAY: reduced result concatenation not correct');
	_assert.eq('hello20.0true1.0', collection.reduceRight(list, function(_result, _item, _index, _collection) { return _result + '' + _item; }, ''), 'LIST: reduced result concatenation not correct');

	var set = new java.util.HashSet();
	set.add(1);
	set.add(2);
	set.add(3);
	set.add(4);

	_assert.eq(10, collection.reduceRight(set, function(_result, _item, _index, _collection) { return _result + _item.intValue(); }, 0), 'SET: reduced result addition result not correct');
};