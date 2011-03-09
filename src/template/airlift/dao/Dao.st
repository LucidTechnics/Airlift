//$generatorComment$

var airlift;

if (!airlift)
{
	airlift = {};
}
else if (typeof airlift != "object")
{
	throw new Error("airlift already exists and it is not an object");
}

importClass(Packages.$package$.airlift.domain.$className$);
importClass(Packages.$package$.airlift.domain.$className$Jdo);
importClass(Packages.$package$.airlift.domain.$className$IndexJdo);

importClass(Packages.javax.jdo.Query);
importClass(Packages.javax.jdo.PersistenceManager);

airlift.create$upperCaseFirstLetterDomainClassName$Dao = function()
{
	var dao = {};
	
	dao.collect = function(_config)
	{
		var config = (airlift.isDefined(_config) === true) ? _config : {};
		
		var offset = (airlift.isDefined(_config.offset) === true) ? _config.offset : 0;
		var limit = (airlift.isDefined(_config.limit) === true) ? _config.limit : 20;
		var asc = (airlift.isDefined(_config.asc) === true) ? _config.asc : true;
		var orderBy = (airlift.isDefined(_config.orderBy) === true) ? _config.orderBy : undefined;
		
		var sql = "$selectAllSql$";

		var query = PERSISTENCE_MANAGER.newQuery(sql);

		if (orderBy)
		{
			orderBy = (asc === true) ? orderBy + " asc" : orderBy + " desc";
			query.setOrdering(orderBy);
		}
		
		query.setRange(offset, limit);

		return query.execute();
	}

	dao.insert = function(_$lowerCaseClassName$)
	{
		var id = Packages.airlift.util.IdGenerator.generate(12);
		_$lowerCaseClassName$.setId(id);

		var password = SERVLET.getServletConfig().getInitParameter("a.cipher.password");
		var initialVector = SERVLET.getServletConfig().getInitParameter("a.cipher.initial.vector");
		var revolutions = SERVLET.getServletConfig().getInitParameter("a.cipher.revolutions")||20;

		_$lowerCaseClassName$.encrypt(password, initialVector, null, null, null, null, revolutions);

		var indexList = this.index(_$lowerCaseClassName$);

		var index = new $className$IndexJdo();
		var indexId = Packages.airlift.util.IdGenerator.generate(12);

		index.setId(indexId);
		index.setIndex(indexList);
		index.set$className$Jdo(_$lowerCaseClassName$);

		_$lowerCaseClassName$.set$className$IndexJdo(index);
		
		for (var i = 0; i < 5; i++)
		{
			try
			{
				PERSISTENCE_MANAGER.makePersistent(_$lowerCaseClassName$);				
				break;
			}
			catch(e)
			{
				LOG.warning("Encountered this error while accessing the datastore for insert: " + e.toString());

				if (i >= 5)
				{
					LOG.severe("After fifth try at insert: " + e.toString());
					throw e;
				}
			}
		}

		return id;
	}

	dao.index = function(_$lowerCaseClassName$)
	{
		var indexSet = new Packages.java.util.HashSet();

		$indexAddAll; separator="\n"$

		return new Packages.java.util.ArrayList(indexSet);
	}

	dao.search = function(_tokenList, _config)
	{
		var config = (airlift.isDefined(_config) === true) ? _config : {};

		var offset = (airlift.isDefined(_config.offset) === true) ? _config.offset : 0;
		var limit = (airlift.isDefined(_config.limit) === true) ? _config.limit : 20;

		var sql = new Packages.java.lang.StringBuffer("$findKeysSql$ WHERE ");
		
		for (var token in Iterator(_tokenList))
		{
			sql.append("index == \"" + token + "\" || ");
		}

		sql = sql.toString().replaceAll(" \\\|\\\| \$", "");

		LOG.info("SQL is: " + sql);

		var query = PERSISTENCE_MANAGER.newQuery(sql);

		query.setRange(offset, limit);

		var indexKeyList = query.execute();
		var keyList = new Packages.java.util.ArrayList();
		
		for (var indexKey in Iterator(indexKeyList))
		{
			var key = Packages.com.google.appengine.api.datastore.KeyFactory.stringToKey(indexKey);
			if (airlift.isDefined(key.getParent() === true))
			{
				keyList.add(key.getParent());
			}
		}

		var objectMap = new Packages.java.util.HashMap();
		
		if (keyList.isEmpty() === false)
		{
			objectMap = Packages.com.google.appengine.api.datastore.DatastoreServiceFactory.getDatastoreService().get(keyList);
		}
		
		return objectMap;
	}
	
	$insertChangeEvent$

	$primaryKeyMethods$

	$collectByAttribute; separator="\n\n"$

	$collectByMembership; separator="\n\n"$

	$collectByRange; separator="\n\n"$

	return dao;
};