(function()
{
	var RMD = function()
	{
		var metadata = new Airlift.ResourceMetadata($config$);

		metadata.name = '$resourceName$';
		metadata.attributes = ['$propertyName; separator="', '"$'];
		metadata.foreignKeys = {$foreignKeyName: {f |"$f$": 1}; separator=","$};
		metadata.indexedProperties = {$indexedProperty: {ip |"$ip$": 1}; separator=","$};
		metadata.searchProperties = {$searchProperty: {sp |"$sp$": 1}; separator=","$};
		metadata.encryptedProperties = {$encryptedProperty: {ep |"$ep$": 1}; separator=","$};

		return metadata;
	};

	Airlift.rmd['$resourceName$'] = new RMD();
})();