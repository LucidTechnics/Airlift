public boolean __exists($primaryKeyType$ _id)
{
	return dao.exists(_id);
}

public hannibal.domain.ActiveRecord __get($primaryKeyType$ _id)
{
	copy(dao.get(_id));
	return this;
}

public String __del()
{
	return __delete();
}

public String __delete()
{
	String changeEventId = null;
	
	dao.delete(getId());
			
	deleteMatchingIndices("$primaryKeyName$", hannibal.util.FormatUtil.format(getId()));

	$trackDeleteChange$
			
	return changeEventId;
}

public String __update()
{
	return __update("$appName$");
}

public String __update(String _source)
{
	String changeEventId = null;
	
	$updateClock$

	int updateCount = dao.update(this);

	if (updateCount != 1)
	{
		throw new hannibal.HannibalException("Update may not have been successful.  For domain object: " + toString() + 
					 " the update count is not 1 but is: " + updateCount);
	}

	deleteMatchingIndices("$primaryKeyName$", hannibal.util.FormatUtil.format(getId()));

	index();

	$trackUpdateChange$
			
	return changeEventId;
}