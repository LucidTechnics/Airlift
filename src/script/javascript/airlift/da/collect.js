var util = require('../util');
var service = require('../service');

function Collect(_web)
{
	var factory = Packages.com.google.appengine.api.datastore.DatastoreServiceFactory;
	var datastore = factory.getAsyncDatastoreService();

	var createCursorKey = function(_resourceName, _guid)
	{
		return util.string("cursor:") + util.string(_resourceName) + util.string(":") + util.string(_guid);
	}

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
			var guid = util.guid(32);
			var key = createCursorKey(_resourceName, guid);
			
			originalQueryConfigOptions.cursorId = cursor.toWebSafeString();
			//save key and cursor to memcache
			service.getCacheService().put(key, res.json(originalQueryConfigOptions));
			
			return key;
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

			result = keys.next().getName();

			if (!keysOnly)
			{
				result = fetchedResources.get(result);
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
		var config = _config||{};
		
		var resourceName = _resourceName;

		if (_web.getAppProfile().isValidResource(resourceName) === false)
		{
			throw 'Invalid resource name: ' + resourceName + ' provided for collect. ' + ' Please make sure first parameter is a valid resource name.'
		}
		
		var metadata = util.getResourceMetadata(resourceName);
		if (metadata.isView === true) { resourceName = metadata.lookingAt; }
		
		var originalConfig;
		
		if (config.cursorId && util.isWhitespace(config.cursorId) === false)
		{
			var originalConfig = service.getCacheService().get(config.cursorId);
			if (!originalConfig) { throw 'unable to find cursor identified by: ' + config.cursorId; }
			originalConfig = JSON.parse(originalConfig);
		}
		
		var config = originalConfig||config||{};
		var limit = util.value(config.limit, 0);
		var asc = (util.hasValue(config.asc) === true) ? config.asc : true;
		var orderBy = config.orderBy||"auditPutDate";
		var filterList = config.filterList||[];
		var keysOnly = (util.hasValue(config.keysOnly) === true) ? config.keysOnly : false;

		var Query = Packages.com.google.appengine.api.datastore.Query;
		var sort = (asc && Query.SortDirection.ASCENDING)||Query.SortDirection.DESCENDING;

		var query = new Query(resourceName).addSort(orderBy, sort).setKeysOnly();

		var FilterPredicate = com.google.appengine.api.datastore.Query.FilterPredicate;
		var FilterOperator = com.google.appengine.api.datastore.Query.FilterOperator;

		var filter = new Packages.java.util.ArrayList();

		util.assert(!filterList.forEach, 'filter list must be a JavaScript array');
		
		filterList.forEach(function(_filter)
		{
			var o = _filter.operator || _filter.comparator || _filter.op || _filter.o || _filter.c || 'EQUAL';
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

		var FetchOptions = Packages.com.google.appengine.api.datastore.FetchOptions;
		var fetchOptions = (limit && FetchOptions.Builder.withLimit(limit))||FetchOptions.Builder.withDefaults();

		if (config.cursorId && util.isWhitespace(config.cursorId) === false)
		{
			var decodedCursor = com.google.appengine.api.datastore.Cursor.fromWebSafeString(config.cursorId);
			delete config.cursorId;

			fetchOptions = fetchOptions.cursor(decodedCursor);
		}

		var entities = datastore.prepare(query).asQueryResultList(fetchOptions);

		return new java.util.Iterator(new QueryResultIterator(resourceName, entities, keysOnly, config));
	};

	this.collectBy = function(_resourceName, _attributeName, _value, _config)
	{
		var config = _config || {}; 
		config.filterList = config.filterList || [];
		config.filterList.push({name: _attributeName, value: _value});

		return this.collect(_resourceName, config);
	};

	this.collectByMembership = function(_resourceName, _attributeName, _membershipList, _config)
	{
		var membershipList = _membershipList;
		
		if (_membershipList instanceof java.lang.Iterable === false && Array.isArray(_membershipList) === false)
		{
			throw Error("Membership list must implement java.lang.Iterable or be a JavaScript array");
		}

		if (Array.isArray(_membershipList) === true)
		{
			membershipList = util.list();
			
			for (var i = 0; i < _membershipList.length; i++)
			{
				membershipList.add(_membershipList[i]);
			}
		}

		var config = _config || {}; 
		config.filterList = config.filterList || [];
		config.filterList.push({name: _attributeName, op: 'IN', value: _membershipList});

		return this.collect(_resourceName, config);
	};
}

exports.create = function(_web)
{
	if (!_web) { throw 'Unable to create collect module without an airlift/web context' }

	return new Collect(_web);
};