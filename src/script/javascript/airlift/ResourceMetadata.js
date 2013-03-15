var util = require('./util');

var ResourceMetadata = function(_config)
{
	this.isView = util.value(_config.viewable, false);
	this.isPresented = util.value(_config.securable, true);
	this.isPersisted = util.value(_config.persistable, true);
	this.isCached = util.value(_config.cacheable, true);
	this.isSecured = util.value(_config.securable, true);
	this.isAudited = util.value(_config.auditable, false);

	this.lookingAt = util.value(_config.lookingAt, undefined);
};

exports.create = function(_config)
{
	return new ResourceMetadata(_config);
};
