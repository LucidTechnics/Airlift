(function() {
	var root = this;
	var previousResourceMetadata = root.Airlift_ResourceMetadata;

	var Airlift_ResourceMetadata = function(obj) {
		if (obj instanceof Airlift_ResourceMetadata) return obj;
		if (!(this instanceof Airlift_ResourceMetadata)) return new Airlift_ResourceMetadata(obj);
		this._wrapped = obj;
	};

	if (typeof exports !== 'undefined') {
		if (typeof module !== 'undefined' && module.exports) {
			exports = module.exports = Airlift_ResourceMetadata;
		}
		exports.Airlift_ResourceMetadata = Airlift_ResourceMetadata;
	} else {
		root.Airlift_ResourceMetadata = Airlift_ResourceMetadata;
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

	var ResourceMetadata = function(_config)
	{
		this.isView = value(_config.viewable, false);
		this.isPresented = value(_config.securable, true);
		this.isPersisted = value(_config.persistable, true);
		this.isCached = value(_config.cacheable, true);
		this.isSecured = value(_config.securable, true);
		this.isAudited = value(_config.auditable, false);
		this.lookingAt = value(_config.lookingat, undefined);
	};

	var create = Airlift_ResourceMetadata.create = function(_config)
	{
		return new ResourceMetadata(_config);
	};

}).call(this);