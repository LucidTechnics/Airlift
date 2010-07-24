dao.insertChangeEvent = function(_changeEventId, _method, _$lowerCaseClassName$)
{
	//Not using this template right now.  Needs to be converted!!!!
	var sql = "$insertChangeEventSql$";

	return update(sql, _changeEventId, _method, $objectGetterList$);
}
