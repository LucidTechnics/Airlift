var res = require('./resource');

exports.deentify = function(_resourceName, _entity)
{
	var resource = res.map(_resourceName, _resource, function(_value, _attributeName)
	{
		var value = _entity.getProperty();

		if ("com.google.appengine.api.datastore.Text".equalsIgnoreCase(value.class.getName()) === true)
		{
			value = value.toString();
		}

		return value;
	});

	resource.id = _entity.getKey().getName();

	return resource;
};