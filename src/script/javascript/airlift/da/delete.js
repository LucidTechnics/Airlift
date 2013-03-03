var res = require('../resource');
var incoming = require('../incoming');
var util = require('../util');
var audit = require('../audit');

var factory = Packages.com.google.appengine.api.datastore.DatastoreServiceFactory;
var datastore = factory.getAsyncDatastoreService();
var cache = Packages.com.google.appengine.api.memcache.MemcacheServiceFactory.getMemcacheService();

exports.del = function(_resourceName, _id)
{
	var key = incoming.createKey(_resourceName, _id);

	try
	{
		util.multiTry(function() { datastore["delete"](key); }, 5,
					  function(_tries, _e) { util.severe("Encountered this error while deleting", _resourceName, "identified by:", _id);
	}
	catch(e if e.javaException instanceof Packages.java.util.concurrent.ExecutionException)
	{
		if (e.javaException.getCause() instanceof Packages.com.google.appengine.api.datastore.EntityNotFoundException)
		{
			util.warning("Unable to delete. No resource of type:", _resourceName, "exists for the provided key:", _id);
		}
		else
		{
			throw e;
		}
	}

	cache.invalidateCache(key);
	res.audit({id: _id, action: 'DELETE', createDate: util.createDate(), resourceName: _resourceName});
};

exports['delete'] = this.del;