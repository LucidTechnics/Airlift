/**
 * _membership list must be a java.lang.List object.
 * _config can optional have as attributes
 * offset: starting point for returned objects
 * limit: total number of returned objects
 * asc: the direction ordering should be performed
 * orderBy: the attribute on which ordering should be performed.
 */

dao.collectBy$uppercaseAttribute$Membership = function(_membershipList, _config)
{
	var config = (airlift.isDefined(_config) === true) ? _config : {};

	var offset = (airlift.isDefined(_config.offset) === true) ? 0 : 0;
	var limit = (airlift.isDefined(_config.limit) === true) ? _config.limit : 20;
	var asc = (airlift.isDefined(_config.asc) === true) ? _config.asc : true;
	var orderBy = (airlift.isDefined(_config.orderBy) === true && _config.orderBy.length > 0) ? "$attribute$," + _config.orderBy : "$attribute$";

	orderBy = (asc === true) ? orderBy + " asc" : orderBy + " desc";
	
	var sql = "$findByMembershipSql$";

	var whereClause = airlift.appender("WHERE", " AND ");
	var parameters = airlift.appender("", ", ");

	var index = 0;
	for (var element in Iterator(_membershipList))
	{
		whereClause.append("$attribute$ = :" + (index + 1));
		index++;
		/*
		 * For membership queries, _element must be a
		 * java.lang.String, java.lang.Number.
		 * Other complex objects including Date objects should have
		 * already been serialized into a java.lang.String or
		 * summarily decomposed into constituent parts that are also
		 * strings.
		 * We may revisit this in the future.
		*/
		
		parameters.append("java.lang.String " + element);
	}
	
	sql += " " + whereClause.toString();
	
	var query = PERSISTENCE_MANAGER.newQuery(sql);

	query.declareParameters(parameters.toString());

	return query.execute(_membershipList.toArray());
}