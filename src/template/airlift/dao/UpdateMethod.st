public void update($className$Jdo _$lowerCaseClassName$)
{
	if (_$lowerCaseClassName$.getId() == null) { throw new RuntimeException("Cannot update. Null id found for object: " + _$lowerCaseClassName$); }

	persistenceManager.makePersistent(_$lowerCaseClassName$);
}