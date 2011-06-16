if (!airlift)
{
	var airlift = {};
}
else if (typeof airlift != "object")
{
	throw new Error("airlift already exists and it is not an object");
}

//Convenience method to create a Java class
airlift.cc = function(_className)
{
	return Packages.java.lang.Class.forName(_className);
};

//Convenience method for creating a blank StringTemplate object
airlift.stringTemplate = function(_templateString)
{
	var stringTemplate  = (airlift.isDefined(_templateString) === true) ? new Packages.org.antlr.stringtemplate.StringTemplate(_templateString) : new Packages.org.antlr.stringtemplate.StringTemplate();

	return stringTemplate;
};

//every - execution function on every member of java.util.Collection
airlift.every = function(_collection, _function)
{
	if (airlift.isDefined(_collection) === true)
	{
		var index = 0;
		
		for (var item in Iterator(_collection))
		{
			_function(item, index, _collection);
			index++;
		}
	}
};

//split - separate java.util.Collection members by function evaluation of true
//and false.
airlift.split = function(_collection, _function)
{
	if (_collection && _function)
	{
		var first = (_collection.push && []) || airlift.l();
		var second = (_collection.push && []) || airlift.l();

		var add = (_collection.push && function(_item, _collection) { _collection.push(item); }) || function(_item, _collection) { _collection.add(item); }

		if (airlift.isDefined(_collection) === true)
		{
			var index = 0;
			for (var item in Iterator(_collection))
			{
				(_function(item, index, _collection) === true) ? add(item, first) : add(item, second);
				index++;
			}
		}

		return [first, second];
	}
};

//partition - separate java.util.Collection into lists partitioned by _attribute
//value
airlift.partition = function(_collection, _attribute)
{
	if (_collection)
	{
		var partitionMap = (_collection.push && {}) || airlift.m();
		var orderedKeys = (_collection.push && []) || airlift.l();

		var get = (_collection.get && function(_item, _map) { _map.get(_item); }) || function(_item, _map) { _map[_item]; }
		var put = (_collection.put && function(_key, _item, _map) { _map.put(_key, _item); }) || function(_key, _item, _map) { _map[_key] = _item; }
		var add = (_collection.push && function(_item, _collection) { _collection.push(_item); }) || function(_item, _collection) { _collection.add(_item); }

		for (var item in Iterator(_collection))
		{
			var value = item[_attribute];

			if (airlift.isDefined(value) === true)
			{
				var list = get(value, partitionMap);

				if (airlift.isDefined(list) === false)
				{
					list = (_collection.push && []) || airlift.l();
					put(value, list, partitionMap);
					add(value, orderedKeys);
				}

				add(item, list);
			}
		}

		return [orderedKeys, partitionMap];
	}
};

airlift.list = function(_collection)
{
	return (_collection && airlift.l(_collection)) || airlift.l();
};

//l - create an enhanced java.util.ArrayList
airlift.l = function(_list)
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

	if (airlift.isDefined(_list) === true)
	{
		list.addAll(_list);
	}

	return list;
};

airlift.set = function(_collection)
{
	return (_collection && airlift.s(_collection)) || airlift.s();
};

//s - create an enhanced java.util.HashSet
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
		return this;
	};

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

airlift.map = function(_map)
{
	return (_map && airlift.m(_map)) || airlift.m();
};

//m - create an enhanced java.util.HashMap
airlift.m = function(_map)
{
	var map = {};

	map.p = function(_key, _value)
	{
		this.put(_key, _value);
		return this;
	};

	map.forEachKey = function(_function)
	{
		airlift.every(this.keySet(), _function);
		return this;
	};

	map.forEachValue = function(_function)
	{
		airlift.every(this.values(), _function);
		return this;
	};

	map.partitionKeys = function(_attribute)
	{
		return airlift.partition(this.keySet(), _attribute);
	};

	map.splitKeys = function(_attribute)
	{
		return airlift.split(this.keySet(), _attribute);
	};

	map.partitionValues = function(_attribute)
	{
		return airlift.partition(this.values(), _attribute);
	};

	map.split = function(_attribute)
	{
		return airlift.split(this.values(), _attribute);
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

//a - Convenience method to create a new Java array of the specified type
airlift.a = function(_javaType, _size)
{
	return Packages.java.lang.reflect.Array.newInstance(_javaType, _size);
};

//g - Convenience method to create an id generator
airlift.g = function(_length)
{
	if (_length) { var id = Packages.airlift.util.IdGenerator.generate(_length); }
	else { var id = Packages.airlift.util.IdGenerator.generate(); }

	return id; 
};

//mm - Convenience method create a message manager
airlift.mm = function()
{
	return new Packages.airlift.MessageManager();
};

//post - post an active record based on domain URI and rest context.
//Post accepts function that runs after syntactic validation but before
//insert into persistent store.
airlift.post = function(_domainName)
{
	if (typeof _domainName ==='function')
	{
		var domainName = undefined;
		var startingIndex = 0;
	}
	else
	{
		var domainName = _domainName;
		var startingIndex = 1;
	}
	
	var [activeRecord, errorMap] = airlift.populate(domainName);

	if (activeRecord.error === true)
	{
		activeRecord["id"] =  airlift.g();
	}

	if (arguments.length > startingIndex)
	{
		for (var i = startingIndex; i < arguments.length; i++)
		{
			arguments[i](activeRecord, errorMap);
		}
	}

	if (activeRecord.error === false)
	{
		activeRecord.insert();
	}

	return [activeRecord, errorMap, activeRecord["id"]];
};

airlift.put = function(_domainName)
{
	if (typeof _domainName === 'function')
	{
		var domainName;
		var startingIndex = 0;
	}
	else
	{
		var domainName = _domainName;
		var startingIndex = 1;
	}

	var [activeRecord, errorMap] = airlift.populate(domainName);

	if (arguments.length > startingIndex)
	{
		for (var i = startingIndex; i < arguments.length; i++)
		{
			arguments[i](activeRecord, errorMap);
		}
	}

	if (activeRecord.error === false)
	{
		activeRecord.update();
	}

	return [activeRecord, errorMap];
};

airlift.del = function(_id, _domainName)
{
	var activeRecord = airlift.ar(_domainName);

	activeRecord.id = (airlift.isDefined(_id) === true) ? _id : ID;

	activeRecord.del();
};

airlift["delete"] = function(_id, _domainName)
{
	airlift.del(_id, _domainName);
};

airlift.isDefined = function(_variable)
{
	var defined = (_variable !== null && _variable !== undefined);

	return defined;
};

airlift.notDefined = function(_variable)
{
	var notDefined = (_variable === null || _variable === undefined);

	return notDefined;
};

airlift.guid = function()
{
	return airlift.g();
};

airlift.hash = function(_hashAlgorithm, _string)
{
	return Packages.airlift.util.IdGenerator.hash(_hashAlgorithm||"SHA1", _string);
};

airlift.sb = function(_string)
{
	return (_string && new Packages.java.lang.StringBuffer(_string)) || new Packages.java.lang.StringBuffer(_string);
};

airlift.string = function(_string)
{
	return (airlift.isDefined(_string) === true) ? new Packages.java.lang.String(_string) : new Packages.java.lang.String();
};

airlift.integer = function(_integer)
{
	return (airlift.isDefined(_integer) === true) ? new Packages.java.lang.Integer(_integer) : new Packages.java.lang.Integer();
};

airlift.toJavaString = function(_string)
{
	return airlift.string(_string);
};

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

airlift.getPropertyValue = function(_resourceName, _propertyName)
{
	return Packages.airlift.util.PropertyUtil.getInstance().getProperty(_resourceName, _propertyName);
};

airlift.isWhitespace = function(_string)
{
	return Packages.airlift.util.AirliftUtil.isWhitespace(_string);
};

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

airlift.copy = function(_source, _destination, _propertyArray)
{
	_propertyArray.forEach(function (_e, _i, _a) { _destination[_e] = _source[_e]; });
};

airlift.tokenizeIntoNGrams = function(_string)
{
	//Make sure string is a string and make sure it is in all lowercase
	//...
	var string = (airlift.isDefined(_string) === true) ? _string.toString().toLowerCase() : "";

	var indexList = airlift.l();
	var standardTokenizer = new Packages.org.apache.lucene.analysis.standard.StandardTokenizer(org.apache.lucene.util.Version.LUCENE_30, new Packages.java.io.StringReader(string));
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

airlift.prepareForDateSearch = function(_calendar, _attributeName, _datePart)
{
	var name = (airlift.isDefined(_attributeName) === true) ? (_attributeName + "-") : "";

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

	resultArray.forEach(function(_item) {

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
	});

	return filteredArray;
};

airlift.getCacheService = function()
{
	return Packages.com.google.appengine.api.memcache.MemcacheServiceFactory.getMemcacheService();
};

airlift.createTimeZone = function(_timeZoneString)
{
	return new Packages.java.util.TimeZone.getTimeZone(_timeZoneString);
};

airlift.createDate = function(_config)
{
	var calendar = airlift.createCalendar(_config);
	return calendar.getTime();
};

airlift.cloneDate = function(_date)
{
	return new Packages.java.util.Date(_date.getTime());
};

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

airlift.createArray = function(_size, _type, _initializer)
{
	var size = _size||0;
	var type = _type||Packages.java.lang.String;
	initializer = _initializer||[];

	var newArray = java.lang.reflect.Array.newInstance(type, size);
	initializer.forEach(function(_item, _index) { newArray[_index] = _item; });

	return newArray;
};

airlift.stringArray = function(_size, _initializer)
{
	return airlift.createArray(_size, Packages.java.lang.String, _initializer);
};

airlift.byteArray = function(_size, _initializer)
{
	return airlift.createArray(_size, Packages.java.lang.Byte.TYPE, _initializer);
};

airlift.byteObjectArray = function(_size, _initializer)
{
	return airlift.createArray(_size, Packages.java.lang.Byte, _initializer);
};

airlift.shortArray = function(_size, _initializer)
{
	return airlift.createArray(_size, Packages.java.lang.Short.TYPE, _initializer);
};

airlift.shortObjectArray = function(_size, _initializer)
{
	return airlift.createArray(_size, Packages.java.lang.Short, _initializer);
};

airlift.charArray = function(_size, _initializer)
{
	return airlift.createArray(_size, Packages.java.lang.Character.TYPE, _initializer);
};

airlift.charObjectArray = function(_size, _initializer)
{
	return airlift.createArray(_size, Packages.java.lang.Character, _initializer);
};

airlift.characterObjectArray = function(_size, _initializer)
{
	return airlift.charObjectArray(_size, _initializer);
};

airlift.intArray = function(_size, _initializer)
{
	return airlift.createArray(_size, Packages.java.lang.Integer.TYPE, _initializer);
};

airlift.intObjectArray = function(_size, _initializer)
{
	return airlift.createArray(_size, Packages.java.lang.Integer, _initializer);
};

airlift.integerObjectArray = function(_size, _initializer)
{
	return airlift.intObjectArray(_size, _initializer);
};

airlift.longArray = function(_size, _initializer)
{
	return airlift.createArray(_size, Packages.java.lang.Long.TYPE, _initializer);
};

airlift.longObjectArray = function(_size, _initializer)
{
	return airlift.createArray(_size, Packages.java.lang.Long, _initializer);
};

airlift.booleanArray = function(_size, _initializer)
{
	return airlift.createArray(_size, Packages.java.lang.Boolean.TYPE, _initializer);
};

airlift.booleanObjectArray = function(_size, _initializer)
{
	return airlift.createArray(_size, Packages.java.lang.Boolean, _initializer);
};

airlift.floatArray = function(_size, _initializer)
{
	return airlift.createArray(_size, Packages.java.lang.Float.TYPE, _initializer);
};

airlift.floatObjectArray = function(_size, _initializer)
{
	return airlift.createArray(_size, Packages.java.lang.Float, _initializer);
};

airlift.doubleArray = function(_size, _initializer)
{
	return airlift.createArray(_size, Packages.java.lang.Double.TYPE, _initializer);
};

airlift.doubleObjectArray = function(_size, _initializer)
{
	return airlift.createArray(_size, Packages.java.lang.Double, _initializer);
};

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

airlift.enqueueTask = function(_config)
{
	var url = _config.url;
	var method = _config.method||"POST";
	var parameters = _config.parameters||airlift.m();
	var queueName = _config.queueName||"default";
	var queue = ("default".equalsIgnoreCase(queueName) === true) ? Packages.com.google.appengine.api.taskqueue.QueueFactory.getDefaultQueue() : Packages.com.google.appengine.api.taskqueue.QueueFactory.getQueue(queueName);

	var taskOptions = Packages.com.google.appengine.api.taskqueue.TaskOptions.Builder.withUrl(url);

	switch (method)
	{
		case "GET":
		case "get":
		case "Get":
			var taskMethod = Packages.com.google.appengine.api.taskqueue.TaskOptions.Method.GET;
			break;

		case "POST":
		case "post":
		case "Post":
			var taskMethod = Packages.com.google.appengine.api.taskqueue.TaskOptions.Method.POST;
			break;

		case "PUT":
		case "put":
		case "Put":
			var taskMethod = Packages.com.google.appengine.api.taskqueue.TaskOptions.Method.PUT;
			break;

		case "DELETE":
		case "delete":
		case "Delete":
			var taskMethod = Packages.com.google.appengine.api.taskqueue.TaskOptions.Method.DELETE;
			break;

		default:
			var taskMethod = Packages.com.google.appengine.api.taskqueue.TaskOptions.Method.POST;
	}

	taskOptions.method(taskMethod);

	for (var parameterEntry in Iterator(parameters.entrySet()))
	{
		taskOptions.param(parameterEntry.getKey(), parameterEntry.getValue());
	}

	return queue.add(taskOptions); //returns TaskHandle
};

airlift.chat = function(_users, _message)
{
	var statusArray = [];
	var xmppService = Packages.com.google.appengine.api.xmpp.XMPPServiceFactory.getXMPPService();
	var users = _users||[];

	users.forEach(function(_user)
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
	});

	return statusArray;
};

airlift.email = function(_users, _message, _subject, _from)
{
	if (_message &&
		  "".equals(_message) === false &&
		  airlift.isWhitespace(_message) === false)
	{
		var users = _users||[];
		var adminEmail = APP_NAME.toLowerCase() + "@appspot.com";
		var from = _from||{ email: adminEmail, fullName: "Admin" };
		var subject = _subject||"From the " + APP_NAME + "application.";
		var message = _message||"";

		var properties = new Packages.java.util.Properties();
		var session = Packages.javax.mail.Session.getDefaultInstance(properties, null);

		users.forEach(function(_user)
		{
			if (_user && _user.email)
			{
				var mimeMessage = new Packages.javax.mail.internet.MimeMessage(session);

				mimeMessage.setFrom(new Packages.javax.mail.internet.InternetAddress(from.email, from.fullName));
				mimeMessage.addRecipient(
										 Packages.javax.mail.Message.RecipientType.TO,
										 new Packages.javax.mail.internet.InternetAddress(_user.email, _user.fullName||""));
				mimeMessage.setSubject(subject);
				mimeMessage.setText(message);

				Packages.javax.mail.Transport.send(mimeMessage);
			}
		});
	}
};

airlift.escapeXml = function(_value)
{
	return Packages.org.apache.commons.lang.StringEscapeUtils.escapeXml(_value);
};

airlift.unescapeXml = function(_value)
{
	return Packages.org.apache.commons.lang.StringEscapeUtils.unescapeXml(_value);
};

airlift.escapeHtml = function(_value)
{
	return Packages.org.apache.commons.lang.StringEscapeUtils.escapeHtml(_value);
};

airlift.unescapeHtml = function(_value)
{
	return Packages.org.apache.commons.lang.StringEscapeUtils.unescapeHtml(_value);
};

airlift.browser = function()
{
	return new Packages.airlift.util.Browser();
};

airlift.isWhiteSpace = function(_string)
{
	return airlift.isWhitespace(_string);
};

airlift.isWhitespace = function(_string)
{
	return Packages.org.apache.commons.lang.StringUtils.isWhitespace(_string);
};

airlift.rightPad = function(_string, _size, _character)
{
	var character = _character||'';

	return Packages.org.apache.commons.lang.StringUtils.rightPad(_string, _size, character);
};

airlift.leftPad = function(_string, _size, _character)
{
	var character = _character||'';

	return Packages.org.apache.commons.lang.StringUtils.leftPad(_string, _size, character);
};

airlift.trim = function(_string)
{
	return Packages.org.apache.commons.lang.StringUtils.trim(_string);
};

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

//this will be replaced by memcache ...
airlift.cache = {};

//thank you John Resig ...
airlift.tmpl = function tmpl(str, data)
{
	// Figure out if we're getting a template, or if we need to
	// load the template - and be sure to cache the result.
	var fn = !/\W/.test(str) ? airlift.cache[str] = airlift.cache[str] || tmpl(document.getElementById(str).innerHTML) :

  // Generate a reusable function that will serve as a template
  // generator (and which will be cached).
  new Function("obj",
	"var p=[],print=function(){p.push.apply(p,arguments);};" +
	// Introduce the data as local variables using with(){}
	"with(obj){p.push('" +

	// Convert the template into pure JavaScript
	str
	.replace(/[\r\t\n]/g, " ")
	.split("<%").join("\t")
	.replace(/((^|%>)[^\t]*)'/g, "$1\r")
	.replace(/\t=(.*?)%>/g, "',$1,'")
	.split("\t").join("');")
	.split("%>").join("p.push('")
	.split("\r").join("\\'")
	+ "');}return p.join('');");

// Provide some basic currying to the user
	return data ? fn( data ) : fn;
};