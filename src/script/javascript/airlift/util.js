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
