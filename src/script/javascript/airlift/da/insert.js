var res = require('../res');
var ingest = require('../ingest');
var util = require('../util');
var web = require('../web');

var factory = Packages.com.google.appengine.api.datastore.DatastoreServiceFactory;
var datastore = factory.getAsyncDatastoreService();
var cache = Packages.com.google.appengine.api.memcache.MemcacheServiceFactory.getMemcacheService();

exports.provideUniqueId = function(_resourceName)
{
	var test = function(_tries)
	{
		var id = Packages.airlift.util.IdGenerator.generate(12);
			//Make sure this randomly generated id has not already been
			//assigned to a resource in this table.
		try
		{
			var result = datastore.get(Packages.com.google.appengine.api.datastore.KeyFactory.createKey(_resourceName, id)).get();
		}
		catch(e if e.javaException.getCause && (e.javaException.getCause() instanceof Packages.com.google.appengine.api.datastore.EntityNotFoundException))
		{
			LOG.info("Got a unique id: " + id + " after trying this many times: " +  _tries);
		}

		if (result) { throw new Packages.java.lang.RuntimeException("Found entity of type: " +  _resourceName +  " with id: " + id); }

		return id;
	}

	return util.multiTry(test, 100, "After 100 tries, we were unable to generate a random unique id for creation of resource: " + _resourceName + ".  Are ids saturated?");
};

exports.insert = function(_resourceName, _resource, _partialSequence)
{
	var sequence = _partialSequence || res.seq.partial({});
	
	res.bookkeeping(_resource);
	var id = this.provideUniqueId(_resourceName);
	var entity = ingest.createEntity(_resourceName, id);

	res.each(_resourceName, _resource, sequence(ingest.entify.partial(entity), ingest.encrypt.partial(entity)));

	if (util.isEmpty(sequence.errors) == true)
	{
		var written = util.multiTry(function() { datastore.put(entity); return true; }, 5, "Encountered this error while accessing the datastore for " + _resourceName + " insert");
		if (util.isDefined(written) === true) { cache.put(key, entity); }

		res.audit({entity: entity, action: 'INSERT'});
	}

	return {id: id, errors: sequence.errors};
};