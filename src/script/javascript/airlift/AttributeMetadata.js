var util = require('./util');

var AttributeMetadata = function(_config)
{			
	this.name = util.value(_config.name, null);
	this.type = util.value(_config.type, 'java.lang.String');
	this.isPresentable = util.value(_config.isPresentable, true);
	this.displayOrder = util.value(_config.displayOrder, 1000);	
	this.fieldSetName = util.value(_config.fieldSetName, '');
	this.label = util.value(_config.label, util.value(_config.name, ''));
	this.pluralLabel = util.value(_config.pluralLabel, '');	
	this.displayLength = util.value(_config.displayLength, 32)	;
	this.inputType = util.value(_config.inputType, 'TEXT');
	this.textAreaRows = util.value(_config.textAreaRows, 5);
	this.textAreaColumns = util.value(_config.textAreaColumns, 50);
	this.hasFormat = util.value(_config.hasFormat, '.*');
	this.readOnly = util.value(_config.readOnly, false);
	this.allowedValues = util.value(_config.allowedValues, {})
	this.dateTimePattern = util.value(_config.dateTimePattern, "MM-dd-yyyy");
	this.delimiter = util.value(_config.delimiter, ',');
	this.isPersistable = util.value(_config.isPersistable, true);
	this.maxLength = util.value(_config.maxLength, 200);
	this.minLength = util.value(_config.minLength, 0);
	this.isSearchable = util.value(_config.isSearchable, false);
	this.isIndexable = util.value(_config.isIndexable, false);
	this.isPrimaryKey = util.value(_config.isPrimaryKey, false);
	this.isUniqueKey = util.value(_config.isUniqueKey, false);
	this.concept = util.value(_config.concept, '');
	this.nullable = util.value(_config.nullable, false);
	this.immutable = util.value(_config.immutable, false);
	this.ranged = util.value(_config.ranged, false);
	this.minValue = util.value(_config.minValue, null);
	this.maxValue = util.value(_config.maxValue, null);
	this.encrypted = util.value(_config.encrypted, false);
	this.semanticType = util.value(_config.semanticType, 'NONE');
	this.mapTo = util.value(_config.mapTo, null);
};

exports.create = function(_config)
{
	return new AttributeMetadata(_config)
};