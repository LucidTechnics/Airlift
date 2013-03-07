var u = require('airlift/util');

exports.handle = function(_web)
{
	u.info("IN HANDLER: " + Packages.java.lang.System.currentTimeMillis());
	
	var res = require('airlift/resource').create(_web);
	var incoming = require('airlift/incoming').create(_web);

	var errors;

	var callback = function()
	{
		var errors = this.allErrors();

		if (u.isEmpty(errors) === true)
		{
			var da = require('airlift/da/insert').create(_web);
			da.insert('person', this.resource);
			_web.setResponseCode('200');
		}
		else
		{
			u.severe('POST ERRORS: ' + res.json(errors));
			_web.setResponseCode('400');
		}
	};

	u.info('Bediako here we are Christmas!!!!!');
	
	var seq = res.sequence(incoming.convert, incoming.validate);

	res.each('person', {}, seq, callback);

	u.info("OUT handler: " + Packages.java.lang.System.currentTimeMillis());
};