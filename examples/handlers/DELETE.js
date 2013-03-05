var u = require('airlift/util');

exports.handle = function(WEB_CONTEXT)
{
	var w = require('airlift/web').create(WEB_CONTEXT);

	u.info("IN HANDLER: " + Packages.java.lang.System.currentTimeMillis());
	
	var da = require('airlift/da/delete').create(WEB_CONTEXT);

	u.info('deleting', w.getResourceName(), w.getId());
	
	da['delete'](w.getResourceName(), w.getId());
	w.setResponseCode('200');
	
	u.info("OUT handler: " + Packages.java.lang.System.currentTimeMillis());
};