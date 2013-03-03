var res = require('../resource');
var incoming = require('../incoming');
var util = require('../util');
var web = require('../web');

var factory = Packages.com.google.appengine.api.datastore.DatastoreServiceFactory;
var datastore = factory.getAsyncDatastoreService();
var cache = Packages.com.google.appengine.api.memcache.MemcacheServiceFactory.getMemcacheService();

exports.provideUniqueId = function(_resourceName)
{
	var LOG = this.LOG;
	
	var test = function(_tries, e)
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

	return util.multiTry(test, 100, function() { util.severe("After 100 tries, we were unable to generate a random unique id for creation of resource:", _resourceName + '.', "Are ids saturated?"); });
};

exports.insert = function(_resourceName, _resource, _function)
{
	try
	{
		var transaction = datastore.getCurrentTransaction(null);

		if (!transaction)
		{
			transaction = datastore.beginTransaction(Packages.com.google.appengine.api.datastore.TransactionOptions.Builder.withXG(true)).get();
		}

		var sequence = _function && res.sequence.partial(_function) || res.sequence;

		var id = this.provideUniqueId(_resourceName);
		var entity = incoming.createEntity(_resourceName, id);
		var result = {};

		res.each(_resourceName, _resource, sequence(incoming.entify.partial(entity), incoming.encrypt.partial(entity)), function()
		{
			result.id = id;
			result.errors = this.allErrors();

			incoming.bookkeeping(entity);

			if (util.isEmpty(result.errors) === true)
			{
				var written = util.multiTry(function() { datastore.put(transaction, entity); return true; }, 5,
											function(_tries, _e) { util.severe("Encountered this error while accessing the datastore for ", _resourceName, "insert", _e); });
				if (util.hasValue(written) === true) { cache.put(entity.getKey(), entity); }

				res.audit({entity: entity, action: 'INSERT'});
			}
		});
	}
	catch(e)
	{
		if (transaction) { transaction.rollbackAsync(); }
		throw e;
	}
	finally
	{
		if (transaction) { transaction.commitAsync(); } 
	}

	return result;
};