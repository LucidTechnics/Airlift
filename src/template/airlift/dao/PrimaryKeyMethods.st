dao.get = function(_activeRecord)
{
	var datastore = this.datastore;

	return dao.multiTry(function()
	{
		var success = false;
		
		try
		{
			var key = Packages.com.google.appengine.api.datastore.KeyFactory.createKey("$className$", _activeRecord.id);
			var result = dao.getFromCache(key)||dao.populateCache(key, datastore.get(key).get());
			
			dao.copyFromEntity(_activeRecord, result);
			dao.decrypt(_activeRecord, result);
			
			success = true;
		}
		catch(e if e.javaException instanceof Packages.java.util.concurrent.ExecutionException)
		{
			if (e.javaException.getCause() instanceof Packages.com.google.appengine.api.datastore.EntityNotFoundException)
			{
				LOG.warning("No resource of type: $className$ exists for the provided key: " + _activeRecord.id);
			}
			else
			{
				throw e;
			}
		}

		return success;
	},
	5, "Encountered this error while getting $className$ identified by: " + _activeRecord.id);
}

dao.getAll = function(_keySet)
{
	var datastore = this.datastore;

	return dao.multiTry(function()
	{
		var results = [];

		try
		{
			var resultMap = dao.getAllFromCache(_keySet);
			_keySet.removeAll(resultMap.keySet());

			if (_keySet.size() > 0)
			{
				resultMap.putAll(dao.populateCacheFromMap(datastore.get(_keySet).get()));
			}

			for (var entry in Iterator(resultMap.entrySet()))
			{
				var result = entry.getValue();
				var activeRecord = airlift.ar("$className$");
				dao.copyFromEntity(activeRecord, result);
				dao.decrypt(activeRecord, result);
				results.push(activeRecord);
			}
		}
		catch(e if e.javaException instanceof Packages.java.util.concurrent.ExecutionException)
		{
			if (e.javaException.getCause() instanceof Packages.com.google.appengine.api.datastore.EntityNotFoundException)
			{
				LOG.warning("No resources of type: $className$ exists for at least some of the provided keys: " + _keySet);
			}
			else
			{
				throw e;
			}
		}

		return results;
	},
	5, "Encountered this error while getting multiple $className$ resources identified by: " + _keySet);
}


$updateMethod$

dao.del = function(_id)
{
	var datastore = this.datastore;
	var key = Packages.com.google.appengine.api.datastore.KeyFactory.createKey("$className$", _id);
	dao.multiTry(function() { datastore["delete"](key); }, 5, "Encountered this error while deleting $className$ identified by: " + _id);
	dao.invalidateCache(key);
}

dao["delete"] = function(_id)
{
	dao.del(_id);
}