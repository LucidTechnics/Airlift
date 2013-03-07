var util = require('./util');

var ResourceMetadata = function(_config)
{	
	this.isPresented = util.value(_config.isPresented, true);
	this.isPersisted = util.value(_config.isPersisted, true);
	this.isCached = util.value(_config.isCached, true);
	this.isSecured = util.value(_config.isSecured, true);
	this.isAudited = util.value(_config.isAudited, false);
	this.isChangeTracked = util.value(_config.isChangeTracked, false);
};

exports.create = function(_config)
{
	return new ResourceMetadata(_config);
};
