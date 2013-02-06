var da = require('./da/get');
var web = require('../web');

exports.get = function(_config)
{
	var config = _config||{};

	var resourceName = config.resourceName||this.resourceName;
	var id = config.id||web.getId();
	
	return da.get(resourceName, id);
};