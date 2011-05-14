dao.get = function(_activeRecord)
{
	var datastore = this.datastore;

	return dao.multiTry(function()
	{
		var success = false;
		
		try
		{
			var result = datastore.get(Packages.com.google.appengine.api.datastore.KeyFactory.createKey("$className$", _id)).get();
			dao.copyFromEntity(_activeRecord, result);
			dao.decrypt(_activeRecord, result);
			
			success = true;
		}
		catch(e if e.javaException instanceof Packages.java.util.concurrent.ExecutionException)
		{
			if (e.javaException.getCause() instanceof Packages.com.google.appengine.api.datastore.EntityNotFoundException)
			{
				LOG.warning("No resource of type: $className$ exists for the provided key: " + _id);
			}
			else
			{
				throw e;
			}
		}

		return success;
	},
	5, "Encountered this error while getting $className$ identified by: " + _id);
}

$updateMethod$

dao.del = function(_id)
{
	var datastore = this.datastore;
	dao.multiTry(function() { datastore["delete"](Packages.com.google.appengine.api.datastore.KeyFactory.createKey("$className$", _id)); }, 5, "Encountered this error while deleting $className$ identified by: " + _id);
}

dao["delete"] = function(_id)
{
	dao.del(_id);
}