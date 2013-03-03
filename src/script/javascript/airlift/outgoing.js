var javaArray = require('./javaArray');
var util = require('./util');
var web = require('./web');

var password = web.getInitParameter("a.cipher.password");
var initialVector = web.getInitParameter("a.cipher.initial.vector");
var revolutions = web.getInitParameter("a.cipher.revolutions")||20;

exports.deentify = function deentify(_entity, _value, _attributeName)
{
	var value = _entity.getProperty(_attributeName);
	
	if ("id".equals(_attributeName) === true)
	{
		value = _entity.getKey().getName();
	}
		
	return value;
};

exports.decrypt = function decrypt(_entity, _value, _attributeName, _attributeMetadata)
{
	if (util.isEmpty(this.getErrors(_attributeName)) === true && attributeMetadata.encrypted === true)
	{
	  var attributeEncryptedName = _attributeName + "Encrypted";
	  _entity.setUnindexedProperty(_attributeName, Packages.airlift.util.AirliftUtil.convertToString(Packages.airlift.util.AirliftUtil.decrypt(((_entity.getProperty(attributeEncryptedName) && _entity.getProperty(attributeEncryptedName).getBytes())||javaArray.byteArray(0)), password, initialVector, null, null, null, null, revolutions)));
	}
};