dao.collectBy$uppercaseAttribute$Range = function(_begin, _end, _config)
{
	var offset = (_config && _config.offset) ? _config.offset : 0;
	var limit = (_config && _config.limit) ? _config.limit : 20;
	var asc = (_config && _config.asc) ? _config.asc : true;
	var orderBy = (_config && _config.orderBy && (_config.orderBy.length > 0)) ? "$attribute$," + _config.orderBy : "$attribute$";

	orderBy = (asc === true) ? orderBy + " asc" : orderBy + " desc";
	
	var sql = "$findByRangeSql$";

	var query = PERSISTENCE_MANAGER.newQuery(sql);
	query.setOrdering(orderBy);
	query.setRange(offset, limit);
	query.declareParameters("$rangeParameters$");

	return query.execute(_begin, _end);
}