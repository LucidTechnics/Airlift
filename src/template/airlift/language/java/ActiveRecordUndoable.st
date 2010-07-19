public String trackChange(String _source)
{
	setChangeEventId(hannibal.util.IdGenerator.generate());	

	int count = dao.insertChangeEvent(this);

	if (count != 1)
	{
		log.error("Change event tracking apparently failed. Insert count to tracking table is: " + count);
	}

	return getChangeEventId();
}