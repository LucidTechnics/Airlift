exports['delete'] = exports.del = function del(_web, _config)
{
	var config = _config||{};
	var da = require('airlift/da/delete').create(_web);	
	da['delete'](config.resourceName||_web.getResourceName(), config.id||_web.getId());
};