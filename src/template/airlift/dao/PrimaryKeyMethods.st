public boolean exists(String _id)
{
	return (get(_id) != null);
}

public $className$ get(String _id)
{
	return ($className$) this.persistenceManager.getObjectById($className$Jdo.class, _id);
}

$updateMethod$

public void del($className$Jdo _$lowerCaseClassName$)
{
	persistenceManager.deletePersistent(_$lowerCaseClassName$);
}

public void delete($className$Jdo _$lowerCaseClassName$)
{
	del(_$lowerCaseClassName$);
}