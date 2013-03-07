var u = require('airlift/util');

exports.handle = function(_web)
{
	u.info("IN HANDLER: " + Packages.java.lang.System.currentTimeMillis());

	var res = require('airlift/resource').create(_web);
	var incoming = require('airlift/incoming').create(_web);

	var errors;
	var seq = res.sequence(incoming.convert, incoming.validate);

	var callback = function(_resourceName, _resource)
	{
		u.info('updating', res.json(_resource));
		var errors = this.allErrors();

		if (u.isEmpty(errors) === true)
		{
			var da = require('airlift/da/update').create(_web);
			da.update(_resourceName, _resource);
			_web.setResponseCode('200');
		}
		else
		{
			this.LOG.severe('POST ERRORS: ' + res.json(errors));
			_web.setResponseCode('400');
		}
	};

	res.each('person', {}, seq, callback);

	u.info("OUT handler: " + Packages.java.lang.System.currentTimeMillis());
};