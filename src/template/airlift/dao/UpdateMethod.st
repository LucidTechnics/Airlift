dao.update = function(_$lowerCaseClassName$)
{
	if (airlift.isDefined(_$lowerCaseClassName$.getId()) !== true) { throw {name: "AIRLIFT_DAO_EXCEPTION", message: "Cannot update. Null id found for object: " + _$lowerCaseClassName$ }; }

	//indexing
	var indexList = this.index(_$lowerCaseClassName$);
	var index = new $className$IndexDo();
	index.setId(_$lowerCaseClassName$.getId());
	index.setIndex(indexList);

	var Key = Packages.com.googlecode.objectify.Key;		
	var parentKey = new Key(airlift.cc("$package$.airlift.domain.$className$Do"), id);  
	index.set$className$DoKey(new Key(parentKey, airlift.cc("$package$.airlift.domain.$className$IndexDo"), id));

	var objectify = Packages.com.googlecode.objectify.ObjectifyService.begin();

	dao.multiTry(function() { objectify.async().put(_$lowerCaseClassName$); }, 5, "Encountered this error while accessing the datastore for insert");
	dao.multiTry(function() { objectify.async().put(index); }, 5, "Encountered this error while accessing the datastore for insert");

	return id;
}