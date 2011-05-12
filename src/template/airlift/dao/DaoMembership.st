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
	var config = _config||{};
	var offset = config.offset||0;
	var limit = config.limit||20;
	var asc = config.asc||true;
	var orderBy = config.orderBy||"$attribute$";

	var Query = Packages.com.google.appengine.api.datastore.Query;
	var sort = (asc && Query.SortDirection.ASCENDING)||Query.SortDirection.DESCENDING;

	var query = new Query("$className$").addSort(orderBy, sort);

	_membershipList.forEach(function(_member)
	{
		query.addFilter("$attribute$", Query.FilterOperator.EQUAL, _member);
	});
	
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