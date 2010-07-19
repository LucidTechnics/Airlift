public int insertChangeEvent(String _changeEventId, String _method, $className$Impl _$lowerCaseClassName$)
{
	final String sql = "$insertChangeEventSql$";

	return update(sql, _changeEventId, _method, $objectGetterList$);
}
