var log = Packages.java.util.logging.Logger.getLogger('airlift');

exports.typeOf = function typeOf(value)
{
	var s = typeof value;

	if (s === 'object')
	{
		if (value)
		{
			if (typeof value.length === 'number' &&
				  !(value.propertyIsEnumerable('length')) &&
				  typeof value.splice === 'function')
			{
				s = 'array';
			}
		}
		else
		{
			s = 'null';
		}
	}

	return s;
};

exports.isEmpty = function isEmpty(o)
{
	var i, v, isEmpty = true;

	if ( this.typeOf(o) === 'object')
	{
		for (i in o)
		{
			v = o[i];
			
			if (v !== undefined && this.typeOf(v) !== 'function')
			{
				isEmpty = false;
			}
		}
	}
	else
	{
		isEmpty = false;
	}

	return isEmpty;
};

exports.createClass = function createClass(_className)
{
	return Packages.java.lang.Class.forName(_className);
};

exports.isWhitespace = function isWhitespace(_string)
{
	return Packages.org.apache.commons.lang.StringUtils.isWhitespace(_string);
};

exports.hasValue = function hasValue(_value)
{
	return (_value !== null && _value !== undefined);
};

var ErrorReporter = function()
{
	var errors = {};

	this.allErrors = function() { return errors; };
	this.getErrors = function(_name)
	{
		if (_name === undefined || _name === null)
		{
			throw new Error('getErrors expects an error name.  To get allErrors use allErrors instead');
		}
		
		return errors[_name];
	}

	this.report = function(_name, _error)
	{
		if (_name === null || _name === undefined)
		{
			throw new Error('Cannot report and error with an undefined or null name');
		}
		
		var errorList = errors[_name]||[];

		if (_error && Array.isArray(_error) === true)
		{
			errorList = errorList.concat(_error);
		}
		else if (_error && _error.name !== null && _error.name !== undefined)
		{
			errorList.push(_error);
		}
		else if (_error && typeof _error === 'string')
		{
			var error = {name: _name, message: _error, category: arguments[2]||''};
			errorList.push(error);
		}

		errors[_name] = errorList;
	};
};

exports.createErrorReporter = function()
{
	return new ErrorReporter();
}

exports.multiTry = function multiTry(_executable, _tryCount, _callback)
{
	var result, success = false;
	var lastException;

	for (var i = 0; i < _tryCount && success === false; i++)
	{
		if (i < _tryCount)
		{
			try
			{
				result = _executable(i + 1);
				success = true;
			}
			catch(e)
			{
				lastException = e;
				
				if (!_callback) { exports.warning('multitry:', lastException.toString()); }
			}
		}
	}

	if (!success)
	{
		exports.severe("After this many tries:", _tryCount, " - ", lastException.toString());

		if (_callback)
		{
			_callback(_tryCount, lastException);
		}
		else
		{
			throw lastException;
		}
	}

	return result;
};

exports.createDate = function createDate(_milliseconds)
{
	var date;
	
	if (this.hasValue(_milliseconds) === true)
	{
		date = new Packages.java.util.Date(_milliseconds);
	}
	else
	{
		date = new Packages.java.util.Date();
	}
	
	return date; 
};

exports.createCalendar = function createCalendar(_config)
{
	var date = (_config && _config.date) ? _config.date : null;
	var dateOffset = (_config && _config.dateOffset) ? _config.dateOffset : 0;
	var dateOffsetType = (_config && _config.dateOffsetType) ? _config.dateOffsetType : Packages.java.util.Calendar.MILLISECOND;
	var timezone = (_config && _config.timezone) ? _config.timezone : "UTC";
	var locale = (_config && _config.locale) ? _config.locale : Packages.java.util.Locale.getDefault();

	if (this.hasValue(date) === true)
	{
		var calendar = Packages.java.util.Calendar.getInstance(timezone, locale);
		calendar.setTime(date);
		calendar.setTimeZone(timezone);
	}
	else
	{
		var calendar = Packages.java.util.Calendar.getInstance(timezone, locale);
	}

	calendar.add(dateOffsetType, dateOffset);

	return calendar;
};

exports.guid = function guid(_length)
{
	var id;
	
	if (_length)
	{
		id = Packages.airlift.util.IdGenerator.generate(_length);
	}
	else
	{
		id = Packages.airlift.util.IdGenerator.generate(32);
	}

	return id; 
};

exports.trim = function trim(_string)
{
	var trimmed = _string;

	if (_string)
	{
		trimmed = Packages.org.apache.commons.lang.StringUtils.trim(_string);

		if (this.typeOf(_string) === 'string')
		{
			trimmed = trimmed + '';
		}
	}

	return trimmed;
};

exports.print = function print()
{
	var args = Array.prototype.slice.call(arguments, 0);

	for (var i = 0, length = args.length; i < length; i++)
	{
		if (i === 0)
		{
			Packages.java.lang.System.out.print(args[i]||'');
		}
		else
		{
			Packages.java.lang.System.out.print(' ' + args[i]||'');
		}
	}
};

exports.println = function println()
{
	var args = Array.prototype.slice.call(arguments, 0);

	exports.print.apply(this, args);
	
	Packages.java.lang.System.out.println('');
};

var message = function message()
{
	var args = Array.prototype.slice.call(arguments, 0);
	var message;

	for (var i = 0, length = args.length; i < length; i++)
	{
		if (i === 0)
		{
			message = args[i]||'';
		}
		else
		{
			message += ' ' + args[i]||'';
		}
	}

	return message;
};

exports.info = function info()
{
	var info = message.apply(this, Array.prototype.slice.call(arguments, 0));
	log.info(info);
};

exports.warning = function warning()
{
	var warning = message.apply(this, Array.prototype.slice.call(arguments, 0));
	log.warning(warning);
};

exports.severe = function severe()
{
	var severe = message.apply(this, Array.prototype.slice.call(arguments, 0));
	log.severe(severe);
};


exports.value = function value(_candidate, _default)
{
	var candidate;

	if (this.hasValue(_candidate) === true)
	{
		candidate = _candidate;
	}
	else
	{
		candidate = _default;
	}

	return candidate;
};

function PrimitiveConverter()
{
	this["java.lang.String"] = function(_value) { return _value };
	this["java.util.Date"] = function(_value) { return _value };

	this["java.util.List"] = function(_value) { return _value };
	this["java.util.HashSet"] = this["java.util.List"];
	this["java.util.Set"] = this["java.util.List"];
	this["java.util.ArrayList"] = this["java.util.List"];
	this["java.util.List<java.lang.String>"] = this["java.util.List"];
	this["java.util.ArrayList<java.lang.String>"] = this["java.util.List"];
	this["java.util.HashSet<java.lang.String>"] = this["java.util.List"];
	this["java.util.Set<java.lang.String>"] = this["java.util.List"];

	this["java.lang.Integer"] = function(_value) { return (_value && _value.intValue()) || null; };
	this["java.lang.Boolean"] = function(_value) { return (_value && _value.booleanValue()) || null; };
	this["java.lang.Long"] = function(_value) { return (_value && _value.longValue()) || null; };
	this["java.lang.Short"] = function(_value) { return (_value && _value.shortValue()) || null; };
	this["java.lang.Double"] = function(_value) { return (_value && _value.doubleValue()) || null; };
	this["java.lang.Float"] = function(_value) { return (_value && _value.floatValue()) || null; };
	this["java.lang.Character"] = function(_value) { return (_value && _value.charValue()) || null; };
	this["java.lang.Byte"] = function(_value) { return (_value && _value.byteValue()) || null; };
}

exports.primitive = function(_value)
{
	var primitive = _value;

	if (_value && _value.getClass)
	{
		var type = _value.getClass().getName();		
		var converter = new PrimitiveConverter();

		if (converter[type]) { primitive = converter[type](_value); }
	}

	return primitive;
};

exports.callbackIterator = function callbackIterator(_iterator, _callback)
{
	var iterator = {
		hasNext: function() { return _iterator.hasNext(); },
		next: function() { var next = _iterator.next(); _callback(next); return next; },
		remove: function() { _iterator.remove(); }
	};

	return new Packages.java.util.Iterator(iterator);
};

exports.list = function list(_parameter)
{
	var list;

	if (exports.hasValue(_parameter) === true)
	{
		list = new Packages.java.util.ArrayList(_parameter);
	}
	else
	{
		list = new Packages.java.util.ArrayList();
	}

	return list;
};

exports.set = function set(_parameter)
{
	var set;

	if (exports.hasValue(_parameter) === true)
	{
		set= new Packages.java.util.HashSet(_parameter);
	}
	else
	{
		set= new Packages.java.util.HashSet();
	}

	return set;
};

exports.map = function map(_parameter)
{
	var map;

	if (exports.hasValue(_parameter) === true)
	{
		map = new Packages.java.util.HashMap(_parameter);
	}
	else
	{
		map = new Packages.java.util.HashMap();
	}

	return map;
};

function KeysIterator(_entityList)
{
	var iterator = _entityList.iterator();

	this.hasNext = function() { return iterator.hasNext(); };
	this.next = function() { return iterator.next().getKey(); };
	this.remove = function() { iterator.remove(); };
};

exports.createKeysIterator = function createKeysIterator(_entityList)
{
	return new Packages.java.util.Iterator(new KeysIterator(_entityList));
};

function KeysCollection(_entityList)
{
	this.iterator = function()
	{
		return new KeysIterator(_entityList);
	};

	this.isEmpty = function() { return _entityList.isEmpty(); };
	this.size = function() { return _entityList.size(); }

	this.toArray = function() { return _entityList.toArray(); };
	this.add = function() { throw 'add not supported in this collection'; };
	this.addAll = function() { throw 'addAll not supported in this collection'; };
	this.clear = function() { _entityList.clear(); };
	this.contains = function(_object) { return contains(_object); };
	this.containsAll = function(_collection) { return _entityList.containsAll(_collection); };
	this.equals = function(_object) { return _entityList.equals(_object); };
	this.hashCode = function() { return _entityList.hashCode() };

	this.remove = function(_object) { _entityList.remove(_object) };
	this.removeAll = function(_collection) { _entityList.removeAll(_entityList); };
	this.retainAll = function(_collection) { _entityList.retainAll(_collection); };
};

exports.createKeysCollection = function createKeysCollection(_entityList)
{
	return new java.util.Collection(new KeysCollection(_entityList));
};

exports.getResourceMetadata = function(_name)
{
	return require('meta/r/' + _name).create();
};

exports.getAttributesMetadata = function(_name)
{
	return require('meta/a/' + _name).create();
};

exports.getWebRequestId = function(_name)
{
	return Packages.com.google.apphosting.api.ApiProxy.getCurrentEnvironment().getAttributes().get("com.google.appengine.runtime.request_log_id");
};

exports.string = function(_stringOrJavaByteArray)
{
	return new Packages.java.lang.String(_stringOrJavaByteArray);
};

exports.boolean = function(_booleanString)
{
	var boolean = false;
	
	if (exports.hasValue(_booleanString) === true)
	{
		boolean = new Packages.java.lang.Boolean(_booleanString).booleanValue();
	}

	return boolean;
};

exports['int'] = function(_number)
{
	return new Packages.java.lang.Integer(_number).intValue();
}

exports['double'] = function(_number)
{
	return new Packages.java.lang.Double(_number).doubleValue();
}

exports['short'] = function(_number)
{
	return new Packages.java.lang.Short(_number).shortValue();
}

exports['float'] = function(_number)
{
	return new Packages.java.lang.Float(_number).floatValue();
}

exports['long'] = function(_number)
{
	return new Packages.java.lang.Long(_number).longValue();
}

exports.leftPad = function(_item, _digits, _pad)
{
	var item = _item + '';
	var pad = _pad + '';

	while (item.length < _digits)
	{
		item = pad + item;
	}

	if (_item instanceof java.lang.String) { item = exports.string(item); }
	
	return item;
};

exports.rightPad = function(_item, _digits, _pad)
{
	var item = _item + '';
	var pad = _pad + '';

	while (item.length < _digits)
	{
		item = item + pad;
	}

	if (_item instanceof java.lang.String) { item = exports.string(item); }
	
	return item;
};

exports.hash = function(_algorithm, _message, _length)
{
	var hash = Packages.airlift.util.IdGenerator.hash(_algorithm, _message);

	var length = (hash.length() > _length) ? _length : (hash.length() - 1);

	return hash.substring(hash.length() - length, hash.length());
};

exports.load = function(_resourcePath)
{
	return (new Packages.airlift.util.ResourceUtil).load(_resourcePath);
};

exports.stringBuffer = function(_string)
{
	return new Packages.java.lang.StringBuffer(_string);
};

exports.appProfile = function()
{
	return new Packages.airlift.app.AppProfile();
};