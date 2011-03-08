dao.exists = function(_id)
{
	return (airlift.isDefined(this.get(_id)) === true);
}

dao.get = function(_id)
{
	var got, key = Packages.com.google.appengine.api.datastore.KeyFactory.createKey(airlift.cc("$package$.airlift.domain.$className$Jdo").getSimpleName(), _id);

	for (var i = 0; i < 5; i++)
	{
		try
		{
			got = PERSISTENCE_MANAGER.getObjectById(airlift.cc("$package$.airlift.domain.$className$Jdo"), key);
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

	var password = SERVLET.getServletConfig().getInitParameter("a.cipher.password");
	var initialVector = SERVLET.getServletConfig().getInitParameter("a.cipher.initial.vector");
	var revolutions = SERVLET.getServletConfig().getInitParameter("a.cipher.revolutions")||20;

	return got.decrypt(password, initialVector, null, null, null, null, revolutions);
}

$updateMethod$

dao.del = function(_id)
{
	var object = dao.get(_id);
	
	//Need to retry automatically ...
	for (var i = 0; i < 5; i++)
	{
		try
		{
			PERSISTENCE_MANAGER.deletePersistent(object);
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
	del(_$lowerCaseClassName$);
}