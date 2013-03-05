var u = require('airlift/util');

exports.handle = function(WEB_CONTEXT)
{
	u.info("IN HANDLER: " + Packages.java.lang.System.currentTimeMillis());
	var w = require('airlift/web').create(WEB_CONTEXT);
	var r = require('airlift/resource').create(WEB_CONTEXT);
	var da = require('airlift/da/get').create(WEB_CONTEXT);

	u.info('getting', w.getResourceName(), w.getId());
	
	var person = da.get(w.getResourceName(), w.getId());

	if (person)
	{
		w.setResponseCode('200');
		w.setContent(r.json(person));
	}
	else
	{
		w.setResponseCode('404');
	}
	
	u.info("OUT handler: " + Packages.java.lang.System.currentTimeMillis());
};