/**
    @namespace Airlift context object.
*/
var airlift;

if (!airlift)
{
	airlift = {};
}
else if (typeof airlift != "object")
{
	throw new Error("airlift already exists and it is not an object");
}

/**
 *
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * 
 * @param _className - a Java class name 
 *
 * @returns - a class 
 *
 * @example
 * 
 * var stringClass = airlift.cc("java.lang.String");
 *
 */
airlift.cc = function(_className)
{
	return Packages.java.lang.Class.forName(_className);
};

/**
 *
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 * * 
 * @param _templateString - an optional legal stringTemplate template string 
 *
 * @returns a stringTemplate object.  If _templateString is provided
 * the stringTemplate object will use this as its template, otherwise
 * the stringTemplate object returned will not yet have a template.
 * You may later associate a template with this object using the
 * setTemplate method.
 *
 * @example
 * var template = airlift.stringTemplate("<$tag$>$value$</$tag$>");
 */

airlift.stringTemplate = function(_templateString)
{
	var stringTemplate  = (airlift.isDefined(_templateString) === true) ? new Packages.org.antlr.stringtemplate.StringTemplate(_templateString) : new Packages.org.antlr.stringtemplate.StringTemplate();

	return stringTemplate;
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
 * has been visited OR if the _function ever returns false.
 *
 * @returns returns true if the function returned true for every item
 * it visited.
 * 
 * @example
 * var users = ["Bediako", "Dave", "Loki"];
 *
 * var success = airlift.every(users, function(_item, _index, _collection) { return true; });
 */
airlift.every = function(_collection, _function)
{
	var success = true;
	
	if (_collection && _collection.add)
	{
		var index = 0;
		
		for (var item in Iterator(_collection))
		{
			success = _function(item, index, _collection);
			if (success === false) { break; } else { index++; }
		}
	}
	else if (_collection && _collection.push)
	{
		success = _collection.every(_function);
	}
	else if (_collection)
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
 * Javascript array, or a Javascript string to iterate over.
 * 
 * @param _function - a function that will be applied to every member
 * of that collection or array, OR every character of the
 * java.lang.String or Javascript string.  The function can expect the
 * item/character, index, and collection/string to be passed to it at runtime.
 *
 * @example
 * var users = ["Bediako", "Dave", "Loki"];
 *
 * airlift.forEach(users, function(_item, _index, _collection) { LOG.info("Hello " + _item); });
 * //this writes "Hello <item>" to the logs.
 */
airlift.forEach = function(_collection, _function)
{
	if (_collection && _collection.add)
	{
		var index = 0;

		for (var item in Iterator(_collection))
		{
			_function && _function(item, index, _collection);
			index++;
		}
	}
	else if (_collection && _collection.push)
	{
		_collection.forEach(_function);
	}
	else if (_collection)
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
 * var results = airlift.filter(users, function(_item, _index, _collection) { return true; });  //this returns every item in users.
 *
 */
airlift.filterCollection = function(_collection, _function)
{
	if (_collection && _collection.add)
	{
		var result = airlift.l();

		if (airlift.isDefined(_collection) === true)
		{
			var index = 0;
			for (var item in Iterator(_collection))
			{
				_function && (_function(item, index, _collection) === true) && result.add(item);
				index++;
			}
		}
	}
	else if (_collection && _collection.push)
	{
		var result = _collection.filter(_function);
	}
	else if (_collection)
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
 * var results = airlift.map(users, function(_item, _index, _collection) { return "Hello " + _item; });  //this returns a list
 * of "Hello <item>" for every item in users.
 *
 */
airlift.map = function(_collection, _function)
{
	if (_collection && _collection.add)
	{
		var results = airlift.l();

		if (airlift.isDefined(_collection) === true)
		{
			var index = 0;
			for (var item in Iterator(_collection))
			{
				results = results.add(_function && _function(item, index, _collection));
				index++;
			}
		}
	}
	else if (_collection && _collection.push)
	{
		var results = _collection.map(_function);
	}
	else if (_collection)
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
 * var success = airlift.every(users, function(_item, _index, _collection) { return true; });
 */
airlift.some = function(_collection, _function)
{
	var success = false;

	if (_collection && _collection.add)
	{
		var index = 0;

		for (var item in Iterator(_collection))
		{
			success = _function(item, index, _collection);
			if (success === true) { break; } else { index++; }
		}
	}
	else if (_collection && _collection.push)
	{
		success = _collection.some(_function);
	}
	else if (_collection)
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
 * var [successList, failList] = airlift.every(users, function(_item, _index, _collection)
 * {
 *	return (_item.length > 4);
 * });  //this returns [["Bediako"], ["Dave", "Loki"]].
 */
airlift.split = function(_collection, _function)
{
	if (_collection && _function && _collection.add)
	{
		var success = airlift.l();
		var fail = airlift.l();

		var index = 0;
		for (var item in Iterator(_collection))
		{
			(_function(item, index, _collection) === true) ? success.add(item) : fail.add(item);
			index++;
		}
	}
	else if (_collection && _collection.push)
	{
		var success = [];
		var fail = [];
		
		for (var i = 0; i < _collection.length; i++)
		{
			(_function(_collection[i], i, _collection) === true) ? success.push(item) : fail.push(item);
		}
	}
	else
	{
		var success = [];
		var fail = [];

		Array.forEach(_collection + "", function(_item, _index, _string)
		{
			(_function(_item, _index, _string) === true) ? success.push(_item) : fail.push(_item);
		});
	}

	return [success, fail];
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
 * var [valueList, valueMap] = airlift.every(users, function(_item, _index, _collection)
 * {
 *	return (_item.length > 4);
 * });  //this returns [["Bediako", "Dave", "Loki"], {"Bediako" : [{name: "Bediako"}, {name: Bediako}], "Dave": [{name: "Dave"}], "Loki": [{name: Loki}]}]
 * 
 */
airlift.partition = function(_collection, _attribute)
{
	if (_collection && _collection.add)
	{
		var partitionMap = airlift.m();
		var orderedKeys = airlift.l();

		for (var item in Iterator(_collection))
		{
			var value = item[_attribute];

			if (value)
			{
				var list = partition.get(value);

				if (list)
				{
					list = airlift.l();
					partitionMap.put(value, list);
					orderedKeys.add(value);
				}

				list.add(item);
			}
		}
	}
	else if (_collection && _collection.add)
	{
		var partitionMap = {};
		var orderedKeys = [];

		for (var i =0; i < _collection.length; i++)
		{
			var value = item[_attribute];

			if (value)
			{
				var list = partition[value];

				if (list)
				{
					list = [];
					partitionMap[value] = list;
					orderedKeys.push(value);
				}

				list.push(item);
			}
		}
	}

	return [orderedKeys, partitionMap];
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @see airlift.l()
 *
 */
airlift.arrayList = function(_collection)
{
	return (_collection && airlift.l(_collection)) || airlift.l();
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @param _list - java.util.Collection
 *
 * @returns an enhanced java.util.List
 *
 * @description Enhanced java.util.List has Javascript array iterative functions
 * every, filter, forEach, map, and some, as well as other array
 * methods like pop, push, reverse, shift, unshift, slice,
 * splice, sort
 *
 * They also support @see airlift.split and @see airlift.partition
 *
 * They also have shortcut functions g() for get(), and chainable a() for add().
 *
 * Finally enhanced lists have the function i() which returns a
 * Javascript Iterator.
 * 
 * @example
 * var list = airlift.l();
 *
 * //or
 * var list = airlift.l(new Packages.java.util.ArrayList());
 * 
 * //or
 * var list = airlift.l(new Packages.java.util.HashSet());
 * 
 * //or
 * var arrayList = new Packages.java.util.ArrayList();
 * arrayList.add("Bediako");
 *
 * var list = airlift.l(arrayList);
 * var bediako = list.g(0) //now bediako is "Bediako"
 *
 * //adding things to a list
 * var list = airlift.l().a("Bediako").a("George");
 * //list now contains ["Bediako", "George"];
 *
 * //iterating over an enhanced list
 * for (var name in Iterator(list)) { LOG.info(name); }
 *
 * //or
 * for (var name in list.i()) { LOG.info(name); }
 *
 */
airlift.l = function(_collection)
{
	var list = {};

	list.a = function(_value)
	{
		this.add(_value);
		return list;
	};

	list.g = function(_index)
	{
		//Does this list return a active record or just a collection of
		//Java adapters.
		return this.get(_index);
	};

	list.forEach = function(_function)
	{
		airlift.every(list, _function);
		return list;
	};

	list.pop = function()
	{		
		return (this.isEmpty() === false) ? this.remove(this.size() - 1) : undefined;
	};

	list.push = function(_item)
	{		
		this.add(_item);
		return this.size();
	};

	list.reverse = function()
	{
		var leftToRightPointer = 0;
		var rightToLeftPointer = (this.isEmpty() === false) ? this.size() - 1 : 0;

		var swap = function(_list, _leftToRightPointer, _rightToLeftPointer)
		{
			var item = _list.get(_leftToRightPointer);
			_list.set(_leftToRightPointer, _list.get(_rightToLeftPointer));
			_list.set(_rightToLeftPointer, item);
		}
		
		while (leftToRightPointer < rightToLeftPointer)
		{
			swap(this, leftToRightPointer, rightToLeftPointer);
			leftToRightPointer++;
			rightToLeftPointer--;
		}
	};

	list.shift = function()
	{
		return this.remove(0);
	};

	list.slice = function(_start, _end)
	{
		var start = (_start < 0 && (_start + this.size()))||_start;
		var end = (airlift.isDefined(_end) === true) ? (end < 0) ? end + this.size() : end : this.size();

		var newList;
		
		if (start >= this.size())
		{
			newList = airlift.l();
		}
		else
		{
			newList = airlift.l(this.subList(start, end));
		}

		return newList;
	};

	list.sort = function(_comparator)
	{
		var comparator = { compare : _comparator };
		var treeSet = new Packages.java.util.TreeSet(new Packages.java.util.Comparator(comparator));
		var iterator = this.iterator();
		
		while (iterator.hasNext() === true)
		{
			var item = iterator.next();
			treeSet.add(item);
			iterator.remove();
		}

		this.addAll(treeSet);
	};
	
	list.splice = function(_start, _deleteCount)
	{
		var deleteCount = _deleteCount;
		var deletedElements = airlift.l();
		var insertCount = arguments.length - 2;

		for (var i = 0; i < deleteCount; i++)
		{
			deletedElements.a(this.remove(_start));
		}

		for (var i = 0; i < insertCount; i++)
		{
			this.add(_start, arguments[i + 2]);
		}

		return deletedElements;
	};

	list.unshift = function(_item)
	{
		this.add(0, _item);
		return this.size();
	};

	list.every = function(_function)
	{
		return airlift.every(list, _function);
	}

	list.filter = function(_function)
	{
		return airlift.filterCollection(list, _function);
	}

	list.map = function(_function)
	{
		return airlift.map(list, _function);
	}

	list.some = function(_function)
	{
		return airlift.some(list, _function);
	}
	
	list.partition = function(_attribute)
	{
		return airlift.partition(list, _attribute);
	};

	list.split = function(_function)
	{
		return airlift.split(list, _function);
	};

	list.__iterator__ = function()
	{
		var myIterator = {};

		myIterator.iterator = this.iterator();

		myIterator.next = function()
		{
			var next;

			if (myIterator.iterator.hasNext() === true)
			{
				next =  myIterator.iterator.next();
			}
			else
			{
				throw new StopIteration();
			}

			return next;
		}

		return myIterator;
	};

	list.i = function()
	{
		return Iterator(list);
	};

	list = new JavaAdapter(Packages.java.util.ArrayList, list);

	if (airlift.isDefined(_collection) === true)
	{
		list.addAll(_collection);
	}

	return list;
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @see airlift.s
 *
 */
airlift.hashSet = function(_collection)
{
	return (_collection && airlift.s(_collection)) || airlift.s();
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @param _collection - java.util.Collection
 *
 * @returns an enhanced java.util.Set
 * Enhanced java.util.Set has Javascript array iterative functions
 * every, filter, forEach, map, and some.
 *
 * They also support @see airlift.split and @see airlift.partition
 *
 * They also have chainable shortcut functions a() for add().
 *
 * Finally enhanced lists have the function i() which returns a
 * Javascript Iterator.
 *
 * @example
 * var set = airlift.s();
 *
 * //or
 * var set = airlift.s(new Packages.java.util.ArrayList());
 * 
 * //or
 * var hashSet = new Packages.java.util.HashSet();
 * hashSet.add("Bediako");
 *
 * var set = airlift.s(hashSet); //set now has "Bediako"
 *
 * //adding things to a set
 * var set = airlift.s().a("Bediako").a("George");
 * //set now contains ["Bediako", "George"]
 *
 * //iterating over an enhanced set
 * for (var name in Iterator(set)) { LOG.info(name); }
 *
 * //or
 * for (var name in set.i()) { LOG.info(name); }
 *
 */
airlift.s = function(_set)
{
	var set = {};

	set.a = function(_value)
	{
		this.add(_value);
		return this;
	};

	set.forEach = function(_function)
	{
		airlift.every(set, _function);
	};

	set.every = function(_function)
	{
		return airlift.every(set, _function);
	}

	set.filter = function(_function)
	{
		return airlift.filterCollection(set, _function);
	}

	set.map = function(_function)
	{
		return airlift.map(set, _function);
	}

	set.some = function(_function)
	{
		return airlift.some(set, _function);
	}

	set.partition = function(_attribute)
	{
		return airlift.partition(set, _attribute);
	};

	set.split = function(_function)
	{
		return airlift.split(set, _function);
	};

	set.__iterator__ = function()
	{
		var myIterator = {};

		myIterator.iterator = this.iterator();

		myIterator.next = function()
		{
			var next;

			if (myIterator.iterator.hasNext() === true)
			{
				next =  myIterator.iterator.next();
			}
			else
			{
				throw new StopIteration();
			}

			return next;
		}

		return myIterator;
	};

	set.i = function()
	{
		return Iterator(set);
	};

	set = new JavaAdapter(Packages.java.util.HashSet, set);

	if (airlift.isDefined(_set) === true)
	{
		set.addAll(_set);
	}

	return set;
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @see airlift.m
 *
 */
airlift.hashMap = function(_map)
{
	return (_map && airlift.m(_map)) || airlift.m();
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @param _map - java.util.Map
 *
 * @returns an enhanced java.util.Map
 *
 * Enhanced maps contain chainable shorthand method p(_key, _value) for
 * put(_key, _value) and shorthand method g(_key) for get(_key);
 *
 * Finally enhanced maps have the function i() which returns a
 * Javascript Iterator.
 *
 * @example
 * var map = airlift.m();
 *
 * //or
 * var map = airlift.m(new Packages.java.util.HashMap());
 * 
 * //or
 * var hashMap = new Packages.java.util.HashMap();
 * hashMap.put("Bediako", "42");
 *
 * var map = airlift.m(hashMap); //map now has {"Bediako", "42"}
 *
 * //iterating over an enhanced map
 * for (var entry in Iterator(map.entrySet())) { LOG.info(name); }
 *
 * //or this is the same as above
 * for (var name in map.i()) { LOG.info(name); }
 *
 */
airlift.m = function(_map)
{
	var map = {};

	map.p = function(_key, _value)
	{
		this.put(_key, _value);
		return this;
	};

	map.g = function(_key)
	{
		return this.get(_key);
	};

	map.i = function()
	{
		return Iterator(this.entrySet().iterator());
	};

	map = new JavaAdapter(Packages.java.util.HashMap, map);

	if (airlift.isDefined(_map) === true)
	{
		map.putAll(_map);
	}

	return map;
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @param _javaType - the java class name or type for this array
 * @param _size - the number of slots allocated for this array
 *
 * @returns a Java array of type _javaType and length _size.
 *
 * @example
 * var stringArray = airlift.a("java.lang.String", 10);
 *
 */
airlift.a = function(_javaType, _size)
{
	return Packages.java.lang.reflect.Array.newInstance(_javaType, _size);
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @param _length - the length of the unique id to be generated
 *
 * @returns a randomly generated string of length _length
 *
 * @example
 * var guid = airlift.g(10); //might return "12a34bf77a"
 */
airlift.g = function(_length)
{
	if (_length) { var id = Packages.airlift.util.IdGenerator.generate(_length); }
	else { var id = Packages.airlift.util.IdGenerator.generate(); }

	return id; 
};


/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @returns a new Packages.airlift.MessageManager()
 *
 * @example
 * var messageManager = airlift.mm();
 */
airlift.mm = function()
{
	return new Packages.airlift.MessageManager();
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * Post an active record based on domain URI and rest context.
 * post accepts functions in its argument list that are run after
 * syntactic validation but before insertion into the persistent store.
 * 
 * @param _domainName is an optional parameter. If not provided post
 * will use the GLOBAL context variable DOMAIN_NAME provided by the
 * handler context.  DOMAIN_NAME is derived from the URI.
 *
 * @returns a newly created activerecord for the resource identified by
 * _domainName (or DOMAIN_NAME is _domainName is not defined)
 * @returns a map of validation and conversion errors discovered while
 * processing the parameter values from the request map and/or the URI
 * @returns the newly created id for the persisted active record.
 *
 * @example
 * var setName = function(_activeRecord, _errorMap) { if (_errorMap.isEmpty() ===
 * true) { _activeRecord.name = "Bediako"; }
 *
 * var [activeRecord, errorMap, id] = airlift.post("user", setName);
 *
 * //or
 *
 * var [activeRecord, errorMap, id] = airlift.post(setName);
 */
airlift.post = function(_config)
{
	if (typeof _config === 'function')
	{
		var config = {};
		var after = [];
		for (var i = 0; i < arguments.length; i++) { after.push(arguments[i]); }
	}
	else
	{
		var config = _config||{};
		var after = config.after||[];
	}

	var [activeRecord, errorMap] = airlift.populate(config);

	if (activeRecord.error === true)
	{
		activeRecord["id"] =  airlift.g();
	}

	after.forEach(function(_function) { _function(activeRecord, errorMap); });
	
	if (activeRecord.error === false)
	{
		activeRecord.insert();
	}

	return [activeRecord, errorMap, activeRecord["id"]];
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * Put an active record based on domain URI and rest context.
 * put accepts functions in its argument list that are run after
 * syntactic validation but before update into the persistent store.
 * 
 * @param _domainName is an optional parameter. If not provided post
 * will use the GLOBAL context variable DOMAIN_NAME provided by the
 * handler context.  DOMAIN_NAME is derived from the URI.
 *
 * @returns a newly created activerecord for the resource identified by
 * _domainName (or DOMAIN_NAME is _domainName is not defined)
 * @returns a map of validation and conversion errors discovered while
 * processing the parameter values from the request map and/or the URI
 *
 * @example
 * var setName = function(_activeRecord, _errorMap) { if (_errorMap.isEmpty() ===
 * true) { _activeRecord.name = "Bediako"; }
 *
 * var [activeRecord, errorMap] = airlift.put("user", setName);
 *
 * //or
 *
 * var [activeRecord, errorMap] = airlift.put(setName);
 */
airlift.put = function(_config)
{
	if (typeof _config === 'function')
	{
		var config = {};
		var after = [];
		for (var i = 0; i < arguments.length; i++) { after.push(arguments[i]); }
	}
	else
	{
		var config = _config||{};
		var after = config.after||[];
	}

	var [activeRecord, errorMap] = airlift.populate(config);

	after.forEach(function(_function) { _function(activeRecord, errorMap); });
	
	if (activeRecord.error === false)
	{
		activeRecord.update();
	}

	return [activeRecord, errorMap];
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * Delete an active record based on domain URI and rest context.
 * delete accepts functions in its argument list that are run after
 * syntactic validation but before insertion into the persistent store.
 * 
 * @param _id is the identifier of the active record to be deleted from
 * the persistent store.
 *
 * @param _domainName is an optional parameter. If not provided post
 * will use the GLOBAL context variable DOMAIN_NAME provided by the
 * handler context.  DOMAIN_NAME is derived from the URI.
 *
 * @example
 *
 * airlift.del("12hgh23", "user");
 *
 */
airlift.del = function(_config)
{
	var config = _config||{};
	var id = config.id||ID;
	
	var activeRecord = airlift.ar(config.domainName);

	activeRecord.id = id;

	activeRecord.del();
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @see airlift.del()
 *
 */
airlift["delete"] = function(_config)
{
	airlift.del(_config);
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @param _variable - the variable to check to see if it is defined
 *
 * @returns true if defined false otherwise
 *
 * @example
 * var test;
 * if (airlift.isDefined(test) === true) { LOG.info("test is defined"); else {
 * LOG.info("test is not defined"); } will log that "test is not
 * defined".
 */
airlift.isDefined = function(_variable)
{
	var defined = (_variable !== null && _variable !== undefined);

	return defined;
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @param _variable - the variable to check to see if it is not defined
 *
 * @returns false if defined true otherwise
 *
 * @example
 * var test;
 * if (airlift.notDefined(test) === true) { LOG.info("test is not defined"); else {
 * LOG.info("test is defined"); } will log that "test is not
 * defined".
 */

airlift.notDefined = function(_variable)
{
	var notDefined = (_variable === null || _variable === undefined);

	return notDefined;
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @see airlift.g()
 */

airlift.guid = function()
{
	return airlift.g();
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @param _string is the string to provide a SHA1 has for.
 *
 * @returns SHA1 hash of _string
 *
 * @example
 * var hash = airlift.hash("Bediako");
 */
airlift.hash = function(_string)
{
	return Packages.airlift.util.IdGenerator.hash("SHA1", _string);
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @param _string - the initial string the java.lang.StringBuffer
 * should optionally be based on.
 *
 * @returns a java.lang.StringBuffer based on _string if it is defined, otherwise
 * a blank java.lang.StringBuffer.
 *
 * @example
 * var javaStringBuffer = airlift.stringBuffer("Hello Bediako");
 * 
 */
airlift.sb = function(_string)
{
	return (_string && new Packages.java.lang.StringBuffer(_string)) || new Packages.java.lang.StringBuffer();
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @param _string - the initial string the java.lang.String
 * should optionally be based on.
 *
 * @returns a java.lang.String based on _string if it is defined, otherwise
 * a blank java.lang.String.
 *
 * @example
 * var javaString = airlift.string("Hello Bediako");
 *
 */
airlift.string = function(_string)
{
	return (airlift.isDefined(_string) === true) ? new Packages.java.lang.String(_string) : new Packages.java.lang.String();
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @param _integer - the initial integer the java.lang.Integer
 * should optionally be based on.
 *
 * @returns a java.lang.Integer based on _integer if it is defined, otherwise
 * a java.lang.Integer of value 0.
 *
 * @example
 * var result = airlift.integer(42);
 *
 */

airlift.integer = function(_integer)
{
	return (airlift.isDefined(_integer) === true) ? new Packages.java.lang.Integer(_integer) : new Packages.java.lang.Integer();
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @see airlift.string
 *
 */
airlift.toJavaString = function(_string)
{
	return airlift.string(_string);
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * An appender makes it easy to create delimited lists ... Its use help
 * avoid the trailing delimiter problem.
 * 
 * @param _initialText - the first text to be applied.
 * @param _delimiter - the delimiter to be used to separate parts of
 * the text string
 *
 * @returns a string delimited by _delimiter 
 *
 * @example
 *
 * var record = airlift.appender("Bediako", ",");
 *
 * record.append("42");
 * record.append("6'1\"");
 *
 * var record = record.toString() //"Bediako, 42, 6'1\""
 *
 */
airlift.appender = function(_initialText, _delimiter)
{
	var delimiter = (airlift.isDefined(_delimiter) === true) ? _delimiter : ",";
	var initialText = (airlift.isDefined(_initialText) === true) ? _initialText : "";

	var appender = {
		text: initialText,
		delimiter: delimiter,	  

		append: function(_appendee)
			  {
				  this.text += this.delimiter + _appendee;
			  },

		toString: function()
			  {
				  return this.text;
			  },

		reset: function()
			  {
				  this.text = "";
				  this.delimiter = "";
				  this.firstAppend = true;
			  }
	};

	return appender;
};


/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @param _resourceName - name of the Java property file resource,
 * @param _propertyName - name of the property whose value is to be
 * retrieved.
 *
 * @returns the value of referred to by property name _propertyName in
 * resource _resourceName
 *
 * @example
 * var cacheTimeOut = airlift.getPropertyValue("startup.properties,
 * "cacheTimeOut");
 *
 */
airlift.getPropertyValue = function(_resourceName, _propertyName)
{
	return Packages.airlift.util.PropertyUtil.getInstance().getProperty(_resourceName, _propertyName);
};


/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @param an argument list of collections
 *
 * @returns a new collection that has all the members of the passed in
 * collections as its members.
 *
 * @example
 * var customerList = airlift.l().a("Bediako").a("Connor").a("Loki");
 * var storeSet = airlift.s().a("Amazon").a("Zappos").a("Macy's");
 * var customersAndStores = airlift.mergeCollections(customerList,
 * storeSet);
 *
 */
airlift.mergeCollections = function()
{
	var collection = airlift.l();

	for (var i = 0; i < arguments.length; i++)
	{
		if (airlift.isDefined(arguments[i]) === true)
		{
			collection.addAll(arguments[i]);
		}
	}

	return collection;
};


/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @param _source - the source object to copy from.
 * @param _destination - the destination object to copy to
 * @param _propertyArray - the enhanced list or Javascript array of
 * properties that should be copied from the source to the destination
 * object.
 *
 * @example
 * airlift.copy(person, employee, ["firstName", "lastName", "age"]);
 *
 */
airlift.copy = function(_source, _destination, _propertyArray)
{
	_propertyArray.forEach(function (_e, _i, _a) { _destination[_e] = _source[_e]; });
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @requires
 *
 * @param _string - the string to be tokenized into NGrams
 *
 * @returns a list of ngrams of the given string
 *
 * @example
 * var ngramTokenList = airlift.tokenizeIntoNGrams("Bediako");
 *
 */
airlift.tokenizeIntoNGrams = function(_string)
{
	//Make sure string is a string and make sure it is in all lowercase
	//...
	var string = (airlift.isDefined(_string) === true) ? _string.toString().toLowerCase() : "";

	var indexList = airlift.l();
	var standardTokenizer = new Packages.org.apache.lucene.analysis.standard.StandardTokenizer(Packages.org.apache.lucene.util.Version.LUCENE_30, new Packages.java.io.StringReader(string));
	var standardTermAttribute = standardTokenizer.addAttribute(Packages.java.lang.Class.forName("org.apache.lucene.analysis.tokenattributes.TermAttribute"));

	while (standardTokenizer.incrementToken() === true)
	{
		var term = standardTermAttribute.term();
		indexList.add(term);

		var tokenizer = new Packages.org.apache.lucene.analysis.ngram.EdgeNGramTokenizer(new Packages.java.io.StringReader(term), "front", 3, 15);
		var termAttribute = tokenizer.addAttribute(Packages.java.lang.Class.forName("org.apache.lucene.analysis.tokenattributes.TermAttribute"));

		tokenizer.reset();

		while (tokenizer.incrementToken() === true)
		{
			indexList.add(termAttribute.term());
		}
	}

	return indexList;
};


/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @description  This function prepares a calendar object for indexing
 *
 * @param _calendar - the date that is to be indexed
 * @param _attributeName - the name of the active record attribute this
 * calendar came from.
 * @param _datePart - the name of the calendar part that is to be index
 *
 * @returns a string which could be added to the list of tokens to be
 * indexed into the domain index field.
 *
 * @example
 * var indexedToken = airlift.prepareForDateSearch(calendar, "auditPutDate", "year");
 *
 */
airlift.prepareForDateSearch = function(_calendar, _attributeName, _datePart)
{
	var name = (airlift.isDefined(_attributeName) === true) ? (_attributeName.toLowerCase() + "-") : "";

	if ("month".equalsIgnoreCase(_datePart) === true )
	{
		var datePart = "month-";
		var getter = "MONTH";
	}
	else if ("year".equalsIgnoreCase(_datePart) === true)
	{
		var datePart = "year-";
		var getter = "YEAR";
	}
	else if ("date".equalsIgnoreCase(_datePart) === true)
	{
		var datePart = "date-";
		var getter = "DAY_OF_MONTH";
	}

	return name + datePart + _calendar.get(_calendar[getter]);
};


/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @description This method relies on airlift.prepareForDateSearch to
 * tokenize a date into month, day, and year tokens.
 *
 * @param _date - the date to be tokenized
 * @param _name - the property name this token is associated with.
 *
 * @returns tokenized date parts of the month, year, and day.
 *
 * @example
 * var tokenizedDateParts = airlift.tokenizeIntoDateParts(date, "auditPutDate");
 *
 */
airlift.tokenizeIntoDateParts = function(_date, _name)
{
	var indexList = airlift.l();

	if (_date)
	{
		//works for java.util.Date and for Date
		var calendar = airlift.createCalendar({date: _date});
		indexList.add(airlift.prepareForDateSearch(calendar, _name, "year"));
		indexList.add(airlift.prepareForDateSearch(calendar, _name, "month"));
		indexList.add(airlift.prepareForDateSearch(calendar, _name, "date"));
	}

	return indexList;
};


/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @description This function returns the enumeration of months that
 * occur between two dates
 *
 * @param _date1 - start date
 * @param _date2 - end date
 *
 * @returns the months in numeric format between two dates
 *
 * @example
 * var monthIntervals = airlift.getMonthIntervals(date1, date2); //if
 * date1 is in December 2010 and date2 is March 2011 the month
 * intervals is [12, 1, 2, 3]  
 *
 */
airlift.getMonthIntervals = function(_date1, _date2)
{
	var monthList = airlift.l();

	if (_date1 && _date2)
	{
		//works for java.util.Date and for Date
		var date1 = airlift.createCalendar({date: _date1});
		var date2 = airlift.createCalendar({date: _date2});

		var startDate = (date1.getTimeInMillis() < date2.getTimeInMillis()) ? date1 : date2;
		var endDate = (date1.getTimeInMillis() >= date2.getTimeInMillis()) ? date1 : date2;

		var interval = airlift.createCalendar({date: startDate.getTime()});
		interval.set(interval.DAY_OF_MONTH, 1);

		while (interval.getTimeInMillis() < endDate.getTimeInMillis())
		{
			var month = interval.get(interval.MONTH);

			var fullYear = interval.get(interval.YEAR);

			monthList.add(interval);

			interval = airlift.createCalendar({date: interval.getTime()});

			var nextMonth = month + 1;

			var nextYear = fullYear + 1;

			interval.set(interval.MONTH, (((nextMonth) > 11) ? 0 : nextMonth));
			interval.set(interval.YEAR, (interval.get(interval.MONTH) === 0) ? nextYear : fullYear);
		}
	}

	return monthList;
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @description - This function compares properties of each active
 * record in an array of active records with a search string and a
 * date interval. If the properties match the search criteria and a
 * specified date property falls in between the provide date interval,
 * the active record is returned along with other matching active
 * records in an array.  Useful for performing natural language like
 * searches against an array, an Iterable, an Iterator, or an enhanced
 * list or set of active records.
 *
 * @param _config - a config object that provides the following
 * properties ...
 * 
 * <p> _config.filterString - the string of tokens to filter this
 * result on.</p>
 * 
 * <p>_config.resultArray the list of active records.</p>
 *
 * <p>_config.propertyArray - An array of properties of the array of
 * objects the search is to be performed on.</p>
 *
 * <p>_config.startDate - a JavaScript Date or java.util.Date that
 * marks the beginning of the date interval.</p>
 *
 * <p>_config.endDate - a JavaScript Date or java.util.Date that
 * marks the end of the date interval.</p>
 *
 * <p>_config.dateFieldName the optional name of the property that
 * contains the date that should fall between the _config.startDate and
 * the _config.endDate.  If not provided this defaults to the
 * auditPutDate of the active record.</p>
 *
 * @returns an array of active records that have properties that match
 * at least partially the words in the filter string and have the
 * specified date field property that falls in between the provided
 * date interval
 *
 * @example
 * var resultArray = [{firstName: "Bediako", lastName: "George", recordDate:
 * new Date(10-14-2011")}, {firstName: "Loki", lastName:
 * "George", recordDate: new Date(10-14-2010")}, {firstName:
 * "Connor", lastName: "George", recordDate:
 * new Date(12-14-2011")}];
 *
 * var resultArray = airlift.filter({filterString: "George",
 * propertyArray: ["firstName", "lastName"], resultArray: resultArray,
 * dateFieldName: "recordDate", startDate: new Date("11-01-2011"),
 * endDate: new Date("01-01-2012")});
 *
 * //this should return {firstName: "Connor", lastName: "George",
 * //recordDate:  new Date(12-14-2011")}
 *
 */
airlift.filter = function(_config)
{
	var config = _config||{};
	
	var filterString = config.filterString;
	var propertyArray = config.propertyArray;
	var resultArray = config.resultArray||[];
	var dateFieldName = config.dateFieldName||"auditPutDate";
	var startDate = config.startDate;
	var endDate = config.endDate||airlift.createDate();
	
	var hasFilterTokens = true;
	var inInterval = true;
	var filteredArray = [];

	var filterTokens = airlift.tokenizeIntoNGrams(filterString);

	var filterFunction = function(_item)
	{
		LOG.info("start date time: " + startDate.getTime());
		LOG.info("target date time: " + (_item[dateFieldName] && _item[dateFieldName].getTime()));
		LOG.info("end date time: " + endDate.getTime());
		
		if ((startDate && endDate && dateFieldName) &&
			  (
			   _item[dateFieldName] && _item[dateFieldName].getTime() < startDate.getTime() ||
			   _item[dateFieldName] && _item[dateFieldName].getTime() > endDate.getTime()
			  )
		   )
		{
			inInterval = false;
		}
		else
		{
			inInterval = true;
		}

		if (filterTokens.isEmpty() === false)
		{			
			var indexSet = airlift.s();

			propertyArray.forEach(function(_property)
			{
				var newTokenSet = airlift.tokenizeIntoNGrams(_item[_property]);
				indexSet.addAll(newTokenSet);
			});

			indexSet.retainAll(filterTokens);

			hasFilterTokens = (indexSet.isEmpty() === false);
		}

		if (hasFilterTokens === true && inInterval === true) { filteredArray.push(_item); }
	}

	if (resultArray.hasNext || resultArray.iterator)
	{
		//This is an java.util.Iterator, java.util.Iterable
		for (var item in Iterator(resultArray))
		{
			filterFunction(item);
		}
	}
	else
	//Javascript array.
	{
		resultArray.forEach(filterFunction);
	}

	return filteredArray;
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @description Returns the Google memcache service object.
 *
 * @returns com.google.appengine.api.memcache.MemcacheService
 *
 * @example
 * var cache = airlift.getCacheService();
 *
 */
airlift.getCacheService = function()
{
	return Packages.com.google.appengine.api.memcache.MemcacheServiceFactory.getMemcacheService();
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @description returns the corresponding java.util.TimeZone object for
 * a given _timeZoneString
 *
 * @param _timeZoneString - a valid time zone string
 *
 * @returns java.util.TimeZone
 *
 * @example
 * var timezone = airlift.createTimeZone("America/New_York");
 *
 * @see java.util.TimeZone
 */
airlift.createTimeZone = function(_timeZoneString)
{
	return new Packages.java.util.TimeZone.getTimeZone(_timeZoneString);
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @description creates a java.util.Date object
 *
 * @param _config - the config parameters as expected by
 * airlift.createCalendar()
 *
 * @returns java.util.Date
 *
 * @example
 * var date = airlift.createDate();
 *
 * @see airlift.createCalendar();
 *
 */
airlift.createDate = function(_config)
{
	var calendar = airlift.createCalendar(_config);
	return calendar.getTime();
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @description Creates a new java.util.Date object from another
 * java.util.Date or Javascript Date object.
 *
 * @param _date - the java.util.Date or Javascript Date object to be
 * cloned.
 *
 * @returns a java.util.Date object that is the same time as the passed
 * in date.
 *
 * @example
 * var date = new Date();
 * var clonedDate = airlift.cloneDate(date);
 *
 * var date = airlift.createDate();
 * var clonedDate = airlift.cloneDate(date); 
 */
airlift.cloneDate = function(_date)
{
	return new Packages.java.util.Date(_date.getTime());
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @description - a function for encrypting an array of bytes.  This
 * function is not really expected to be used by developers.  Instead
 * the encryption of a field is specified using the encryption
 * attribute on airlift's Persistable annotation.
 *
 * @param _initialBytes - the byte array to encrypt
 * @param _password - the password to be used to decrypt these bytes
 * @param _initialVector - the encryption vector
 * @param _algorithm - the object holding information on the  encryption
 * algorithm to be used.  This maps to any of the Java 6 packaged standard
 * encyption algorithms.  The following options can be set ...
 * @param _algorithm.provider - the name of the encryption algorithm
 * provider
 * @param _algorithm.name - the name of the alogirthm
 * @param _algorithm.mode
 * @param _algorithm.padding
 * @param _algorithm.revolutions - the number of times this encryption
 * algorithm should be repeated. 
 *
 * @returns an encrypted byte array.
 *
 * @example
 * var fullNameEncrypted =
 * airlift.encrypt(airlift.string("Bediako").toBytes(), "password123", "Batman and Robin", "SunJCE", "AES", "PCBC", "PKCS5PADDING", 20);
 *
 */
airlift.encrypt = function(_initialBytes, _password, _initialVector, _algorithm)
{
	var algorithm = _algorithm||{};
	var provider = algorithm.provider||null;
	var name = algorithm.name||null;
	var mode = algorithm.mode||null;
	var padding = algorithm.padding||null;
	var revolutions = algorithm.revolutions||null;

	return Packages.airlift.util.AirliftUtil.encrypt(_initialBytes, _password, _initialVector, provider, name, mode, padding, revolutions)
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @description - a function for decrypting an array of bytes.  This
 * function is not really expected to be used by developers.  Instead
 * the decryption of a field is specified using the encryption
 * attribute on airlift's Persistable annotation.
 *
 * @param _initialBytes - the byte array to encrypt
 * @param _password - the password to be used to decrypt these bytes
 * @param _initialVector - the encryption vector
 * @param _algorithm - the object holding information on the  encryption
 * algorithm to be used.  This maps to any of the Java 6 packaged standard
 * encyption algorithms.  The following options can be set ...
 * @param _algorithm.provider - the name of the encryption algorithm
 * provider
 * @param _algorithm.name - the name of the algorithm
 * @param _algorithm.mode
 * @param _algorithm.padding
 * @param _algorithm.revolutions - the number of times this encryption
 * algorithm should be repeated. 
 *
 * @returns the unencrypted byte array
 *
 * @example
 * airlift.decrypt(byteArray, "password123", "Batman and Robin", "SunJCE", "AES", "PCBC", "PKCS5PADDING", 20);
 */
airlift.decrypt = function(_initialBytes, _password, _initialVector, _algorithm)
{
	var algorithm = _algorithm||{};
	var provider = algorithm.provider||null;
	var name = algorithm.name||null;
	var mode = algorithm.mode||null;
	var padding = algorithm.padding||null;
	var revolutions = algorithm.revolutions||null;

	return Packages.airlift.util.AirliftUtil.decrypt(_initialBytes, _password, _initialVector, provider, name, mode, padding, revolutions)
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @description - Creates a Java array of the specified size and type.
 * If an initialization array is provided tht contents of that array
 * are copied to the Java array.
 *
 * @param _size - the initial size of the array.
 * @param _type - the Java type of the array
 * @param _initializer - an array of values that should be copied to
 * the array.
 *
 * @returns a Java type array
 *
 * @example
 * var stringArray = airlift.createArray(3, "java.lang.String",
 * ["Bediako", "Loki"]); //should return java.lang.String[] of size 3
 * with the first two slots containing "Bediako" and "Loki".
 */
airlift.createArray = function(_size, _type, _initializer)
{
	var size = _size||0;
	var type = _type||Packages.java.lang.String;
	initializer = _initializer||[];

	var newArray = java.lang.reflect.Array.newInstance(type, size);
	initializer.forEach(function(_item, _index) { newArray[_index] = _item; });

	return newArray;
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @description - Creates a Java array of specified size and type
 * java.lang.String.  If an initialization array is provided the contents of that array
 * are copied to the array.
 *
 * @param _size - the initial size of the array.
 * @param _initializer - an array of values that should be copied to
 * the array.
 *
 * @returns an array of type java.lang.String
 *
 * @see airlift.createArray();
 *
 */
airlift.stringArray = function(_size, _initializer)
{
	return airlift.createArray(_size, Packages.java.lang.String, _initializer);
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @description - Creates a Java array of specified size and type byte.
 * If an initialization array is provided the contents of that array
 * are copied to the array.
 * 
 * @param _size - the initial size of the array.
 * @param _initializer - an array of values that should be copied to
 * the array.
 *
 * @returns an array of type byte
 *
 * @see airlift.createArray();
 *
 */

airlift.byteArray = function(_size, _initializer)
{
	return airlift.createArray(_size, Packages.java.lang.Byte.TYPE, _initializer);
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @description - Creates a Java array of specified size and type
 * java.lang.Byte.  If an initialization array is provided the contents of that array
 * are copied to the array.
 *
 * @param _size - the initial size of the array.
 * @param _initializer - an array of values that should be copied to
 * the array.
 *
 * @returns an array of type java.lang.Byte
 *
 * @see airlift.createArray();
 *
 */

airlift.byteObjectArray = function(_size, _initializer)
{
	return airlift.createArray(_size, Packages.java.lang.Byte, _initializer);
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @description - Creates a Java array of specified size and type
 * short.  If an initialization array is provided the contents of that array
 * are copied to the array.
 *
 * @param _size - the initial size of the array.
 * @param _initializer - an array of values that should be copied to
 * the array.
 *
 * @returns an array of type short
 *
 * @see airlift.createArray();
 *
 */

airlift.shortArray = function(_size, _initializer)
{
	return airlift.createArray(_size, Packages.java.lang.Short.TYPE, _initializer);
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @description - Creates a Java array of specified size and type
 * java.lang.Byte.  If an initialization array is provided the contents of that array
 * are copied to the array.
 *
 * @param _size - the initial size of the array.
 * @param _initializer - an array of values that should be copied to
 * the array.
 *
 * @returns an array of type java.lang.Byte
 *
 * @see airlift.createArray();
 *
 */

airlift.shortObjectArray = function(_size, _initializer)
{
	return airlift.createArray(_size, Packages.java.lang.Short, _initializer);
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @description - Creates a Java array of specified size and type
 * char.  If an initialization array is provided the contents of that array
 * are copied to the array.
 *
 * @param _size - the initial size of the array.
 * @param _initializer - an array of values that should be copied to
 * the array.
 *
 * @returns an array of type char
 *
 * @see airlift.createArray();
 *
 */

airlift.charArray = function(_size, _initializer)
{
	return airlift.createArray(_size, Packages.java.lang.Character.TYPE, _initializer);
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @description - Creates a Java array of specified size and type
 * java.lang.Character.  If an initialization array is provided the contents of that array
 * are copied to the array.
 *
 * @param _size - the initial size of the array.
 * @param _initializer - an array of values that should be copied to
 * the array.
 *
 * @returns an array of type java.lang.Character
 *
 * @see airlift.createArray();
 *
 */

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @description - Creates a Java array of specified size and type
 * java.lang.Character.  If an initialization array is provided the contents of that array
 * are copied to the array.
 *
 * @param _size - the initial size of the array.
 * @param _initializer - an array of values that should be copied to
 * the array.
 *
 * @returns an array of type java.lang.Character
 *
 * @see airlift.createArray();
 *
 */

airlift.charObjectArray = function(_size, _initializer)
{
	return airlift.createArray(_size, Packages.java.lang.Character, _initializer);
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @see airlift.charObjectArray();
 *
 */

airlift.characterObjectArray = function(_size, _initializer)
{
	return airlift.charObjectArray(_size, _initializer);
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @description - Creates a Java array of specified size and type
 * int.  If an initialization array is provided the contents of that array
 * are copied to the array.
 *
 * @param _size - the initial size of the array.
 * @param _initializer - an array of values that should be copied to
 * the array.
 *
 * @returns an array of type int
 *
 * @see airlift.createArray();
 *
 */

airlift.intArray = function(_size, _initializer)
{
	return airlift.createArray(_size, Packages.java.lang.Integer.TYPE, _initializer);
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @description - Creates a Java array of specified size and type
 * java.lang.Integer.  If an initialization array is provided the contents of that array
 * are copied to the array.
 *
 * @param _size - the initial size of the array.
 * @param _initializer - an array of values that should be copied to
 * the array.
 *
 * @returns an array of type java.lang.Integer
 *
 * @see airlift.createArray();
 *
 */

airlift.intObjectArray = function(_size, _initializer)
{
	return airlift.createArray(_size, Packages.java.lang.Integer, _initializer);
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @see airlift.intObjectArray();
 *
 */

airlift.integerObjectArray = function(_size, _initializer)
{
	return airlift.intObjectArray(_size, _initializer);
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @description - Creates a Java array of specified size and type
 * long.  If an initialization array is provided the contents of that array
 * are copied to the array.
 *
 * @param _size - the initial size of the array.
 * @param _initializer - an array of values that should be copied to
 * the array.
 *
 * @returns an array of type long
 *
 * @see airlift.createArray();
 *
 */

airlift.longArray = function(_size, _initializer)
{
	return airlift.createArray(_size, Packages.java.lang.Long.TYPE, _initializer);
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @description - Creates a Java array of specified size and type
 * java.lang.Long.  If an initialization array is provided the contents of that array
 * are copied to the array.
 *
 * @param _size - the initial size of the array.
 * @param _initializer - an array of values that should be copied to
 * the array.
 *
 * @returns an array of type java.lang.Long
 *
 * @see airlift.createArray();
 *
 */

airlift.longObjectArray = function(_size, _initializer)
{
	return airlift.createArray(_size, Packages.java.lang.Long, _initializer);
};


/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @description - Creates a Java array of specified size and type
 * boolean.  If an initialization array is provided the contents of that array
 * are copied to the array.
 *
 * @param _size - the initial size of the array.
 * @param _initializer - an array of values that should be copied to
 * the array.
 *
 * @returns an array of type boolean
 *
 * @see airlift.createArray();
 *
 */

airlift.booleanArray = function(_size, _initializer)
{
	return airlift.createArray(_size, Packages.java.lang.Boolean.TYPE, _initializer);
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @description - Creates a Java array of specified size and type
 * java.lang.Boolean.  If an initialization array is provided the contents of that array
 * are copied to the array.
 *
 * @param _size - the initial size of the array.
 * @param _initializer - an array of values that should be copied to
 * the array.
 *
 * @returns an array of type java.lang.Boolean
 *
 * @see airlift.createArray();
 *
 */

airlift.booleanObjectArray = function(_size, _initializer)
{
	return airlift.createArray(_size, Packages.java.lang.Boolean, _initializer);
};


/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @description - Creates a Java array of specified size and type
 * float.  If an initialization array is provided the contents of that array
 * are copied to the array.
 *
 * @param _size - the initial size of the array.
 * @param _initializer - an array of values that should be copied to
 * the array.
 *
 * @returns an array of type float
 *
 * @see airlift.createArray();
 *
 */

airlift.floatArray = function(_size, _initializer)
{
	return airlift.createArray(_size, Packages.java.lang.Float.TYPE, _initializer);
};


/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @description - Creates a Java array of specified size and type
 * java.lang.Float.  If an initialization array is provided the contents of that array
 * are copied to the array.
 *
 * @param _size - the initial size of the array.
 * @param _initializer - an array of values that should be copied to
 * the array.
 *
 * @returns an array of type java.lang.Float
 *
 * @see airlift.createArray();
 *
 */

airlift.floatObjectArray = function(_size, _initializer)
{
	return airlift.createArray(_size, Packages.java.lang.Float, _initializer);
};


/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @description - Creates a Java array of specified size and type
 * double.  If an initialization array is provided the contents of that array
 * are copied to the array.
 *
 * @param _size - the initial size of the array.
 * @param _initializer - an array of values that should be copied to
 * the array.
 *
 * @returns an array of type java.lang.Double
 *
 * @see airlift.createArray();
 *
 */

airlift.doubleArray = function(_size, _initializer)
{
	return airlift.createArray(_size, Packages.java.lang.Double.TYPE, _initializer);
};


/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @description - Creates a Java array of specified size and type
 * java.lang.Double.  If an initialization array is provided the contents of that array
 * are copied to the array.
 *
 * @param _size - the initial size of the array.
 * @param _initializer - an array of values that should be copied to
 * the array.
 *
 * @returns an array of type java.lang.Double
 *
 * @see airlift.createArray();
 *
 */

airlift.doubleObjectArray = function(_size, _initializer)
{
	return airlift.createArray(_size, Packages.java.lang.Double, _initializer);
};


/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @description Copies on array to another.  If a conversion function
 * is provided, it is applied to each element in the source array with
 * the result of that application placed in the destination array. 
 *
 * @param _sourceArray - the array to copy from. Could be a Javascript
 * or Java type array.
 * @param _destinationArray the array to copy to. Could be a Javascript
 * or Java type array.
 * @param _conversionFunction - the optional element level conversion function
 *
 * @example
 * var destination = [];
 * @airlift.arrayCopy(["Bediako", "Connor", "Loki"], destination,
 * function(_item) { _item.toLowerCase()});
 * //destination array should contain ["bediako", "connor", "loki"]
 */
airlift.arrayCopy = function(_sourceArray, _destinationArray, _conversionFunction)
{
	if (_sourceArray && _destinationArray)
	{
		var conversionFunction = _conversionFunction||function(_input) { return _input; };

		for (var i = 0; i < _sourceArray.length; i++)
		{
			if (i === _destinationArray.length)
			{
				break;
			}
			else
			{
				_destinationArray[i] = conversionFunction(_sourceArray[i]);
			}
		}
	}
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @description - Place a serilizable object in a Google App Engine
 * task queue.
 *
 * @param _config - the task queue configuration object that contains the
 * following options.
 *
 * @param _config.url - the URI this task will be sent to.
 * @param _config.method - the optional HTTP method used to send this
 * task.  This defaults to "POST".
 * @param _config.parameters a java.util.Map or a Javascript object
 * detailing the config parameters that are to be sent with this task.
 * @param _queueName - The Google App Engine task queue that will hold
 * this task.
 *
 * @example
 * var params = {"name: Bediako", "gender: male" }
 * airlift.enqueueTask({url: "http://example.com/a/person", "POST",
 * params, "addPersonQueue"});
 */
airlift.enqueueTask = function(_config)
{
	var url = _config.url;
	var method = _config.method||"POST";
	var parameters = _config.parameters||airlift.m();
	var queueName = _config.queueName||"default";
	var queue = ("default".equalsIgnoreCase(queueName) === true) ? Packages.com.google.appengine.api.taskqueue.QueueFactory.getDefaultQueue() : Packages.com.google.appengine.api.taskqueue.QueueFactory.getQueue(queueName);

	var taskOptions = Packages.com.google.appengine.api.taskqueue.TaskOptions.Builder.withUrl(url);
	taskOptions.method(Packages.com.google.appengine.api.taskqueue.TaskOptions.Method[method.toUpperCase()]);

	if (parameters.entrySet)
	{
		for (var parameterEntry in Iterator(parameters.entrySet()))
		{
			taskOptions.param(parameterEntry.getKey(), parameterEntry.getValue());
		}
	}
	else
	{
		for (var i in params)
		{
			taskOptions.param(i, params[i]);
		}
	}

	return queue.add(taskOptions); //returns TaskHandle
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @description - send a message to a collection of Google users via Google
 * Talk.
 *
 * @param _users - a JavaScript array or a java.util.Iterator or
 * java.util.Iterable
 * @param _message - a string containing the message.
 *
 * @returns a Javascript array that has the status of each message sent.
 *
 * @example
 *
 */
airlift.chat = function(_users, _message)
{
	var statusArray = [];
	var xmppService = Packages.com.google.appengine.api.xmpp.XMPPServiceFactory.getXMPPService();
	var users = _users||[];

	var sendMessage = function(_user)
	{
		var jid = new Packages.com.google.appengine.api.xmpp.JID(_user.email);
		var message = new Packages.com.google.appengine.api.xmpp.MessageBuilder()
					  .withRecipientJids(jid)
					  .withBody(_message)
					  .build();

		var messageSent = false;

		if (xmppService.getPresence(jid).isAvailable() === true)
		{
			var status = xmppService.sendMessage(message);
			messageSent = (status.getStatusMap().get(jid) === Packages.com.google.appengine.api.xmpp.SendResponse.Status.SUCCESS);
		}

		statusArray.push(messageSent);
	};

	if (users.iterator)
	{
		for (var _user in Iterator(users))
		{
			sendMessage(_user);
		}
	}
	else
	{
		users.forEach(sendMessage);
	}

	return statusArray;
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @description - escapes a string to prepare it for adding it to an
 * XML fragment
 *
 * @param _value - the string to escaped
 *
 * @returns - the escaped string
 *
 * @example
 * var escapedXml = airlift.escapeXml("Bediako");
 * 
 */
airlift.escapeXml = function(_value)
{
	return Packages.org.apache.commons.lang.StringEscapeUtils.escapeXml(_value);
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @description - unescapes a string that was prepared for adding to an
 * XML fragment
 *
 * @param _value - the string to unescaped
 *
 * @returns - the unescaped string
 *
 * @example
 * var unescapedXml = airlift.unescapeXml("Bediako");
 * 
 */

airlift.unescapeXml = function(_value)
{
	return Packages.org.apache.commons.lang.StringEscapeUtils.unescapeXml(_value);
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @description - escapes a string for adding to an
 * HTML fragment
 *
 * @param _value - the string to escaped
 *
 * @returns - the escaped string
 *
 * @example
 * var escapedHtml = airlift.escapeHtml("Bediako");
 * 
 */

airlift.escapeHtml = function(_value)
{
	return Packages.org.apache.commons.lang.StringEscapeUtils.escapeHtml(_value);
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @description - unescapes a string that was prepared for adding to an
 * HTML fragment
 *
 * @param _value - the string to unescaped
 *
 * @returns - the unescaped string
 *
 * @example
 * var unescapedHtml = airlift.unescapeHtml("Bediako");
 * 
 */

airlift.unescapeHtml = function(_value)
{
	return Packages.org.apache.commons.lang.StringEscapeUtils.unescapeHtml(_value);
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @description Airlift browser object can be used to call other URIs
 *
 * @returns airlift.util.Browser
 *
 * @example
 * var browser = airlift.browser();
 * 
 */
airlift.browser = function()
{
	return new Packages.airlift.util.Browser();
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @see airlift.isWhitespace
 *
 */
airlift.isWhiteSpace = function(_string)
{
	return airlift.isWhitespace(_string);
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @description - check a string and returns true if it is white space.
 *
 * @param _string - the string to check for white space.
 *
 * @returns true if string is whitespace, false otherwise.
 *
 * @example
 * if (airlift.isWhiteSpace(_string) === true)
 * {
 *	LOG.info("String is white space");
 * }
 *
 */
airlift.isWhitespace = function(_string)
{
	return Packages.org.apache.commons.lang.StringUtils.isWhitespace(_string);
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @description - right pad a string with the specified number of
 * characters
 *
 * @param _string - the string to be right padded
 * @param _size - the final size of the string
 * @param _character - the character to be used for padding
 *
 * @returns the right padded string
 *
 * @example
 * var paddedString = airlift.rightPad("Bediako", 10, " ");
 * //paddedString is now "Bediako   ";
 */
airlift.rightPad = function(_string, _size, _character)
{
	var character = _character||'';

	return Packages.org.apache.commons.lang.StringUtils.rightPad(_string, _size, character);
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @description - left pad a string with the specified number of
 * characters
 *
 * @param _string - the string to be left padded
 * @param _size - the final size of the string
 * @param _character - the character to be used for padding
 *
 * @returns the left padded string
 *
 * @example
 * var paddedString = airlift.leftPad("Bediako   ", 13, " ");
 * //paddedString is now "   Bediako   ";
 */

airlift.leftPad = function(_string, _size, _character)
{
	var character = _character||'';

	return Packages.org.apache.commons.lang.StringUtils.leftPad(_string, _size, character);
};


airlift.typeOf = function(_value)
{
	return typeOf(_value);
}

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @description - remove white space from the left and right of a string
 *
 * @param _string - the string to be trimmed
 *
 * @returns a trimmed string
 *
 * @example
 * var trimmedString = airlift.trim("   Bediako   "); //trimmedString
 * is now "Bediako";
 *
 */
airlift.trim = function(_string)
{
	var trimmed = Packages.org.apache.commons.lang.StringUtils.trim(_string);
	return (airlift.typeOf(_string) === 'string') ? trimmed + "" : trimmed;
};

/**
 * @author <a href="mailto:bediako.george@lucidtechnics.com">Bediako
 * George</a>
 *
 * @description - returns true is the array of strings contains
 * _propertyName
 *
 * @param _filter - the array of strings to check against
 * @param _propertyName - the name of the property to look for.
 *
 * @returns - true if _filter contains _propertyName, false otherwise.
 *
 * @example
 * if (airlift.filterContains(["Bediako", "George"], "Loki") === false)
 * {
 *	LOG,info("Loki is not found in the list");
 * }
 */
airlift.filterContains = function(_filter, _propertyName)
{
	var contains = false;

	_filter.forEach(function(_item)
	{
		if (_item.equalsIgnoreCase(_propertyName) === true)
		{
			contains = true;
		}
	});

	return contains;
};

/**
 * @author Bediako George
 * @description - Formats value as dictated by
 * the appropriate airlift.util.FormatUtil.format
 *
 * @param _value the value that needs to be formatted as a string.
 * @param _mask - Optional - the mask that should used to defined the
 * string format.  Useful for date and timestamp objects.
 *
 * @return - formatted string
 *
 * @example
 * var dateString = airlift.format(new Packages.java.util.Date(),
 * "mm/dd/yyyy");
 *
 */
airlift.format = function(_value, _mask)
{
	var formattedValue = _value;

	if (_value && _mask)
	{
		formattedValue = Packages.airlift.util.FormatUtil.format(_value, _mask);
	}
	else if (_value)
	{
		formattedValue = Packages.airlift.util.FormatUtil.format(_value);
	}

	return formattedValue;
}

/**
 * @author Bediako George
 * @description Convenience parameter to return
 * Packages.airlift.util.AirliftUtil object.
 *
 * @example
 *
 * var list = airlift.l().a("Bediako").a("Damali");
 * var jsonList = airlift.util.toJson(list); //executes toJson method
 * on Packages.airlift.util.AirliftUtil
 * //Creates json list representation ["Bediako", "Damali"].
 *
 */
airlift.util = Packages.airlift.util.AirliftUtil;

/**
 * @author Bediako George
 * @description render the information in a do into a map property
 * names to property values as strings.
 *
 * @example
 *
 * var list = airlift.describe(_personDo, {interfaceClass:
 * "com.yourapp.PersonDo", auditPostDate: "MMM d, yyyy h:mm:ss a ZZZ" });
 *
 */

airlift.describe = function(_do, _config)
{
	var config = _config||{};
	var interfaceClass = _config.interfaceClass||_do.getClass().getName();
	var activeRecord = config.activeRecord;
	var filter = config.filter||[];
	var orderedPropertyList = config.displayOrder||activeRecord.retrieveOrderedPropertyList();

	var descriptionMap = new Packages.java.util.HashMap();
	
	var processDo = function(_property)
	{
		if ("class".equalsIgnoreCase(_property) === false)
		{
			var rawValue = _do["get" + Packages.airlift.util.AirliftUtil.upperTheFirstCharacter(_property)]();

			if (rawValue)
			{
				if ("java.util.Date".equals(rawValue.getClass().getName()) === true)
				{
					var datable = Packages.airlift.util.AirliftUtil.getMethodAnnotation(interfaceClass, _property, airlift.cc("airlift.generator.Datable"));

					var mask = config[_property];

					if (!mask && datable)
					{
						var datePatternArray = datable.dateTimePatterns();

						if (datePatternArray != null && datePatternArray.length > 0)
						{
							mask = datePatternArray[0];
						}
					}
					else if (!mask)
					{
						mask = "MM-dd-yyyy";
					}

					value = airlift.formatDate(rawValue, mask);
				}
				else if ("java.util.ArrayList".equals(rawValue.getClass().getName()) === true ||
						 "java.util.HashSet".equals(rawValue.getClass().getName()) === true)
				{
					value = rawValue||airlift.l();
				}
				else
				{
					value = (rawValue && rawValue.toString())||null;
				}
			}
			else
			{
				value = "";
			}

			descriptionMap.put(_property, value);
		}
	};

	orderedPropertyList.forEach(processDo);

	return descriptionMap;
}