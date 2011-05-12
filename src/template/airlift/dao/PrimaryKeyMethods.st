dao.exists = function(_activeRecord)
{
	return (airlift.isDefined(dao.get(_activeRecord) === true);
}

dao.get = function(_activeRecord)
{
	return dao.multiTry(function()
	{
		try
		{
			return this.datastore.get(Packages.google.appengine.api.datastore.KeyFactory.createKey("$className$", _id)).get();
		}
		catch(e if e.javaException instanceof Packages.google.appengine.api.datastore.EntityNotFoundException)
		{
			LOG.warning("No resource of type: $className$ exists for the provided key: " + _id);
		}
	},
	5, "Encountered this error while getting $className$ identified by: " + _id);
}

$updateMethod$

dao.del = function(_id)
{
	dao.multiTry(function() { this.datastore["delete"](Packages.google.appengine.api.datastore.KeyFactory.createKey("$className$", _id)); }, 5, "Encountered this error while deleting $className$ identified by: " + _id);
}

dao["delete"] = function(_id)
{
	dao.del(_id);
}