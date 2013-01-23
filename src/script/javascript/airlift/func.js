exports.each = function(_resourceName, _resource, _function)
{
	var context = {};
	
	context.resourceName = _resourceName;
	context.resourceMeta = require('meta/r/' + _resourceName).create();
	context.attributes = this.attributes || context.resourceMeta.attributes;
	context.WEB_CONTEXT = _function.WEB_CONTEXT || this.WEB_CONTEXT;
	
	context.attributes.forEach(function(_attributeName)
	{
		_function.call(context, _resource[_attributeName], _attributeName, _resource);
	});
};

exports.map = function(_resourceName, _resource, _function)
{
	var result = {};

	this.each(_resourceName, _resource, function(_value, _attributeName, _resource)
	{
		result[_attributeName] = _function.call(this, _value, _attributeName, _resource);
	});
	
	return result;
};

exports.sequence = function(_resourceName, _resource, _status)
{
	var args = Array.prototype.slice.call(arguments, 2);
	var length = args && args.length || 0;
	if (!args || length < 1) { throw "please provide at least one function for sequence to execute"; }

	var stack = {};
	
	this.each(_resourceName, _resource, function(_value, _attributeName, _resource, _status )
	{
		for (var i = 0; i < length; i++)
		{
			var status = args[i].call(this, _value, _attributeName, _resource, stack);
			stack[_attributeName] = (stack[_attributeName] && stack[_attributeName].push(status)) || [ status ];
		}
	});

	return stack;
};