var web = require('./web');
var util = require('./util');
var constructors = {}; //a cache for Java String, Collection, and primitive constructors

exports.each = function(_resourceName, _resource, _function, _context)
{
	var context = _context || {};

	context.resourceName = context.resourceName || _resourceName;
	context.resourceMetadata = context.resourceMetadata || require('meta/r/' + _resourceName).create();
	context.attributesMetadata = context.attributesMetadata || require('meta/a/' + _resourceName).create().attributes;
	context.attributes = this.attributes || context.attributes || context.resourceMeta.attributes;
	context.WEB_CONTEXT = context.WEB_CONTEXT || _function.WEB_CONTEXT || web;
	
	var length = (context.attributes && context.attributes.length)||0;
	
	for (var i = 0; i < length; i++)
	{
		var name = context.attributes[i];
		_function.call(context, _resource[name], name, _resource);
	}
};

exports.map = function(_resourceName, _resource, _function, _context)
{
	var result = {};

	this.each(_resourceName, _resource, function(_value, _attributeName, _resource)
	{
		result[_attributeName] = _function.call(this, _value, _attributeName, _resource);
	}, _context);

	return result;
};

exports.reduce = function(_base, _resourceName, _resource, _function, _context)
{
	this.each(_resourceName, _resource, function(_value, _attributeName, _resource)
	{
		_base = _function.call(this, _base, _value, _attributeName, _resource);
	}, _context);

	return _base;
};

exports.sequence = function()
{
	var errorReporter, functions;	

	var args = Array.prototype.slice.call(arguments, 0);

	if (args[0] && args[0].getErrors && args[0].report && args[0].getError)
	{
		errorReporter = args[0];
		functions = args.slice(1);
	}
	else
	{
		errorReporter = util.createErrorReporter();
		functions = args;
	}
		
	this.errorReporter = errorReporter;

	var length = functions && functions.length || 0;
	if (!functions || length < 1) { throw "please provide at least one function for sequence to execute"; }
	
	return function(_value, _attributeName, _resource)
	{
		for (var i = 0; i < length; i++)
		{
			functions[i].call(errorReporter, _value, _attributeName, _resource);
		}
	};
};

exports.compose = function()
{
	var errorReporter, functions;	

	var args = Array.prototype.slice.call(arguments, 0);

	if (args[0] && args[0].getErrors && args[0].report && args[0].getError)
	{
		errorReporter = args[0];
		functions = args.slice(1);
	}
	else
	{
		errorReporter = util.createErrorReporter();
		functions = args;
	}

	this.errorReporter = errorReporter;

	var length = functions && functions.length || 0;
	if (!functions || length < 1) { throw "please provide at least one function for sequence to execute"; }

	functions = functions.reverse();

	return function(_value, _attributeName, _resource)
	{
		for (var i = 0; i < length; i++)
		{
			functions[i].call(this, errorReporter, _value, _attributeName, _resource);
		}
	};
};

exports.toString = function(_resourceName, _resource, _context)
{
	return this.reduce(new Packages.java.lang.StringBuffer("[** ").append(_resourceName).append("\n"), _resourceName, _resource, function(_base, _value, _name, _resource)
	{
		return _base.append(_name).append(": ").append(_value||"").append("\n");
	}, context).toString();
};

exports.watch = function()
{
	var args = Array.prototype.slice.call(arguments, 0), length = args.length, watch = {}, executable, executed = false;

	for (var i = 0; i < length; i++)
	{
		var item = args[i];

		if (typeof item !== 'function')
		{
			watch[item] = 1;
		}
		else
		{
			executable = item;
		}
	}

	return function(_error, _value, _attributeName, _resource)
	{
		var result;

		if (!executed)
		{
			watch[_attributeName] && delete watch[_attributeName];

			if (util.isEmpty(watch) === true)
			{
				result = executable(_error, _value, _attributeName, _resource);
				executed = true;
			}
		}
		
		return result;
	}
};

var replacer = function replacer(key, value)
{
	var replacement = value;

	if (value instanceof java.util.Collection)
	{
		var list = [];

		for (var item in Iterator(value))
		{
			list.push(item);
		}

		return list;
	}
	else if (value instanceof java.util.Date)
	{
		replacement = Date(value.getTime());
	}
	else if (value instanceof java.lang.String)
	{
		replacement = new String(value);
	}
	else if (value instanceof java.lang.Number)
	{
		replacement = new Number(value);
	}
	else if (value instanceof java.lang.Boolean)
	{
		replacement = value.booleanValue();
	}
	else if (value instanceof java.lang.Character || value instanceof java.lang.Byte)
	{
		replacement = undefined;
	}

	return replacement;
};

exports.json = function(_resource, _replacer)
{
	return JSON.stringify(object, _replacer || replacer);
};

exports.audit = function(_config)
{
	var entity = _config.entity;
	var id = _config.id||_config.entity && _config.entity.getKey().getName();
	var action = _config.action;
	var actionDate = _config.actionDate||_entity.getProperty("auditPutDate")||util.createDate();
	var resourceName = _config.resourceName||_config.entity.getKind();	
	var auditTrail = new Packages.airlift.servlet.rest.AirliftAuditTrail();

	auditTrail.id = util.guid();
	auditTrail.resourceId = id;
	
	if (entity)
	{
		var propertiesMap = _entity.getProperties();
		propertiesMap.put('AIRLIFT_RESOURCE_NAME', resourceName);
		auditTrail.data = new Packages.com.google.appengine.api.datastore.Text(Packages.airlift.util.AirliftUtil.toJson(propertiesMap));
	}
	else
	{
		auditTrail.data = null;
	}
	
	auditTrail.action = _action;
	auditTrail.method = web.getMethod();
	auditTrail.resourceName = resourceName;
	auditTrail.uri = web.getUri();
	auditTrail.handlerName = web.getHandlerName();
	auditTrail.userId = web.getUserId();
	auditTrail.actionDate = actionDate;
	auditTrail.recordDate = util.createDate();

	web.getAuditContext().insert(auditTrail);
};

exports.copy = function(_target, _value, _attributeName)
{
	_target[_attributeName] = _value;
};

exports.deepCopy = function(_target, _value, _attributeName, _source)
{
	var type = this.attributesMetaData[_attributeName].type;
	var constructor = constructors[type] || createClass(type).getConstructor(createClass(type));
	constructors[type] = constructors[type] || constructor;

	_target[_attributeName] = constructor.newInstance(_value);
};

exports.clone = function(_value, _attributeName, _source)
{
	return _source[_attribute];
};

exports.deepClone = function(_target, _value, _attributeName, _source)
{
	var type = this.attributesMetaData[_attributeName].type;
	var constructor = constructors[type] || createClass(type).getConstructor(createClass(type));
	constructors[type] = constructors[type] || constructor;

	return constructor.newInstance(_value);
};