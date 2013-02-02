var res = require('./res');
var ingest = require('./ingest');
var util = require('./util');
var getter = require('./get');
var web = require('./web');

var factory = Packages.com.google.appengine.api.datastore.DatastoreServiceFactory;
var datastore = factory.getAsyncDatastoreService();
var cache = Packages.com.google.appengine.api.memcache.MemcacheServiceFactory.getMemcacheService();

exports.update = function(_resourceName, _resource, _cacheOnly)
{
	var cacheOnly = (util.isDefined(_cacheOnly) === true) ? _cacheOnly : false;

	if (util.isDefined(_resource.id) !== true)
	{
		throw {name: "AIRLIFT_DAO_EXCEPTION", message: "Cannot update. Null id found for object: " + res.toString(_resourceName, _resource); };
	}

	var previousRecord = getter.get(_resourceName, _resource.id);
	
	if (previousRecord)
	{
		res.bookkeeping(_resource, web.getUserId()||null, previousRecord.auditPostDate, util.createDate());
	}
	else
	{
		res.bookkeeping(_resource, web.getUserId()||null);
	}

	audit.put(_resourceName, _resource);

	var key = Packages.com.google.appengine.api.datastore.KeyFactory.createKey(_resourceName, id);
	var entity = new Packages.com.google.appengine.api.datastore.Entity(key);
	var errors = {};
	res.each(_resourceName, _resource, res.sequence(ingest.entify.partial(entity, errors), ingest.encrypt.partial(entity, errors)));

	if (util.isEmpty(errors) === true)
	{
		var written = util.multiTry(function() { datastore.put(entity); return true; }, 5, "Encountered this error while accessing the datastore for " + _resourceName + " insert");

		if (util.isDefined(written) === true) { cache.put(key, entity); }

		res.audit(_resourceName, _resource, 'UPDATE');
	}

	return {id: id, errors: errors};
};