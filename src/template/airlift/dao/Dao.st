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

	dao.multiTry = function(_function, _tryCount, _message)
	{
		LOG.info("START multi try");

		var result, success = false;
		
		for (var i = 0; i < _tryCount && success === false; i++)
		{
			try
			{
				LOG.info("Try number: " + i);
				result = _function();
				success = true;
			}
			catch(e)
			{
				LOG.warning(_message + " " + e.toString());

				if (i >= _tryCount)
				{
					LOG.severe("After this many tries: " + _tryCount + " - " +  e.toString());
					throw e;
				}
			}
		}

		LOG.info("END multi try");
		
		return result;
	};
	
	dao.collect = function(_config)
	{
		var offset = (_config && _config.offset) ? _config.offset : 0;
		var limit = (_config && _config.limit) ? _config.limit : 20;
		var asc = (_config && _config.asc) ? _config.asc : true;
		var orderBy = (_config && _config.orderBy) ? _config.orderBy : "auditPutDate";

		if (asc === false) { orderBy = "-" + orderBy; }

		var objectify = Packages.com.googlecode.objectify.ObjectifyService.begin();

		var query = objectify.query(airlift.cc("$package$.airlift.domain.$className$Do")).
					limit(limit).
					offset(offset).
					order(orderBy);

		var results = [];

		for (var result in Iterator(query))
		{
			results.push(result);
		}
		
		return results;
	};

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
	};
	
	dao.insert = function(_$lowerCaseClassName$)
	{
		var id = this.provideUniqueId();

		_$lowerCaseClassName$.setId(id);

		//indexing
		var indexList = this.index(_$lowerCaseClassName$);

		var index = new $className$IndexDo();

		index.setId(id);
		index.setIndex(indexList);

		var Key = Packages.com.googlecode.objectify.Key;		
		var parentKey = new Key(airlift.cc("$package$.airlift.domain.$className$Do"), id);  
		index.set$className$DoKey(new Key(parentKey, airlift.cc("$package$.airlift.domain.$className$IndexDo"), id));

		var objectify = Packages.com.googlecode.objectify.ObjectifyService.begin();

		dao.multiTry(function() { objectify.async().put(_$lowerCaseClassName$); }, 5, "Encountered this error while accessing the datastore for $className$ insert");
		dao.multiTry(function() { objectify.async().put(index); }, 5, "Encountered this error while accessing the datastore for $className$ index insert");

		return id;
	};

	dao.index = function(_$lowerCaseClassName$)
	{
		var indexSet = new Packages.java.util.HashSet();

		$indexAddAll; separator="\n"$

		return new Packages.java.util.ArrayList(indexSet);
	};

	dao.search = function(_tokenList, _config)
	{
		var config = (airlift.isDefined(_config) === true) ? _config : {};
		var offset = (airlift.isDefined(_config.offset) === true) ? _config.offset : 0;
		var limit = (airlift.isDefined(_config.limit) === true) ? _config.limit : 20;

		var objectify = Packages.com.googlecode.objectify.ObjectifyService.begin();

		var query = objectify.query(airlift.cc("$package$.airlift.domain.$className$IndexDo")).
					limit(limit).
					offset(offset);
		
		for (var token in Iterator(_tokenList))
		{
			query = query.filter("index ==", token);
		}

		return query.fetchParents();
	};

	$insertChangeEvent$

	$primaryKeyMethods$

	$collectByAttribute; separator="\n\n"$

	$collectByMembership; separator="\n\n"$

	$collectByRange; separator="\n\n"$

	return dao;
};