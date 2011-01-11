dao.update = function(_$lowerCaseClassName$)
{
	if (airlift.isDefined(_$lowerCaseClassName$.getId()) !== true) { throw {name: "AIRLIFT_DAO_EXCEPTION", message: "Cannot update. Null id found for object: " + _$lowerCaseClassName$ }; }

	//Need to retry automatically ...
	for (var i = 0; i < 5; i++)
	{
		try
		{
			PERSISTENCE_MANAGER.makePersistent(_$lowerCaseClassName$);
			break;
		}
		catch(e)
		{
			LOG.warning("Encountered this error while accessing the datastore for update: " + e.toString());

			if (i >= 5)
			{
				LOG.severe("After fifth try at update: " + e.toString());
				throw e;
			}
		}
	}
}