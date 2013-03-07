var da = require('./da/collect');

exports.collect = function(_config)
{
	var config = _config||{};

	var resourceName = config.resourceName||this.resourceName;
	
	return da.collect(resourceName, config);
};

exports.collectBy = function(_attributeName, _value, _config)
{
	var config = _config||{};

	var resourceName = config.resourceName||this.resourceName;

	return da.collectBy(resourceName, _attributeName, _value, config);
};

exports.collectByMembership = function(_attributeName, _membershipList, _config)
{
	var config = _config||{};

	var resourceName = config.resourceName||this.resourceName;

	return da.collectBy(resourceName, _attributeName, _membershipList, config);
};