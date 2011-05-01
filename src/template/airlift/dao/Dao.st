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

var $className$IndexDo = Packages.$package$.airlift.domain.$className$IndexDo;

airlift.create$upperCaseFirstLetterDomainClassName$Dao = function()
{
	var dao = {};
	
	dao.collect = function(_config)
	{
		var offset = (_config && _config.offset) ? _config.offset : 0;
		var limit = (_config && _config.limit) ? _config.limit : 20;
		var asc = (_config && _config.asc) ? _config.asc : true;
		var orderBy = (_config && _config.orderBy) ? _config.orderBy : "auditPutDate";

		if (asc === false) { orderBy = "-" + orderBy; }

		var objectify = Packages.com.googlecode.objectify.ObjectifyService.begin();

		var query = objectify.query(Packages.$package$.airlift.domain.$className$).
					limit(limit).
					offset(offset).
					order(orderBy);

		var results = [];
		
		for (var $lowerCaseClassName$ in Iterator(query))
		{
			results.push($lowerCaseClassName$);
		}

		return results;
	}

	dao.provideUniqueId = function()
	{
		var tries = 0; 
		
		do
		{
			var id = Packages.airlift.util.IdGenerator.generate(12);
			//Make sure this randomly generated id has not already been
			//assigned to a resource in this table. 
			testObject = this.get(id);
			tries++;
		}
		while (testObject && (tries < 100))

		if (tries >= 100)
		{
			throw new Error("Unable to generate a random unique id for creation of resource: $lowerCaseClassName$.  Are ids saturated?");
		}
		else if (tries > 1)
		{
			LOG.info("Got a unique id after: " +  tries + " tries.");
		}
		
		return id;
	}
	
	dao.insert = function(_$lowerCaseClassName$)
	{
		var id = this.provideUniqueId();

		_$lowerCaseClassName$.setId(id);

		//indexing
		var indexList = this.index(_$lowerCaseClassName$);

		var index = new $className$IndexDo();

		index.setId(id);
		index.setIndex(indexList);
		index.set$className$Do(_$lowerCaseClassName$);

		_$lowerCaseClassName$.set$className$IndexDo(index);

		var objectify = Packages.com.googlecode.objectify.ObjectifyService.begin();

		for (var i = 0; i < 5; i++)
		{
			try
			{
				objectify.put(_$lowerCaseClassName$);				
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

		var objectify = Packages.com.googlecode.objectify.ObjectifyService.begin();

		var query = objectify.query(Packages.$package$.airlift.domain.$className$IndexDo).
					limit(limit).
					offset(offset);
		
		for (var token in Iterator(_tokenList))
		{
			query = query.filter("index ==", token);
		}

		var parents = query.fetchParents();

		var results = [];
		
		for (var parent in Iterator(parents.valueSet()))
		{
			results.push(parent);
		}
		
		return results;
	}

	$insertChangeEvent$

	$primaryKeyMethods$

	$collectByAttribute; separator="\n\n"$

	$collectByMembership; separator="\n\n"$

	$collectByRange; separator="\n\n"$

	return dao;
};