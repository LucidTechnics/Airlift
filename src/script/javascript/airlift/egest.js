var javaArray = require('./javaArray');

exports.deentify =  = function(_entity, _error, _value, _attributeName)

	var value = _entity.getProperty();
	var type = this.attributesMetaData.type;

	if (value)
	{
		switch(type)
		{
			case "java.lang.String":
				if (value && "com.google.appengine.api.datastore.Text".equalsIgnoreCase(value.class.getName()) === true) { value = value.toString(); }
				break;
			case "java.lang.Integer":
				value = value.intValue();
				break;
			case "java.lang.Boolean":
				value = value.booleanValue();
				break;
			case "java.lang.Long":
				value = value.longValue();
				break;
			case "java.lang.Double":
				value = value.doubleValue();
				break;
			case "java.lang.Float":
				value = value.floatValue();
				break;
			case "java.lang.Short":
				value = value.shortValue();
				break;
			case "java.lang.Byte":
			case "java.lang.Character":				
				throw new Error("Airlift currently does not support java.lang.Byte or java.lang.Character objects. Try using String instead or file a feature request.");
				break;
		}
	}

	return value;
};

exports.decrypt = function(_entity, _error, _value, _attributeName)
{
	  var password = web.getServlet().getServletConfig().getInitParameter("a.cipher.password");
	  var initialVector = web.getServlet().getServletConfig().getInitParameter("a.cipher.initial.vector");
	  var revolutions = web.getServlet().getServletConfig().getInitParameter("a.cipher.revolutions")||20;

	  var attributeEncryptedName = _attributeName + "Encrypted";
	  return Packages.airlift.util.AirliftUtil.convertToString(Packages.airlift.util.AirliftUtil.decrypt(((_entity.getProperty(attributeEncryptedName) && _entity.getProperty(attributeEncryptedName).getBytes())||javaArray.byteArray(0)), password, initialVector, null, null, null, null, revolutions)); 
};
