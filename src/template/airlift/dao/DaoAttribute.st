dao.collectBy$uppercaseAttributeName$ = function(_value, _config)
{
	var offset = (_config && _config.offset) ? _config.offset : 0;
	var limit = (_config && _config.limit) ? _config.limit : 20;
	var asc = (_config && _config.asc) ? _config.asc : true;
	var orderBy = (_config && _config.orderBy) ? _config.orderBy : "auditPutDate";

	if (asc === false) { orderBy = "-" + orderBy; }

	var objectify = com.googlecode.objectify.ObjectifyService.begin();

	var query = objectify.query(airlift.cc("$buildPackage$.airlift.domain.$className$Do")).
				limit(limit).
				offset(offset).
				order(orderBy).
				filter("$lowercaseAttributeName$ ==", _value);

	var results = [];

	for (var result in Iterator(query))
	{
		results.push(result);
	}

	return results;
}