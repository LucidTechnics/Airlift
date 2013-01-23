var util = require('./util');

exports.trim = function(_string)
{
	var trimmed = _string;

	if (_string)
	{
		trimmed = Packages.org.apache.commons.lang.StringUtils.trim(_string);

		if (util.typeOf(_string) === 'string')
		{
			trimmed = trimmed + "";
		}
	}

	return trimmed;
};