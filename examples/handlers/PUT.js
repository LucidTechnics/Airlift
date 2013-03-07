var u = require('airlift/util');

exports.handle = function(WEB_CONTEXT)
{
	u.info("IN HANDLER: " + Packages.java.lang.System.currentTimeMillis());

	var web = require('airlift/web').create(WEB_CONTEXT);
	var res = require('airlift/resource').create(WEB_CONTEXT);
	var incoming = require('airlift/incoming').create(WEB_CONTEXT);

	var errors;
	var seq = res.sequence(incoming.convert, incoming.validate);

	var callback = function(_resourceName, _resource)
	{
		u.info('updating', res.json(_resource));
		var errors = this.allErrors();

		if (u.isEmpty(errors) === true)
		{
			var da = require('airlift/da/update').create(WEB_CONTEXT);
			da.update(_resourceName, _resource);
			web.setResponseCode('200');
		}
		else
		{
			this.LOG.severe('POST ERRORS: ' + res.json(errors));
			web.setResponseCode('400');
		}
	};

	res.each('person', {}, seq, callback);

	u.info("OUT handler: " + Packages.java.lang.System.currentTimeMillis());
};