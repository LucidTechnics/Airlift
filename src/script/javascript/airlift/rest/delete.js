var da = require('./da/delete');
var web = require('../web');

exports.delete = function(_config)
{
	var config = _config||{};

	var resourceName = config.resourceName||this.resourceName;
	var id = config.id||web.getId();
	
	da['delete'](resourceName, id);
};