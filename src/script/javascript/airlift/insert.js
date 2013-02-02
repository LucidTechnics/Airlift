var res = require('./res');
var ingest = require('./ingest');
var util = require('./util');
var audit = require('./audit');
var web = require('./web');

var factory = Packages.com.google.appengine.api.datastore.DatastoreServiceFactory;
var datastore = factory.getAsyncDatastoreService();
var cache = Packages.com.google.appengine.api.memcache.MemcacheServiceFactory.getMemcacheService();

exports.insert = function(_resourceName, _resource, _cacheOnly)
{
	var cacheOnly = (util.isDefined(_cacheOnly) === true) ? _cacheOnly : false;

	res.bookkeeping(_resource);
	var id = provideUniqueId();

	var key = Packages.com.google.appengine.api.datastore.KeyFactory.createKey(_resourceName, id);
	var entity = new Packages.com.google.appengine.api.datastore.Entity(key);
	var errors = {};
	res.each(_resourceName, _resource, res.sequence(ingest.entify.partial(entity, errors), ingest.encrypt.partial(entity, errors)));

	if (util.isEmpty(errors) == true)
	{
		var written = util.multiTry(function() { datastore.put(entity); return true; }, 5, "Encountered this error while accessing the datastore for " + _resourceName + " insert");

		if (util.isDefined(written) === true) { cache.put(key, entity); }

		res.audit(_resourceName, _resource, 'INSERT');
	}

	return {id: id, errors: errors};
};
