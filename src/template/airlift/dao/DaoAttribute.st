public java.util.Collection<$className$> collectBy$uppercaseAttributeName$($attributeType$ _$attributeName$, int _offset, int _limit, String _orderBy)
{
	String sql = "$findByThisAttributeSql$";

	Query query = this.persistenceManager.newQuery(sql);
	query.setOrdering(_orderBy);
	query.setRange(_offset, _limit);

	return (java.util.Collection<$className$>) query.execute(_$attributeName$);
}