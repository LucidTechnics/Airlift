/**
 * _value is the value the attribute must have in order to be returned.
 * _config can optionally have as attributes ...
 * 
 * offset: starting point for returned objects
 * limit: total number of returned objects
 * asc: the direction ordering should be performed
 * orderBy: the attribute on which ordering should be performed.
 * 
 */

dao.collectBy$uppercaseAttributeName$ = function(_value, _config)
{
	var config = _config||{};
	var offset = config.offset||0;
	var limit = config.limit||20;
	var asc = config.asc||true;
	var orderBy = config.orderBy||"auditPutDate";

	var Query = Packages.com.google.appengine.api.datastore.Query;
	var sort = (asc && Query.SortDirection.ASCENDING)||Query.SortDirection.DESCENDING;

	var query = new Query("$className$").addSort(orderBy, sort).addFilter("$attribute$", Query.FilterOperator.EQUAL, _value);
	var queryResults = this.datastore.prepare(query).asIterator(Packages.com.google.appengine.api.datastore.FetchOptions.Builder.withLimit(limit).offset(offset));

	var results = [];

	for (var result in Iterator(queryResults))
	{
		dao.decrypt(result);
		var activeRecord = airlift.ar("$className$");
		dao.copyFromEntity(activeRecord, result);
		results.push(activeRecord);
	}

	return results;
}