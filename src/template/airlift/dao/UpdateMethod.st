dao.update = function(_activeRecord)
{
	if (airlift.isDefined(_activeRecord.getId()) !== true) { throw {name: "AIRLIFT_DAO_EXCEPTION", message: "Cannot update. Null id found for object: " + _activeRecord }; }

	dao.putAudit(_activeRecord);

	var parentKey = Packages.com.google.appengine.api.datastore.KeyFactory.createKey("$className$", _activeRecord.id);
	var parent = new Packages.com.google.appengine.api.datastore.Entity(parentKey);
	dao.copyToEntity(_activeRecord, parent);
	dao.encrypt(parent);
	
	//indexing
	var indexList = this.index(_activeRecord);
	var index = new Packages.com.google.appengine.api.datastore.Entity("$className$Index", _activeRecord.id, parentKey);
	index.setProperty("index", indexList);

	var datastore = this.datastore;
	var transaction = datastore.beginTransaction().get();

	var parentWritten = dao.multiTry(function() { datastore.put(transaction, parent); return true; }, 5, "Encountered this error while accessing the datastore for $className$ update", function() { transaction.rollbackAsync(); });
	var indexWritten = parentWritten && dao.multiTry(function() { datastore.put(transaction, index);  return true; }, 5, "Encountered this error while accessing the datastore for $className$ index update", function() { transaction.rollbackAsync(); });

	parentWritten && indexWritten && transaction.commitAsync();
	
	return _activeRecord.id;
}