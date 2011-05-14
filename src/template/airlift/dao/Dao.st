//$generatorComment$

var airlift;

if (!airlift)
{
	airlift = {};
}
else if (typeof airlift != "object")
{
	throw new Error("airlift already exists and it is not an object");
}

var $className$IndexDo = Packages.$package$.airlift.domain.$className$IndexDo;

airlift.create$upperCaseFirstLetterDomainClassName$Dao = function()
{
	var dao = {};

	dao.getDatastore = function(_sync)
	{
		var sync = _sync||false;
		var factory = Packages.com.google.appengine.api.datastore.DatastoreServiceFactory;
		return (sync && factory.getDatastoreService()) || factory.getAsyncDatastoreService();
	}		

	dao.datastore = dao.getDatastore();
	
	dao.decrypt = function(_activeRecord, _entity)
	{
		$encryptionSetup$

		$decryptToActiveRecordAttribute$
	}

	dao.encrypt = function(_entity)
	{
		$encryptionSetup$

		$encryptedAttribute$

		$setDataObjectEncryptedField$
	}

	dao.copyFromEntity = function(_activeRecord, _entity, _config)
	{
		var config = _config||{};
		var filter = config.filter||[];
		var contains = config.contains||false;

		var that = this;

		$copyFromEntityToActiveRecord; separator="\n"$

		return this;
	}

	dao.copyToEntity = function(_activeRecord, _entity, _config)
	{
		var config = _config||{};
		var filter = config.filter||[];
		var contains = config.contains||false;

		var that = this;

		$copyFromActiveRecordToEntity; separator="\n"$

		return this;
	}
	
	dao.postAudit = function(_activeRecord)
	{
		_activeRecord.setAuditPostDate(airlift.createDate());
		_activeRecord.setAuditPutDate(_activeRecord.getAuditPostDate());
		_activeRecord.setAuditUserEmail(USER_EMAIL||null);

		return this;
	}

	dao.putAudit = function(_activeRecord)
	{
		_activeRecord.setAuditPutDate(airlift.createDate());
		if (USER_EMAIL) { _activeRecord.setAuditUserEmail(USER_EMAIL); }

		return this;
	}
	
	dao.multiTry = function(_executable, _tryCount, _message, _completeFailure)
	{
		LOG.info("START multi try");

		var result, success = false;
		
		for (var i = 0; i < _tryCount && success === false; i++)
		{
			try
			{
				LOG.info("Try number: " + i);
				result = _executable(i);
				success = true;
			}
			catch(e)
			{
				LOG.warning(_message + " " + e.toString());

				if (i >= _tryCount)
				{
					_completeFailure && _completeFailure(_tries);
					LOG.severe("After this many tries: " + _tryCount + " - " +  e.toString());
					throw e;
				}
			}
		}

		LOG.info("END multi try");
		
		return result;
	};

	dao.collect = function(_config)
	{
		var offset = (_config && _config.offset) ? _config.offset : 0;
		var limit = (_config && _config.limit) ? _config.limit : 20;
		var asc = (_config && _config.asc) ? _config.asc : true;
		var orderBy = (_config && _config.orderBy) ? _config.orderBy : "auditPutDate";

		var Query = Packages.com.google.appengine.api.datastore.Query;
		var sort = (asc && Query.SortDirection.ASCENDING)||Query.SortDirection.DESCENDING;

		var query = new Query("$className$").addSort(orderBy, sort);
		var queryResults = this.datastore.prepare(query).asIterator(Packages.com.google.appengine.api.datastore.FetchOptions.Builder.withLimit(limit).offset(offset));

		var results = [];

		for (var result in Iterator(queryResults))
		{
			var activeRecord = airlift.ar("$lowerCaseClassName$");
			dao.copyFromEntity(activeRecord, result);
			dao.decrypt(activeRecord, result);
			results.push(activeRecord);
		}
		
		return results;
	};

	dao.provideUniqueId = function()
	{
		var datastore = this.datastore;
		
		var test = function(_tries)
		{
			var id = Packages.airlift.util.IdGenerator.generate(12);
			//Make sure this randomly generated id has not already been
			//assigned to a resource in this table.

			try
			{
				var result = datastore.get(Packages.com.google.appengine.api.datastore.KeyFactory.createKey("$className$", id)).get();
			}
			catch(e if e.javaException.getCause && (e.javaException.getCause() instanceof Packages.com.google.appengine.api.datastore.EntityNotFoundException))
			{
				LOG.info("Got a unique id: " + id + " after trying this many times: " +  _tries);
			}

			if (result) { throw new Packages.java.lang.RuntimeException("Found entity of type $className$ with id: " + id); }

			return id;
		}
		
		return dao.multiTry(test, 100, "After 100 tries, we were unable to generate a random unique id for creation of resource: $lowerCaseClassName$.  Are ids saturated?");
	};
	
	dao.insert = function(_activeRecord)
	{
		dao.postAudit(_activeRecord);
		
		var id = this.provideUniqueId();
		
		var parentKey = Packages.com.google.appengine.api.datastore.KeyFactory.createKey("$className$", id);
		var parent = new Packages.com.google.appengine.api.datastore.Entity(parentKey);
		dao.copyToEntity(_activeRecord, parent);
		dao.encrypt(parent);
		
		//indexing
		var indexList = this.index(_activeRecord);
		var index = new Packages.com.google.appengine.api.datastore.Entity("$className$Index", id, parentKey);
		index.setProperty("index", indexList);

		var datastore = this.datastore;
		var transaction = datastore.beginTransaction().get();
		
		var parentWritten = dao.multiTry(function() { datastore.put(transaction, parent); return true; }, 5, "Encountered this error while accessing the datastore for $className$ insert", function() { transaction.rollbackAsync(); });
		var indexWritten = parentWritten && dao.multiTry(function() { datastore.put(transaction, index);  return true; }, 5, "Encountered this error while accessing the datastore for $className$ index insert", function() { transaction.rollbackAsync(); });

		indexWritten && parentWritten && transaction.commitAsync();
		
		return id;
	};

	dao.index = function(_activeRecord)
	{
		var indexSet = new Packages.java.util.HashSet();

		$indexAddAll; separator="\n"$

		return new Packages.java.util.ArrayList(indexSet);
	};

	dao.search = function(_tokenList, _config)
	{
		var config = _config||{};
		var offset = config.offset||0;
		var limit = config.limit||20;

		var Query = Packages.com.google.appengine.api.datastore.Query;
		var query = new Query("$className$Index").setKeysOnly();

		for (var token in Iterator(_tokenList))
		{
			query = query.addFilter("index", Query.FilterOperator.EQUAL, token);
		}

		var queryResults = this.datastore.prepare(query).asIterator(Packages.com.google.appengine.api.datastore.FetchOptions.Builder.withLimit(limit).offset(offset));

		var parentKeys = new Packages.java.util.HashSet();

		for (var key in Iterator(queryResults))
		{
			parentKeys.add(key.getParent());
		}

		var queryResults = this.datastore.get(parentKeys);

		for (var entry in Iterator(queryResults.get().entrySet()))
		{
			var result = entry.getValue();
			var activeRecord = airlift.ar("$lowerCaseClassName$");
			dao.copyFromEntity(activeRecord, result);
			dao.decrypt(activeRecord, result);
			
			results.push(activeRecord);
		}

		return results;
	};

	$insertChangeEvent$

	$primaryKeyMethods$

	$collectByAttribute; separator="\n\n"$

	$collectByMembership; separator="\n\n"$

	$collectByRange; separator="\n\n"$

	return dao;
};