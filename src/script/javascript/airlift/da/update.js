var util = require('../util');
var service = require('../service');
var collection = require('airlift/collection');

function Update(_web)
{
	var res = require('../resource').create(_web);
	var incoming = require('../incoming').create(_web);
	var getter = require('./get').create(_web);

	var factory = Packages.com.google.appengine.api.datastore.DatastoreServiceFactory;
	var datastore = factory.getAsyncDatastoreService();
	var cache = service.getCacheService();

	this.update = function(_resourceName, _toUpdate, _pre, _post)
	{
		var resources;

		if ((_toUpdate.add && _toUpdate.iterator) || (_toUpdate.push && _toUpdate.forEach) || (_toUpdate.hasNext && _toUpdate.next))
		{
			resources = _toUpdate;
		}
		else if (typeof _toUpdate === 'object')
		{
			resources = [_toUpdate];
		}
		else
		{
			throw 'update accepts a resource, an iterator of resources, a Java Collection of resources, or a JavaScript array of resources only';
		}

		return this.updateAll(_resourceName, resources, _pre, _post);
	};

	this.updateAll = function(_resourceName, _resources, _pre, _post)
	{
		var resourceName = _resourceName;

		if (_web.getAppProfile().isValidResource(resourceName) === false)
		{
			throw 'Invalid resource name: ' + resourceName + ' provided for update. ' + ' Please make sure first parameter is a valid resource name.'
		}

		var metadata = util.getResourceMetadata(resourceName);
		if (metadata.isView === true) { resourceName = metadata.lookingAt; }
		//_post functionality not yet implemented
		var errorStatus = false, list = util.list(), map = util.map();
		var pre = _pre && res.sequence.partial(_pre) || res.sequence;
		var results = {};

		var ids = collection.map(_resources, function(_resource)
		{
			if (util.hasValue(_resource.id) !== true)
			{
				throw { name: "AIRLIFT_DAO_EXCEPTION", message: "Cannot update. Null id found for object: " + res.toString(resourceName, _resource) };
			}

			return _resource.id;
		});

		util.info('Ids', JSON.stringify(ids));

		var previousRecords = getter.getAll(resourceName, ids);

		collection.each(_resources, function(_resource)
		{
			/*
			 * Important functionality of update.  If the incoming resource does
			 * not have an id OR the resource does not exist
			 * in the datastore, update will throw an exception.
			 */
			var previousRecord = previousRecords.get(_resource.id);
			var entity = incoming.createEntity(resourceName, _resource.id);
			if (previousRecord)
			{
				incoming.bookkeeping(entity, _web.getUserId()||null, previousRecord.auditPostDate, util.createDate());
				incoming.reconcileBookkeeping(entity, _resource);
			}
			else
			{
				var message = "Cannot update. Trying to update a resource that does not exist: " + res.toString(resourceName, _resource);
				util.severe(message);
				throw { name: "AIRLIFT_DAO_EXCEPTION", message: message};
			}

			var callback = function(n,r)
			{
				if (!this.hasErrors())
				{
					list.add(entity);
					map.put(entity.getKey(), entity);
					results[r.id] = null;
				}
				else
				{
					results[r.id] = this.allErrors();
				}
			};

			res.each(resourceName, _resource, pre(incoming.entify.partial(entity), incoming.encrypt.partial(entity)), callback);
		});

		try
		{
			if (list.size() > 0)
			{
				util.info('Writing', list.size(), resourceName, 'entiti(es) to the datastore');

				var transaction = datastore.getCurrentTransaction(null);

				if (!transaction && metadata.isAudited === true)
				{
					transaction = datastore.beginTransaction(Packages.com.google.appengine.api.datastore.TransactionOptions.Builder.withXG(true)).get();
				}

				var written = util.multiTry(function() { datastore.put(transaction, list); return true; }, 5,
											function(_tries, _e) { util.severe("Encountered this error while accessing the datastore for ", resourceName, "insert", _e); });

				if (util.hasValue(written) === true)
				{
					try
					{
						cache.putAll(map);
					}
					catch(e)
					{
						util.warning('unable to cache entit(ies) during insert for resource', resourceName);
					}
				}


				if (metadata.isAudited === true)
				{
					res.audit({entities: list, action: 'UPDATE'});
				}

				if (!transaction && metadata.isAudited === true)
				{
					transaction = datastore.beginTransaction(Packages.com.google.appengine.api.datastore.TransactionOptions.Builder.withXG(true)).get();
				}
			}
		}
		catch(e)
		{
			util.severe(resourceName, 'encountered exception', e.message, e.toString());
			util.severe('... while updating', JSON.stringify(_resources));

			util.getJavaException(e) && util.severe(util.printStackTraceToString(util.getJavaException(e)));

			errorStatus = true;
			if (transaction) { transaction.rollbackAsync(); }
			throw e;
		}
		finally
		{
			if (transaction && !errorStatus) { transaction.commitAsync(); } 
		}

		return results;
	};
}

exports.create = function(_web)
{
	if (!_web) { throw 'Unable to create update module without an airlift/web object' }

	return new Update(_web);
};