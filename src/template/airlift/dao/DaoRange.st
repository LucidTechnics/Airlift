dao.collectBy$uppercaseAttribute$Range = function(_begin, _end, _config)
{
	var config = (airlift.isDefined(_config) === true) ? _config : {};

	var offset = (airlift.isDefined(_config.offset) === true) ? _config.offset : 0;
	var limit = (airlift.isDefined(_config.limit) === true) ? _config.limit : 20;
	var asc = (airlift.isDefined(_config.asc) === true) ? _config.asc : true;
	var orderBy = (airlift.isDefined(_config.orderBy) === true) ? _config.orderBy : "id";

	orderBy = (asc === true) ? orderBy + " asc" : orderBy + " desc";
	
	sql = "$findByRangeSql$";

	var query = PERSISTENCE_MANAGER.newQuery(sql);
	query.setOrdering(orderBy);
	query.setRange(offset, limit);

	return query.execute(_begin, _end);
}