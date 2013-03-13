var util = require('../util');
var service = require('../service');

function Collect(_web)
{
	var factory = Packages.com.google.appengine.api.datastore.DatastoreServiceFactory;
	var datastore = factory.getAsyncDatastoreService();

	function QueryResultIterator(_resourceName, _entities, _keysOnly, _originalQueryConfigOptions)
	{
		var keys = util.createKeysCollection(_entities).iterator();
		var keysOnly = _keysOnly;
		var fetchedResources;
		var cursor = _entities.getCursor();
		var originalQueryConfigOptions = _originalQueryConfigOptions;
		var next;

		this.cursor = function()
		{
			var res = require('airlift/resource').create(_web);
			var guid = new Packages.java.lang.String(util.guid(32));
			var key = new Packages.java.lang.String("cursor: ") + guid;
			
			originalQueryConfigOptions.cursorId = cursor.toWebSafeString();
			//save guid and cursor to memcache
			service.getCacheService().put(key, res.json(originalQueryConfigOptions));
			
			return guid;
		};

		this.hasNext = function()
		{
			return keys.hasNext();
		};

		this.next = function()
		{
			var result;

			if (!keysOnly && !fetchedResources)
			{
				fetchedResources = require('./get').create(_web).getAll(_resourceName, _entities);
			}

			result = keys.next();

			if (!keysOnly)
			{
				result = fetchedResources.get(result.getName());
			}

			return result;
		};

		this.remove = function()
		{
			keys.remove();
		}
	};
	
	this.collect = function(_resourceName, _config)
	{
		var originalConfig;
		
		if (_config.cursorId && util.isWhitespace(_config.cursorId) === false)
		{
			var originalConfig = service.getCacheService().get(new Packages.java.lang.String("cursor: ") + new Packages.java.lang.String(_config.cursorId));
			if (!originalConfig) { throw 'unable to find cursor identified by: ' + _config.cursorId; }
			originalConfig = JSON.parse(originalConfig);
		}
		
		var config = originalConfig||_config||{};
		var limit = config.limit||20;
		var asc = (util.hasValue(config.asc) === true) ? config.asc : true;
		var orderBy = config.orderBy||"auditPutDate";
		var filterList = config.filterList||[];
		var keysOnly = (util.hasValue(config.keysOnly) === true) ? config.keysOnly : false;

		var Query = Packages.com.google.appengine.api.datastore.Query;
		var sort = (asc && Query.SortDirection.ASCENDING)||Query.SortDirection.DESCENDING;

		var query = new Query(_resourceName).addSort(orderBy, sort).setKeysOnly();

		var FilterPredicate = com.google.appengine.api.datastore.Query.FilterPredicate;
		var FilterOperator = com.google.appengine.api.datastore.Query.FilterOperator;

		var filter = new Packages.java.util.ArrayList();

		filterList.forEach(function(_filter)
		{
			var o = _filter.operator || _filter.op || _filter.o || _filter.c || 'EQUAL';
			var n = _filter.name || _filter.n;
			var v = _filter.value || _filter.v;

			filter.add(new FilterPredicate(n, FilterOperator[o.toUpperCase()], v));
		});

		if (filterList.length > 1)
		{
			query.setFilter(new Query.CompositeFilter(Query.CompositeFilterOperator.AND, filter));
		}
		else if (filterList.length === 1 )
		{
			query.setFilter(filter.get(0));
		}

		var fetchOptions;
		
		if (config.cursorId && util.isWhitespace(config.cursorId) === false)
		{
			var decodedCursor = com.google.appengine.api.datastore.Cursor.fromWebSafeString(config.cursorId);
			delete config.cursorId;
			
			fetchOptions = Packages.com.google.appengine.api.datastore.FetchOptions.Builder.withLimit(limit).cursor(decodedCursor);
		}
		else
		{
			fetchOptions = Packages.com.google.appengine.api.datastore.FetchOptions.Builder.withLimit(limit);
		}

		var entities = datastore.prepare(query).asQueryResultList(fetchOptions);

		return new java.util.Iterator(new QueryResultIterator(_resourceName, entities, keysOnly, config));
	};

	this.collectBy = function(_resourceName, _attributeName, _value, _config)
	{
		var config = _config || {}; 
		config.filterList = config.filterList || [];
		config.filterList.add({name: _attributeName, value: _value});

		return collect(_resourceName, config);
	};

	this.collectByMembership = function(_resourceName, _attributeName, _membershipList, _config)
	{
		if (_membershipList instanceof java.lang.Iterable === false)
		{
			throw Error("Membership list must implement java.lang.Iterable");
		}

		var config = _config || {}; 
		config.filterList = config.filterList || [];
		config.filterList.add({name: _attributeName, op: 'IN', value: _membershipList});

		return collect(_resourceName, config);
	};
}

exports.create = function(_web)
{
	if (!_web) { throw 'Unable to create collect module without an airlift/web context' }

	return new Collect(_web);
};