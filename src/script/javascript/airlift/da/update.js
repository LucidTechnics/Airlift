var res = require('../resource');
var incoming = require('../incoming');
var util = require('../util');
var getter = require('./get');
var web = require('../web');

var factory = Packages.com.google.appengine.api.datastore.DatastoreServiceFactory;
var datastore = factory.getAsyncDatastoreService();
var cache = Packages.com.google.appengine.api.memcache.MemcacheServiceFactory.getMemcacheService();

exports.update = function(_resourceName, _resource, _function)
{
	if (util.hasValue(_resource.id) !== true)
	{
		throw {name: "AIRLIFT_DAO_EXCEPTION", message: "Cannot update. Null id found for object: " + res.toString(_resourceName, _resource); };
	}

	try
	{
		var result = {}, transaction = datastore.getCurrentTransaction(null);

		if (!transaction)
		{
			transaction = datastore.beginTransaction(Packages.com.google.appengine.api.datastore.TransactionOptions.Builder.withXG(true)).get();
		}

		var id = resource.id;
		var sequence = _function && res.sequence.partial(_function) || res.sequence;
		var previousRecord = getter.get(_resourceName, _resource.id);

		if (previousRecord)
		{
			incoming.bookkeeping(_resource, web.getUserId()||null, previousRecord.auditPostDate, util.createDate());
		}
		else
		{
			throw {name: "AIRLIFT_DAO_EXCEPTION", message: "Cannot update. Trying to update a resource that does not exist: " + res.toString(_resourceName, _resource); };
		}

		var entity = incoming.createEntity(_resourceName, id);

		res.each(_resourceName, _resource, sequence(incoming.entify.partial(entity), incoming.encrypt.partial(entity)), function()
		{
			result.id = id;
			result.errors = this.allErrors();

			incoming.bookkeeping(entity);

			if (util.isEmpty(result.errors) === true)
			{
				var written = util.multiTry(function() { datastore.put(transaction, entity); return true; }, 5,
											function(_tries, _e) { util.severe("Encountered this error while accessing the datastore for ", _resourceName, "update", _e); });
				if (util.hasValue(written) === true) { cache.put(entity.getKey(), entity); }

				res.audit({entity: entity, action: 'UPDATE'});
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