var util = require('../util');
var service = require('../service');

function Update(_web)
{
	var res = require('../resource').create(_web);
	var incoming = require('../incoming').create(_web);
	var getter = require('./get').create(_web);

	var factory = Packages.com.google.appengine.api.datastore.DatastoreServiceFactory;
	var datastore = factory.getAsyncDatastoreService();
	var cache = service.getCacheService();

	this.update = function(_resourceName, _resource, _pre, _post)
	{
		var resourceName = _resourceName;
		var metadata = util.getResourceMetadata(resourceName);
		if (metadata.isView === true) { resourceName = metadata.lookingAt; }

		//_post functionality not yet implemented
		var errorStatus = false;

		if (util.hasValue(_resource.id) !== true)
		{
			throw { name: "AIRLIFT_DAO_EXCEPTION", message: "Cannot update. Null id found for object: " + res.toString(resourceName, _resource) };
		}

		try
		{
			var result = {}, transaction = datastore.getCurrentTransaction(null);

			var id = _resource.id;
			var pre = _pre && res.sequence.partial(_pre) || res.sequence;
			//var post = _post && res.sequence.partial(undefined, _post) || res.sequence;
			var previousRecord = getter.get(resourceName, _resource.id);

			var entity = incoming.createEntity(resourceName, id);

			if (previousRecord)
			{
				incoming.bookkeeping(entity, _web.getUserId()||null, previousRecord.auditPostDate, util.createDate());
			}
			else
			{
				throw { name: "AIRLIFT_DAO_EXCEPTION", message: "Cannot update. Trying to update a resource that does not exist: " + res.toString(resourceName, _resource) };
			}

			res.each(resourceName, _resource, pre(incoming.entify.partial(entity), incoming.encrypt.partial(entity)), function()
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
								function(_tries, _e) { util.severe("Encountered this error while accessing the datastore for ", resourceName, "update", _e); });

					if (util.hasValue(written) === true)
					{
						cache.put(entity.getKey(), entity);
					}
					
					if (this.resourceMetadata.isAudited === true)
					{
						res.audit({entity: entity, action: 'UPDATE'});
					}
				}
			});
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
	if (!_web) { throw 'Unable to create update module without an airlift/web object' }

	return new Update(_web);
};