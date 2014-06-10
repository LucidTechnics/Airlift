(function() {
	var root = this;
	var previousResourceMetadata = root.Airlift_AttributeMetadata;

	var Airlift_AttributeMetadata = function(obj) {
		if (obj instanceof Airlift_AttributeMetadata) return obj;
		if (!(this instanceof Airlift_AttributeMetadata)) return new Airlift_AttributeMetadata(obj);
		this._wrapped = obj;
	};

	if (typeof exports !== 'undefined') {
		if (typeof module !== 'undefined' && module.exports) {
			exports = module.exports = Airlift_AttributeMetadata;
		}
		exports.Airlift_AttributeMetadata = Airlift_AttributeMetadata;
	} else {
		root.Airlift_AttributeMetadata = Airlift_AttributeMetadata;
	}

	function hasValue(_value)
	{
		return (_value !== null && _value !== undefined);
	};

	function value(_candidate, _default)
	{
		var candidate;

		if (hasValue(_candidate) === true)
		{
			candidate = _candidate;
		}
		else
		{
			candidate = _default;
		}

		return candidate;
	};

	var AttributeMetadata = function(_config)
	{			
		this.name = value(_config.name, null);
		this.type = value(_config.type, 'java.lang.String');
		this.isPresentable = value(_config.isPresentable, true);
		this.displayOrder = value(_config.displayOrder, 1000);	
		this.fieldSetName = value(_config.fieldSetName, '');
		this.label = value(_config.label, value(_config.name, ''));
		this.pluralLabel = value(_config.pluralLabel, '');	
		this.displayLength = value(_config.displayLength, 32)	;
		this.inputType = value(_config.inputType, 'TEXT');
		this.textAreaRows = value(_config.textAreaRows, 5);
		this.textAreaColumns = value(_config.textAreaColumns, 50);
		this.hasFormat = value(_config.hasFormat, '.*');
		this.readOnly = value(_config.readOnly, false);
		this.allowedValues = value(_config.allowedValues, {})
		this.dateTimePattern = value(_config.dateTimePattern, "MM-dd-yyyy");
		this.delimiter = value(_config.delimiter, ',');
		this.isPersistable = value(_config.isPersistable, true);
		this.maxLength = value(_config.maxLength, 200);
		this.minLength = value(_config.minLength, 0);
		this.isSearchable = value(_config.isSearchable, false);
		this.isIndexable = value(_config.isIndexable, false);
		this.isPrimaryKey = value(_config.isPrimaryKey, false);
		this.isUniqueKey = value(_config.isUniqueKey, false);
		this.concept = value(_config.concept, '');
		this.required = value(_config.required, true);
		this.defaultValue = value(_config.default, null);
		this.immutable = value(_config.immutable, false);
		this.ranged = value(_config.ranged, false);
		this.minValue = value(_config.minValue, null);
		this.maxValue = value(_config.maxValue, null);
		this.encrypted = value(_config.encrypted, false);
		this.semanticType = value(_config.semanticType, 'NONE');
		this.mapTo = value(_config.mapTo, null);
		this.mapToMany = value(_config.mapToMany, null);
	};

	var create = Airlift_AttributeMetadata.create = function(_config)
	{
		return new AttributeMetadata(_config);
	};

}).call(this);