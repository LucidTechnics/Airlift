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
	};		

	dao.datastore = dao.getDatastore();
	
	dao.decrypt = function(_activeRecord, _entity)
	{
		$encryptionSetup$

		$decryptToActiveRecordAttribute$
	};

	dao.encrypt = function(_entity)
	{
		$encryptionSetup$

		$encryptedAttribute$

		$setDataObjectEncryptedField$
	};

	dao.getFromCache = function(_key)
	{
		return CACHING_CONTEXT.get("$lowerCaseClassName$").get(_key);
	};

	dao.getAllFromCache = function(_keyCollection)
	{
		return CACHING_CONTEXT.get("$lowerCaseClassName$").getAll(_keyCollection);
	};

	dao.populateCache = function(_key, _value)
	{
		CACHING_CONTEXT.get("$lowerCaseClassName$").put(_key, _value);
		return _value;
	};

	dao.populateCacheFromMap = function(_valueMap)
	{
		CACHING_CONTEXT.get("$lowerCaseClassName$").putAll(_valueMap);
		return _valueMap;
	};

	dao.getIdentifiableValue = function(_key)
	{
		return CACHING_CONTEXT.get("$lowerCaseClassName$").getIdentifiable(_key);
	};
	
	dao.populateCacheIfUntouched = function(_key, _oldValueIdentifier, _newValue)
	{
		return CACHING_CONTEXT.get("$lowerCaseClassName$").putIfUntouched(_key, _oldValueIdentifier, _newValue);
	};

	dao.invalidateCache = function(_key)
	{
		CACHING_CONTEXT.get("$lowerCaseClassName$").remove(_key);
	};
	
	dao.copyFromEntity = function(_activeRecord, _entity, _config)
	{
		var config = _config||{};
		var filter = config.filter||[];
		var contains = config.contains||false;
		var converter = _activeRecord.getConverter();

		var that = this;

		$copyFromEntityToActiveRecord; separator="\n"$

		return this;
	};

	dao.copyToEntity = function(_activeRecord, _entity, _config)
	{
		var config = _config||{};
		var filter = config.filter||[];
		var contains = config.contains||false;

		var that = this;

		$copyFromActiveRecordToEntity; separator="\n"$

		return this;
	};
	
	dao.postAudit = function(_activeRecord)
	{
		_activeRecord.setAuditPostDate(airlift.createDate());
		_activeRecord.setAuditPutDate(_activeRecord.getAuditPostDate());
		_activeRecord.setAuditUserId(USER && USER.id||null);

		return this;
	};

	dao.putAudit = function(_activeRecord)
	{
		_activeRecord.setAuditPutDate(airlift.createDate());
		_activeRecord.setAuditUserId(USER && USER.id||null);

		return this;
	};
	
	dao.multiTry = function(_executable, _tryCount, _message, _completeFailure)
	{
		var result, success = false;
		
		for (var i = 0; i < _tryCount && success === false; i++)
		{
			try
			{
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
		
		return result;
	};

	dao.convertEntity = function(_entity, _activeRecord)
	{
		var activeRecord = _activeRecord||airlift.ar("$className$");
		dao.copyFromEntity(activeRecord, _entity);
		dao.decrypt(activeRecord, _entity);

		return activeRecord;
	};

	dao.asIterator = function(_queryResultIterator, _config)
	{
		var iterator = {};
		var nextResults = [];
		var bufferSize = 100;

		var config = _config||{}
		var keysOnly = (airlift.isDefined(config.keysOnly) === true) ? config.keysOnly : true;
		
		iterator.fetchNextResults = function(_queryResultIterator)
		{
			var nextKeys = airlift.l();
			
			for (var i = 0; i < bufferSize && _queryResultIterator.hasNext() === true; i++)
			{
				nextKeys.add(_queryResultIterator.next().getKey());
			}

			return dao.getAll(nextKeys);
		}
				
		iterator.hasNext = function()
		{
			return (nextResults.length > 0) || _queryResultIterator.hasNext();
		}

		iterator.next = function()
		{
			if (keysOnly === true)
			{
				nextResults = ((nextResults.length === 0) && iterator.fetchNextResults(_queryResultIterator)) || nextResults;
			}
			else
			{
				var result = _queryResultIterator.next();
				var activeRecord = dao.convertEntity(result);
				nextResults.push(activeRecord);
			}
			
			return nextResults.shift();
		}

		iterator.remove = function()
		{
			_queryResultIterator.remove();
		}

		iterator.forEach = function(_function)
		{
			var index = 0;
			var keepGoing = true;
			
			while (this.hasNext() === true && keepGoing === true)
			{
				var status = _function(this.next(), index);
				keepGoing = (airlift.isDefined(status) === true) ? status : true;
				index++;
			}
		}

		return new Packages.airlift.util.Iterator(iterator);
	};

	dao.asIterable = function(_queryResultIterable, _config)
	{
		var iterable = {};

		iterable.iterator = function()
		{
			return dao.asIterator(_queryResultIterable.iterator(), _config);
		}

		return iterable;
	};

	dao.asList = function(_queryResultList, _config)
	{
		var results = airlift.l(), iterator = dao.asIterator(_queryResultList.iterator(), _config);
		
		for (activeRecord in Iterator(iterator))
		{
			activeRecord && results.push(activeRecord);
		}

		return results;
	};
	
	dao.collect = function(_config)
	{
		var config = _config||{};
		var offset = config.offset||0;
		var limit = config.limit||20;
		var asc = config.asc||true;
		var orderBy = config.orderBy||"auditPutDate";
		var returnType = config.returnType||"asIterator";
		var filterList = config.filterList||[];
		
		var Query = Packages.com.google.appengine.api.datastore.Query;
		var sort = (asc && Query.SortDirection.ASCENDING)||Query.SortDirection.DESCENDING;

		var query = new Query("$className$").addSort(orderBy, sort).setKeysOnly();

		filterList.forEach(function(_filter)
		{
			query.addFilter(_filter.attribute, Query.FilterOperator[_filter.operatorName], _filter.value);
		});

		var queryResults = this.datastore.prepare(query)[returnType](Packages.com.google.appengine.api.datastore.FetchOptions.Builder.withLimit(limit).offset(offset));

		return dao[returnType] && dao[returnType](queryResults, config);
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
		
		return dao.multiTry(test, 100, "After 100 tries, we were unable to generate a random unique id for creation of resource: $className$.  Are ids saturated?");
	};
	
	dao.insert = function(_activeRecord, _config)
	{
		var config = _config||{};
		var persist = config.persist||true;

		dao.postAudit(_activeRecord);
		
		var id = this.provideUniqueId();
				
		var parentKey = Packages.com.google.appengine.api.datastore.KeyFactory.createKey("$className$", id);
		var parent = new Packages.com.google.appengine.api.datastore.Entity(parentKey);
		dao.copyToEntity(_activeRecord, parent);
		dao.encrypt(parent);

		if ((airlift.notDefined(config.cacheOnly) === true) || (config.cacheOnly === false))
		{
			$index$
					
			$addIndexFilterParameters; separator="\n"$
				
			var datastore = this.datastore;
			var transaction = datastore.beginTransaction().get();

			var parentWritten = dao.multiTry(function() { datastore.put(transaction, parent); return true; }, 5, "Encountered this error while accessing the datastore for $className$ insert", function() { transaction.rollbackAsync(); });
			$writeIndex$

			$indexWritten$parentWritten && transaction.commitAsync();
		}

		dao.populateCache(parentKey, parent);

		var propertyMap = (parent && parent.getProperties())||(new Packages.java.util.HashMap());
		
		return [id, propertyMap];
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
		var returnType = config.returnType||"asIterator";
		var filterList = config.filterList||[];

		var Query = Packages.com.google.appengine.api.datastore.Query;
		var parentKeys = new Packages.java.util.HashSet();

		for (var token in Iterator(_tokenList))
		{
			token = airlift.trim(token);
			var query = new Query("$className$Index").addFilter("index", Query.FilterOperator.EQUAL, token && token.toLowerCase()).setKeysOnly();
			var queryResults = this.datastore.prepare(query).asIterator(Packages.com.google.appengine.api.datastore.FetchOptions.Builder.withLimit(limit).offset(offset));

			for (var key in Iterator(queryResults))
			{
				parentKeys.add(key.getParent());
			}
		}

		var getResults = this.datastore.get(parentKeys).get();

		return dao[returnType] && dao[returnType](getResults.values(), config);
	};

	$insertChangeEvent$

	$primaryKeyMethods$

	$collectByAttribute; separator="\n\n"$

	$collectByMembership; separator="\n\n"$

	$collectByIntersection; separator="\n\n"$

	return dao;
};