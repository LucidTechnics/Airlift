public boolean exists(String _id)
{
	return (get(_id) != null);
}

public $className$Impl get(String _id)
{
	$className$Impl $lowerCaseClassName$, detached = null;
	
	return ($className$Impl) this.persistenceManager.getObjectById($className$Impl.class, _id);
}

$updateMethod$

public void del($className$Impl _$lowerCaseClassName$)
{
	persistenceManager.deletePersistent(_$lowerCaseClassName$);
}

public void delete($className$Impl _$lowerCaseClassName$)
{
	del(_$lowerCaseClassName$);
}