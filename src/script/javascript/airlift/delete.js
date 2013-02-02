var res = require('./res');
var ingest = require('./ingest');
var util = require('./util');
var audit = require('./audit');

var factory = Packages.com.google.appengine.api.datastore.DatastoreServiceFactory;
var datastore = factory.getAsyncDatastoreService();
var cache = Packages.com.google.appengine.api.memcache.MemcacheServiceFactory.getMemcacheService();

exports.del = function(_resourceName, _id)
{
	var key = Packages.com.google.appengine.api.datastore.KeyFactory.createKey(_resourceName, _id);
	util.multiTry(function() { datastore["delete"](key); }, 5, "Encountered this error while deleting " + _resourceName + " identified by: " + _id);
	cache.invalidateCache(key);
	res.audit(_resourceName, _id, 'DELETE');
};

exports['delete'] = this.del;