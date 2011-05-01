dao.update = function(_$lowerCaseClassName$)
{
	if (airlift.isDefined(_$lowerCaseClassName$.getId()) !== true) { throw {name: "AIRLIFT_DAO_EXCEPTION", message: "Cannot update. Null id found for object: " + _$lowerCaseClassName$ }; }

	//indexing
	var indexList = this.index(_$lowerCaseClassName$);

	var index = new $className$IndexDo();

	index.setId(id);
	index.setIndex(indexList);
	index.set$className$Do(_$lowerCaseClassName$);

	_$lowerCaseClassName$.set$className$IndexDo(index);

	var objectify = Packages.com.googlecode.objectify.ObjectifyService.begin();

	for (var i = 0; i < 5; i++)
	{
		try
		{
			objectify.put(_$lowerCaseClassName$);
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

	return id;
}