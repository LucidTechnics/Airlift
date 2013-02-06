var egest = require('../egest');
var resource = require('../res');
var util = require('../util');

var factory = Packages.com.google.appengine.api.datastore.DatastoreServiceFactory;
var datastore = factory.getAsyncDatastoreService();
var cache = Packages.com.google.appengine.api.memcache.MemcacheServiceFactory.getMemcacheService(); 

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
	return cache.getAll(new Packages.java.lang.Iterable({iterator: function() { return keys; } }));
};

exports.get = function(_resourceName, _id)
{
	return util.multiTry(function()
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
				this.LOG.warning("No resource of type: " + _resourceName + " exists for the provided key: " + _id);
			}
			else
			{
				throw e;
			}
		}

		return result;
	},
	5, "Encountered this error while getting " + _resourceName + " identified by: " + _id);


	return res.map(_resourceName, null, egest.deentify(entity));
};

exports.getAll = function(_resourceName, _keys)
{
	var copyKeyList = new Packages.java.util.ArrayList();

	return util.multiTry(function()
	{
		var results = new Packages.java.util.HashMap();

		try
		{
			var resultMap = getAllFromCache(util.callbackIterator(keys, function(_next) { copyKeyList.add(_next); }));
			copyKeyList.removeAll(resultMap.keySet());

			if (copyKeyList.size() > 0)
			{
				resultMap.putAll(populateCacheFromMap(datastore.get(copyKeyList).get()));
			}

			for (var key in Iterator(_keyList))
			{
				results.put(key, res.map(_resourceName, null, egest.deentify(resultMap.get(key))));
			}
		}
		catch(e if e.javaException instanceof Packages.java.util.concurrent.ExecutionException)
		{
			if (e.javaException.getCause() instanceof Packages.com.google.appengine.api.datastore.EntityNotFoundException)
			{
				this.LOG.warning("No resources of type: "  + _resourceName + " exists for at least some of the provided keys: " + _keyList);
			}
			else
			{
				throw e;
			}
		}

		return results;
	},
	5, "Encountered this error while getting multiple " + _resourceName + " resources identified by: " + _keyList);
};