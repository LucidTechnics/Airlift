exports.create = function()
{
	var metaData = require('airlift/ResourceMetadata').create($config$);
	metaData.name = '$resourceName$';
	metaData.filter = ['$propertyName; separator="', '"$'];

	return metaData;
}