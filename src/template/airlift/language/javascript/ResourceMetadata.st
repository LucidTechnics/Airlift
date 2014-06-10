(function() {
	var metadata;

	if (typeof exports !== 'undefined') {
		if (typeof module !== 'undefined' && module.exports) {
			var resourceMetadata = require('airlift/ResourceMetadata');
		}
	}
	else
	{
		resourceMetadata = Airlift_ResourceMetadata;
	}

	var root = this;
	var previous_$resourceName$_Metadata = root.$resourceName$_Metadata;

	var $resourceName$_Metadata = function(obj) {
		if (obj instanceof $resourceName$_Metadata) return obj;
		if (!(this instanceof $resourceName$_Metadata)) return new $resourceName$_Metadata(obj);
		this._wrapped = obj;
	};

	if (typeof exports !== 'undefined') {
		if (typeof module !== 'undefined' && module.exports) {
			exports = module.exports = $resourceName$_Metadata;
		}
		exports.$resourceName$_Metadata = $resourceName$_Metadata;
	} else {
		root.$resourceName$_Metadata = $resourceName$_Metadata;
	}

	var create = $resourceName$_Metadata.create = function()
	{
		var metadata = resourceMetadata.create($config$);

		metadata.name = '$resourceName$';
		metadata.attributes = ['$propertyName; separator="', '"$'];
		metadata.foreignKeys = {$foreignKeyName: {f |"$f$": 1}; separator=","$};
		metadata.indexedProperties = {$indexedProperty: {ip |"$ip$": 1}; separator=","$};
		metadata.searchProperties = {$searchProperty: {sp |"$sp$": 1}; separator=","$};
		metadata.encryptedProperties = {$encryptedProperty: {ep |"$ep$": 1}; separator=","$};

		return metadata;
	};
	
}).call(this);