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

	this.add = function(_path, _parameters)
	{
		var taskOptions = Packages.com.google.appengine.api.taskqueue.TaskOptions.Builder.withUrl(_path);

		taskOptions = taskOptions.method(com.google.appengine.api.taskqueue.TaskOptions.Method[this.method]);
		
		for (parameter in _parameters)
		{
			var parameters = _parameters[parameter];
			
			if (parameters instanceof Packages.java.util.Collection)
			{
				for (var item in Iterator(parameters))
				{
					taskOptions = taskOptions.param(parameter, item + new Packages.java.lang.String(''));
				}
			}
			else if (parameters && parameters.forEach)
			{
				parameters.forEach(function (_item)
				{
					taskOptions = taskOptions.param(parameter, _item + new Packages.java.lang.String(''));
				});
			}
			else
			{
				taskOptions = taskOptions.param(parameter, parameters + new Packages.java.lang.String(''));
			}
		}

		queue.add(taskOptions);
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
		return service.get(_key);
	};

	this.getAll = function(_keys)
	{
		return service.getAll(_keys);
	};

	this.put = function(_key, _value)
	{
		service.put(_key, _value);
	};

	this.putAll = function(_map)
	{
		service.putAll(_map);
	};

    this['delete'] = function(_key)
    {
        service['delete'](_key);
    };

	this.service = function()
	{
		return service;
	};
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