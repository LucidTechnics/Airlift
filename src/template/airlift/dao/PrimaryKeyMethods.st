dao.exists = function(_id)
{
	return (airlift.isDefined(dao.get(_id)) === true);
}

dao.get = function(_id)
{
	var objectify = Packages.com.googlecode.objectify.ObjectifyService.begin();

	var got = dao.multiTry(function()
	{
		try
		{
			return objectify.get(airlift.cc("$package$.airlift.domain.$className$Do"), _id);
		}
		catch(e if e.javaException instanceof Packages.com.googlecode.objectify.NotFoundException)
		{
			LOG.warning("No resource of type: $className$ exists for the provided key: " + _id);
		}		
	},
	5, "Encountered this error while getting $className$ indentified by: " + _id);
	
	return got;
}

$updateMethod$

dao.del = function(_id)
{
	var objectify = com.googlecode.objectify.ObjectifyService.begin();

	var object = dao.get(_id);

	dao.multiTry(function() { objectify.async()["delete"](object); }, 5, "Encountered this error while deleting $className$ identified by: " + _id);
}

dao["delete"] = function(_id)
{
	dao.del(_id);
}