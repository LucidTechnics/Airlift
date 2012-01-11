/**
 * _value is the value the attribute must have in order to be returned.
 * _config can optionally have as attributes ...
 * 
 * offset: starting point for returned objects
 * limit: total number of returned objects
 * asc: the direction ordering should be performed
 * orderBy: the attribute on which ordering should be performed.
 *
 * The property you are querying on may be a single value property or a
 * list property.
 * 
 */

dao.collectBy$uppercaseAttributeName$ = function(_value, _config)
{
	var config = _config||{};
	var offset = config.offset||0;
	var limit = config.limit||20;
	var asc = (airlift.isDefined(config.asc) === true) ? config.asc : true;
	var orderBy = config.orderBy||"auditPutDate";
	var returnType = config.returnType||"asIterator";
	var filterList = config.filterList||[];
	
	var Query = Packages.com.google.appengine.api.datastore.Query;
	var sort = (asc && Query.SortDirection.ASCENDING)||Query.SortDirection.DESCENDING;

	var query = new Query("$className$").addSort(orderBy, sort).addFilter("$attribute$", Query.FilterOperator.EQUAL, _value).setKeysOnly();

	filterList.forEach(function(_filter)
	{
		query.addFilter(_filter.attribute, Query.FilterOperator[_filter.operatorName], _filter.value);
	});

	var queryResults = this.datastore.prepare(query)[returnType](Packages.com.google.appengine.api.datastore.FetchOptions.Builder.withLimit(limit).offset(offset));

	return dao[returnType] && dao[returnType](queryResults, config);
};