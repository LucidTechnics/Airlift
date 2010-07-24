package $package$.airlift.dao;

import $package$.airlift.domain.$className$;
import $package$.airlift.domain.$className$Jdo;

import javax.jdo.Query;
import javax.jdo.PersistenceManager;

@javax.annotation.Generated
(
	value="hannibal.generator.Generator",
	comments="$generatorJavaComment$",
	date = "$dateTimestamp$"
)
   
public class $className$Dao
{
	PersistenceManager persistenceManager = null;
	
	public $className$Dao(PersistenceManager _persistenceManager) { this.persistenceManager = _persistenceManager; }

	public java.util.Collection<$className$> collect(int _offset, int _limit, String _orderBy)
	{
		String sql = "$selectAllSql$";

		Query query = this.persistenceManager.newQuery(sql);
		query.setOrdering(_orderBy);
		query.setRange(_offset, _limit);

		return (java.util.Collection<$className$>) query.execute();
	}

	public void insert($className$Jdo _$lowerCaseClassName$)
	{
		_$lowerCaseClassName$.setId(airlift.util.IdGenerator.generate(12));
		
		this.persistenceManager.makePersistent(_$lowerCaseClassName$);
	}

	$insertChangeEvent$

	$primaryKeyMethods$

	$collectByAttribute; separator="\n\n"$

	$collectByRange; separator="\n\n"$
}	