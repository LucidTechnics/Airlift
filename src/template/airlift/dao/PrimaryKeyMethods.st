dao.exists = function(_id)
{
	return (airlift.isDefined(dao.get(_id)) === true);
}

dao.get = function(_id)
{
	var  got, objectify = Packages.com.googlecode.objectify.ObjectifyService.begin();

	for (var i = 0; i < 5; i++)
	{
		try
		{
			got = objectify.get(Packages.$package$.airlift.domain.$className$Do, _id);
			break;
		}
		catch(e if e.javaException instanceof Packages.com.googlecode.objectify.NotFoundException)
		{
			LOG.warning("No resource of type: " + $className$ + " exists for the provided key: " + _id);
			break;
		}
		catch(e)
		{
			LOG.warning("Encountered this error while accessing the datastore for get: " + e.toString());

			if (i >= 4)
			{
				LOG.severe("After fifth try at get: " + e.toString());
				throw e;
			}
		}
	}

	return got;
}

$updateMethod$

dao.del = function(_id)
{
	var objectify = com.googlecode.objectify.ObjectifyService.begin();

	var object = dao.get(_id);
	
	//Need to retry automatically ...
	for (var i = 0; i < 5; i++)
	{
		try
		{
			objectify["delete"](object);
			break;
		}
		catch(e)
		{
			LOG.warning("Encountered this error while accessing the datastore for delete: " + e.toString());

			if (i >= 5)
			{
				LOG.severe("After fifth try at delete: " + e.toString());
				throw e;
			}
		}
	}
}

dao["delete"] = function(_$lowerCaseClassName$)
{
	dao.del(_$lowerCaseClassName$);
}