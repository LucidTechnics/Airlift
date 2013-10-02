exports.put = function(_web, _config)
{
	var res = require('airlift/resource').create(_web);
	var inc = require('airlift/incoming').create(_web);

	var config = _config||{};

	var resourceName = config.resourceName||_web.getResourceName();
	var id = config.id||_web.getId();
	var resource = config.resource||{};
	var errors;
	var serializeResource = config.resourceSerializer||JSON.stringify;
	var serializeError = config.errorSerializer||JSON.stringify;

	var callback = function(_resourceName, _resource)
	{
		if (this.hasErrors() === false)
		{
			var da = require('airlift/da/update').create(_web);
			da.update(resourceName, resource);
			_web.setResponseCode('200');
			_web.setContent(serializeResource(_resource));
		}
		else
		{
			errors = this.allErrors();
			_web.setResponseCode('400');
			_web.setContent(serializeError(this.allErrors()));
		}
	};

	var sequence = (config.pre && res.sequence.partial(inc.convert, config.pre, inc.validate)) || res.sequence.partial(inc.convert, inc.validate);
	sequence = (config.post && res.sequence.partial(sequence(), config.post)) || sequence;

	var callbackSequence = (config.preUpdate && res.sequence.partial(config.preUpdate, callback)) || res.sequence.partial(callback);
	
	res.each(resourceName, resource, sequence(), callbackSequence(), context);

	return {resource: resource, errors: errors};
};