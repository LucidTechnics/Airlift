function Update(WEB_CONTEXT)
{
	var res = require('../resource').create(WEB_CONTEXT);
	var incoming = require('../incoming').create(WEB_CONTEXT);
	var util = require('../util');
	var getter = require('./get').create(WEB_CONTEXT);
	var web = require('../web').create(WEB_CONTEXT);

	var factory = Packages.com.google.appengine.api.datastore.DatastoreServiceFactory;
	var datastore = factory.getAsyncDatastoreService();
	var cache = Packages.com.google.appengine.api.memcache.MemcacheServiceFactory.getMemcacheService();

	this.update = function(_resourceName, _resource, _pre, _post)
	{
		//_post functionality not yet implemented
		var errorStatus = false;

		if (util.hasValue(_resource.id) !== true)
		{
			throw { name: "AIRLIFT_DAO_EXCEPTION", message: "Cannot update. Null id found for object: " + res.toString(_resourceName, _resource) };
		}

		try
		{
			var result = {}, transaction = datastore.getCurrentTransaction(null);

			var id = _resource.id;
			var pre = _pre && res.sequence.partial(_pre) || res.sequence;
			//var post = _post && res.sequence.partial(undefined, _post) || res.sequence;
			var previousRecord = getter.get(_resourceName, _resource.id);

			var entity = incoming.createEntity(_resourceName, id);

			if (previousRecord)
			{
				incoming.bookkeeping(entity, web.getUserId()||null, previousRecord.auditPostDate, util.createDate());
			}
			else
			{
				throw { name: "AIRLIFT_DAO_EXCEPTION", message: "Cannot update. Trying to update a resource that does not exist: " + res.toString(_resourceName, _resource) };
			}

			res.each(_resourceName, _resource, pre(incoming.entify.partial(entity), incoming.encrypt.partial(entity)), function()
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
								function(_tries, _e) { util.severe("Encountered this error while accessing the datastore for ", _resourceName, "update", _e); });
					if (util.hasValue(written) === true) { cache.put(entity.getKey(), entity); }

					if (this.resourceMetadata.isAudited === true)
					{
						res.audit({entity: entity, action: 'UPDATE'});
					}
				}
			});
		}
		catch(e)
		{
			errorStatus = true;
			util.severe('Update experienced exception', e.toString(), e.message, e.javaException||'');
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
	if (!WEB_CONTEXT) { throw 'Unable to create update module without a web context' }

	return new Update(WEB_CONTEXT);
};