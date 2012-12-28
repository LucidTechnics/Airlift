exports.ar = function(_domainName)
{
	var domainName = (!_domainName) ? DOMAIN_NAME : (new Packages.java.lang.String(_domainName).toLowerCase());

	if (airlift.isDefined(airlift["create" + APP_PROFILE.getDomainShortClassName(domainName)]) !== true || PRODUCTION_MODE === false)
	{
		airlift.ls("airlift/activerecord/" + APP_PROFILE.getDomainShortClassName(domainName) + ".js");
	}

	return airlift["create" + APP_PROFILE.getDomainShortClassName(domainName)]();
};

exports.populate = function(_config)
{
	var config = _config||{};
	
	var activeRecord = airlift.ar(config.domainName);

	var errorMap = activeRecord.populate(config);
	
	return [activeRecord, errorMap];
};

exports.get = function(_config)
{
	var config = _config||{};
	var id = config.id||ID;
	
	var activeRecord = airlift.ar(config.domainName);
	
	activeRecord.setId(id);

	var foundRecord = activeRecord.get();
	
	return [activeRecord, foundRecord];
};

exports.collect = function(_config)
{
	var config = _config||{};
	var domainName = config.domainName||DOMAIN_NAME;
	
	config.limit = config.limit||REQUEST.getParameter("limit")||10;
	config.offset = config.offset||REQUEST.getParameter("offset")||0;
	config.orderBy = config.orderBy||REQUEST.getParameter("orderBy")||"auditPutDate";
	
	function evaluateBooleanString(_booleanString)
	{
		if ("true".equalsIgnoreCase(_booleanString) === true)
		{
			var value = true;
		}
		else
		{
			var value = false;
		}

		return value;
	}
	
	config.asc = (airlift.isDefined(config.asc) === true) ? config.asc : (airlift.isDefined(REQUEST.getParameter("asc")) === true) ? evaluateBooleanString(REQUEST.getParameter("asc")) : false;
	
	var activeRecord = airlift.ar(domainName);
	var result = activeRecord.collect(config);

	return [activeRecord, result];
};
