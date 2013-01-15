var Resource = function(_resourceName, _filter)
{
	var resourceMetadata = require(appName + '/meta/resource/' + _resourceName);
	
	this.__name = _resourceName;
	this.__filter = _filter||resourceMeta.filter||[];
};

exports.create = function(_resourceName, _filter)
{
	return new Resource(_resourceName, _filter);
};