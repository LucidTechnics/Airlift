var u = require('airlift/util');

exports.handle = function(_web)
{
	u.info("IN HANDLER: " + Packages.java.lang.System.currentTimeMillis());
	
	var da = require('airlift/da/delete').create(_web);

	u.info('deleting', _web.getResourceName(), _web.getId());
	
	da['delete'](_web.getResourceName(), _web.getId());
	_web.setResponseCode('200');
	
	u.info("OUT handler: " + Packages.java.lang.System.currentTimeMillis());
};