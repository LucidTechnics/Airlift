var AttributeMetadata = function(_config)
{
	this.name = _config.name;
	this.type = _config.type || 'java.lang.String';
	this.isPresentable = _config.isPresentable || true;
	this.displayOrder = _config.displayOrder || 1000;
	this.fieldSetName = _config.fieldSetName || '';
	this.label = _config.label || _config.name || '';
	this.pluralLabel = _config.pluralLabel || '';
	this.displayLength = _config.displayLength || 32;
	this.inputType = _config.inputType || 'TEXT';
	this.textAreaRows = _config.textAreaRows || 5;
	this.textAreaColumns = _config.textAreaColumns || 50;
	this.hasFormat = _config.hasFormat || '.*';
	this.readOnly = _config.readOnly || false;
	this.allowedValues = _config.allowedValues || {};
	this.dateTimePattern = _config.dateTimePattern || 'MM-dd-yyyy';
	this.delimiter = _config.delimiter || ',';

	this.isPersistable = _config.isPersistable || true;
	this.maxLength = _config.maxLength || 200;
	this.minLength = _config.minLength || 0;
	this.isSearchable = _config.isSearchable || false;
	this.isIndexable = _config.isIndexable || false;
	this.isPrimaryKey = _config.isPrimaryKey || false;
	this.isUniqueKey = _config.isUniqueKey || false;
	this.concept = _config.concept || '';
	this.nullable = _config.nullable || false;
	this.immutable = _config.immutable || false;
	this.ranged = _config.ranged || false;
	this.minimumValue = _config.minimumValue || null;
	this.maximumValue = _config.maximumValue || null;
	this.encrypted = _config.encrypted || false;
	this.semanticType = _config.semanticType || 'NONE';
};

exports.create = function(_config)
{
	return new AttributeMetadata(_config)
};