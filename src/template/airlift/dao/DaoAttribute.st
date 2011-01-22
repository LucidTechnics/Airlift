dao.collectBy$uppercaseAttributeName$ = function(_value, _config)
{
	var offset = (_config && _config.offset) ? _config.offset : 0;
	var limit = (_config && _config.limit) ? _config.limit : 20;
	var asc = (_config && _config.asc) ? _config.asc : true;
	var orderBy = (_config && _config.orderBy) ? _config.orderBy : undefined;

	var sql = "$findByThisAttributeSql$";

	var query = PERSISTENCE_MANAGER.newQuery(sql);

	if (orderBy)
	{
		orderBy = (asc === true) ? orderBy + " asc" : orderBy + " desc";
		query.setOrdering(orderBy);
	}

	query.setRange(offset, limit);

	return query.execute(_value);
}