var print = function(_item)
{
	Packages.java.lang.System.out.println('CONVERT: ' + _item);
}

exports.convert = function(_value, _attributeName, _resource)
{	
	print('rest context: ' + this.WEB_CONTEXT.REST_CONTEXT);
	print('converting attribute: ' + _attributeName);
	print(this.resourceName);
	print(this.attributes);
};