var web = require('./web');

exports.typeOf = function(_string)
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

exports.isEmpty = function(o)
{
	var i, v;

	if (typeOf(o) === 'object')
	{
		for (i in o)
		{
			v = o[i];
			if (v !== undefined && typeOf(v) !== 'function')
			{
				return false;
			}
		}
	}

	return true;
};

exports.createClass = function(_className)
{
	return Packages.java.lang.Class.forName(_className);
};

exports.createError = function(_name, _message, _category)
{
	return {name: _name, message: _message, category: _category};
};

exports.isWhitespace = function(_string)
{
	return Packages.org.apache.commons.lang.StringUtils.isWhitespace(_string);
};

exports.hasValue = function(_value)
{
	return (_value !== null && _value !== undefined);
};

exports.reportError = function(_errors, _name, _error)
{
	var errorList = _errors[_name]||[];

	if (Array.isArray(_error) === true)
	{
		errorList = errorList.concat(_error);
	}
	else
	{
		errorList.push(error);
	}

	_errors[_name] = errorList;
};

exports.multiTry = function(_executable, _tryCount, _message, _completeFailure)
{
	var result, success = false;

	for (var i = 0; i < _tryCount && success === false; i++)
	{
		try
		{
			result = _executable(i);
			success = true;
		}
		catch(e)
		{
			this.LOG.warning(_message + " " + e.toString());

			if (i >= _tryCount)
			{
				_completeFailure && _completeFailure(_tries);
				this.LOG.severe("After this many tries: " + _tryCount + " - " +  e.toString());
				throw e;
			}
		}
	}

	return result;
};

exports.createDate = function(_milliseconds)
{
	var date;
	
	if (util.isDefined(_milliseconds) === true)
	{
		date = new Packages.java.util.Date(_milliseconds);
	}
	else
	{
		date = new Packages.java.util.Date();
	}
	
	return date; 
};

exports.createCalendar = function(_config)
{
	var date = (_config && _config.date) ? _config.date : null;
	var dateOffset = (_config && _config.dateOffset) ? _config.dateOffset : 0;
	var dateOffsetType = (_config && _config.dateOffsetType) ? _config.dateOffsetType : Packages.java.util.Calendar.MILLISECOND;
	var timeZone = (_config && _config.timeZone) ? _config.timeZone : web.getTimezone();
	var locale = (_config && _config.locale) ? _config.locale : web.getLocale();

	if (airlift.isDefined(date) === true)
	{
		var calendar = Packages.java.util.Calendar.getInstance(timeZone, locale);
		calendar.setTime(date);
		calendar.setTimeZone(timeZone);
	}
	else
	{
		var calendar = Packages.java.util.Calendar.getInstance(timeZone, locale);
	}

	calendar.add(dateOffsetType, dateOffset);

	return calendar;
};

exports.guid = function(_length)
{
	if (_length) { var id = Packages.airlift.util.IdGenerator.generate(_length); }
	else { var id = Packages.airlift.util.IdGenerator.generate(); }

	return id; 
};