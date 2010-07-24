dao.update = function(_$lowerCaseClassName$)
{
	if (airlift.isDefined(_$lowerCaseClassName$.getId()) === true) { throw {name: "AIRLIFT_DAO_EXCEPTION", message: "Cannot update. Null id found for object: " + _$lowerCaseClassName$ }; }

	PERSISTENCE_MANAGER.makePersistent(_$lowerCaseClassName$);
}