var func = require('./func');

exports.entify = function(_resourceName, _resource)
{
	var key = Packages.com.google.appengine.api.datastore.KeyFactory.createKey(_resourceName, _resource.id);
	var entity = new Packages.com.google.appengine.api.datastore.Entity(key);

	func.each(_resourceName, _resource, function(_value, _attributeName)
	{
		if ("id".equalsIgnoreCase(_attributeName) === false)
		{
			var attributesMetaData = require('meta/a/' + _resourceName).create().attributes;
			var isIndexable = attributesMetaData[_attributeName].isIndexable;
			var type = attributesMetaData[_attributeName].type;
			var value = _value;

			if (type === 'java.lang.String')
			{
				//500 is the Google App Engine limitation for Strings
				//persisted to the datastore.
				if (attributesMetaData.maxLength > 500)
				{
					value = new Package.com.google.appengine.api.datastore.Text(value);
				}
			}

			(isIndexable === true) ? entity.setProperty(_value) : entity.setUnindexedProperty(_value);
		}
	});

	return entity;
};

exports.deentify = function(_resourceName, _entity)
{
	var resource = func.map(_resourceName, _resource, function(_value, _attributeName)
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