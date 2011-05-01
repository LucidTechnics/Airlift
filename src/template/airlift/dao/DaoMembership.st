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
	var config = (_config) ? _config : {};

	var offset = config.offset||0;
	var limit = config.limit||20;
	var asc = config.asc||true;
	var orderBy = config.orderBy||"$attribute$";

	orderBy = (asc === true) ? orderBy + " asc" : orderBy + " desc";
	
	var objectify = com.googlecode.objectify.ObjectifyService.begin();

	var query = objectify.query(Packages.$package$.airlift.domain.$className$).
				limit(limit).
				offset(offset).
				order(orderBy);

	_membershipList.forEach(function(_member)
	{
		query = query.filter("$attribute$ ==", _member);
	});
					
	var results = [];

	for (var $lowerCaseClassName$ in Iterator(query))
	{
		results.push($lowerCaseClassName$);
	}

	return results;
}