var u = require('airlift/util');

exports.handle = function(_web)
{
	u.info("IN HANDLER: " + Packages.java.lang.System.currentTimeMillis());
	var r = require('airlift/resource').create(WEB_CONTEXT);
	var da = require('airlift/da/get').create(WEB_CONTEXT);

	u.info('getting', _web.getResourceName(), _web.getId());
	
	var person = da.get(_web.getResourceName(), _web.getId());

	if (person)
	{
		_web.setResponseCode('200');
		_web.setContent(r.json(person));
	}
	else
	{
		_web.setResponseCode('404');
	}
	
	u.info("OUT handler: " + Packages.java.lang.System.currentTimeMillis());
};