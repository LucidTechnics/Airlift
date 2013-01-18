var print = function(_item)
{
	Packages.java.lang.System.out.println('CONVERT: ' + _item);
}

exports.convert = function(_value, _attributeName, _resource)
{
	var getGlobal = require('./util').getGlobal;
	
	var restContext = getGlobal('REST_CONTEXT');



	
	print('rest context: ' + restContext);
	print('converting attribute: ' + _attributeName);
	print(this.resourceName);
	print(this.attributes);
};