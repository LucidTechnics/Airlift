function Outgoing(_web)
{
	var that = this;
	var javaArray = require('./javaArray');
	var util = require('./util');

	var password = _web.getInitParameter("a.cipher.password");
	var initialVector = _web.getInitParameter("a.cipher.initial.vector");
	var revolutions = _web.getInitParameter("a.cipher.revolutions")||20;

	this.deentify = function deentify(_entity, _value, _attributeName, _attributeMetadata)
	{
		var value = _entity.getProperty(_attributeName);

		if (value instanceof com.google.appengine.api.datastore.Text)
		{
			value = value.getValue();
		}
		else if ("id".equals(_attributeName) === true)
		{
			value = _entity.getKey().getName();
		}
		else if (value instanceof com.google.appengine.api.datastore.EmbeddedEntity)
		{
			var object = {};

			var resourceName = util.string(_attributeMetadata.mapTo).split("\.")[0];
			res.each(resourceName, object, that.deentify.partial(value));
			value = object;
		}
		else if (value instanceof java.util.Collection && value.isEmpty() === false)
		{
			if (value.get(0) instanceof com.google.appengine.api.datastore.EmbeddedEntity)
			{
				var resourceName = util.string(_attributeMetadata.mapTo).split("\.")[0];
				var objectList = new Packages.java.util.ArrayList();
				
				for (var embeddedEntity in Iterator(value))
				{
					var object = {};
					res.each(resourceName, object, that.deentify.partial(embeddedEntity));
					objectList.add(object);
				}

				value = objectList;
			}
		}

		return value;
	};

	this.decrypt = function decrypt(_entity, _value, _attributeName, _attributeMetadata)
	{
		if (util.isEmpty(this.getErrors(_attributeName)) === true && attributeMetadata.encrypted === true)
		{
		  var attributeEncryptedName = _attributeName + "Encrypted";
		  _entity.setUnindexedProperty(_attributeName, Packages.airlift.util.AirliftUtil.convertToString(Packages.airlift.util.AirliftUtil.decrypt(((_entity.getProperty(attributeEncryptedName) && _entity.getProperty(attributeEncryptedName).getBytes())||javaArray.byteArray(0)), password, initialVector, null, null, null, null, revolutions)));
		}
	};
}

exports.create = function(_web)
{
	if (!_web) { throw 'Unable to create outgoing module without a airlift/web object' }

	return new Outgoing(_web);
};