var util = require('airlift/util');

var stream = function stream(_web, _config, _results)
{
	var config = _config||{};
	
	var res = require('airlift/resource').create(_web);
	var resourceName = config.resourceName || _web.getResourceName();
	var mimeType = config.mimeType||'application/json';

	_web.stream(function(_write)
	{
		var serializer = config.serializer||config.keysOnly && function(_item) { return "\"" + _item + "\""; }||JSON.stringify;
		res.stream(_results, serializer, _write, ['{"cursor":"' + _results.cursor() + '","' + resourceName + '":[', ",", "]}"]);
	}, mimeType);
}

exports.collect = function collect(_web, _config)
{
	var da = require('airlift/da/collect').create(_web);

	var config = _config||{};
	config.limit = util.hasValue(config.limit) || 1000;
	
	var results = da.collect(config.resourceName || _web.getResourceName(), config);

	stream(_web, config, results);
};

exports.collectBy = function collectBy(_web, _attributeName, _value, _config)
{
	var da = require('airlift/da/collect').create(_web);

	var config = _config||{};
	config.limit = util.hasValue(config.limit) || 1000;
	
	var results = da.collectBy(config.resourceName || _web.getResourceName(), _attributeName, _value, config);

	stream(_web, config, results);
};

exports.collectByMembership = function collectByMembership(_web, _attributeName, _membershipList, _config)
{
	var da = require('airlift/da/collect').create(_web);

	var config = _config||{};
	config.limit = util.hasValue(config.limit) || 1000;
	
	var results = da.collectByMembership(config.resourceName || _web.getResourceName(), _attributeName, _membershipList, config);

	stream(_web, config, results);
};