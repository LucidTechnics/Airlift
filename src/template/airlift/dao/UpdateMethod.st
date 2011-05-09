dao.update = function(_$lowerCaseClassName$)
{
	if (airlift.isDefined(_$lowerCaseClassName$.getId()) !== true) { throw {name: "AIRLIFT_DAO_EXCEPTION", message: "Cannot update. Null id found for object: " + _$lowerCaseClassName$ }; }

	//indexing
	LOG.info("START airlift indexing");
	var indexList = this.index(_$lowerCaseClassName$);
	var index = new $className$IndexDo();
	index.setId(_$lowerCaseClassName$.getId());
	index.setIndex(indexList);

	var Key = Packages.com.googlecode.objectify.Key;		
	var parentKey = new Key(airlift.cc("$package$.airlift.domain.$className$Do"), _$lowerCaseClassName$.getId());  
	index.set$className$DoKey(new Key(parentKey, airlift.cc("$package$.airlift.domain.$className$IndexDo"), _$lowerCaseClassName$.getId()));
	LOG.info("END airlift indexing");
	
	var objectify = Packages.com.googlecode.objectify.ObjectifyService.begin();

	dao.multiTry(function() { objectify.async().put(_$lowerCaseClassName$); }, 5, "Encountered this error while accessing the datastore for $className$ update");
	dao.multiTry(function() { objectify.async().put(index); }, 5, "Encountered this error while accessing the datastore for $className$ index update");

	return _$lowerCaseClassName$.getId();
}