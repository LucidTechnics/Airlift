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
			if (i >= 5)
			{
				throw e;
			}
		}
	}
}