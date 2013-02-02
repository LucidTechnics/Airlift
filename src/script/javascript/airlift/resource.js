var web = require('./web');
var util = require('./util');

exports.view = function()
{
	var args = Array.prototype.slice.call(arguments, 0), length = args.length, view = [];

	for (var i = 0; i < length; i++)
	{
		var item = args[i];

		if (typeof item !== 'function')
		{
			if (Array.isArray(item) === true)
			{
				view = view.concat(item);
			}
			else
			{
				view.push(item);
			}
		}
		else
		{
			item.attributes = view;
			item();
			delete item.attributes;
		}
	}
};

exports.each = function(_resourceName, _resource, _function)
{
	var context = {};

	context.resourceName = _resourceName;
	context.resourceMeta = require('meta/r/' + _resourceName).create();
	context.attributesMetaData = require('meta/a/' + _resourceName).create().attributes;
	context.attributes = this.attributes || context.resourceMeta.attributes;
	context.WEB_CONTEXT = _function.WEB_CONTEXT || this.WEB_CONTEXT;
	var length = (context.attributes && context.attributes.length)||0;
	
	for (var i = 0; i < length; i++)
	{
		var name = context.attributes[i];
		_function.call(context, _resource[name], name, _resource);
	}
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
	var constructors = {};
	var createClass = util.createClass;
	
	return this.map(_resourceName, _resource, function(_value, _attributeName)
	{
		var type = this.attributesMetaData[_attributeName].type;

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
	var constructors = {};
	var createClass = util.createClass;

	this.each(_resourceName, _resource1, function(_value, _attributeName, _resource)
	{
		var type = this.attributesMetaData[_attributeName].type;

		var constructor = constructors[type] || createClass(type).getConstructor(createClass(type));
		constructors[type] = constructors[type] || constructor;

		_resource2[_attributeName] = constructor.newInstance(_value);
	});
};

exports.sequence = function(_error)
{
	var functions = Array.prototype.slice.call(arguments, 1);
	var length = functions && functions.length || 0;
	if (!functions || length < 1) { throw "please provide at least one function for sequence to execute"; }

	return function(_error, _value, _attributeName, _resource)
	{
		for (var i = 0; i < length; i++)
		{
			return functions[i].call(this, _error, _value, _attributeName, _resource);
		}
	};
};

exports.compose = function(_error)
{
	var functions = Array.prototype.slice.call(arguments, 1);
	var length = functions && functions.length || 0;
	if (!functions || length < 1) { throw "please provide at least one function for sequence to execute"; }

	functions = functions.reverse();

	return function(_error, _value, _attributeName, _resource)
	{
		for (var i = 0; i < length; i++)
		{
			return functions[i].call(this, _error, _value, _attributeName, _resource);
		}
	};
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

exports.bookkeeping = function(_resource, _userId, _postDate, _putDate)
{
	var userId = _userId||require('./web').getUserId()||'user id not provided';
	
	_resource.auditUserId = userId;
	_resource.auditPostDate = _postDate||util.createDate();
	_resource.auditPutDate = _putDate||postDate;
};

exports.audit = function(_resourceName, _resource, _action, _actionDate)
{
	var auditTrail = new Packages.airlift.servlet.rest.AirliftAuditTrail();

	auditTrail.id = util.guid();

	if (typeof _resource === "object")
	{
		auditTrail.resourceId = _resource.id;
		auditTrail.data = new Packages.com.google.appengine.api.datastore.Text(this.json(_resource));
	}
	else
	{
		auditTrail.resourceId = _resource;
		auditTrail.data = null;
	}
	
	auditTrail.action = _action;
	auditTrail.method = web.getMethod();
	auditTrail.resourceName = _resourceName;
	auditTrail.uri = web.getUri();
	auditTrail.handlerName = web.getHandlerName();
	auditTrail.userId = web.getUserId();
	auditTrail.actionDate = _actionDate||_resource.auditPutDate()||util.createDate();
	auditTrail.recordDate = auditTrail.actionDate;

	web.getAuditContext().insert(auditTrail);
};