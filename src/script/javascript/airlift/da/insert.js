var util = require('../util');
var service = require('../service');

function Insert(_web)
{
	var res = require('../resource').create(_web);
	var incoming = require('../incoming').create(_web);

	var factory = Packages.com.google.appengine.api.datastore.DatastoreServiceFactory;
	var datastore = factory.getAsyncDatastoreService();
	var cache = service.getCacheService();

	var provideUniqueId = function(_resourceName) 
	{
		var test = function(_tries, e)
		{
			var truncatedShaLength = _web.getTruncatedShaLength();
			
			var id = Packages.airlift.util.IdGenerator.generate(truncatedShaLength);
				//Make sure this randomly generated id has not already been
				//assigned to a resource in this table.

			util.info('generated this id', id);
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
		var resourceName = _resourceName;

		if (_web.getAppProfile().isValidResource(resourceName) === false)
		{
			throw 'Invalid resource name: ' + resourceName + ' provided for collect. ' + ' Please make sure first parameter is a valid resource name.'
		}

		var metadata = util.getResourceMetadata(resourceName);
		if (metadata.isView === true) { 
		    resourceName = metadata.lookingAt; 
		}

		var errorStatus = false;

		try
		{
			var transaction = datastore.getCurrentTransaction(null);

			var pre = _pre && res.sequence.partial(_pre) || res.sequence;

			/*
			 * Important functionality of insert.  If the resource has
			 * an id, insert acts as if the resource did not previously
			 * exist.  As such it will clobber and existing entity in
			 * the database.  This functionality is in place to support
			 * use cases when the client is responsible for providing
			 * the identifier for the resource.
			 */

			var id = _resource.id || provideUniqueId(resourceName);
			_resource.id = _resource.id || id;
			
			var entity = incoming.createEntity(resourceName, id);
			var result = {};
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
												function(_tries, _e) { util.severe("Encountered this error while accessing the datastore for ", resourceName, "insert", _e); });

					if (util.hasValue(written) === true)
					{
						try
						{
							cache.put(entity.getKey(), entity);
						}
						catch(e)
						{
							util.warning('unable to cache entity during insert for resource', resourceName);
						}
					}

					if (this.resourceMetadata.isAudited === true)
					{
						res.audit({entity: entity, action: 'INSERT'});
					}
				}
			};

			res.each(resourceName, _resource, pre(incoming.entify.partial(entity), incoming.encrypt.partial(entity)), callback);
		}
		catch(e)
		{
			util.severe(resourceName, 'encountered exception', e.message, e.toString());
			util.severe('... while inserting', res.json(_resource));
			
			util.getJavaException(e) && util.severe(util.printStackTraceToString(util.getJavaException(e)));

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

exports.create = function(_web)
{
	if (!_web) { throw 'Unable to create insert module without an airlift/web object' }

	return new Insert(_web);
};