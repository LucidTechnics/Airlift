/*
 Copyright 2007, Lucid Technics, LLC.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file
 except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in
 writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 specific language governing permissions and limitations under the License.
*/

package airlift.util;

public class FormatUtil
{
	public static final String DEFAULT_DATE_FORMAT = "MM-dd-yyyy";
	public static final String DEFAULT_TIMESTAMP_FORMAT = "EEE d, MMM yyyy HH:mm:ss";
	
	public static String format(String _string)
	{
		String string = "";

		if (_string != null)
		{
			string = _string;
		}
		
		return string;
	}

	public static String format(java.util.Date _date)
	{
		return format(_date, FormatUtil.DEFAULT_DATE_FORMAT);
	}

	public static String format(java.sql.Timestamp _timestamp)
	{
		return format(_timestamp, FormatUtil.DEFAULT_TIMESTAMP_FORMAT);
	}

	public static String format(java.sql.Timestamp _timestamp, String _pattern)
	{
		return format((java.util.Date) _timestamp, _pattern);
	}

	public static String format(java.sql.Timestamp _timestamp, String _pattern, java.util.TimeZone _timeZone)
	{
		return format((java.util.Date) _timestamp, _pattern, _timeZone);
	}

	public static String format(java.util.Date _date, String _pattern)
	{
		return format(_date, _pattern, java.util.TimeZone.getDefault());
	}
	
	public static String format(java.util.Date _date, String _pattern, java.util.TimeZone _timeZone)
	{
		String date = "";

		try
		{
			java.text.SimpleDateFormat format = new java.text.SimpleDateFormat(_pattern);
			format.setTimeZone(_timeZone);

			if (_date != null)
			{
				date = format.format(_date);
			}
		}
		catch(Throwable t)
		{
			throw new RuntimeException(t);
		}

		return date;
	}

	public static String format(Number _number)
	{
		String number = "";

		if (_number != null)
		{
			number = _number.toString();
		}
		
		return number;
	}

	public static String format(Boolean _boolean)
	{
		String booleanString = "";

		if (_boolean != null)
		{
			booleanString = _boolean.toString();
		}

		return booleanString;
	}
}