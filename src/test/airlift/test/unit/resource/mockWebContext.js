var util = require('airlift/util');
var javaArray = require('airlift/javaArray');
var bediako = require('./mockPerson').create("6524d6f79d19", "Bediako George", 'middle aged', '01/01/1970', 43);
var collection = require('airlift/collection');

function MockWebContext(_config)
{
	var config = _config||{};

	this.CONTENT_CONTEXT = new Packages.airlift.servlet.rest.SimpleContentContext("", "text/html");
	this.PRODUCTION_MODE = util.hasValue(_config.productionMode) || true;

	var resourceId = config.resourceId || null;
	var resourceName = config.resourceName || 'person';
	var resourceIdMap = {};
	resourceIdMap[resourceName] = resourceId;

	var serverName = config.serverName || "www.example.com";
	var scheme = config.scheme || "http";
	var serverPort = config.serverPort || new Packages.java.lang.Integer(80).intValue();

	var timezone = config.timezone || "America/New_York";
	var parameters = {
		'a.timezone': javaArray.stringArray(1, [new Packages.java.lang.String(timezone)]),
	};

	for (var name in bediako)
	{
		var value = bediako[name];

		if (value instanceof Packages.java.util.Collection)
		{
			var initializer = [];

			collection.each(value, function(_value, _index, _collection)
			{
				initializer.push(_value);
			});

			parameters[name] = javaArray.stringArray(value.size(), initializer);
		}
		else
		{
			parameters[name] = javaArray.stringArray(1, [Packages.airlift.util.FormatUtil.format(value)]);
		}
	}

	var restParameters = {
		'person.id': resourceId
	};

	var locale = config.locale || Packages.java.util.Locale.getDefault();
	var cachingContextMap = new Packages.java.util.HashMap();

	var domainIds = new Packages.java.util.HashSet();
	domainIds.add(resourceId);

	this.SERVLET = {
		getServletName: function() { return "Mock Servlet"; }
	};

	this.REQUEST = {
		getServerName: function() { return serverName; },
		getServerPort: function() { return serverPort; },
		getScheme: function() { return scheme; },
		getParameter: function(_name) { return parameters[_name] && parameters[_name][0]; },
		getParameterValues: function(_name) { return parameters[_name]; },
		getLocale: function() { return locale; }
	};

	this.REST_CONTEXT = {
		constructDomainId: function() { return resourceId; },
		getThisDomain: function() { return resourceName; },
		hasIdentifier: function() { return util.hasValue(resourceId); },
		extractDomainObjectPaths: function()
		{
		   var m = new Packages.java.util.HashMap();
		   if (util.hasValue(resourceId) === true)
		   {
			   m.put(resourceName, 'a/' + resourceName + "/" + resourceId)
		   }
		   else
		   {
			   m.put(resourceName, 'a/' + resourceName)
		   }
		   return m;
		},
		getUser: function() { return { userId: 'user1', email: 'user@example.com', userName: 'User user'}; },
		getCachingContextMap: function() { return cachingContextMap; },
		getIdValue: function(_name) { return resourceIdMap[_name]; },
		getParameter: function(_name) { return restParameters[_name]; }
	};
}

exports.create = function(_config)
{
	return new MockWebContext(_config);
};