var func = require('./func');

exports.copy = function(_resourceName, _resource1, _resource2)
{
	func.each(_resourceName, _resource1, function(_value, _attributeName, _resource)
	{
		_resource2[_attributeName] = _value;
	});
};
