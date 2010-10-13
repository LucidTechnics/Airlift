dao.exists = function(_id)
{
	return (airlift.isDefined(this.get(_id)) === true);
}

dao.get = function(_id)
{
	return PERSISTENCE_MANAGER.getObjectById(Packages.java.lang.Class.forName("$package$.airlift.domain.$className$Jdo"), _id);
}

$updateMethod$

dao.del = function(_$lowerCaseClassName$)
{
	//Need to retry automatically ...
	for (var i = 0; i < 5; i++)
	{
		try
		{
			PERSISTENCE_MANAGER.deletePersistent(_$lowerCaseClassName$);
			break;
		}
		catch(e)
		{
			if (i >= 5)
			{
				throw e;
			}
		}
	}
}

dao["delete"] = function(_$lowerCaseClassName$)
{
	del(_$lowerCaseClassName$);
}