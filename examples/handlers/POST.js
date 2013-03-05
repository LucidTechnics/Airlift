var u = require('airlift/util');

exports.handle = function(WEB_CONTEXT)
{
	var web = require('airlift/web').create(WEB_CONTEXT);

	u.info("IN HANDLER: " + Packages.java.lang.System.currentTimeMillis());
	
	var res = require('airlift/resource').create(WEB_CONTEXT);
	var incoming = require('airlift/incoming').create(WEB_CONTEXT);

	var errors;

	var callback = function()
	{
		var errors = this.allErrors();

		if (u.isEmpty(errors) === true)
		{
			var da = require('airlift/da/insert').create(WEB_CONTEXT);
			da.insert('person', this.resource);
			web.setResponseCode('200');
		}
		else
		{
			u.severe('POST ERRORS: ' + res.json(errors));
			web.setResponseCode('400');
		}
	};

	u.info('Bediako here we are Christmas!!!!!');
	
	var seq = res.sequence(incoming.convert, incoming.validate);

	res.each('person', {}, seq, callback);

	u.info("OUT handler: " + Packages.java.lang.System.currentTimeMillis());
};