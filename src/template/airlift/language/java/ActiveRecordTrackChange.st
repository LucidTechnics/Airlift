changeEventId = hannibal.util.IdGenerator.generate();	

int trackCount = this.dao.insertChangeEvent(changeEventId, "$method$", this);

if (trackCount != 1)
{
	log.error("Change event tracking for $domain$ apparently failed. Insert count for tracking table is: " + trackCount);
} 
