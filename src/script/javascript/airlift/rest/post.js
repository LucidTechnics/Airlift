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
			_web.setContent(resourceSerialize(_resource));
		}
		else
		{
			errors = this.allErrors();
			util.info('ERRORS', JSON.stringify(this.allErrors()));
			_web.setResponseCode('400');
			_web.setContent(errorSerialize(this.allErrors()));
		}
	};

	var sequence = (config.pre && res.sequence(inc.convert, config.pre, inc.validate)) || res.sequence(inc.convert, inc.validate);
	sequence = (config.post && res.sequence(sequence, config.post)) || sequence;

	var callbackSequence = (config.preInsert && res.sequence(config.preInsert, callback)) || callback;

	util.info('calling resource.each', JSON.stringify(sequence()), JSON.stringify(callbackSequence()));
	res.each(resourceName, resource, sequence, callbackSequence, context);
	util.info('finished with resource.each');
	
	return {resource: resource, errors: errors};
};