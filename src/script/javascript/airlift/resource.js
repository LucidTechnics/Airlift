function Resource(_web)
{
	var util = require('./util');
	
	var constructors = {}; //a cache for Java String, Collection, and primitive constructors

	this.each = function each(_resourceName, _resource, _function, _callback, _context)
	{
		var context = _context || {};

		context.resource = _resource||{};
		context.resourceName = context.resourceName || _resourceName;
		context.resourceMetadata = context.resourceMetadata || require('meta/r/' + _resourceName).create();
		context.attributesMetadata = context.attributesMetadata || require('meta/a/' + _resourceName).create();
		context.foreignKeys = context.attributesMetadata.foreignKeys;
		context.attributes = this.attributes || context.attributes || context.resourceMetadata.attributes;
		context.web = _web;
		context.WEB_CONTEXT = _web.WEB_CONTEXT;

		var reporter = util.createErrorReporter();

		context.report = reporter.report;
		context.allErrors = reporter.allErrors;
		context.getErrors = reporter.getErrors;

		var length = (context.attributes && context.attributes.length)||0;

		for (var i = 0; i < length; i++)
		{
			var name = context.attributes[i];		
			_function.call(context, context.resource[name], name, context.resource, context.attributesMetadata.attributes[name]);
		}

		if (_callback)
		{
			_callback.call(context, _resourceName, context.resource);
		}
	};

	this.map = function map(_resourceName, _resource, _function, _callback, _context)
	{
		var result = {};

		this.each(_resourceName, _resource, function(_value, _attributeName, _resource, _metadata)
		{
			result[_attributeName] = _function.call(this, _value, _attributeName, _resource, _metadata);
		}, _callback, _context);

		return result;
	};

	this.reduce = function reduce(_base, _resourceName, _resource, _function, _callback, _context)
	{
		this.each(_resourceName, _resource, function(_value, _attributeName, _resource, _metadata)
		{
			_base = _function.call(this, _base, _value, _attributeName, _resource, _metadata);
		}, _callback, _context);

		return _base;
	};

	this.sequence = function sequence()
	{
		var functions = Array.prototype.slice.call(arguments, 0);		

		var length = functions && functions.length || 0;
		if (!functions || length < 1) { throw "please provide at least one function for sequence to execute"; }

		return function()
		{
			var args = (arguments.length && Array.prototype.slice.call(arguments, 0)) || [];
			var result;

			for (var i = 0; i < length; i++)
			{
				if (this.resourceName)
				{
					if (args.length === 5) //this is reduce
					{
						result = functions[i].call(this, args[0], args[3][args[2]], args[2], args[3], args[4]);
					}
					else if (args.length === 4) //basically each or map
					{
						result = functions[i].call(this, args[2][args[1]], args[1], args[2], args[3]);
					}
				}
				else //sequence is called outside of resource.each/map/reduce
				{
					result = functions[i].apply(this, args);
				}
			}

			return result;
		};
	};

	this.compose = function compose()
	{
		var functions = Array.prototype.slice.call(arguments, 0);

		var length = functions && functions.length || 0;
		if (!functions || length < 1) { throw "please provide at least one function for compose to execute"; }

		var value;

		return function()
		{
			var args = Array.prototype.slice.call(arguments, 0);

			for (var i = 0; i < length; i++)
			{			
				args[0] = functions[i].apply(this, args); //replace first argument of args with the result of this execution.
			}

			return args[0];
		};
	};

	this.toString = function toString(_resourceName, _resource, _context)
	{
		return this.reduce(new Packages.java.lang.StringBuffer("[** ").append(_resourceName||"no resource name!!!").append("\n"), _resourceName, _resource, function(_base, _value, _name, _resource)
		{
			return _base.append(_name).append(": ").append(_value||"").append("\n");
		}, _context).toString();
	};

	this.watch = function watch()
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
		else if (_value instanceof java.util.Map)
		{
			var map = {};

			for (var item in Iterator(_value.keySet()))
			{
				map[item] = _value.get(item);
			}

			replacement = map;
		}
		else if (_value instanceof java.util.Date)
		{
			replacement = new Date(_value.getTime()).toJSON();
		}
		else if (_value instanceof java.lang.String)
		{
			replacement = new String(_value);
		}
		else if (_value && _value.getClass && _value.getClass().isArray() &&
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
		else if (_value && _value.getClass && _value.getClass().isArray() === true) //arrays other than java.lang.String[] are not supported
		{
			replacement = undefined;
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
		else if (_value && _value.getClass)  
		{
			util.info('No replacement for:', _value.getClass());
		}
		
		return replacement;
	};

	this.json = function json(_resource, _replacer)
	{
		util.info('START JSON');
		for (var item in _resource)
		{
			util.info('resource item', item, _resource[item], _resource[item] && _resource[item].getClass && _resource[item].getClass());
		}
		
		var result = JSON.stringify(_resource, _replacer || replacer);
		util.info('END JSON');
		
		return result;
	};

	this.audit = function audit(_config)
	{
		var entity = _config.entity;
		var id = _config.id||_config.entity && _config.entity.getKey().getName();
		var action = _config.action;
		var resourceName = _config.resourceName||entity.getKind();	
		var auditTrail = new Packages.airlift.servlet.rest.AirliftAuditTrail();

		auditTrail.id = util.guid();
		auditTrail.resourceId = id;

		if (entity)
		{
			var propertiesMap = new Packages.java.util.HashMap(entity.getProperties());
			propertiesMap.put('AIRLIFT_RESOURCE_NAME', resourceName);
			auditTrail.data = new Packages.com.google.appengine.api.datastore.Text(this.json(propertiesMap));
		}
		else
		{
			auditTrail.data = null;
		}

		var currentDate = util.createDate();

		auditTrail.setAction(action);
		auditTrail.setMethod(_web.getMethod());
		auditTrail.setResource(resourceName);
		auditTrail.setUri(_web.getUri());
		auditTrail.setHandlerName(_web.getHandlerName());
		auditTrail.setUserId(_web.getUserId());
		auditTrail.setActionDate(currentDate);
		auditTrail.setRecordDate(currentDate);
		auditTrail.requestId = com.google.apphosting.api.ApiProxy.getCurrentEnvironment().getAttributes().get("com.google.appengine.runtime.request_log_id");

		_web.getAuditContext().insert(auditTrail);

		util.println('Finished audit');
	};

	this.copy = function copy(_target, _value, _attributeName)
	{
		_target[_attributeName] = _value;
	};

	this.clone = function clone(_value)
	{
		return _value;
	};
}

exports.create = function(_web)
{
	if (!_web) { throw 'Unable to create resource module without an airlift/web object' }

	return new Resource(_web);
};