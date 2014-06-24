var util = require('airlift/util');

function AppIdentityService()
{
	var service = com.google.appengine.api.appidentity.AppIdentityServiceFactory.getAppIdentityService();
	var appInfo = service.ParsedAppId;
	
	this.getAppId = function()
	{
		return Packages.com.google.appengine.api.utils.SystemProperty.applicationId.get();
	};

	this.getDomain = function()
	{
		return appInfo.getDomain();
	};

	this.getPartition = function()
	{
		return appInfo.getPartition();
	};

	this.service = function()
	{
		return service;
	}
}

function QueueService(_name, _method)
{
	this.name = _name;
	this.method = _method||'POST';
	
	var queue = Packages.com.google.appengine.api.taskqueue.QueueFactory.getQueue(_name);

	this.add = function()
	{
		var parameters, taskOptions = Packages.com.google.appengine.api.taskqueue.TaskOptions.Builder.withMethod(com.google.appengine.api.taskqueue.TaskOptions.Method[this.method]);
		
		function addParameters(_parameters)
		{
			for (parameter in _parameters)
			{
				var parameters = _parameters[parameter];

				if (util.hasValue(parameters) === true)
				{
					if (parameters instanceof java.util.Collection)
					{
						for (var item in Iterator(parameters))
						{
							taskOptions = taskOptions.param(parameter, item + new Packages.java.lang.String(''));
						}
					}
					else if (parameters && parameters.forEach)
					{
						parameters.forEach(function(_item)
						{
							taskOptions = taskOptions.param(parameter, _item + new Packages.java.lang.String(''));
						});
					}
					else
					{
						taskOptions = taskOptions.param(parameter, parameters + new Packages.java.lang.String(''));
					}
				}
			}
		}

		if (/^pull$/i.test(this.method) === false)
		{
			parameters = arguments[1];
			taskOptions = Packages.com.google.appengine.api.taskqueue.TaskOptions.Builder.url(arguments[0]);
		}
		else
		{
			parameters = arguments[0];
		}

		addParameters(parameters);
		queue.add(taskOptions);
	};

	this['delete'] = function(_name)
	{
		queue.deleteTask(_name);
	};

	this.service = function()
	{
		return queue;
	}
}

function CacheService()
{
	var service = Packages.com.google.appengine.api.memcache.MemcacheServiceFactory.getMemcacheService();
	
	this.get = function(_key)
	{
		var item = null;

		try
		{
			item = service.get(_key);
		}
		catch(e)
		{
			util.warning('cache get of key:', _key, 'threw an exception');
			util.warning(e.message, e.stack);
		}

		return item;
	};

	this.getAll = function(_keys)
	{
		var items;
		
		try
		{
			items = service.getAll(_keys);
		}
		catch(e)
		{
			util.warning('cache getAll of key:', _keys, 'threw an exception');
			util.warning(e.message, e.stack);
		}

		return items;
	};

	this.put = function(_key, _value)
	{
		try
		{
			service.put(_key, _value);
		}
		catch(e)
		{
			util.warning('cache put of key:', _key, '-', value, 'threw an exception');
			util.warning(e.message, e.stack);
		}
	};

	this.putAll = function(_map)
	{
		try
		{
			service.putAll(_map);
		}
		catch(e)
		{
			util.warning('cache putAll of key value map:', _map, 'threw an exception');
			util.warning(e.message, e.stack);
		}
	};

    this['delete'] = function(_key)
	{
		try
		{
			service['delete'](_key);
		}
		catch(e)
		{
			util.warning('cache delete of key:', _key, 'threw an exception');
			util.warning(e.message, e.stack);
		}
    };

	this.clearAll = function()
	{
		try
		{
			service.clearAll(_key);
		}
		catch(e)
		{
			util.warning('cache clearAll threw an exception');
			util.warning(e.message, e.stack);
		}
	};
	
	this.service = function()
	{
		return service;
	};
}

function URLFetchService()
{
	var service = Packages.com.google.appengine.api.urlfetch.URLFetchServiceFactory.getURLFetchService();

	this.fetch = function(_request)
	{
		var response = service.fetch(_request);
		return response.getContent();
	};

	this.service = function()
	{
		return service;
	};
}

function ChannelService()
{
	var service = Packages.com.google.appengine.api.channel.ChannelServiceFactory.getChannelService();

	this.create = function(_id)
	{
		return service.createChannel(_id);
	};

	this.send = function(_key, _message)
	{
		service.sendMessage(new Packages.com.google.appengine.api.channel.ChannelMessage(_key, _message));
	};
}

exports.getChannelService = function()
{
	return new ChannelService();
}

exports.getURLFetchService = function()
{
	return new URLFetchService();
}

exports.getQueueService = function(_name, _method)
{
        return new QueueService(_name, _method);
};

exports.getAppIdentityService = function()
{
	return new AppIdentityService();
};

exports.getCacheService = function()
{
	return 	new CacheService();
}