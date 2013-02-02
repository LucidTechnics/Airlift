/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @param _collection - a java.util.Collection, a java.lang.String, a
 * Javascript array, or a Javascript string to iterate over.
 * 
 * @param _function - a function that will be applied to every member
 * of that collection or array, OR every character of the
 * java.lang.String or Javascript string.  The function can expect the
 * item/character, index, and collection/string to be passed to it at runtime.
 *
 * The iteration will stop once the all the members of the _collection
 * has been visited OR if the _function ever returns false.
 *
 * @returns returns true if the function returned true for every item
 * it visited.
 * 
 * @example
 * var users = ["Bediako", "Dave", "Loki"];
 *
 * var success = require('collection').every(users, function(_item, _index, _collection) { return true; });
 */
exports.every = function(_collection, _function, _this)
{
	var success = true;

	if (_collection && _collection.hasNext && _collection.next)
	{
		iterator = _collection;
	}
	else if (_collection && _collection.iterator)
	{
		iterator = Iterator(_collection);
	}

	if (iterator)
	{
		var index = 0;

		for (var item in iterator)
		{
			success = _function.call(_this, item, index, _collection);
			if (success === false) { break; } else { index++; }
		}
	}
	else if (_collection && _collection.every)
	{
		success = _collection.every(_function);
	}
	else if (_collection && _collection.replace)
	{
		success = Array.every(_collection + "", _function);
	}

	return success;
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @param _collection - a java.util.Collection, a java.lang.String, a
 * Javascript array, or a Javascript string to iterate over, or an
 * java.util.Iterator.
 * 
 * @param _function - a function that will be applied to every member
 * of that collection or array, OR every character of the
 * java.lang.String or Javascript string.  The function can expect the
 * item/character, index, and collection/string to be passed to it at runtime.
 *
 * @example
 * var users = ["Bediako", "Dave", "Loki"];
 *
 * require('collection').forEach(users, function(_item, _index, _collection) { LOG.info("Hello " + _item); });
 * //this writes "Hello <item>" to the logs.
 */
exports.forEach = function(_collection, _function, _this)
{
	var iterator;
			
	if (_collection && _collection.hasNext && _collection.next)
	{
		iterator = _collection;
	}
	else if (_collection && _collection.iterator)
	{
		iterator = Iterator(_collection);
	}

	if (iterator)
	{
		var index = 0;

		for (var item in iterator)
		{
			_function && _function.call(_this, item, index, _collection.add && _collection);
			index++;
		}		
	}
	else if (_collection && _collection.forEach)
	{
		_collection.forEach(_function);
	}
	else if (_collection && _collection.replace)
	{
		Array.forEach(_collection + "", _function);
	}
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @param _collection - a java.util.Collection, a java.lang.String, a
 * Javascript array, or a Javascript string to iterate over.
 * 
 * @param _function - a function that will be applied to every member
 * of that collection or array, OR every character of the
 * java.lang.String or Javascript string.  The function can expect the
 * item/character, index, and collection/string to be passed to it at runtime.
 *
 * @returns a java.util.List or a Javascript array that contains every
 * item/character in the Javascript array or java.util.Collection
 * or string for which _function returned
 * true.
 *
 * @example
 * var users = ["Bediako", "Dave", "Loki"];
 *
 * var results = require('collection').filter(users, function(_item, _index, _collection) { return true; });  //this returns every item in users.
 *
 */
exports.filter = function(_collection, _function, _this)
{
	if (_collection && _collection.hasNext && _collection.next)
	{
		iterator = _collection;
	}
	else if (_collection && _collection.iterator)
	{
		iterator = Iterator(_collection);
	}

	if (iterator)
	{
		var result = new Packages.java.util.ArrayList(), index = 0;
		
		for (var item in iterator)
		{
			_function && (_function.call(_this, item, index, _collection) === true) && result.add(item);
			index++;
		}
	}
	else if (_collection && _collection.filter)
	{
		var result = _collection.filter(_function);
	}
	else if (_collection && _collection.replace)
	{
		var result = Array.filter(_collection + "", _function);
	}

	return result;
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @param _collection - a java.util.Collection, a java.lang.String, a
 * Javascript array, or a Javascript string to iterate over.
 * 
 * @param _function - a function that will be applied to every member
 * of that collection or array, OR every character of the
 * java.lang.String or Javascript string.  The function can expect the
 * item/character, index, and collection/string to be passed to it at runtime.
 *
 * @returns a java.util.List or a Javascript array that contains every
 * result returned by _function's execution against every item in the
 * collection or array OR every character in the java.lang.String or
 * Javascript string.
 *
 * @example
 * var users = ["Bediako", "Dave", "Loki"];
 *
 * var results = require('collection').map(users, function(_item, _index, _collection) { return "Hello " + _item; });  //this returns a list
 * of "Hello <item>" for every item in users.
 *
 */
exports.map = function(_collection, _function, _this)
{
	if (_collection && _collection.hasNext && _collection.next)
	{
		iterator = _collection;
	}
	else if (_collection && _collection.iterator)
	{
		iterator = Iterator(_collection);
	}

	if (iterator)
	{
		var results = new Packages.java.util.ArrayList(), index = 0;
		
		for (var item in iterator)
		{
			results = results.add(_function && _function.call(_this, item, index, _collection));
			index++;
		}
	}
	else if (_collection && _collection.map)
	{
		var results = _collection.map(_function);
	}
	else if (_collection && _collection.replace)
	{
		var results = Array.map(_collection + "", _function);
	}

	return results;
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @param _collection - a java.util.Collection, a java.lang.String, a
 * Javascript array, or a Javascript string to iterate over.
 * 
 * @param _function - a function that will be applied to every member
 * of that collection or array, OR every character of the
 * java.lang.String or Javascript string.  The function can expect the
 * item/character, index, and collection/string to be passed to it at runtime.
 *
 * The iteration will stop once the all the members of the _collection
 * has been visited OR if the _function ever returns true.
 *
 * @returns returns true if the function returned true for any item
 * it visited.
 * 
 * @example
 * var users = ["Bediako", "Dave", "Loki"];
 *
 * var success = require('collection').every(users, function(_item, _index, _collection) { return true; });
 */
exports.some = function(_collection, _function, _this)
{
	var success = false;

	if (_collection && _collection.hasNext && _collection.next)
	{
		iterator = _collection;
	}
	else if (_collection && _collection.iterator)
	{
		iterator = Iterator(_collection);
	}

	if (iterator)
	{
		var index = 0;

		for (var item in iterator)
		{
			success = _function.call(_this, item, index, _collection);
			if (success === true) { break; } else { index++; }
		}
	}
	else if (_collection && _collection.some)
	{
		success = _collection.some(_function);
	}
	else if (_collection && _collection.replace)
	{
		success = Array.some(_collection + "", _function);
	}

	return success;
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @param _collection - a java.util.Collection, a java.lang.String, a
 * Javascript array, or a Javascript string to iterate over.
 * 
 * @param _function - a function that will be applied to every member
 * of that collection or array, OR every character of the
 * java.lang.String or Javascript string.  The function can expect the
 * item/character, index, and collection/string to be passed to it at runtime.
 *
 * @returns two collections.  The first collection contains the items
 * for which _function returned true, the second collection contains
 * the items for which the function returned false.
 * 
 * @example
 * var users = ["Bediako", "Dave", "Loki"];
 *
 * var [successList, failList] = require('collection').every(users, function(_item, _index, _collection)
 * {
 *	return (_item.length > 4);
 * });  //this returns [["Bediako"], ["Dave", "Loki"]].
 */
exports.split = function(_collection, _function)
{
	var success = [], fail = [];

	if (_collection && _collection.hasNext && _collection.next)
	{
		iterator = _collection;
	}
	else if (_collection && _collection.iterator)
	{
		iterator = Iterator(_collection);
	}

	if (iterator)
	{
		success = new Packages.java.util.ArrayList()
		fail = new Packages.java.util.ArrayList()

		var index = 0;
		for (var item in iterator)
		{
			(_function(item, index, _collection) === true) ? success.add(item) : fail.add(item);
			index++;
		}
	}
	else if (_collection && _collection.push)
	{
		for (var i = 0; i < _collection.length; i++)
		{
			(_function(_collection[i], i, _collection) === true) ? success.push(item) : fail.push(item);
		}
	}
	else if (_collection && _collection.replace)
	{
		Array.forEach(_collection + "", function(_item, _index, _string)
		{
			(_function(_item, _index, _string) === true) ? success.push(_item) : fail.push(_item);
		});
	}
	
	return {success: success, fail: fail};
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @param _collection - a java.util.Collection, a java.lang.String, a
 * Javascript array, or a Javascript string to iterate over.
 * 
 * @param _attribute - the name of the attribute to be examined on the items in 
 * _collection.
 *
 * @returns a value list (java.util.List or Javascript array) and a
 * map (java.util.Map or Javascript object).  The value list contains
 * the set of values that each item in the _collection had on its
 * property _attribute.  The map contains all the values found in the
 * value list and a list of items that had that value on its property
 * named attribute.
 * 
 * @example
 * var users = [{name: "Bediako"}, {name: "Dave"}, {name: "Loki"}
 * {name: "Bediako"}];
 *
 * var [valueList, valueMap] = require('collection').every(users, function(_item, _index, _collection)
 * {
 *	return (_item.length > 4);
 * });  //this returns [["Bediako", "Dave", "Loki"], {"Bediako" : [{name: "Bediako"}, {name: Bediako}], "Dave": [{name: "Dave"}], "Loki": [{name: Loki}]}]
 * 
 */
exports.partition = function(_collection, _attribute)
{
	if (_collection && _collection.hasNext && _collection.next)
	{
		iterator = _collection;
	}
	else if (_collection && _collection.iterator)
	{
		iterator = Iterator(_collection);
	}

	if (iterator)
	{
		var partitionMap = new Packages.java.util.HashMap()
		var orderedKeys = new Packages.java.util.ArrayList()

		for (var item in iterator)
		{
			var value = item[_attribute];

			if (value)
			{
				var list = partitionMap.get(value);

				if (!list)
				{
					list = new Packages.java.util.ArrayList();
					partitionMap.put(value, list);
					orderedKeys.add(value);
				}

				list.add(item);
			}
		}
	}
	else if (_collection && _collection.push)
	{
		var partitionMap = {};
		var orderedKeys = [];

		for (var i =0; i < _collection.length; i++)
		{
			var value = item[_attribute];

			if (value)
			{
				var list = partitionMap[value];

				if (!list)
				{
					list = [];
					partitionMap[value] = list;
					orderedKeys.push(value);
				}

				list.push(item);
			}
		}
	}

	return {keys: orderedKeys, partition: partitionMap};
};

exports.reduce = function(_collection, _function, _initialValue)
{
	var result;
	
	if (_collection && _collection.hasNext && _collection.next)
	{
		iterator = _collection;
	}
	else if (_collection && _collection.iterator)
	{
		iterator = Iterator(_collection);
	}

	if (iterator && iterator.hasNext() === false && util.isDefined(_initialValue) === false)
	{
		throw TypeError('Collection is empty ... Must provide initial value or a non empty collection');
	}
	
	if (iterator)
	{
		var index = 0;
		
		if (util.isDefined(_initialValue) === true)
		{
			result = _initialValue;
		}
		else if (iterator.hasNext() === true)
		{
			result = iterator.next();
			index++;
		}
		
		while (iterator.hasNext() === true)
		{
			result = _function.call(undefined, result, iterator.next(), index, _collection);
			index++;
		}
	}
	else if (_collection && _collection.reduce)
	{
		result = _collection.reduce(_function);
	}
	
	return result;
};

exports.reduceRight = function(_collection, _function, _initialValue)
{
	var collection;

	if (_collection && _collection.hasNext && _collection.next)
	{
		throw Error("Cannot right reduce an iterator");
	}

	if (collection.reverse)
	{
		collection = collection.reverse();
	}
	else if (collection.add && collection.get)
	{
		collection = new Packages.java.util.ArrayList(_collection);
		Packages.java.util.Collections.reverse(collection);
	}

	return this.reduce(collection, _function, _initialValue);
};
