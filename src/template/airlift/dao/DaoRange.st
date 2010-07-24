public java.util.Collection<$className$> collectBy$uppercaseAttribute$Range($rangeType$ _begin, $rangeType$ _end, int _offset, int _limit, String _orderBy)
{
	String sql = "$findByRangeSql$";

	Query query = this.persistenceManager.newQuery(sql);
	query.setOrdering(_orderBy);
	query.setRange(_offset, _limit);

	return (java.util.Collection<$className$>) query.execute(_begin, _end);
}