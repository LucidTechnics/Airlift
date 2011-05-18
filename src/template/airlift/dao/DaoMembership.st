/**
 * _membership list must be a Javascript array or an Java Collection
 * _config can optionally have as attributes ...
 * 
 * offset: starting point for returned objects
 * limit: total number of returned objects
 * asc: the direction ordering should be performed
 * orderBy: the attribute on which ordering should be performed.
 * 
 * returns all entities where the property value is a member of the _membershipList
 */

dao.collectBy$uppercaseAttributeName$Membership = function(_membershipList, _config)
{
	var config = _config||{};
	var offset = config.offset||0;
	var limit = config.limit||20;
	var asc = config.asc||true;
	var orderBy = config.orderBy||false;
	var returnType = config.returnType||"asIterator";
	var filterList = config.filterList||[];
	
	var Query = Packages.com.google.appengine.api.datastore.Query;

	if (orderBy !== false)
	{
		var sort = (asc && Query.SortDirection.ASCENDING)||Query.SortDirection.DESCENDING;
		var query = new Query("$className$").addSort(orderBy, sort);
		config.keysOnly = false;
	}
	else
	{
		var query = new Query("$className$").setKeysOnly();
		config.keysOnly = true;
	}

	if (_membershipList.forEach)
	{
		var membershipList = new Packages.java.util.ArrayList();

		_membershipList.forEach(function(_member)
		{
			membershipList.add(_member);
		});
	}
	else
	{
		var membershipList = _membershipList;
	}

	query.addFilter("$attribute$", Query.FilterOperator.IN, membershipList);

	filterList.forEach(function(_filter)
	{
		query.addFilter(_filter.attribute, Query.FilterOperator[_filter.operatorName], _filter.value);
	});
	
	var queryResults = this.datastore.prepare(query)[returnType](Packages.com.google.appengine.api.datastore.FetchOptions.Builder.withLimit(limit).offset(offset));

	return dao[returnType] && dao[returnType](queryResults, config);
}