var util = require('airlift/util');
var service = require('airlift/service');
var collection = require('airlift/collection');

function Insert(_web)
{
	var res = require('airlift/resource').create(_web);
	var incoming = require('airlift/incoming').create(_web);

	var factory = Packages.com.google.appengine.api.datastore.DatastoreServiceFactory;
	var datastore = factory.getAsyncDatastoreService();
	var cache = service.getCacheService();

	var provideUniqueId = function(_resourceName) 
	{
		var test = function(_tries, e)
		{
			var truncatedShaLength = _web.getTruncatedShaLength();
			
			var id = Packages.airlift.util.IdGenerator.generate(truncatedShaLength);
				//Make sure this randomly generated id has not already been
				//assigned to a resource in this table.

			try
			{
				var result = datastore.get(Packages.com.google.appengine.api.datastore.KeyFactory.createKey(_resourceName, id)).get();
			}
			catch(e if e.javaException.getCause && (e.javaException.getCause() instanceof Packages.com.google.appengine.api.datastore.EntityNotFoundException))
			{
			}

			if (result) { throw new Packages.java.lang.RuntimeException("Found entity of type: " +  _resourceName +  " with id: " + id); }

			return id;
		}

		return util.multiTry(test, 10, function() { util.severe("After 10 tries, we were unable to generate a random unique id for creation of resource:", _resourceName + '.', "Are ids saturated?"); });
	};

	this.insert = function(_resourceName, _toInsert, _pre, _post)
	{
		var resources;

		if ((_toInsert.add && _toInsert.iterate) || (_toInsert.push && _toInsert.forEach) || (_toInsert.hasNext && _toInsert.next))
		{
			resources = _toInsert;
		}
		else if (typeof _toInsert === 'object')
		{
			resources = [_toInsert];
		}
		else
		{
			throw 'insert accepts a resource, an iterator of resources, a Java Collection of resources, or a JavaScript array of resources only';
		}
			
		return this.insertAll(_resourceName, resources, _pre, _post);
	};

	this.insertAll = function (_resourceName, _resources, _pre, _post)
	{
		var resourceName = _resourceName;

		if (_web.getAppProfile().isValidResource(resourceName) === false)
		{
			throw 'Invalid resource name: ' + resourceName + ' provided for collect. ' + ' Please make sure first parameter is a valid resource name.'
		}

		var metadata = util.getResourceMetadata(resourceName);
		
		if (metadata.isView === true) { 
			resourceName = metadata.lookingAt; 
		}

		var errorStatus = false, list = util.list(), map = util.map();
		var pre = _pre && res.sequence.partial(_pre) || res.sequence;
		var results = {};

		collection.each(_resources, function(_resource)
		{
			/*
			 * Important functionality of insert.  If the resource has
			 * an id, insert acts as if the resource did not previously
			 * exist.  As such it will clobber an existing entity in
			 * the database.  This functionality is in place to support
			 * use cases when the client is responsible for providing
			 * the identifier for the resource.
			 */

			var id = _resource.id || provideUniqueId(resourceName);
			_resource.id = id;

			var entity = incoming.createEntity(resourceName, id);

			incoming.bookkeeping(entity);
			incoming.reconcileBookkeeping(entity, _resource);

			var callback = function()
			{
				if (!this.hasErrors())
				{
					list.add(entity);
					map.put(entity.getKey(), entity);
					results[id] = null;
				}
				else
				{
					results[id] = this.allErrors();
				}
			};
			
			res.each(resourceName, _resource, pre(incoming.entify.partial(entity), incoming.encrypt.partial(entity)), callback);
		});
		
		try
		{
			if (list.size() > 0)
			{
				util.info('Writing', list.size(), resourceName, 'entiti(es) to the datastore');
				
				var transaction = datastore.getCurrentTransaction(null);

				if (!transaction && metadata.isAudited === true)
				{
					transaction = datastore.beginTransaction(Packages.com.google.appengine.api.datastore.TransactionOptions.Builder.withXG(true)).get();
				}

				var written = util.multiTry(function() { datastore.put(transaction, list); return true; }, 5,
											function(_tries, _e) { util.severe("Encountered this error while accessing the datastore for ", resourceName, "insert", _e); });

				if (util.hasValue(written) === true)
				{
					try
					{
						cache.putAll(map);
					}
					catch(e)
					{
						util.warning('unable to cache entit(ies) during insert for resource', resourceName);
					}
				}

				if (metadata.isAudited === true)
				{
					res.audit({entities: list, action: 'INSERT'});
				}

				if (!transaction && metadata.isAudited === true)
				{
					transaction = datastore.beginTransaction(Packages.com.google.appengine.api.datastore.TransactionOptions.Builder.withXG(true)).get();
				}
			}
		}
		catch(e)
		{
			util.severe(resourceName, 'encountered exception', e.message, e.toString());
			util.severe('... while inserting', JSON.stringify(_resources));

			util.getJavaException(e) && util.severe(util.printStackTraceToString(util.getJavaException(e)));

			errorStatus = true;
			if (transaction) { transaction.rollbackAsync(); }
			throw e;
		}
		finally
		{
			if (transaction && !errorStatus) { transaction.commitAsync(); } 
		}

		if (collection.size(_resources) === 1)
		{
			for (var id in results)
			{
				results.id = id;
				results.errors = results[id];
			}
		}

		return results;
	}
}

exports.create = function(_web)
{
	if (!_web) { throw 'Unable to create insert module without an airlift/web object' }

	return new Insert(_web);
};