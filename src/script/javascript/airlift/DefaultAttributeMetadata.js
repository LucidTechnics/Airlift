var AttributeMetadata = function()
{
	this.type = 'java.lang.String';
	this.isPresentable = true;
	this.displayOrder = 1000; //By default basically use the order returned by the Java compiler.
	this.fieldSetName = '';
	this.label = '';
	this.pluralLabel = '';
	this.displayLength = 32;
	this.inputType = 'TEXT'; //TEXT, HIDDEN, PASSWORD, TEXTAREA, CHECKBOX, RADIO, SELECT, MULTISELECT
	this.textAreaRows = 5;
	this.textAreaColumns = 50;
	this.hasFormat = '.*';	
	this.readOnly = false;
	this.allowedValues = {};
	this.dateTimePattern = 'MM-dd-yyyy';
	this.delimiter = ','; //to be used for attributes that are presented as checkboxes, radio buttons, and selects.

	this.isPersistable = true;
	this.maxLength = 200;
	this.minLength = 0;
	this.isSearchable = false;
	this.isIndexable = false;
	this.isPrimaryKey = false;
	this.isUniqueKey = false;
	this.concept = '';
	this.nullable = false;
	this.immutable = false;
	this.ranged = false;
	this.minimumValue = null;
	this.maximumValue = null;
	this.encrypted = false;
	this.semanticType = 'NONE'; //NONE, ID, EMAIL, ADDRESS, CREDITCARD, ZIPCODE, PHONENUMBER, VERYLONGTEXT 
};

exports.create = function()
{
	return new AttributeMetadata();
}
