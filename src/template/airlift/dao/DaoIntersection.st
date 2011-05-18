/**
 * _intersectionList list must be a Javascript array or a Java
 * Collection.
 * _property must be a list property
 * _config can optionally have as attributes ...
 * 
 * offset: starting point for returned objects
 * limit: total number of returned objects
 * asc: the direction ordering should be performed
 * orderBy: the attribute on which ordering should be performed.
 *
 * returns entities for which every member of the intersection list is
 * a member of the list property.
 */

dao.collectBy$uppercaseAttributeName$Intersection = function(_intersectionList, _config)
{
	var config = _config||{};
	var offset = config.offset||0;
	var limit = config.limit||1000;
	var asc = config.asc||true;
	var orderBy = config.orderBy||"$attribute$";
	var returnType = config.returnType||"asIterator";
	var filterList = config.filterList||[];
	
	var Query = Packages.com.google.appengine.api.datastore.Query;
	var sort = (asc && Query.SortDirection.ASCENDING)||Query.SortDirection.DESCENDING;

	var query = new Query("$className$").addSort(orderBy, sort).setKeysOnly();

	if (_intersectionList.forEach)
	{
		_intersectionList.forEach(function(_member)
		{
			query.addFilter("$attribute$", Query.FilterOperator.EQUAL, _member);
		});
	}
	else
	{
		for (var member in Iterator(_intersectionList))
		{
			query.addFilter("$attribute$", Query.FilterOperator.EQUAL, member);
		}
	}

	filterList.forEach(function(_filter)
	{
		query.addFilter(_filter.attribute, Query.FilterOperator[_filter.operatorName], _filter.value);
	});
	
	var queryResults = this.datastore.prepare(query)[returnType](Packages.com.google.appengine.api.datastore.FetchOptions.Builder.withLimit(limit).offset(offset));

	return dao[returnType] && dao[returnType](queryResults, config);
}