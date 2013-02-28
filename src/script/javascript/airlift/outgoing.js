var javaArray = require('./javaArray');
var util = require('./util');

exports.deentify =  = function(_entity, _value, _attributeName)
{
	return util.primitive(_entity.getProperty());
};

exports.decrypt = function(_entity, _value, _attributeName)
{
	if (util.isEmpty(_error) === true && this.attributeMetadata.encrypted === true)
	{
	  var password = web.getServlet().getServletConfig().getInitParameter("a.cipher.password");
	  var initialVector = web.getServlet().getServletConfig().getInitParameter("a.cipher.initial.vector");
	  var revolutions = web.getServlet().getServletConfig().getInitParameter("a.cipher.revolutions")||20;

	  var attributeEncryptedName = _attributeName + "Encrypted";
	  _entity.setUnindexedProperty(_attributeName, Packages.airlift.util.AirliftUtil.convertToString(Packages.airlift.util.AirliftUtil.decrypt(((_entity.getProperty(attributeEncryptedName) && _entity.getProperty(attributeEncryptedName).getBytes())||javaArray.byteArray(0)), password, initialVector, null, null, null, null, revolutions)));
	}
};