var util = require('airlift/util');

exports.post = function(_web, _config)
{
	var res = require('airlift/resource').create(_web);
	var inc = require('airlift/incoming').create(_web);

	var config = _config||{};

	var resourceName = config.resourceName||_web.getResourceName();
	var id = config.id||_web.getId();
	var resource = config.resource||{};
	var context = config.context || undefined;
	var errors;
	var serializeResource = config.resourceSerializer||JSON.stringify;
	var serializeError = config.errorSerializer||JSON.stringify;
	
	var callback = function(_resourceName, _resource)
	{
		util.info('calling callback', _resourceName, JSON.stringify(_resource));
		
		if (this.hasErrors() === false)
		{
			util.info('no validation errors');
			
			var da = require('airlift/da/insert').create(_web);
			da.insert(resourceName, resource);
			_web.setResponseCode('201');
			_web.setContent(serializeResource(_resource));
		}
		else
		{
			errors = this.allErrors();
			util.info('ERRORS', JSON.stringify(this.allErrors()));
			_web.setResponseCode('400');
			_web.setContent(serializeError(this.allErrors()));
		}
	};

	var sequence = (config.pre && res.sequence.partial(inc.convert, config.pre, inc.validate)) || res.sequence.partial(inc.convert, inc.validate);
	sequence = (config.post && res.sequence.partial(sequence, config.post)) || sequence;

	var callbackSequence = (config.preInsert && res.sequence.partial(config.preInsert, callback)) || res.sequence.partial(callback);

	util.info('calling resource.each on ', JSON.stringify(resource));
	res.each(resourceName, resource, sequence(), callbackSequence(), config.context);
	util.info('finished with resource.each');
	
	return {resource: resource, errors: errors};
};