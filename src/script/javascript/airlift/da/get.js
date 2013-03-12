var service = require('airlift/service');

function Get(_web)
{
	var outgoing = require('airlift/outgoing').create(_web);
	var util = require('airlift/util');
	var res = require('airlift/resource').create(_web);
	
	var factory = Packages.com.google.appengine.api.datastore.DatastoreServiceFactory;
	var datastore = factory.getAsyncDatastoreService();
	var cache = service.getCacheService(); 

	var populateCache = function(_key, _value)
	{
		cache.put(_key, _value);

		return _value;
	};

	var populateCacheFromMap = function(_valueMap)
	{
		cache.putAll(_valueMap);
		return _valueMap;
	};

	var getFromCache = function(_key)
	{
		return cache.get(_key);
	};

	var getAllFromCache = function(_keys)
	{
		return cache.getAll(_keys);
	};

	this.get = function(_resourceName, _id)
	{
		var result;

		var entity = util.multiTry(function()
		{
			try
			{
				var key = Packages.com.google.appengine.api.datastore.KeyFactory.createKey(_resourceName, _id);
				var result = getFromCache(key)||populateCache(key, datastore.get(key).get());
			}
			catch(e if e.javaException instanceof Packages.java.util.concurrent.ExecutionException)
			{
				if (e.javaException.getCause() instanceof Packages.com.google.appengine.api.datastore.EntityNotFoundException)
				{
					util.warning("No resource of type:", _resourceName, "exists for the provided key:", _id);
				}
				else
				{
					throw e;
				}
			}

			return result;
		},
		5, function(_tries, _e) { util.severe("Encountered this error while getting", _resourceName, "identified by:", _id); });

		result = entity && res.map(_resourceName, null, res.sequence(outgoing.decrypt, outgoing.deentify.partial(entity)));

		return result;
	};

	this.getAll = function(_resourceName, _entityList)
	{
		var copy = util.list(_entityList);

		return util.multiTry(function()
		{
			var results = util.map();

			try
			{
				var resultMap = getAllFromCache(util.createKeysCollection(_entityList));

				copy.removeAll(resultMap.values());

				if (copy.size() > 0)
				{
					resultMap.putAll(populateCacheFromMap(datastore.get(util.createKeysCollection(copy)).get()));
				}

				for (var key in Iterator(util.createKeysCollection(_entityList)))
				{
					var entity = resultMap.get(key);

					if (entity)
					{
						results.put(key, res.map(_resourceName, null, res.sequence(outgoing.decrypt, outgoing.deentify.partial(entity))));
					}
				}
			}
			catch(e if e.javaException instanceof Packages.java.util.concurrent.ExecutionException)
			{
				if (e.javaException.getCause() instanceof Packages.com.google.appengine.api.datastore.EntityNotFoundException)
				{
					util.warning("No resources of type:", _resourceName, " exists for at least some of the provided keys:", _entityList);
				}
				else
				{
					throw e;
				}
			}

			return results;
		},
		5, function(_tries, _e) { util.severe("Encountered this error while getting multiple", _resourceName, " resources identified by:", _entityList, _e) });
	};
}

exports.create = function(_web)
{
	if (!_web) { throw 'Unable to create get module without an airlift/web context' }

	return new Get(_web);
};