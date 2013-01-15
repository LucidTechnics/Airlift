var DomainMetadata = function(_name)
{
	this.name = _name;

	this.isPresented = true;
	this.isPersisted = true;
	this.isCached = true;
	this.isSecured = true;
	this.isAudited = false;
	this.isChangeTracked = false;

	this.attributeMetaDataMap = {};
};

exports.create = function(_name)
{
	return new DomainMetadata(_name);
};
