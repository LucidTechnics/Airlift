dao.exists = function(_id)
{
	return (airlift.isDefined(this.get(_id)) === true);
}

dao.get = function(_id)
{
	return PERSISTENCE_MANAGER.getObjectById(Packages.java.lang.Class.forName("$package$.airlift.domain.$className$Jdo"), _id);
}

$updateMethod$

dao.del = function(_$lowerCaseClassName$)
{
	PERSISTENCE_MANAGER.deletePersistent(_$lowerCaseClassName$);
}

dao["delete"] = function(_$lowerCaseClassName$)
{
	del(_$lowerCaseClassName$);
}