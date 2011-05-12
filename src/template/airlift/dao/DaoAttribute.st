dao.collectBy$uppercaseAttributeName$ = function(_value, _config)
{
	var config = _config||{};
	var offset = config.offset||0;
	var limit = config.limit||20;
	var asc = config.asc||true;
	var orderBy = config.orderBy||"auditPutDate";

	var Query = Packages.com.google.appengine.api.datastore.Query;
	var sort = (asc && Query.SortDirection.ASCENDING)||Query.SortDirection.DESCENDING;

	var query = new Query("$className$").addSort(orderBy, sort).addFilter("$attribute$", Query.FilterOperator.EQUAL, token);
	var queryResults = this.datastore.prepare(query).asIterator(Packages.com.google.appengine.api.datastore.FetchOptions.Builder.withLimit(limit).withOffset(offset));

	var results = [];

	for (var result in queryResults)
	{
		var activeRecord = airlift.ar("$lowerCaseClassName$");
		dao.copyTo(activeRecord, result);
		results.push(activeRecord);
	}

	return results;
}