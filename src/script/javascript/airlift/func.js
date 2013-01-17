exports.partial = function(_function)
{
	var restOfArguments = Array.prototype.slice.call(arguments, 1);

	return function()
	{
		var functionArguments = restOfArguments.concat(Array.prototype.slice.call(arguments, 0));;
		return _function.apply(_function, functionArguments); //honestly can you set the this to the function itself?
	};
};

exports.each = function(_resourceName, _resource, _function)
{
	var context = {};
	
	context.resourceName = _resourceName;
	context.resourceMeta = require('meta/r/' + _resourceName).create();
	context.attributes = context.resourceMeta.attributes;
	
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
		result[_attributeName] = _function.call(this, _attributeName, _resource);
	});

	return result;
};

exports.copy = function(_resourceName, c1, c2)
{
	this.each(_resourceName, c1, function(_value, _attributeName, _resource)
	{
		c2[_attributeName] = _value;
	});
};

exports.validate = function(_resourceName, _resource)
{
	var validator = require('util/validator');
	
	return this.map(_resourceName, _resource, validator.validate);
};

exports.convert = function(_resourceName, _resource)
{
	var converter = require('util/converter');

	return this.map(_resourceName, _resource, convertor.convert);
};

exports.serialize = function(_resourceName, _resource)
{
	var entity = new Entity(_resourceName);
	this.each(_resourceName, _resource, this.partial(require('util/serializer').serialize, entity));

	return entity;
};

exports.deserialize = function(_resourceName, _entity)
{
	return this.map(_resourceName, _resource, require('util/deserializer').deserialize);
};