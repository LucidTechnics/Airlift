var web = require('./web');
var util = require('./util');
var constructors = {}; //a cache for Java String, Collection, and primitive constructors

exports.each = function each(_resourceName, _resource, _function, _context)
{
	var context = _context || {};

	context.resourceName = context.resourceName || _resourceName;
	context.resourceMetadata = context.resourceMetadata || require('meta/r/' + _resourceName).create();
	context.attributesMetadata = context.attributesMetadata || require('meta/a/' + _resourceName).create().attributes;
	context.attributes = this.attributes || context.attributes || context.resourceMeta.attributes;
	context.WEB_CONTEXT = context.WEB_CONTEXT || _function.WEB_CONTEXT || web;

	var reporter = util.createErrorReporter();
	
	context.report = reporter.report;
	context.allErrors = reporter.allErrors;
	context.getErrors = reporter.getErrors;
						   
	var length = (context.attributes && context.attributes.length)||0;
	
	for (var i = 0; i < length; i++)
	{
		var name = context.attributes[i];

		try
		{
			_function.call(context, _resource[name], name, _resource);
		}
		catch(e)
		{
			e.javaException && this.LOG.info(e.javaException.getMessage());
			var category = e.category || _function.name || 'resource';
			var message = e.message || e.javaException && e.javaException.getMessage();
			this.LOG.severe('Exception: ' + context.resourceName + ':' + name + ':' + message + ':' + category);
			context.report(name, message, category);
		}
	}
};

exports.map = function map(_resourceName, _resource, _function, _context)
{
	var result = {};

	this.each(_resourceName, _resource, function(_value, _attributeName, _resource)
	{
		result[_attributeName] = _function.call(this, _value, _attributeName, _resource);
	}, _context);

	return result;
};

exports.reduce = function reduce(_base, _resourceName, _resource, _function, _context)
{
	this.each(_resourceName, _resource, function(_value, _attributeName, _resource)
	{
		_base = _function.call(this, _base, _value, _attributeName, _resource);
	}, _context);

	return _base;
};

exports.sequence = function sequence()
{
	var functions = Array.prototype.slice.call(arguments, 0);		
	
	var length = functions && functions.length || 0;
	if (!functions || length < 1) { throw "please provide at least one function for sequence to execute"; }
	
	return function(_value, _attributeName, _resource)
	{
		for (var i = 0; i < length; i++)
		{
			functions[i].call(this, _value, _attributeName, _resource);
		}
	};
};

exports.compose = function compose()
{
	var functions = Array.prototype.slice.call(arguments, 0);

	var length = functions && functions.length || 0;
	if (!functions || length < 1) { throw "please provide at least one function for sequence to execute"; }

	functions = functions.reverse();

	return function(_value, _attributeName, _resource)
	{
		for (var i = 0; i < length; i++)
		{
			functions[i].call(this, _value, _attributeName, _resource);
		}
	};
};

exports.toString = function toString(_resourceName, _resource, _context)
{
	return this.reduce(new Packages.java.lang.StringBuffer("[** ").append(_resourceName).append("\n"), _resourceName, _resource, function(_base, _value, _name, _resource)
	{
		return _base.append(_name).append(": ").append(_value||"").append("\n");
	}, context).toString();
};

exports.watch = function watch()
{
	var args = Array.prototype.slice.call(arguments, 0), watch, executable, executed = false;
	
	for (var i = 0, length = args.length; i < length; i++)
	{
		var item = args[i];

		if (typeof item !== 'function')
		{
			watch = watch || {};

			if (Array.isArray(item) === true)
			{
				for (var j = 0, jLength = item.length; i < jLength; i++)
				{
					watch[item[j]] = 1;
				}
			}
			else if (typeof item === 'string')
			{
				watch[item] = 1;
			}
		}
		else
		{
			executable = item;
		}
	}

	return function(_value, _attributeName, _resource)
	{
		var result;

		if (!watch)
		{
			watch = {};
			var attributes = this.attributes;
			
			for (var i = 0, length = attributes.length; i < length; i++)
			{
				watch[attributes[i]] = 1;
			}
		}

		if (!executed)
		{
			watch[_attributeName] && delete watch[_attributeName];

			if (util.isEmpty(watch) === true)
			{
				result = executable.call(this, _value, _attributeName, _resource);
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

exports.json = function json(_resource, _replacer)
{
	return JSON.stringify(object, _replacer || replacer);
};

exports.audit = function audit(_config)
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

exports.copy = function copy(_target, _value, _attributeName)
{
	_target[_attributeName] = _value;
};

exports.clone = function clone(_value)
{
	return _value;
};