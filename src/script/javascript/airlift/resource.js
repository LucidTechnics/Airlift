var web = require('./web');
var util = require('./util');
var constructors = {}; //a cache for Java String, Collection, and primitive constructors

exports.each = function each(_resourceName, _resource, _function, _context)
{
	var context = _context || {};

	context.resourceName = context.resourceName || _resourceName;
	context.resourceMetadata = context.resourceMetadata || require('meta/r/' + _resourceName).create();
	context.attributesMetadata = context.attributesMetadata || require('meta/a/' + _resourceName).create();
	context.foreignKeys = context.attributesMetadata.foreignKeys;
	context.attributes = this.attributes || context.attributes || context.resourceMeta.attributes;
	context.web = web.init(context.WEB_CONTEXT || _function.WEB_CONTEXT || this.WEB_CONTEXT);
	context.log = web.log;
	
	var reporter = util.createErrorReporter();
	
	context.report = reporter.report;
	context.allErrors = reporter.allErrors;
	context.getErrors = reporter.getErrors;
						   
	var length = (context.attributes && context.attributes.length)||0;
	
	for (var i = 0; i < length; i++)
	{
		var name = context.attributes[i];		
		_function.call(context, _resource[name], name, _resource, context.attributesMetadata.attributes[name]);
	}
};

exports.map = function map(_resourceName, _resource, _function, _context)
{
	var result = {};

	this.each(_resourceName, _resource, function(_value, _attributeName, _resource, _metadata)
	{
		result[_attributeName] = _function.call(this, _value, _attributeName, _resource, _metadata);
	}, _context);

	return result;
};

exports.reduce = function reduce(_base, _resourceName, _resource, _function, _context)
{
	this.each(_resourceName, _resource, function(_value, _attributeName, _resource, _metadata)
	{
		_base = _function.call(this, _base, _value, _attributeName, _resource, _metadata);
	}, _context);

	return _base;
};

exports.sequence = function sequence()
{
	var functions = Array.prototype.slice.call(arguments, 0);		
	
	var length = functions && functions.length || 0;
	if (!functions || length < 1) { throw "please provide at least one function for sequence to execute"; }
	
	return function(_value, _attributeName, _resource, _metadata)
	{
		for (var i = 0; i < length; i++)
		{
			var value = _resource && _attributeName && _resource[_attributeName]||null;
			functions[i].call(this, value, _attributeName, _resource, _metadata);
		}
	};
};

exports.compose = function compose()
{
	var functions = Array.prototype.slice.call(arguments, 0);

	var length = functions && functions.length || 0;
	if (!functions || length < 1) { throw "please provide at least one function for sequence to execute"; }

	functions = functions.reverse();

	return function(_value, _attributeName, _resource, _metadata)
	{
		for (var i = 0; i < length; i++)
		{
			var value = _resource && _attributeName && _resource[_attributeName]||null;
			functions[i].call(this, value, _attributeName, _resource, _metadata);
		}
	};
};

exports.toString = function toString(_resourceName, _resource, _context)
{
	return this.reduce(new Packages.java.lang.StringBuffer("[** ").append(_resourceName||"no resource name!!!").append("\n"), _resourceName, _resource, function(_base, _value, _name, _resource)
	{
		return _base.append(_name).append(": ").append(_value||"").append("\n");
	}, _context).toString();
};

exports.watch = function watch()
{
	var args = Array.prototype.slice.call(arguments, 0), watch, executable, executed = false;
	
	for (var i = 0, length = args.length; i < length; i++)
	{
		var item = args[i];

		if (typeof item === 'string' || Array.isArray(item) === true)
		{
			watch = watch || {};

			if (Array.isArray(item) === true)
			{
				for (var j = 0, jLength = item.length; j < jLength; j++)
				{
					watch[item[j]] = 1;
				}
			}
			else
			{
				watch[item] = 1;
			}
		}
		else
		{
			executable = item;
		}
	}

	return function(_value, _attributeName, _resource, _metadata)
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
				result = executable.call(this, _value, _attributeName, _resource, _metadata);
				executed = true;
			}
		}
		
		return result;
	}
};

var replacer = function replacer(_key, _value)
{
	var replacement = _value;

	if (_value instanceof java.util.Collection)
	{
		var list = [];

		for (var item in Iterator(_value))
		{
			list.push(item);
		}

		replacement = list;
	}
	else if (_value instanceof java.util.Date)
	{
		replacement = Date(_value.getTime());
	}
	else if (_value instanceof java.lang.String)
	{
		replacement = new String(_value);
	}
	else if (_value.length && _value.getClass() &&
			 _value.getClass().getComponentType() &&
			 "java.lang.String".equals(_value.getClass().getComponentType().getName()) === true)
	{
		var list = [];

		for (var i = 0, length = _value.length; i < length; i++)
		{
			list.push(_value[i]);
		}
		
		replacement = list;
	}
	else if (_value instanceof java.lang.Number)
	{
		replacement = new Number(_value);
	}
	else if (_value instanceof java.lang.Boolean)
	{
		replacement = _value.booleanValue();
	}
	else if (_value instanceof java.lang.Character || _value instanceof java.lang.Byte)
	{
		//do not show a property with this type.
		replacement = undefined;
	}

	return replacement;
};

exports.json = function json(_resource, _replacer)
{
	return JSON.stringify(_resource, _replacer || replacer);
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