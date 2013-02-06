var da = require('./da/collect');
var web = require('../web');

exports.collect = function(_config)
{
	var config = _config||{};

	var resourceName = config.resourceName||this.resourceName;
	
	return da.collect(resourceName, config);
};