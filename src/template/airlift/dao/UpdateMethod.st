dao.update = function(_activeRecord, _config)
{
	var config = _config||{};

	if (airlift.isDefined(_activeRecord.getId()) !== true)
	{
		throw {name: "AIRLIFT_DAO_EXCEPTION", message: "Cannot update. Null id found for object: " + _activeRecord };
	}

	var previousRecord = airlift.ar("$className$");

	if (previousRecord.setId(_activeRecord.id).get() === true)
	{
		_activeRecord.auditPostDate = previousRecord.auditPostDate;
		dao.putAudit(_activeRecord);
	}
	else
	{
		dao.postAudit(_activeRecord);
	}

	var parentKey = Packages.com.google.appengine.api.datastore.KeyFactory.createKey("$className$", _activeRecord.id);
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
	
	return propertyMap;
};