var MetaData = function()
{
	this.resourceName = '$resourceName$';
	this.attributes = {};
    this.foreignKeys = [$foreignKeyName: {f |'$f$'}; separator=","$];

	$propertyName, propertyConfig: {n,c| this.attributes['$n$'] = require('airlift/AttributeMetadata').create($c$); }; separator="\n"$
}

exports.create = function()
{
	return new MetaData();
};