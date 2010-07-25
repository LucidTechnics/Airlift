//$comment$

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
		var orderBy = (airlift.isDefined(_config.orderBy) === true) ? _config.orderBy : "id";

		orderBy = (asc === true) ? orderBy + " asc" : orderBy + " desc";
		
		var sql = "$selectAllSql$";

		var query = PERSISTENCE_MANAGER.newQuery(sql);
		query.setOrdering(orderBy);
		query.setRange(offset, limit);

		return query.execute();
	}

	dao.insert = function(_$lowerCaseClassName$)
	{
		var id = Packages.airlift.util.IdGenerator.generate(12);
		_$lowerCaseClassName$.setId(id);
		
		PERSISTENCE_MANAGER.makePersistent(_$lowerCaseClassName$);

		return id;
	}

	$insertChangeEvent$

	$primaryKeyMethods$

	$collectByAttribute; separator="\n\n"$

	$collectByRange; separator="\n\n"$

	return dao;
};