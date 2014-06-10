(function() {
	var metadata;

	if (typeof exports !== 'undefined') {
		if (typeof module !== 'undefined' && module.exports) {
			var attributeMetadata = require('airlift/AttributeMetadata');
		}
	}
	else
	{
		attributeMetadata = Airlift_AttributeMetadata;
	}

	var root = this;
	var previous_$resourceName$_Attribute_Metadata = root.$resourceName$_AttributeMetadata;

	var $resourceName$_AttributeMetadata = function(obj) {
		if (obj instanceof $resourceName$_AttributeMetadata) return obj;
		if (!(this instanceof $resourceName$_AttributeMetadata)) return new $resourceName$_AttributeMetadata(obj);
		this._wrapped = obj;
	};

	if (typeof exports !== 'undefined') {
		if (typeof module !== 'undefined' && module.exports) {
			exports = module.exports = $resourceName$_AttributeMetadata;
		}
		exports.$resourceName$_AttributeMetadata = $resourceName$_AttributeMetadata;
	} else {
		root.$resourceName$_AttributeMetadata = $resourceName$_AttributeMetadata;
	}

	var MetaData = function()
	{
		this.resourceName = '$resourceName$';
		this.attributes = {};

		$propertyName, propertyConfig: {n,c| this.attributes['$n$'] = attributeMetadata.create($c$); }; separator="\n"$
	};

	var create = $resourceName$_AttributeMetadata.create = function()
	{
		return new MetaData();
	};
	
}).call(this);