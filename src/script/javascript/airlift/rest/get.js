exports.get = function get(_web, _config)
{
	var config = _config||{};
	var resource = require('airlift/da/get').create(_web).get(config.resourceName || _web.getResourceName(), config.id || _web.getId());
	var serializeResource = resourceSerializer||JSON.stringify;
	
	if (resource)
	{
		_web.setContent(resourceSerializer(resource));
	}
	else
	{
		_web.setResponseCode('404');
	}
	
	return resource; 
};