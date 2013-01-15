var ResourceMetadata = function()
{
	this.isPresentable = true;
	this.isPersistable = true;
	this.isCacheable = true;
	this.isSecureable = true;
	this.isAuditable = false;
	this.isUndoable = false;
};

exports.create = function()
{
	return new ResourceMetadata();
};
