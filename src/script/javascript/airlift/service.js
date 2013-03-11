function AppIdentityService()
{
	var service = com.google.appengine.api.appidentity.AppIdentityServiceFactory.getAppIdentityService();
	var appInfo = service.ParsedAppId		;
	
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
			taskOptions = taskOptions.param(parameter, _parameters[parameter]);
		}

		queue.add(taskOptions);
	};
}

exports.getQueueService = function(_name)
{
	return new QueueService(_name);
};

exports.getAppIdentityService = function()
{
	return new AppIdentityService();
};