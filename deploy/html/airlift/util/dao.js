var util = require("./util");

var getGlobalConstant = function (_constant){
	var global = (function(){
		return this;
	}).call(null);

	return global[_constant.toUpperCase()];
};

getGlobalConstant('LOG').info("Looks like require in the dao worked! " + util);

exports.getGlobalConstant = function (_constant){
	var global = (function(){
		return this;
	}).call(null);

	return global[_constant.toUpperCase()];
};

exports.ar = function(_domainName)
{
	var DOMAIN_NAME = this.getGlobalConstant('DOMAIN_NAME');
	var APP_PROFILE = this.getGlobalConstant('APP_PROFILE');
	var PRODUCTION_MODE = this.getGlobalConstant('PRODUCTION_MODE');
	
	var domainName = (!_domainName) ? DOMAIN_NAME : (new Packages.java.lang.String(_domainName).toLowerCase());

	if (util.isDefined(airlift["create" + APP_PROFILE.getDomainShortClassName(domainName)]) !== true || PRODUCTION_MODE === false)
	{
		util.ls("airlift/activerecord/" + APP_PROFILE.getDomainShortClassName(domainName) + ".js");
	}

	return airlift["create" + APP_PROFILE.getDomainShortClassName(domainName)]();
};

exports.populate = function(_config)
{
	var config = _config||{};
	
	var activeRecord = util.ar(config.domainName);

	var errorMap = activeRecord.populate(config);
	
	return [activeRecord, errorMap];
};

exports.get = function(_config)
{
	var ID = this.getGlobalConstant('ID');

	var config = _config||{};
	var id = config.id||ID;
	
	var activeRecord = util.ar(config.domainName);
	
	activeRecord.setId(id);

	var foundRecord = activeRecord.get();
	
	return [activeRecord, foundRecord];
};

exports.collect = function(_config)
{
	var DOMAIN_NAME = this.getGlobalConstant('DOMAIN_NAME');
	var REQUEST = this.getGlobalConstant('REQUEST');

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
	
	config.asc = (util.isDefined(config.asc) === true) ? config.asc : (util.isDefined(REQUEST.getParameter("asc")) === true) ? evaluateBooleanString(REQUEST.getParameter("asc")) : false;
	
	var activeRecord = util.ar(domainName);
	var result = activeRecord.collect(config);

	return [activeRecord, result];
};

exports.post = function(_config)
{
	if (typeof _config === 'function')
	{
		var config = {};
		var after = [];
		for (var i = 0; i < arguments.length; i++) { after.push(arguments[i]); }
	}
	else
	{
		var config = _config||{};
		var after = config.after||[];
	}

	var [activeRecord, errorMap] = this.populate(config);

	if (activeRecord.error === true)
	{
		activeRecord["id"] =  util.g();
	}

	after.forEach(function(_function) { _function(activeRecord, errorMap); });

	if (activeRecord.error === false)
	{
		activeRecord.insert();
	}

	return [activeRecord, errorMap, activeRecord["id"]];
};

exports.put = function(_config)
{
	if (typeof _config === 'function')
	{
		var config = {};
		var after = [];
		for (var i = 0; i < arguments.length; i++) { after.push(arguments[i]); }
	}
	else
	{
		var config = _config||{};
		var after = config.after||[];
	}

	var [activeRecord, errorMap] = util.populate(config);

	after.forEach(function(_function) { _function(activeRecord, errorMap); });

	if (activeRecord.error === false)
	{
		activeRecord.update();
	}

	return [activeRecord, errorMap];
};
