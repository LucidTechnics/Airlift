var da = require('./da/update');
var res = require('../resource');
var ingest = require('../ingest');

exports.put = function(_config)
{
	var config = _config||{};

	var resourceName = config.resourceName||this.resourceName;
	var resource = config.resource;
	var errors = config.errors||{};
	var sequence = config.sequence||res.sequence.partial(errors);

	da.update(resourceName, resource, sequence.partial(ingest.convert, ingest.validate));

	return {resource: resource, errors: sequence.errors};
};