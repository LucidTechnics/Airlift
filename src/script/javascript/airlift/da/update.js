var res = require('../res');
var ingest = require('../ingest');
var util = require('../util');
var getter = require('./get');
var web = require('../web');

var factory = Packages.com.google.appengine.api.datastore.DatastoreServiceFactory;
var datastore = factory.getAsyncDatastoreService();
var cache = Packages.com.google.appengine.api.memcache.MemcacheServiceFactory.getMemcacheService();

exports.update = function(_resourceName, _resource, _partialSequence)
{	
	if (util.isDefined(_resource.id) !== true)
	{
		throw {name: "AIRLIFT_DAO_EXCEPTION", message: "Cannot update. Null id found for object: " + res.toString(_resourceName, _resource); };
	}

	var id = resource.id;
	var sequence = _partialSequence || res.seq.partial({});
	var previousRecord = getter.get(_resourceName, _resource.id);
	
	if (previousRecord)
	{
		res.bookkeeping(_resource, web.getUserId()||null, previousRecord.auditPostDate, util.createDate());
	}
	else
	{
		throw {name: "AIRLIFT_DAO_EXCEPTION", message: "Cannot update. Trying to update a resource that does not exist: " + res.toString(_resourceName, _resource); };
	}

	var entity = ingest.createEntity(_resourceName, id);
	res.each(_resourceName, _resource, sequence(ingest.entify.partial(entity), ingest.encrypt.partial(entity)));

	if (util.isEmpty(sequence.errors) === true)
	{
		var written = util.multiTry(function() { datastore.put(entity); return true; }, 5, "Encountered this error while accessing the datastore for " + _resourceName + " insert");
		if (util.isDefined(written) === true) {	cache.put(key, entity);	}

		res.audit({entity: entity, action: 'UPDATE'});
	}

	return {id: id, errors: sequence.errors};
};