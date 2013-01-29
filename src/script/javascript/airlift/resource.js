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

exports.clone = function(_resourceName, _resource)
{
	return this.map(_resourceName, _resource, function(_value)
	{
		return _value;
	});
};

exports.deepClone = function(_resourceName, _resource)
{
	var attributesMetaData = require('meta/a/' + _resourceName).create().attributes;
	var constructors = {};
	var createClass = require('./util').createClass;
	
	return this.map(_resourceName, _resource, function(_value, _attributeName)
	{
		var type = attributesMetaData[_attributeName].type;

		var constructor = constructors[type] || createClass(type).getConstructor(createClass(type));
		constructors[type] = constructors[type] || constructor;
		
		return constructor.newInstance(_value);
	});
};

exports.reduce = function(_base, _resourceName, _resource, _function)
{
	this.each(_resourceName, _resource, function(_value, _attributeName, _resource)
	{
		_base = _function.call(this, _base, _value, _attributeName, _resource);
	});

	return _base;
};

exports.copy = function(_resourceName, _resource1, _resource2)
{
	this.each(_resourceName, _resource1, function(_value, _attributeName, _resource)
	{
		_resource2[_attributeName] = _value;
	});
};

exports.deepCopy = function(_resourceName, _resource1, _resource2)
{
	var attributesMetaData = require('meta/a/' + _resourceName).create().attributes;
	var constructors = {};
	var createClass = require('./util').createClass;

	this.each(_resourceName, _resource1, function(_value, _attributeName, _resource)
	{
		var type = attributesMetaData[_attributeName].type;

		var constructor = constructors[type] || createClass(type).getConstructor(createClass(type));
		constructors[type] = constructors[type] || constructor;

		_resource2[_attributeName] = constructor.newInstance(_value);
	});
};

var seq = function(_resourceName, _resource, _length, _functions)
{
	var errors = {};

	this.each(_resourceName, _resource, function(_value, _attributeName, _resource)
	{
		for (var i = 0; i < _length; i++)
		{
			var error = functions[i].call(this, errors, _value, _attributeName, _resource);
			errors[_attributeName] = (errors[_attributeName] && errors[_attributeName].push(error)) || [ error ];
		}
	});

	return errors;
};

exports.sequence = function(_resourceName, _resource)
{
	var functions = Array.prototype.slice.call(arguments, 1);
	var length = functions && functions.length || 0;
	if (!functions || length < 1) { throw "please provide at least one function for sequence to execute"; }

	return seq(_resourceName, _resource, length, functions);
};

exports.compose = function(_resourceName, _resource)
{
	var functions = Array.prototype.slice.call(arguments, 1);
	var length = functions && functions.length || 0;
	if (!functions || length < 1) { throw "please provide at least one function for sequence to execute"; }

	functions = functions.reverse();

	return seq(_resourceName, _resource, length, functions);
};

exports.toString = function(_resourceName, _resource)
{
	var stringBuffer = new Packages.java.lang.StringBuffer("[** ");
	stringBuffer.append(_resourceName).append("\n");
	
	this.each(_resourceName, _resource, function(_value, _name)
	{
		stringBuffer.append(_name).append(": ").append(_value||"").append("\n"); 
	});

	return stringBuffer.append(" **]\n").toString();
};