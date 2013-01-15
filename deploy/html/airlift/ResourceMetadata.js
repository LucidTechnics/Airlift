var ResourceMetadata = function(_config)
{	
	this.isPresented = _config.isPresented || true;
	this.isPersisted = _config.isPersisted || true;
	this.isCached = _config.isCached || true;
	this.isSecured = _config.isSecured || true;
	this.isAudited = _config.isAudited || false;
	this.isChangeTracked = _config.isChangeTracked || false;
};

exports.create = function(_config)
{
	return new ResourceMetadata(_config);
};
