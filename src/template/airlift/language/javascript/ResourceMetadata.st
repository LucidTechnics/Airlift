exports.create = function()
{
	var metaData = require('airlift/ResourceMetadata').create($config$);
	metaData.name = '$resourceName$';
	metaData.attributes = ['$propertyName; separator="', '"$'];

	return metaData;
}