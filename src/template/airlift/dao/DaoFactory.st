package $package$.hannibal.dao;

import hannibal.dao.DataSourceFactory;
import hannibal.dao.db.spring.Dao;

@javax.annotation.Generated
(
	value="hannibal.generator.Generator",
	comments="$generatorJavaComment$",
	date = "$dateTimestamp$"
)
   
public class DaoFactory
{
	private static DaoFactory daoFactory = new DaoFactory();
	private static java.util.Map<String, Dao> daoNameToDaoMap;

	private DaoFactory()
	{
		this.daoNameToDaoMap = new java.util.HashMap<String, Dao>();
	}

	public synchronized static DaoFactory getInstance()
	{
		return daoFactory;
	}
		
	public Dao createDao(String _className)
	{
		try
		{
			if (this.daoNameToDaoMap.containsKey(_className) == false)
			{
				synchronized(this)
				{
					Class daoClass = Class.forName(_className);
					Dao dao = (Dao) daoClass.getDeclaredConstructor(javax.sql.DataSource.class).newInstance(DataSourceFactory.getInstance().getDataSource());
					this.daoNameToDaoMap.put(_className, dao);
				}
			}
		}
		catch(Throwable t)
		{
			throw new hannibal.HannibalException(t);
		}

		return this.daoNameToDaoMap.get(_className);
	}
}