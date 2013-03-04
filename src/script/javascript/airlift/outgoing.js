function Outgoing(WEB_CONTEXT)
{
	var javaArray = require('./javaArray');
	var util = require('./util');
	var web = require('./web').create(WEB_CONTEXT);

	var password = web.getInitParameter("a.cipher.password");
	var initialVector = web.getInitParameter("a.cipher.initial.vector");
	var revolutions = web.getInitParameter("a.cipher.revolutions")||20;

	this.deentify = function deentify(_entity, _value, _attributeName)
	{
		var value = _entity.getProperty(_attributeName);

		if ("id".equals(_attributeName) === true)
		{
			value = _entity.getKey().getName();
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

exports.create = function(WEB_CONTEXT)
{
	if (!WEB_CONTEXT) { throw 'Unable to create outgoing module without a web context' }

	return new Outgoing(WEB_CONTEXT);
};