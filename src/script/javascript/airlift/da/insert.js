function Insert(WEB_CONTEXT)
{
	var res = require('../resource').create(WEB_CONTEXT);
	var incoming = require('../incoming').create(WEB_CONTEXT);
	var util = require('../util');

	var factory = Packages.com.google.appengine.api.datastore.DatastoreServiceFactory;
	var datastore = factory.getAsyncDatastoreService();
	var cache = Packages.com.google.appengine.api.memcache.MemcacheServiceFactory.getMemcacheService();

	this.provideUniqueId = function(_resourceName)
	{
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
				util.info("Got a unique id: " + id + " after trying this many times: " +  _tries);
			}

			if (result) { throw new Packages.java.lang.RuntimeException("Found entity of type: " +  _resourceName +  " with id: " + id); }

			return id;
		}

		return util.multiTry(test, 100, function() { util.severe("After 100 tries, we were unable to generate a random unique id for creation of resource:", _resourceName + '.', "Are ids saturated?"); });
	};

	this.insert = function(_resourceName, _resource, _pre, _post)
	{
		var errorStatus = false;

		try
		{
			var transaction = datastore.getCurrentTransaction(null);

			var pre = _pre && res.sequence.partial(_pre) || res.sequence;

			var callback = function()
			{
				result.id = id;
				result.errors = this.allErrors();

				incoming.bookkeeping(entity);

				if (util.isEmpty(result.errors) === true)
				{
					if (!transaction && this.resourceMetadata.isAudited === true)
					{
						transaction = datastore.beginTransaction(Packages.com.google.appengine.api.datastore.TransactionOptions.Builder.withXG(true)).get();
					}

					var written = util.multiTry(function() { datastore.put(transaction, entity); return true; }, 5,
												function(_tries, _e) { util.severe("Encountered this error while accessing the datastore for ", _resourceName, "insert", _e); });

					if (util.hasValue(written) === true) { cache.put(entity.getKey(), entity); }

					if (this.resourceMetadata.isAudited === true)
					{
						res.audit({entity: entity, action: 'INSERT'});
					}
				}
			};

			//var post = _post && res.sequence.partial(callback, _post) || res.sequence.partial(callback);

			var id = this.provideUniqueId(_resourceName);
			var entity = incoming.createEntity(_resourceName, id);
			var result = {};

			res.each(_resourceName, _resource, pre(incoming.entify.partial(entity), incoming.encrypt.partial(entity)), callback);
		}
		catch(e)
		{
			util.severe('Encountered exception', e);
			errorStatus = true;
			if (transaction) { transaction.rollbackAsync(); }
			throw e;
		}
		finally
		{
			if (transaction && !errorStatus) { transaction.commitAsync(); } 
		}

		return result;
	};
}

exports.create = function(WEB_CONTEXT)
{
	if (!WEB_CONTEXT) { throw 'Unable to create insert module without a web context' }

	return new Insert(WEB_CONTEXT);
};