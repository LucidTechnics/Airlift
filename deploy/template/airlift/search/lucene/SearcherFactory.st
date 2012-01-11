package $package$.hannibal.search;

import hannibal.search.lucene.Searcher;

@javax.annotation.Generated
(
	value="hannibal.generator.Generator",
	comments="$generatorJavaComment$",
	date = "$dateTimestamp$"
)
   
public class SearcherFactory
{
	private static SearcherFactory searcherFactory = new SearcherFactory();
	private static java.util.Map<String, Searcher> map;

	private SearcherFactory()
	{
		this.map = new java.util.HashMap<String, Searcher>();
	}

	public synchronized static SearcherFactory getInstance()
	{
		return searcherFactory;
	}
		
	public Searcher createSearcher(String _className)
	{
		try
		{
			if (this.map.containsKey(_className) == false)
			{
				synchronized(this)
				{
					Class searcherClass = Class.forName(_className);
					Searcher searcher = (Searcher) searcherClass.getDeclaredConstructor().newInstance();
					this.map.put(_className, searcher);
				}
			}
		}
		catch(Throwable t)
		{
			throw new hannibal.HannibalException(t);
		}

		return this.map.get(_className);
	}
}