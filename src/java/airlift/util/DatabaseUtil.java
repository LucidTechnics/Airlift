package airlift.util;

import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;

public class DatabaseUtil
   extends AirliftUtil
{

	public static String getString(ResultSet _resultSet, int _columnIndex)
			throws SQLException
	{
		String _value = _resultSet.getString(_columnIndex);

		if (_resultSet.wasNull())
		{
			return null;
		}
		else
		{
			return _value;
		}
	}

	public static Date getDate(ResultSet _resultSet, int _columnIndex)
			throws SQLException
	{
		Date dateValue = _resultSet.getDate(_columnIndex);

		if (_resultSet.wasNull())
		{
			return null;
		}
		else
		{
			return dateValue;
		}
	}

	public static Timestamp getTimestamp(ResultSet _resultSet, int _columnIndex)
			throws SQLException
	{
		Timestamp timestampValue = _resultSet.getTimestamp(_columnIndex);

		if (_resultSet.wasNull())
		{
			return null;
		}
		else
		{
			return timestampValue;
		}
	}

	public static java.util.Date getTimestampAsDate(ResultSet _resultSet, int _columnIndex)
			throws SQLException
	{
		Timestamp timestampValue = _resultSet.getTimestamp(_columnIndex);

		if (_resultSet.wasNull())
		{
			return null;
		}
		else
		{
			return new java.util.Date(timestampValue.getTime());
		}
	}

	public static Double getDouble(ResultSet _resultSet, int _columnIndex)
			throws SQLException
	{
		double doubleValue = _resultSet.getDouble(_columnIndex);

		if (_resultSet.wasNull())
		{
			return null;
		}
		else
		{
			return Double.valueOf(doubleValue);
		}
	}

	public static Integer getInt(ResultSet _resultSet, int _columnIndex)
			throws SQLException
	{
		int intValue = _resultSet.getInt(_columnIndex);

		if (_resultSet.wasNull())
		{
			return null;
		}
		else
		{
			return Integer.valueOf(intValue);
		}
	}

	public static Long getLong(ResultSet _resultSet, int _columnIndex)
			throws SQLException
	{
		long longValue = _resultSet.getLong(_columnIndex);

		if (_resultSet.wasNull())
		{
			return null;
		}
		else
		{
			return Long.valueOf(longValue);
		}
	}

	public static Boolean getBoolean(ResultSet _resultSet, int _columnIndex)
			throws SQLException
	{
		boolean booleanValue = _resultSet.getBoolean(_columnIndex);

		if (_resultSet.wasNull())
		{
			return null;
		}
		else
		{
			return Boolean.valueOf(booleanValue);
		}
	}

	public static java.math.BigDecimal getBigDecimal(ResultSet _resultSet, int _columnIndex)
			throws SQLException
	{
		java.math.BigDecimal value = _resultSet.getBigDecimal(_columnIndex);

		if (_resultSet.wasNull())
		{
			return null;
		}
		else
		{
			return value;
		}
	}

	public static Short getShort(ResultSet _resultSet, int _columnIndex)
			throws SQLException
	{
		short value = _resultSet.getShort(_columnIndex);

		if (_resultSet.wasNull())
		{
			return null;
		}
		else
		{
			return Short.valueOf(value);
		}
	}

	public static Float getFloat(ResultSet _resultSet, int _columnIndex)
			throws SQLException
	{
		float value = _resultSet.getFloat(_columnIndex);

		if (_resultSet.wasNull())
		{
			return null;
		}
		else
		{
			return Float.valueOf(value);
		}
	}

	public static java.sql.Time getTime(ResultSet _resultSet, int _columnIndex)
			throws SQLException
	{
		java.sql.Time value = _resultSet.getTime(_columnIndex);

		if (_resultSet.wasNull())
		{
			return null;
		}
		else
		{
			return value;
		}
	}

	public static Byte getByte(ResultSet _resultSet, int _columnIndex)
			throws SQLException
	{
		byte value = _resultSet.getByte(_columnIndex);

		if (_resultSet.wasNull())
		{
			return null;
		}
		else
		{
			return Byte.valueOf(value);
		}
	}

	public static String getString(ResultSet _resultSet, String _columnName)
			throws SQLException
	{
		String _value = _resultSet.getString(_columnName);

		if (_resultSet.wasNull())
		{
			return null;
		}
		else
		{
			return _value;
		}
	}

	public static Date getDate(ResultSet _resultSet, String _columnName)
			throws SQLException
	{
		Date dateValue = _resultSet.getDate(_columnName);

		if (_resultSet.wasNull())
		{
			return null;
		}
		else
		{
			return dateValue;
		}
	}

	public static Timestamp getTimestamp(ResultSet _resultSet, String _columnName)
			throws SQLException
	{
		Timestamp timestampValue = _resultSet.getTimestamp(_columnName);

		if (_resultSet.wasNull())
		{
			return null;
		}
		else
		{
			return timestampValue;
		}
	}

	public static java.util.Date getTimestampAsDate(ResultSet _resultSet, String _columnName)
			throws SQLException
	{
		Timestamp timestampValue = _resultSet.getTimestamp(_columnName);

		if (_resultSet.wasNull())
		{
			return null;
		}
		else
		{
			return new java.util.Date(timestampValue.getTime());
		}
	}

	public static Double getDouble(ResultSet _resultSet, String _columnName)
			throws SQLException
	{
		double doubleValue = _resultSet.getDouble(_columnName);

		if (_resultSet.wasNull())
		{
			return null;
		}
		else
		{
			return Double.valueOf(doubleValue);
		}
	}

	public static Integer getInt(ResultSet _resultSet, String _columnName)
			throws SQLException
	{
		int intValue = _resultSet.getInt(_columnName);

		if (_resultSet.wasNull())
		{
			return null;
		}
		else
		{
			return Integer.valueOf(intValue);
		}
	}

	public static Long getLong(ResultSet _resultSet, String _columnName)
			throws SQLException
	{
		long longValue = _resultSet.getLong(_columnName);

		if (_resultSet.wasNull())
		{
			return null;
		}
		else
		{
			return Long.valueOf(longValue);
		}
	}

	public static Boolean getBoolean(ResultSet _resultSet, String _columnName)
			throws SQLException
	{
		boolean booleanValue = _resultSet.getBoolean(_columnName);

		if (_resultSet.wasNull())
		{
			return null;
		}
		else
		{
			return Boolean.valueOf(booleanValue);
		}
	}

	public static java.math.BigDecimal getBigDecimal(ResultSet _resultSet, String _columnName)
			throws SQLException
	{
		java.math.BigDecimal value = _resultSet.getBigDecimal(_columnName);

		if (_resultSet.wasNull())
		{
			return null;
		}
		else
		{
			return value;
		}
	}

	public static Short getShort(ResultSet _resultSet, String _columnName)
			throws SQLException
	{
		short value = _resultSet.getShort(_columnName);

		if (_resultSet.wasNull())
		{
			return null;
		}
		else
		{
			return Short.valueOf(value);
		}
	}

	public static Float getFloat(ResultSet _resultSet, String _columnName)
			throws SQLException
	{
		float value = _resultSet.getFloat(_columnName);

		if (_resultSet.wasNull())
		{
			return null;
		}
		else
		{
			return Float.valueOf(value);
		}
	}

	public static java.sql.Time getTime(ResultSet _resultSet, String _columnName)
			throws SQLException
	{
		java.sql.Time value = _resultSet.getTime(_columnName);

		if (_resultSet.wasNull())
		{
			return null;
		}
		else
		{
			return value;
		}
	}

	public static Byte getByte(ResultSet _resultSet, String _columnName)
			throws SQLException
	{
		byte value = _resultSet.getByte(_columnName);

		if (_resultSet.wasNull())
		{
			return null;
		}
		else
		{
			return Byte.valueOf(value);
		}
	}

	public static void setString(PreparedStatement _preparedStatement, int _index, String _value)
			throws SQLException
	{
		if (_value == null)
		{
			_preparedStatement.setNull(_index, java.sql.Types.VARCHAR);
		}
		else
		{
			_preparedStatement.setString(_index, _value);
		}
	}

	public static void setInteger(PreparedStatement _preparedStatement, int _index, Integer _value)
			throws SQLException
	{
		if (_value == null)
		{
			_preparedStatement.setNull(_index, java.sql.Types.INTEGER);
		}
		else
		{
			setInteger(_preparedStatement, _index, _value.intValue());
		}
	}

	public static void setInteger(PreparedStatement _preparedStatement, int _index, int _value)
			throws SQLException
	{
		_preparedStatement.setInt(_index, _value);
	}

	public static void setDouble(PreparedStatement _preparedStatement, int _index, Double _value)
			throws SQLException
	{
		if (_value == null)
		{
			_preparedStatement.setNull(_index, java.sql.Types.DOUBLE);
		}
		else
		{
			_preparedStatement.setDouble(_index, _value.doubleValue());
		}
	}

	public static void setDouble(PreparedStatement _preparedStatement, int _index, double _value)
			throws SQLException
	{
		_preparedStatement.setDouble(_index, _value);
	}

	public static void setDate(PreparedStatement _preparedStatement, int _index, java.util.Date _value)
			throws SQLException
	{
		if (_value == null)
		{
			_preparedStatement.setNull(_index, java.sql.Types.DATE);
		}
		else
		{
			_preparedStatement.setDate(_index, new java.sql.Date(_value.getTime()));
		}
	}

	public static void setTimestamp(PreparedStatement _preparedStatement, int _index, java.util.Date _value)
			throws SQLException
	{
		if (_value == null)
		{
			_preparedStatement.setNull(_index, java.sql.Types.TIMESTAMP);
		}
		else
		{
			_preparedStatement.setTimestamp(_index, new java.sql.Timestamp(_value.getTime()));
		}
	}

	public static void setTimestamp(PreparedStatement _preparedStatement, int _index, java.sql.Timestamp _value)
			throws SQLException
	{
		if (_value == null)
		{
			_preparedStatement.setNull(_index, java.sql.Types.TIMESTAMP);
		}
		else
		{
			_preparedStatement.setTimestamp(_index, _value);
		}
	}

	public static void setLong(PreparedStatement _preparedStatement, int index, Long _value)
			throws SQLException
	{
		if (_value == null)
		{
			_preparedStatement.setNull(index, java.sql.Types.BIGINT);
		}
		else
		{
			setLong(_preparedStatement, index, _value.longValue());
		}
	}

	public static void setLong(PreparedStatement _preparedStatement, int index, long _value)
			throws SQLException
	{
		_preparedStatement.setLong(index, _value);
	}

	public static void setBoolean(PreparedStatement _preparedStatement, int index, Boolean _value)
			throws SQLException
	{
		if (_value == null)
		{
			_preparedStatement.setNull(index, java.sql.Types.BOOLEAN);
		}
		else
		{
			setBoolean(_preparedStatement, index, _value.booleanValue());
		}
	}

	public static void setBoolean(PreparedStatement _preparedStatement, int index, boolean _value)
			throws SQLException
	{
		_preparedStatement.setBoolean(index, _value);
	}

}