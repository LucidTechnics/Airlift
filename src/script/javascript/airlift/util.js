var web = require('./web');

exports.typeOf = function(value)
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

var ErrorReporter = function()
{
	var errors = {};

	this.getErrors = function() { return errors; };
	this.report = function(_name, _error) { this.reportError(errors, _name, _error); };
	this.getError = function(_name) { return errors[_name];}
};

exports.createErrorReporter = function()
{
	return new ErrorReporter();
}

exports.reportError = function(_errors, _name, _error)
{
	var errorList = _errors[_name]||[];

	if (Array.isArray(_error) === true)
	{
		errorList = errorList.concat(_error);
	}
	else
	{
		errorList.push(_error);
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
			var log = web.getLog();
			log.warning(_message + " " + e.toString());

			if (i >= _tryCount)
			{
				_completeFailure && _completeFailure(_tries);
				log.severe("After this many tries: " + _tryCount + " - " +  e.toString());
				throw e;
			}
		}
	}

	return result;
};

exports.createDate = function(_milliseconds)
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

exports.createCalendar = function(_config)
{
	var date = (_config && _config.date) ? _config.date : null;
	var dateOffset = (_config && _config.dateOffset) ? _config.dateOffset : 0;
	var dateOffsetType = (_config && _config.dateOffsetType) ? _config.dateOffsetType : Packages.java.util.Calendar.MILLISECOND;
	var timeZone = (_config && _config.timeZone) ? _config.timeZone : web.getTimezone();
	var locale = (_config && _config.locale) ? _config.locale : web.getLocale();

	if (this.hasValue(date) === true)
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

exports.trim = function(_string)
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

exports.print = function()
{
	var args = Array.prototype.slice.call(arguments, 0);

	for (var i = 0, length = args.length; i < length; i++)
	{
		if (i === 0)
		{
			Packages.java.lang.System.out.print(args[i]);
		}
		else
		{
			Packages.java.lang.System.out.print(' ' + args[i]);
		}
	}
};

exports.println = function()
{
	var args = Array.prototype.slice.call(arguments, 0);

	exports.print.apply(this, args);
	
	Packages.java.lang.System.out.println('');
};
					