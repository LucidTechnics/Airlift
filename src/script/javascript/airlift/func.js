exports.each = function(_resourceName, _resource, _function)
{
	var context = {};
	
	context.resourceName = _resourceName;
	context.resourceMeta = require('meta/r/' + _resourceName).create();
	context.attributes = context.resourceMeta.attributes;
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

exports.copy = function(_resourceName, c1, c2)
{
	this.each(_resourceName, c1, function(_value, _attributeName, _resource)
	{
		c2[_attributeName] = _value;
	});
};

exports.validate = function(_resourceName, _resource)
{
	var validator = require('./validator');
	
	return this.map(_resourceName, _resource, validator.validate);
};

exports.convert = function(_resourceName, _resource)
{
	var converter = require('./converter');

	for (var i in converter)
	{
		Packages.java.lang.System.out.println("func converter i: " + i + " has value: " + converter[i]);
	}
	
	return this.map(_resourceName, _resource, converter.convert);
};

exports.entify = function(_resourceName, _resource)
{
	var entity = new Entity(_resourceName);
	this.each(_resourceName, _resource, require('./entifier').entify.partial(entity));

	return entity;
};

exports.deentify = function(_resourceName, _entity)
{
	return this.map(_resourceName, _resource, require('./entifier').deentify);
};