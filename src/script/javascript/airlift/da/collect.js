function Collect(WEB_CONTEXT)
{
	var util = require('airlift/util');

	var factory = Packages.com.google.appengine.api.datastore.DatastoreServiceFactory;
	var datastore = factory.getAsyncDatastoreService();

	function QueryResultIterator(_resourceName, _entities, _keysOnly)
	{
		var keys = util.createKeysCollection(_entities).iterator();
		var keysOnly = _keysOnly;
		var fetchedResources;
		var next;

		this.hasNext = function()
		{
			return keys.hasNext();
		};

		this.next = function()
		{
			var result;

			if (!keysOnly && !fetchedResources)
			{
				fetchedResources = require('./get').create(WEB_CONTEXT).getAll(_resourceName, _entities);

				util.println('fetched resource is', fetchedResources);
			}

			result = keys.next();

			util.info('result is', result);

			if (!keysOnly)
			{
				result = fetchedResources.get(result);
				util.info('now result is', result);
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
		var offset = config.offset||0;
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
			var o = _filter.op || _filter.o || _filter.c || 'EQUAL';
			var n = _filter.name || _filter.n;
			var v = _filter.value || filter.v;
			filter.add(new FilterPredicate(n, FilterOperator[o.toUpperCase()], v));
		});

		if (filterList.length > 1)
		{
			query.setFilter(new Query.CompositeFilter(Query.CompositeFilterOperator.AND, filter));
		}
		else if (filterList.length === 1 )
		{
			query.setFilter(filterList.get(0));
		}

		var entities = datastore.prepare(query).asList(Packages.com.google.appengine.api.datastore.FetchOptions.Builder.withLimit(limit).offset(offset));

		return new java.util.Iterator(new QueryResultIterator(_resourceName, entities, keysOnly));
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

exports.create = function(WEB_CONTEXT)
{
	if (!WEB_CONTEXT) { throw 'Unable to create collect module without a web context' }

	return new Collect(WEB_CONTEXT);
};