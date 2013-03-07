function Delete(_web)
{
	var res = require('../resource').create(_web);
	var incoming = require('../incoming').create(_web);
	var util = require('../util');

	var factory = Packages.com.google.appengine.api.datastore.DatastoreServiceFactory;
	var datastore = factory.getAsyncDatastoreService();
	var cache = Packages.com.google.appengine.api.memcache.MemcacheServiceFactory.getMemcacheService();

	this.del = function del(_resourceName, _id)
	{
		var errorStatus = false, key = incoming.createKey(_resourceName, _id);

		try
		{
			var resourceMetadata = util.getResourceMetadata(_resourceName);

			var transaction = datastore.getCurrentTransaction(null);

			if (!transaction && resourceMetadata.isAudited === true)
			{
				transaction = datastore.beginTransaction(Packages.com.google.appengine.api.datastore.TransactionOptions.Builder.withXG(true)).get();
			}

			util.multiTry(function() { if (transaction) { datastore['delete'](transaction, key); } else { datastore['delete'](key); } },
						  5,
						  function(_tries, _e) { util.severe("Encountered this error while deleting", _resourceName, "identified by:", _id); }
			);

			cache['delete'](key);

			if (resourceMetadata.isAudited === true)
			{
				res.audit({id: _id, action: 'DELETE', createDate: util.createDate(), resourceName: _resourceName});
			}
		}
		catch(e if e.javaException instanceof Packages.java.util.concurrent.ExecutionException)
		{
			util.warning('Exception encountered', e);

			errorStatus = true;
			if (transaction) { transaction.rollbackAsync(); }

			if (e.javaException.getCause() instanceof Packages.com.google.appengine.api.datastore.EntityNotFoundException)
			{
				util.warning("Unable to delete. No resource of type:", _resourceName, "exists for the provided key:", _id);
			}
			else
			{
				throw e;
			}
		}
		catch(e)
		{
			util.warning('Generic Exception encountered', e);
			errorStatus = true;
			if (transaction) { transaction.rollbackAsync(); }
			throw e;
		}
		finally
		{
			if (transaction && !errorStatus) { transaction.commitAsync(); } 
		}
	};

	this['delete'] = this.del;
}

exports.create = function(_web)
{
	if (!_web) { throw 'Unable to create delete module without an airlift/web object' }

	return new Delete(_web);
};