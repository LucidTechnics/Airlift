var print = function print(_message)
{
	Packages.java.lang.System.out.println(_message);
};

try
{
    var log = Packages.java.util.logging.Logger.getLogger('airlift');
    var handlerArray = log.getHandlers();
}
catch(e)
{
	//not reporting these 
    print(e.message);
    print(e.stack);
}

exports.hasValue = function hasValue(_value)
{
	return (_value !== null && _value !== undefined);
};

exports.value = function value(_candidate, _default)
{
	var candidate;

	if (exports.hasValue(_candidate) === true)
	{
		candidate = _candidate;
	}
	else
	{
		candidate = _default;
	}

	return candidate;
};

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

var ErrorReporter = function(_prefix)
{
	var errors = {};
	var prefix = _prefix;
	
	this.allErrors = function() { return errors; };
	this.getErrors = function(_name)
	{
		if (_name === undefined || _name === null)
		{
			throw new Error('getErrors expects an error name.  To get allErrors use allErrors instead');
		}

		var name = exports.hasValue(prefix) ? [prefix, '.', _name].join('') : _name; 
		
		return errors[name];
	};

	this.hasErrors = function() { return (exports.isEmpty(this.allErrors()) === false); };

	this.report = function(_name, _error)
	{
		if (_name === null || _name === undefined)
		{
			throw new Error('Cannot report and error with an undefined or null name');
		}

		var name = exports.hasValue(prefix) ? [prefix, '[', _name, ']'].join('') : _name;
		
		var errorList = errors[name]||[];

		if (_error && Array.isArray(_error) === true)
		{
			errorList = errorList.concat(_error);
		}
		else if (_error && exports.hasValue(_error.name))
		{
			errorList.push(_error);
		}
		else if (_error && typeof _error === 'string')
		{
			var error = {name: name, message: _error, category: arguments[2]||'validation'};
			errorList.push(error);
		}

		errors[name] = errorList;
	};

	this.clear = function()
	{
		errors = {};
	};
};

exports.isJavaArray = function(_value)
{
	return (_value.getClass && _value.getClass().isArray() === true);
}

exports.isJavaScriptArray = function(_value)
{
	return Array.isArray(_value);
};

exports.isArray = function(_value)
{
	return exports.isJavaScriptArray(_value) || exports.isJavaArray(_value);
};

exports.createErrorReporter = function(_prefix)
{
	return new ErrorReporter(_prefix);
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
				
				exports.warning('multitry:', lastException.toString());
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
	
	if (exports.hasValue(_milliseconds) === true && _milliseconds.getTime)
	{
		date = new Packages.java.util.Date(_milliseconds.getTime());
	}
	else if (exports.hasValue(_milliseconds) === true)
	{
		date = new Packages.java.util.Date(_milliseconds);
	}
	else
	{
		date = new Packages.java.util.Date();
	}
	
	return date; 
};

exports.date = function date(_milliseconds)
{
	return exports.createDate(_milliseconds);
};

exports.createTimezone = function createTimezone(_timezoneString)
{
	return Packages.java.util.TimeZone.getTimeZone(_timezoneString);
};

exports.timezone = function timezone(_timezoneString)
{
	return exports.createTimezone(_timezoneString);
};

exports.formatDate = function formatDate(_utcDate, _formatString, _timezoneString)
{
	var timezoneString = _timezoneString || 'UTC';
	return Packages.airlift.util.FormatUtil().format(exports.adjustUTCDate(_utcDate, _timezoneString), _formatString);
};

exports.adjustUTCDate = function adjustUTCDate(_utcDate, _timezone)
{
	var timezone = exports.timezone(_timezone);
	return exports.createDate(_utcDate.getTime() + exports.getTimezoneOffset(timezone, _utcDate));
};

exports.getTimezoneOffset = function getTimezoneOffset(_timezone, _date)
{
	return new Packages.airlift.util.TimeZoneWrapper(_timezone).getOffset(_date.getTime());
};

exports.createCalendar = function createCalendar(_config)
{
	var date = (_config && _config.date) ? _config.date : null;
	var timezone = (_config && _config.timezone) ? exports.timezone(_config.timezone) : exports.timezone('UTC');
	var locale = (_config && _config.locale) ? _config.locale : Packages.java.util.Locale.getDefault();
	
	if (exports.hasValue(date) === true)
	{
		var calendar = Packages.java.util.Calendar.getInstance(timezone, locale);
		calendar.setTime(date);
		calendar.setTimeZone(timezone);
	}
	else
	{
		var calendar = Packages.java.util.Calendar.getInstance(timezone, locale);
	}

	return calendar;
};

exports.calendar = function calendar(_config)
{
	return exports.createCalendar(_config);
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

function PrimitiveConverter()
{
	this["java.lang.Integer"] = function(_value) { return (exports.hasValue(_value) === true) ?  _value.intValue() : null; };
	this["java.lang.Boolean"] = function(_value) { return (exports.hasValue(_value) === true) ? _value.booleanValue() : null; };
	this["java.lang.Long"] = function(_value) { return (exports.hasValue(_value) === true) ? _value.longValue() : null; };
	this["java.lang.Short"] = function(_value) { return (exports.hasValue(_value) === true) ? _value.shortValue() : null; };
	this["java.lang.Double"] = function(_value) { return (exports.hasValue(_value) === true) ? _value.doubleValue() : null; };
	this["java.lang.Float"] = function(_value) { return (exports.hasValue(_value) === true) ? _value.floatValue() : null; };
	this["java.lang.Character"] = function(_value) { return (exports.hasValue(_value) === true) ? _value.charValue() : null; };
	this["java.lang.Byte"] = function(_value) { return (exports.hasValue(_value) === true) ? _value.byteValue() : null; };
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
		set = new Packages.java.util.HashSet(_parameter);
	}
	else
	{
		set = new Packages.java.util.HashSet();
	}

	return set;
};

exports.orderedSet = exports.oSet = function orderedSet(_parameter)
{
	var set;

	if (exports.hasValue(_parameter) === true)
	{
		set = new Packages.java.util.TreeSet(_parameter);
	}
	else
	{
		set = new Packages.java.util.TreeSet();
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
		return exports.createKeysIterator(_entityList);
	};

	this.isEmpty = function() { return _entityList.isEmpty(); };
	this.size = function() { return _entityList.size(); }

	this.toArray = function()
	{
		var entities = _entityList.toArray();
		var length = entities.length;
		var ja = require('airlift/javaArray');
		
		var keys = ja.createArray(length, Packages.com.google.appengine.api.datastore.Key);
		
		for (var i = 0; i < length; i++)
		{
			keys[i] = entities[i].getKey();
		}

		return keys;
	};
	
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
	return new Packages.java.util.Collection(new KeysCollection(_entityList));
};

function KeysIterable(_entityList)
{
	this.iterator = function()
	{
		return exports.createKeysIterator(_entityList);
	};
};

exports.createKeysIterable = function createKeysIterable(_entityList)
{
	return new Packages.java.lang.Iterable(new KeysIterable(_entityList));
};

exports.getResourceMetadata = function(_name)
{
	return require('meta/r/' + _name).create();
};

exports.getAttributesMetadata = function(_name)
{
	return require('meta/a/' + _name).create();
};

exports.getWebRequestId = function()
{
	return Packages.com.google.apphosting.api.ApiProxy.getCurrentEnvironment().getAttributes().get("com.google.appengine.runtime.request_log_id");
};

exports.string = function(_stringOrJavaByteArray, _charSet)
{
	var charSet = _charSet||'UTF-8', string;

	if (exports.hasValue(_stringOrJavaByteArray) === true &&
		  _stringOrJavaByteArray.getClass &&
		  _stringOrJavaByteArray.getClass().isArray() === true)
	{
		string = new Packages.java.lang.String(_stringOrJavaByteArray, charSet);
	}
	else
	{
		string = new Packages.java.lang.String(_stringOrJavaByteArray);
	}
	
	return string;
};

exports.jss = function(_javaString)
{
	return new String(_javaString + '');
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
	return '' + (new Packages.airlift.util.ResourceUtil).load(_resourcePath);
};

exports.stringBuffer = function(_string)
{
	return new Packages.java.lang.StringBuffer(_string);
};

exports.appProfile = function()
{
	return new Packages.airlift.app.AppProfile();
};

exports.sanitize = function(_resource)
{
	delete _resource.auditUserId;
	delete _resource.auditRequestId;
	delete _resource.auditPostDate;
	delete _resource.auditPutDate;

	return _resource;
};

exports.printStackTraceToString = function(_throwable)
{
	var stringWriter = new Packages.java.io.StringWriter();
	var printWriter = new Packages.java.io.PrintWriter(stringWriter);
	_throwable.printStackTrace(printWriter);

	return stringWriter.toString();
};

exports.getJavaException = function(_exception)
{
	return ((_exception instanceof java.lang.Throwable) && _exception)||_exception.javaException;
};

exports.now = function()
{
	return Packages.java.lang.System.currentTimeMillis();
};

var httpCodes = {
'100':'Continue',
'101':'Switching Protocols',
'200':'OK',
'201':'Created',
'202':'Accepted',
'203':'Non-Authoritative Information',
'204':'No Content',
'205':'Reset Content',
'206':'Partial Content',
'300':'Multiple Choices',
'301':'Moved Permanently',
'302':'Found',
'303':'See Other',
'304':'Not Modified',
'305':'Use Proxy',
'306':'(Unused)',
'307':'Temporary Redirect',
'400':'Bad Request',
'401':'Unauthorized',
'402':'Payment Required',
'403':'Forbidden',
'404':'Not Found',
'405':'Method Not Allowed',
'406':'Not Acceptable',
'407':'Proxy Authentication Required',
'408':'Request Timeout',
'409':'Conflict',
'410':'Gone',
'411':'Length Required',
'412':'Precondition Failed',
'413':'Request Entity Too Large',
'414':'Request-URI Too Long',
'415':'Unsupported Media Type',
'416':'Requested Range Not Satisfiable',
'417':'Expectation Failed',
'500':'Internal Server Error',
'501':'Not Implemented',
'502':'Bad Gateway',
'503':'Service Unavailable',
'504':'Gateway Timeout',
'505':'HTTP Version Not Supported',
};

exports.assert = function(_assertion, _config)
{
	var n,m,c,r,h,e;
	
	if (!_assertion)
	{
		if (typeof _config === 'string')
		{
			m = _config;
			r = '400';
			e = {category: 'validation', m: m};
		}
		else
		{
			var validationErrors = false;
			
			for (var item in _config)
			{
				if (exports.hasValue(_config[item].length) === true)
				{
					validationErrors = true;
					break;
				}
			}

			if (validationErrors)
			{
				r = '400';
				n = '';
				m = 'Validation errors encountered';
				c = 'validation';
				e = _config;
			}
			else
			{				
				r = _config.r||_config.responseCode||'400';
				n = _config.n||_config.name||'';
				m = _config.m||_config.message||'';
				c = _config.c||_config.category||'validation';
				e = _config.e||_config.error||_config.errors||{name: n, category: c, message: m};
			}
		}

		h = httpCodes[r];

		m && exports.severe(m);
		e && exports.severe(JSON.stringify(e));

		throw {r: r, h: h, message: m, error: e};
	}
};

exports.bool = function(_boolean)
{
	var boolean = _boolean;
	
	if (_boolean.booleanValue)
	{
		boolean = _boolean.booleanValue();
	}

	return boolean;
};