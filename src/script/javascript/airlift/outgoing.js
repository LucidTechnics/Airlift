function Outgoing(_web)
{
	var that = this;
	var javaArray = require('./javaArray');
	var util = require('./util');

	var password = _web.getInitParameter("a.cipher.password");
	var initialVector = _web.getInitParameter("a.cipher.initial.vector");
	var revolutions = _web.getInitParameter("a.cipher.revolutions")||20;

	var res = require('airlift/resource').create(_web);
	
	this.deentify = function deentify(_entity, _value, _attributeName, _resource, _attributeMetadata)
	{
		var value = _entity.getProperty(_attributeName)||undefined;

		if (value instanceof com.google.appengine.api.datastore.Text)
		{
			value = value.getValue();
		}
		else if (value instanceof com.google.appengine.api.datastore.Blob)
		{
			value = value.getBytes();
		}
		else if ("id".equals(_attributeName) === true)
		{
			var key = _entity.getKey();
			value = (key && key.getName())||undefined;
		}
		else if (value instanceof com.google.appengine.api.datastore.EmbeddedEntity)
		{
			var object = {};
			res.each(_attributeMetadata.mapTo, object, that.deentify.partial(value));
			value = object;
		}
		else if (value instanceof java.util.Collection && value.isEmpty() === false)
		{
			function getFirstValue(_collection)
			{
				var value;
				
				if (_collection.get)
				{
					value = _collection.get(0);
				}
				else
				{
					var iterator = _collection.iterator();
					value =  iterator.hasNext() && iterator.next();
				}

				return value;
			}
			
			if (getFirstValue(value) instanceof com.google.appengine.api.datastore.EmbeddedEntity)
			{
				var objectCollection = (_attributeMetadata.type + '' === 'list') ? new Packages.java.util.ArrayList() : new Packages.java.util.HashSet();
				
				for (var embeddedEntity in Iterator(value))
				{
					var object = {};
					res.each(_attributeMetadata.mapToMany, object, that.deentify.partial(embeddedEntity));
					objectCollection.add(object);
				}
				
				value = objectCollection;
			}
		}
		else
		{
			value = util.primitive(value);
		}

		_resource[_attributeName] = value;
		
		return value;
	};

	this.decrypt = function decrypt(_entity, _value, _attributeName, _resource, _attributeMetadata)
	{
		var decryptedValue = _value;
		
		if (util.isEmpty(this.getErrors(_attributeName)) === true && attributeMetadata.encrypted === true)
		{
			var attributeEncryptedName = _attributeName + "Encrypted";
			decryptedValue = Packages.airlift.util.AirliftUtil.convertToString(Packages.airlift.util.AirliftUtil.decrypt(((_entity.getProperty(attributeEncryptedName) && _entity.getProperty(attributeEncryptedName).getBytes())||javaArray.byteArray(0)), password, initialVector, null, null, null, null, revolutions));
			_entity.setUnindexedProperty(_attributeName, decryptedValue);
		}

		return decryptedValue;
	};
}

exports.create = function(_web)
{
	if (!_web) { throw 'Unable to create outgoing module without a airlift/web object' }

	return new Outgoing(_web);
};