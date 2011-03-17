dao.update = function(_$lowerCaseClassName$)
{
	if (airlift.isDefined(_$lowerCaseClassName$.getId()) !== true) { throw {name: "AIRLIFT_DAO_EXCEPTION", message: "Cannot update. Null id found for object: " + _$lowerCaseClassName$ }; }

	var password = SERVLET.getServletConfig().getInitParameter("a.cipher.password");
	var initialVector = SERVLET.getServletConfig().getInitParameter("a.cipher.initial.vector");
	var revolutions = SERVLET.getServletConfig().getInitParameter("a.cipher.revolutions")||20;
	
	_$lowerCaseClassName$ = _$lowerCaseClassName$.encrypt(password, initialVector, null, null, null, null, revolutions);

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